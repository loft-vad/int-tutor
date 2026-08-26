/**
 * Lazy Firebase bootstrap.
 *
 * Everything is imported dynamically so that:
 *   - the Firebase SDK never enters the bundle when sync is not configured;
 *   - the app builds and runs with `firebase` absent from node_modules.
 *
 * Configuration comes entirely from `NEXT_PUBLIC_FIREBASE_*` environment
 * variables — see `.env.example`. If any required variable is missing,
 * {@link isFirebaseConfigured} returns false and the app falls back to
 * local-only storage.
 */

export interface FirebaseHandles {
  db: import('firebase/firestore').Firestore;
  uid: string;
  firestore: typeof import('firebase/firestore');
  auth: import('firebase/auth').Auth;
}

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True when every required env var is present and we are in the browser. */
export function isFirebaseConfigured(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(config.apiKey && config.projectId && config.appId);
}

let _handles: Promise<FirebaseHandles> | null = null;

/**
 * Initialise Firebase, sign in, and resolve the handles.
 *
 * Signs in anonymously by default so sync works with zero user friction; the
 * anonymous account can later be upgraded to Google via {@link signInWithGoogle},
 * which preserves the same uid and therefore the same progress document.
 */
export function getFirebase(): Promise<FirebaseHandles> {
  if (_handles) return _handles;

  _handles = (async (): Promise<FirebaseHandles> => {
    const [{ initializeApp, getApps }, authMod, firestore] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);

    const app = getApps().length
      ? getApps()[0]!
      : initializeApp(config as Record<string, string>);

    const auth = authMod.getAuth(app);
    await authMod.setPersistence(auth, authMod.browserLocalPersistence);

    const user =
      auth.currentUser ??
      (await new Promise<import('firebase/auth').User>((resolve, reject) => {
        const unsub = authMod.onAuthStateChanged(
          auth,
          (u) => {
            if (u) {
              unsub();
              resolve(u);
            } else {
              authMod.signInAnonymously(auth).catch(reject);
            }
          },
          reject
        );
      }));

    const db = firestore.initializeFirestore(app, {
      localCache: firestore.persistentLocalCache({
        tabManager: firestore.persistentMultipleTabManager(),
      }),
    });

    return { db, uid: user.uid, firestore, auth };
  })();

  return _handles;
}

/** Upgrade the current anonymous account to Google, keeping the same uid. */
export async function signInWithGoogle(): Promise<{ uid: string; email: string | null }> {
  const { auth } = await getFirebase();
  const authMod = await import('firebase/auth');
  const provider = new authMod.GoogleAuthProvider();

  const current = auth.currentUser;
  try {
    // linkWithPopup keeps the anonymous uid, so existing progress carries over.
    if (current?.isAnonymous) {
      const cred = await authMod.linkWithPopup(current, provider);
      return { uid: cred.user.uid, email: cred.user.email };
    }
  } catch (err) {
    // credential-already-in-use: this Google account already has its own uid.
    // Fall through to a plain sign-in and adopt that account's data.
    if ((err as { code?: string }).code !== 'auth/credential-already-in-use') throw err;
  }

  const cred = await authMod.signInWithPopup(auth, provider);
  _handles = null; // uid may have changed — force re-resolution
  return { uid: cred.user.uid, email: cred.user.email };
}

export async function signOut(): Promise<void> {
  const { auth } = await getFirebase();
  const authMod = await import('firebase/auth');
  await authMod.signOut(auth);
  _handles = null;
}

/** Current account info, or null when sync is not configured/initialised. */
export async function getAccount(): Promise<{
  uid: string;
  email: string | null;
  isAnonymous: boolean;
} | null> {
  if (!isFirebaseConfigured()) return null;
  const { auth } = await getFirebase();
  const u = auth.currentUser;
  return u ? { uid: u.uid, email: u.email, isAnonymous: u.isAnonymous } : null;
}

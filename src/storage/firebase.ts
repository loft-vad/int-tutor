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
 *
 * Two things are deliberately separated here:
 *   - the **core** (app, auth, Firestore) is initialised exactly once;
 *   - the **uid** is resolved on every call.
 *
 * That split matters: signing in with Google on a second device adopts an
 * existing account and therefore CHANGES the uid. Anything that caches the uid
 * keeps writing to the old (anonymous) document and sync silently does nothing.
 */

export interface FirebaseCore {
  db: import('firebase/firestore').Firestore;
  auth: import('firebase/auth').Auth;
  firestore: typeof import('firebase/firestore');
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

let _core: Promise<FirebaseCore> | null = null;

/**
 * Initialise the Firebase app, auth, and Firestore — exactly once.
 *
 * `initializeFirestore` throws `failed-precondition` if called twice on the same
 * app, so this promise is never reset. Sign-in state is NOT captured here.
 */
export function getCore(): Promise<FirebaseCore> {
  if (_core) return _core;

  _core = (async (): Promise<FirebaseCore> => {
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

    const db = firestore.initializeFirestore(app, {
      localCache: firestore.persistentLocalCache({
        tabManager: firestore.persistentMultipleTabManager(),
      }),
    });

    return { db, auth, firestore };
  })();

  return _core;
}

/**
 * The current user's uid, resolved fresh on every call.
 *
 * Signs in anonymously when nobody is signed in, so sync works with zero user
 * friction. The anonymous account can later be upgraded via
 * {@link signInWithGoogle}.
 */
export async function getUid(): Promise<string> {
  const { auth } = await getCore();
  if (auth.currentUser) return auth.currentUser.uid;

  const authMod = await import('firebase/auth');
  const user = await new Promise<import('firebase/auth').User>((resolve, reject) => {
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
  });
  return user.uid;
}

/**
 * Sign in with Google.
 *
 * Prefers `linkWithPopup` on an anonymous account, which KEEPS the same uid so
 * progress accumulated before signing in carries over. If that Google account
 * already owns an account (`auth/credential-already-in-use` — the normal case on
 * a second device), falls back to a plain sign-in and adopts it. The uid changes
 * in that path, which is why nothing caches it.
 */
export async function signInWithGoogle(): Promise<{ uid: string; email: string | null }> {
  const { auth } = await getCore();
  const authMod = await import('firebase/auth');
  const provider = new authMod.GoogleAuthProvider();

  const current = auth.currentUser;
  if (current?.isAnonymous) {
    try {
      const cred = await authMod.linkWithPopup(current, provider);
      return { uid: cred.user.uid, email: cred.user.email };
    } catch (err) {
      const code = (err as { code?: string }).code;
      // Anything other than "this Google account already exists" is a real
      // failure (popup blocked, unauthorized domain, user cancelled).
      if (code !== 'auth/credential-already-in-use') throw err;
    }
  }

  const cred = await authMod.signInWithPopup(auth, provider);
  return { uid: cred.user.uid, email: cred.user.email };
}

export async function signOut(): Promise<void> {
  const { auth } = await getCore();
  const authMod = await import('firebase/auth');
  await authMod.signOut(auth);
  // The next getUid() signs in anonymously again.
}

/** Current account info, or null when sync is not configured/initialised. */
export async function getAccount(): Promise<{
  uid: string;
  email: string | null;
  isAnonymous: boolean;
} | null> {
  if (!isFirebaseConfigured()) return null;
  const { auth } = await getCore();
  const u = auth.currentUser;
  return u ? { uid: u.uid, email: u.email, isAnonymous: u.isAnonymous } : null;
}

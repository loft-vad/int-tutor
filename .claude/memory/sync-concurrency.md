# Firebase sync: never cache the uid, always dedupe the sign-in

Symptom: the settings panel read **"Sync failed — Missing or insufficient
permissions"** on every load, while the Firestore rules were provably correct
(an anonymous REST client could read and write its own document and was denied
another user's).

## Cause

Neither `getStorageAdapter()` nor `getUid()` deduplicated concurrent callers.

At startup three call sites request the adapter at once: the progress store
middleware, the settings store middleware, and `SyncPanel`. Because
`getStorageAdapter()` only cached the *resolved* adapter — not the in-flight
promise — all three raced past the cache and each built its own `SyncedAdapter`,
each running its own `pull()`.

Each of those then called `getUid()` concurrently. Every call found
`auth.currentUser === null` and invoked `signInAnonymously`, creating **three
separate anonymous accounts**. The document path was built from the uid that
resolved first, while the request carried the token of whichever sign-in landed
last. `request.auth.uid != uid`, so the rules correctly denied it.

The tell: three identical `[sync] pull failed` lines, and a correct-looking
document path in the logs. The path was right; the *token* was for a different
user.

## The two invariants

1. **Any async factory that caches must cache the in-flight promise, not just the
   result.** `if (_x) return _x` is not enough when the builder is `await`ed —
   concurrent callers all sail past it.
2. **Never cache the uid.** Signing in with Google on a second device hits
   `auth/credential-already-in-use`, falls back to `signInWithPopup`, adopts the
   existing account, and **the uid changes**. An earlier version captured the uid
   in `FirebaseAdapter`'s constructor; after that sign-in it kept writing to the
   old anonymous document and cross-device sync silently did nothing — the exact
   feature it exists for.

So: `getCore()` (app + auth + Firestore) is initialised **once** and cached
forever. `getUid()` reads `auth.currentUser` **live** every call, and only the
sign-in *handshake* is deduped via a shared in-flight promise.

`initializeFirestore()` throws `failed-precondition` if called twice on the same
app, which is why `getCore()`'s promise is never reset — an earlier version
nulled it after sign-in and would have thrown on the next call.

Related: [[storage-seam]], [[verification-discipline]], [[firebase-project-setup]]

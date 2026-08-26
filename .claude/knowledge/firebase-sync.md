# Cross-device progress sync (Firebase)

Sync is **optional**. With no `NEXT_PUBLIC_FIREBASE_*` variables set, the app behaves
exactly as before: progress lives in IndexedDB and never leaves the device. The Firebase
SDK is dynamically imported, so it does not enter the bundle when unconfigured.

## Why Firestore

| Option | Verdict |
|---|---|
| **Firestore** ✅ | No backend to run, generous free tier, anonymous auth, offline persistence built in, works from a static export (GitHub Pages) |
| Supabase | Also good; Postgres is nicer, but it needs a row-level-security policy set up and has no anonymous auth by default |
| Custom API | Requires a server, which this app deliberately does not have |
| Cloud sync via a file (Drive/Dropbox) | Conflict handling and auth are worse for this shape of data |

The deciding factor: the app deploys as a **static site** to GitHub Pages, so anything
requiring a server was out.

## Architecture

```
Zustand stores  ─────►  StorageAdapter (interface)  ◄── unchanged seam
                              │
                        SyncedAdapter
                        ╱            ╲
              IndexedDBAdapter    FirebaseAdapter
              (read path,          (sync target,
               always instant)      Firestore)
```

`SyncedAdapter` is **offline-first**:
- **Reads** always come from local — never a network round trip.
- **Writes** hit local first, then push to Firestore debounced (3 s), plus a flush on
  `visibilitychange` / `pagehide`.
- **Startup** calls `pull()`, which merges remote into local *before* the stores hydrate.
- A remote failure degrades to local-only. `pull()` never throws.

Per the project rule, **no Zustand store, hook, or existing component changed**. The only
React addition is `SyncPanel`, which renders `null` when sync is not configured.

## Conflict resolution

Progress is merged **per card**, last-write-wins on `lastAttemptedAt`:

```
card present on one side only  →  keep it
card present on both           →  newer lastAttemptedAt wins
timestamps equal / both null   →  more attempts wins
```

Whole-document LWW would be wrong here: study 20 cards on a phone and 20 on a laptop and
one device's session would be discarded entirely. Per-card merge keeps both.

Settings are whole-object last-write-wins — they are small and rarely conflicting.

## Data model

```
users/{uid}
  progress:  { [questionId]: CardProgress }
  settings:  UserSettings
  updatedAt: serverTimestamp()
```

One document per user. At ~150 bytes per card and a few thousand cards, this stays far
under Firestore's 1 MiB document limit, and each sync is a single read or write.

## Auth

Anonymous sign-in by default — sync works with zero friction, scoped to that browser.
"Sign in with Google" calls `linkWithPopup`, which **keeps the same uid**, so existing
progress carries over rather than starting fresh. If that Google account already has its
own uid (`auth/credential-already-in-use`), the code falls back to a plain sign-in and
adopts that account's data.

## Setup

1. Create a project at <https://console.firebase.google.com>.
2. **Build → Firestore Database → Create database** (production mode).
3. **Build → Authentication → Sign-in method** → enable **Anonymous** and **Google**.
4. **Project settings → Your apps → Web** → register an app and copy the config.
5. Copy `.env.example` to `.env.local` and fill in the values.
6. Publish these security rules — a user may only ever touch their own document:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

7. **Authentication → Settings → Authorized domains** — add your GitHub Pages domain.

For the GitHub Pages deploy, add the six variables as repository secrets and expose them
as `env:` in `.github/workflows/nextjs.yml`, since `NEXT_PUBLIC_*` values are inlined at
build time.

## Cost

Free tier: 50k document reads, 20k writes, 1 GiB storage per day. This app does roughly
one read at startup and one debounced write every few seconds of active study — a single
user costs on the order of a few hundred operations a day.

## Adding a different backend

Write a class implementing `StorageAdapter` and change the factory in
`src/storage/adapters.ts`. Nothing else moves.

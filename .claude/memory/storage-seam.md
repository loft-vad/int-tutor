# The StorageAdapter seam is load-bearing

`src/types/storage.ts` defines a five-method interface. **Every** persistence path in the
app goes through it, and nothing above it knows what is behind it.

## The rule
Adding or changing a storage backend must not require edits to Zustand stores, hooks, or
components. If a change to persistence forces a React change, the seam has been violated.

## Why
The app is a static-exported PWA on GitHub Pages with no server. Storage was always going
to change — IndexedDB → localStorage fallback → cloud sync — and each change would
otherwise ripple through the whole component tree.

## How it held up
Cross-device sync (2026-08) was added as `FirebaseAdapter` + `SyncedAdapter` and one line
in the factory. **Zero** store, hook, or existing-component changes. The only React
addition was `SyncPanel`, which renders `null` when sync is unconfigured, so the default
experience is byte-for-byte unchanged.

## Applying it next time
1. Write a class implementing `StorageAdapter`.
2. Change the factory in `src/storage/adapters.ts`.
3. Stop.

Related: [[content-pipeline]]

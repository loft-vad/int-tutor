import type { StorageAdapter } from '@/types/storage';
import type { SyncedAdapter } from './SyncedAdapter';

let _adapter: StorageAdapter | null = null;
let _synced: SyncedAdapter | null = null;

function isIndexedDBAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

async function createLocalAdapter(): Promise<StorageAdapter> {
  if (isIndexedDBAvailable()) {
    const { IndexedDBAdapter } = await import('./IndexedDBAdapter');
    return new IndexedDBAdapter();
  }
  const { LocalStorageAdapter } = await import('./LocalStorageAdapter');
  return new LocalStorageAdapter();
}

/**
 * Resolve the app's storage adapter.
 *
 * - No Firebase config → local only (IndexedDB, or localStorage as a fallback).
 * - Firebase configured → {@link SyncedAdapter} wrapping local + Firestore,
 *   so reads stay instant and offline, and writes replicate in the background.
 *
 * Adding a different backend means writing one more `StorageAdapter` and
 * changing this factory. Zustand stores, hooks, and components stay untouched —
 * that is the whole point of the seam.
 */
export async function getStorageAdapter(): Promise<StorageAdapter> {
  if (_adapter) return _adapter;

  const local = await createLocalAdapter();

  const { isFirebaseConfigured } = await import('./firebase');
  if (!isFirebaseConfigured()) {
    _adapter = local;
    return _adapter;
  }

  try {
    const [{ FirebaseAdapter }, { SyncedAdapter }] = await Promise.all([
      import('./FirebaseAdapter'),
      import('./SyncedAdapter'),
    ]);
    const synced = new SyncedAdapter(local, new FirebaseAdapter());

    // Merge remote state before the stores hydrate. `pull()` never throws.
    await synced.pull();

    _synced = synced;
    _adapter = synced;
  } catch (err) {
    // Firebase package missing, network down, auth blocked — degrade to local.
    console.warn('[storage] sync unavailable, using local storage only:', err);
    _adapter = local;
  }

  return _adapter;
}

/** The active {@link SyncedAdapter}, or null when running local-only. */
export function getSyncedAdapter(): SyncedAdapter | null {
  return _synced;
}

/** Reset cached adapter (useful for testing, and after sign-in/sign-out). */
export function resetAdapter(): void {
  _adapter = null;
  _synced = null;
}

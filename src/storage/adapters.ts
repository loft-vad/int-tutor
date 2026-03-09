import type { StorageAdapter } from '@/types/storage';

let _adapter: StorageAdapter | null = null;

function isIndexedDBAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

export async function getStorageAdapter(): Promise<StorageAdapter> {
  if (_adapter) return _adapter;

  if (isIndexedDBAvailable()) {
    const { IndexedDBAdapter } = await import('./IndexedDBAdapter');
    _adapter = new IndexedDBAdapter();
  } else {
    const { LocalStorageAdapter } = await import('./LocalStorageAdapter');
    _adapter = new LocalStorageAdapter();
  }

  return _adapter;
}

/** Reset cached adapter (useful for testing) */
export function resetAdapter(): void {
  _adapter = null;
}

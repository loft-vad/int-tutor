import { getStorageAdapter } from '@/storage/adapters';
import type { CardProgress, UserSettings } from '@/types/progress';

type PersistKey = 'progress' | 'settings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySet = (...args: any[]) => any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyGet = () => any;

interface PersistOptions<T> {
  key: PersistKey;
  serialize: (state: T) => Record<string, CardProgress> | UserSettings;
  deserialize: (stored: Record<string, CardProgress> | UserSettings) => Partial<T>;
}

async function persistToIDB<T>(key: PersistKey, state: T, serialize: PersistOptions<T>['serialize']) {
  try {
    const adapter = await getStorageAdapter();
    const serialized = serialize(state);
    if (key === 'progress') {
      await adapter.setProgress(serialized as Record<string, CardProgress>);
    } else {
      await adapter.setSettings(serialized as UserSettings);
    }
  } catch (err) {
    console.error('[IDB persist] write failed:', err);
  }
}

async function hydrateFromIDB<T>(
  key: PersistKey,
  set: AnySet,
  deserialize: PersistOptions<T>['deserialize']
) {
  try {
    const adapter = await getStorageAdapter();
    let stored: Record<string, CardProgress> | UserSettings;
    if (key === 'progress') {
      stored = await adapter.getProgress();
    } else {
      stored = await adapter.getSettings();
    }
    const partial = deserialize(stored);
    set(partial);
  } catch (err) {
    console.error('[IDB persist] read failed:', err);
  }
}

export function withIDBPersist<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  f: (set: any, get: AnyGet, store: any) => T,
  options: PersistOptions<T>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): (set: any, get: AnyGet, store: any) => T {
  return (set, get, store) => {
    const wrappedSet = async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      partial: any,
      replace?: boolean
    ) => {
      set(partial, replace);
      await persistToIDB(options.key, get() as T, options.serialize);
    };

    const state = f(wrappedSet, get, store);

    // Hydrate on mount
    queueMicrotask(() => hydrateFromIDB(options.key, set, options.deserialize));

    return state;
  };
}

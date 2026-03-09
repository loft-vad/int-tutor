import { openDB, type IDBPDatabase } from 'idb';
import type { StorageAdapter } from '@/types/storage';
import type { CardProgress, UserSettings } from '@/types/progress';

const DB_NAME = 'interview-trainer';
const DB_VERSION = 1;
const STORE_PROGRESS = 'progress';
const STORE_SETTINGS = 'settings';

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 20,
  preferredTopics: [],
  preferredDifficulty: 'all',
  timerEnabled: true,
};

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        db.createObjectStore(STORE_PROGRESS);
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS);
      }
    },
  });
}

export class IndexedDBAdapter implements StorageAdapter {
  async getProgress(): Promise<Record<string, CardProgress>> {
    const db = await getDB();
    const value = await db.get(STORE_PROGRESS, 'all');
    return (value as Record<string, CardProgress>) ?? {};
  }

  async setProgress(progress: Record<string, CardProgress>): Promise<void> {
    const db = await getDB();
    await db.put(STORE_PROGRESS, progress, 'all');
  }

  async getSettings(): Promise<UserSettings> {
    const db = await getDB();
    const value = await db.get(STORE_SETTINGS, 'user');
    return (value as UserSettings) ?? DEFAULT_SETTINGS;
  }

  async setSettings(settings: UserSettings): Promise<void> {
    const db = await getDB();
    await db.put(STORE_SETTINGS, settings, 'user');
  }

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear(STORE_PROGRESS);
    await db.clear(STORE_SETTINGS);
  }
}

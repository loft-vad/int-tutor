import type { StorageAdapter } from '@/types/storage';
import type { CardProgress, UserSettings } from '@/types/progress';

const KEY_PROGRESS = 'it:progress';
const KEY_SETTINGS = 'it:settings';

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 20,
  preferredTopics: [],
  preferredDifficulty: 'all',
  timerEnabled: true,
};

export class LocalStorageAdapter implements StorageAdapter {
  async getProgress(): Promise<Record<string, CardProgress>> {
    try {
      const raw = localStorage.getItem(KEY_PROGRESS);
      return raw ? (JSON.parse(raw) as Record<string, CardProgress>) : {};
    } catch {
      return {};
    }
  }

  async setProgress(progress: Record<string, CardProgress>): Promise<void> {
    localStorage.setItem(KEY_PROGRESS, JSON.stringify(progress));
  }

  async getSettings(): Promise<UserSettings> {
    try {
      const raw = localStorage.getItem(KEY_SETTINGS);
      return raw ? (JSON.parse(raw) as UserSettings) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  async setSettings(settings: UserSettings): Promise<void> {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(KEY_PROGRESS);
    localStorage.removeItem(KEY_SETTINGS);
  }
}

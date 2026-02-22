import type { CardProgress, UserSettings } from './progress';

export interface StorageAdapter {
  getProgress(): Promise<Record<string, CardProgress>>;
  setProgress(progress: Record<string, CardProgress>): Promise<void>;
  getSettings(): Promise<UserSettings>;
  setSettings(settings: UserSettings): Promise<void>;
  clear(): Promise<void>;
}

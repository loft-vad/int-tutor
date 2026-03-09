'use client';

import { create } from 'zustand';
import { withIDBPersist } from './middleware/indexedDBMiddleware';
import type { UserSettings } from '@/types/progress';

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 20,
  preferredTopics: [],
  preferredDifficulty: 'all',
  timerEnabled: true,
};

interface SettingsState {
  settings: UserSettings;
  hydrated: boolean;
}

interface SettingsActions {
  updateSettings(partial: Partial<UserSettings>): void;
  resetSettings(): void;
}

type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  withIDBPersist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      hydrated: false as boolean,

      updateSettings(partial: Partial<UserSettings>) {
        set((state: SettingsStore) => ({
          settings: { ...state.settings, ...partial },
        }));
      },

      resetSettings() {
        set({ settings: DEFAULT_SETTINGS });
      },
    }),
    {
      key: 'settings',
      serialize: (state: SettingsStore) => state.settings,
      deserialize: (stored) => ({
        settings: stored as UserSettings,
        hydrated: true as boolean,
      }),
    }
  )
);

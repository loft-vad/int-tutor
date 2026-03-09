'use client';

import { create } from 'zustand';
import { withIDBPersist } from './middleware/indexedDBMiddleware';
import type { CardProgress } from '@/types/progress';
import { computeNextStatus } from '@/lib/learningAlgorithm';

interface ProgressState {
  progress: Record<string, CardProgress>;
  hydrated: boolean;
}

interface ProgressActions {
  recordAnswer(questionId: string, correct: boolean): void;
  skipCard(questionId: string): void;
  unskipCard(questionId: string): void;
  resetProgress(): void;
  getCardProgress(questionId: string): CardProgress;
  setHydrated(value: boolean): void;
}

type ProgressStore = ProgressState & ProgressActions;

function createDefaultProgress(questionId: string): CardProgress {
  return {
    questionId,
    status: 'new',
    attempts: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    lastAttemptedAt: null,
    learnedAt: null,
    skippedAt: null,
  };
}

export const useProgressStore = create<ProgressStore>()(
  withIDBPersist(
    (set, get) => ({
      progress: {},
      hydrated: false as boolean,

      getCardProgress(questionId: string): CardProgress {
        return get().progress[questionId] ?? createDefaultProgress(questionId);
      },

      recordAnswer(questionId: string, correct: boolean) {
        const current = get().getCardProgress(questionId);
        const now = new Date().toISOString();

        const nextConsecutive = correct ? current.consecutiveCorrect + 1 : 0;
        const nextStatus = computeNextStatus(current.status, correct, nextConsecutive);

        const updated: CardProgress = {
          ...current,
          status: nextStatus,
          attempts: current.attempts + 1,
          correctCount: current.correctCount + (correct ? 1 : 0),
          consecutiveCorrect: nextConsecutive,
          lastAttemptedAt: now,
          learnedAt: nextStatus === 'learned' && current.status !== 'learned' ? now : current.learnedAt,
          skippedAt: current.skippedAt,
        };

        set((state: ProgressStore) => ({
          progress: { ...state.progress, [questionId]: updated },
        }));
      },

      skipCard(questionId: string) {
        const current = get().getCardProgress(questionId);
        const updated: CardProgress = {
          ...current,
          status: 'skipped',
          skippedAt: new Date().toISOString(),
        };
        set((state: ProgressStore) => ({
          progress: { ...state.progress, [questionId]: updated },
        }));
      },

      unskipCard(questionId: string) {
        const current = get().getCardProgress(questionId);
        if (current.status !== 'skipped') return;
        const updated: CardProgress = {
          ...current,
          status: current.attempts > 0 ? 'learning' : 'new',
          skippedAt: null,
        };
        set((state: ProgressStore) => ({
          progress: { ...state.progress, [questionId]: updated },
        }));
      },

      resetProgress() {
        set({ progress: {} });
      },

      setHydrated(value: boolean) {
        set({ hydrated: value });
      },
    }),
    {
      key: 'progress',
      serialize: (state: ProgressStore) => state.progress,
      deserialize: (stored) => ({
        progress: stored as Record<string, CardProgress>,
        hydrated: true as boolean,
      }),
    }
  )
);

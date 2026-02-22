import type { Topic, DifficultyLevel } from './content';

export type CardStatus = 'new' | 'learning' | 'learned' | 'skipped';

export interface CardProgress {
  questionId: string;
  status: CardStatus;
  attempts: number;
  correctCount: number;
  consecutiveCorrect: number;
  lastAttemptedAt: string | null;
  learnedAt: string | null;
  skippedAt: string | null;
}

export interface UserSettings {
  dailyGoal: number;
  preferredTopics: Topic[];
  preferredDifficulty: DifficultyLevel | 'all';
  timerEnabled: boolean;
}

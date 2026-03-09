import type { Question, Topic } from '@/types/content';
import type { CardProgress, UserSettings } from '@/types/progress';
import { filterQuestions } from './questionFilters';
import { buildSessionQueue } from './learningAlgorithm';

export interface SessionConfig {
  topic?: Topic;
  maxCards?: number;
  settings?: UserSettings;
}

export function buildFlashcardSession(
  allQuestions: Question[],
  progress: Record<string, CardProgress>,
  config: SessionConfig = {}
): Question[] {
  const { topic, maxCards = 20, settings } = config;

  const topics = topic ? [topic] : settings?.preferredTopics;
  const difficulties =
    settings?.preferredDifficulty && settings.preferredDifficulty !== 'all'
      ? [settings.preferredDifficulty]
      : undefined;

  const pool = filterQuestions(allQuestions, progress, {
    topics: topics?.length ? topics : undefined,
    types: ['flashcard'],
    difficulties,
    excludeStatuses: ['learned', 'skipped'],
  });

  return buildSessionQueue(pool, progress, maxCards);
}

export function buildQuizSession(
  allQuestions: Question[],
  progress: Record<string, CardProgress>,
  config: SessionConfig = {}
): Question[] {
  const { topic, maxCards = 10, settings } = config;

  const topics = topic ? [topic] : settings?.preferredTopics;
  const difficulties =
    settings?.preferredDifficulty && settings.preferredDifficulty !== 'all'
      ? [settings.preferredDifficulty]
      : undefined;

  const pool = filterQuestions(allQuestions, progress, {
    topics: topics?.length ? topics : undefined,
    types: ['multiple-choice'],
    difficulties,
    excludeStatuses: ['skipped'],
  });

  return buildSessionQueue(pool, progress, maxCards);
}

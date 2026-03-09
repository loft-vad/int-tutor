import type { Question, Topic, QuestionType, DifficultyLevel } from '@/types/content';
import type { CardProgress } from '@/types/progress';

export interface FilterOptions {
  topics?: Topic[];
  types?: QuestionType[];
  difficulties?: DifficultyLevel[];
  excludeStatuses?: Array<'new' | 'learning' | 'learned' | 'skipped'>;
}

export function filterQuestions(
  questions: Question[],
  progress: Record<string, CardProgress>,
  options: FilterOptions = {}
): Question[] {
  return questions.filter((q) => {
    if (options.topics?.length && !options.topics.includes(q.topic)) return false;
    if (options.types?.length && !options.types.includes(q.type)) return false;
    if (options.difficulties?.length && !options.difficulties.includes(q.difficulty)) return false;

    if (options.excludeStatuses?.length) {
      const status = progress[q.id]?.status ?? 'new';
      if (options.excludeStatuses.includes(status)) return false;
    }

    return true;
  });
}

export function groupByTopic(questions: Question[]): Record<Topic, Question[]> {
  return questions.reduce(
    (acc, q) => {
      if (!acc[q.topic]) acc[q.topic] = [];
      acc[q.topic]!.push(q);
      return acc;
    },
    {} as Record<Topic, Question[]>
  );
}

export function countByStatus(
  questions: Question[],
  progress: Record<string, CardProgress>
): Record<'new' | 'learning' | 'learned' | 'skipped', number> {
  const counts = { new: 0, learning: 0, learned: 0, skipped: 0 };
  for (const q of questions) {
    const status = progress[q.id]?.status ?? 'new';
    counts[status]++;
  }
  return counts;
}

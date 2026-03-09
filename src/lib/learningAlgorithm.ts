import type { CardStatus, CardProgress } from '@/types/progress';
import type { Question } from '@/types/content';

const LEARNED_THRESHOLD = 5;

/**
 * Compute the next card status after an answer.
 * Pure function — no side effects.
 */
export function computeNextStatus(
  currentStatus: CardStatus,
  correct: boolean,
  nextConsecutiveCorrect: number
): CardStatus {
  if (!correct) {
    // Wrong answer: always demote to learning
    return 'learning';
  }

  if (nextConsecutiveCorrect >= LEARNED_THRESHOLD) {
    return 'learned';
  }

  return currentStatus === 'new' ? 'learning' : currentStatus;
}

/**
 * Build a prioritized session queue from a pool of questions.
 * Priority: learning → new → (skipped excluded)
 */
export function buildSessionQueue(
  questions: Question[],
  progress: Record<string, CardProgress>,
  maxCards = 20
): Question[] {
  const learning: Question[] = [];
  const fresh: Question[] = [];

  for (const q of questions) {
    const p = progress[q.id];
    const status = p?.status ?? 'new';

    if (status === 'learned' || status === 'skipped') continue;

    if (status === 'learning') {
      learning.push(q);
    } else {
      fresh.push(q);
    }
  }

  // Shuffle each group independently
  shuffleInPlace(learning);
  shuffleInPlace(fresh);

  return [...learning, ...fresh].slice(0, maxCards);
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

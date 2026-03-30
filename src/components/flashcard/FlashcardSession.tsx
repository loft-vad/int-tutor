'use client';

import Link from 'next/link';
import { FlipCard } from './FlipCard';
import { CardActions } from './CardActions';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DifficultyBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useFlashcardSession } from '@/hooks/useFlashcardSession';
import type { Topic } from '@/types/content';
import { TOPIC_META } from '@/config/topics';

interface FlashcardSessionProps {
  topic?: Topic;
}

export function FlashcardSession({ topic }: FlashcardSessionProps) {
  const {
    sessionState,
    currentCard,
    currentIndex,
    totalCards,
    isFlipped,
    start,
    flip,
    answer,
    skip,
    restart,
  } = useFlashcardSession(topic);

  if (sessionState === 'idle') {
    const topicMeta = topic ? TOPIC_META[topic] : null;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
          {topicMeta?.icon ?? '🃏'}
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {topicMeta ? `${topicMeta.label} Flashcards` : 'Flashcard Study'}
        </h2>
        <p className="text-slate-500 mb-8 max-w-xs">
          Study with spaced repetition. Cards you struggle with come back more often.
        </p>
        <Button size="lg" onClick={start} fullWidth className="max-w-xs">
          Start Session
        </Button>
      </div>
    );
  }

  if (sessionState === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Session Complete!</h2>
        <p className="text-slate-500 mb-8">You&apos;ve gone through all {totalCards} cards.</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={restart} fullWidth>Study Again</Button>
          <Link href="/flashcards" className="block">
            <Button variant="outline" fullWidth>Change Topic</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="flex flex-col gap-4 px-4 pb-6 min-h-[calc(100vh-10rem)]">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{currentIndex + 1} / {totalCards}</span>
          <div className="flex gap-2 items-center">
            <DifficultyBadge difficulty={currentCard.difficulty} />
          </div>
        </div>
        <ProgressBar value={currentIndex} max={totalCards} size="sm" />
      </div>

      {/* Card — absolute inner div gives FlipCard a resolved pixel height */}
      <div className="flex-1 relative" style={{ minHeight: '300px' }}>
        <div className="absolute inset-0">
          <FlipCard card={currentCard} isFlipped={isFlipped} onFlip={flip} />
        </div>
      </div>

      {/* Actions */}
      <CardActions
        isFlipped={isFlipped}
        onCorrect={() => answer(true)}
        onIncorrect={() => answer(false)}
        onSkip={skip}
      />
    </div>
  );
}

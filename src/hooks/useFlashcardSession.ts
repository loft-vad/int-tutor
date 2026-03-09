'use client';

import { useState, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import type { FlashcardQuestion, Topic } from '@/types/content';
import { useProgressStore } from '@/store/useProgressStore';
import { useSessionStore } from '@/store/useSessionStore';
import { allQuestions } from '@/data';
import { buildFlashcardSession } from '@/lib/sessionBuilder';

export type FlashcardSessionState = 'idle' | 'active' | 'complete';

export function useFlashcardSession(topic?: Topic) {
  const [sessionState, setSessionState] = useState<FlashcardSessionState>('idle');
  const [isFlipped, setIsFlipped] = useState(false);

  const progress = useProgressStore((s) => s.progress);
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const skipCard = useProgressStore((s) => s.skipCard);

  const { queue, currentIndex, startSession, advanceQueue, recordSessionAnswer, endSession } =
    useSessionStore();

  const currentCard = useMemo(() => {
    return queue[currentIndex] as FlashcardQuestion | undefined;
  }, [queue, currentIndex]);

  const isComplete = currentIndex >= queue.length && queue.length > 0;

  const start = useCallback(() => {
    const flashcards = allQuestions.filter((q) => q.type === 'flashcard');
    const sessionQueue = buildFlashcardSession(flashcards, progress, {
      topic,
      maxCards: 20,
    });

    if (sessionQueue.length === 0) {
      setSessionState('complete');
      return;
    }

    startSession(nanoid(), topic ?? ('all' as Topic), sessionQueue);
    setSessionState('active');
    setIsFlipped(false);
  }, [topic, progress, startSession]);

  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const answer = useCallback(
    (correct: boolean) => {
      if (!currentCard) return;
      recordAnswer(currentCard.id, correct);
      recordSessionAnswer(correct);
      advanceQueue();
      setIsFlipped(false);

      if (currentIndex + 1 >= queue.length) {
        setSessionState('complete');
      }
    },
    [currentCard, currentIndex, queue.length, recordAnswer, recordSessionAnswer, advanceQueue]
  );

  const skip = useCallback(() => {
    if (!currentCard) return;
    skipCard(currentCard.id);
    advanceQueue();
    setIsFlipped(false);

    if (currentIndex + 1 >= queue.length) {
      setSessionState('complete');
    }
  }, [currentCard, currentIndex, queue.length, skipCard, advanceQueue]);

  const restart = useCallback(() => {
    endSession();
    setSessionState('idle');
    setIsFlipped(false);
    start();
  }, [endSession, start]);

  return {
    sessionState,
    currentCard,
    currentIndex,
    totalCards: queue.length,
    isFlipped,
    isComplete,
    start,
    flip,
    answer,
    skip,
    restart,
  };
}

'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { nanoid } from 'nanoid';
import type { MultipleChoiceQuestion, Topic } from '@/types/content';
import { useProgressStore } from '@/store/useProgressStore';
import { useSessionStore } from '@/store/useSessionStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { allQuestions } from '@/data';
import { buildQuizSession } from '@/lib/sessionBuilder';

export type QuizPhase = 'idle' | 'answering' | 'reviewing' | 'complete';

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  correct: boolean;
  timeSpent: number;
}

export function useQuizSession(topic?: Topic) {
  const [phase, setPhase] = useState<QuizPhase>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const progress = useProgressStore((s) => s.progress);
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const timerEnabled = useSettingsStore((s) => s.settings.timerEnabled);

  const { queue, currentIndex, score, totalAnswered, startSession, advanceQueue, recordSessionAnswer, endSession } =
    useSessionStore();

  const currentQuestion = useMemo(
    () => queue[currentIndex] as MultipleChoiceQuestion | undefined,
    [queue, currentIndex]
  );

  const isComplete = currentIndex >= queue.length && queue.length > 0;

  // Timer logic
  useEffect(() => {
    if (phase !== 'answering' || !timerEnabled || !currentQuestion) return;

    setTimeRemaining(currentQuestion.timeLimitSeconds);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up — auto-submit wrong
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIndex, timerEnabled]);

  const handleTimeout = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!currentQuestion) return;

    const timeSpent = currentQuestion.timeLimitSeconds;
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: '',
      correct: false,
      timeSpent,
    };

    setAnswers((prev) => [...prev, answer]);
    recordAnswer(currentQuestion.id, false);
    recordSessionAnswer(false);
    setPhase('reviewing');
  }, [currentQuestion, recordAnswer, recordSessionAnswer]);

  const start = useCallback(() => {
    const mcQuestions = allQuestions.filter((q) => q.type === 'multiple-choice');
    const sessionQueue = buildQuizSession(mcQuestions, progress, { topic, maxCards: 10 });

    if (sessionQueue.length === 0) {
      setPhase('complete');
      return;
    }

    startSession(nanoid(), topic ?? ('all' as Topic), sessionQueue);
    setPhase('answering');
    setSelectedOption(null);
    setAnswers([]);
  }, [topic, progress, startSession]);

  const selectOption = useCallback(
    (optionId: string) => {
      if (phase !== 'answering' || selectedOption !== null) return;
      if (timerRef.current) clearInterval(timerRef.current);

      if (!currentQuestion) return;

      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      const correct = optionId === currentQuestion.correctOptionId;

      const answer: QuizAnswer = {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        correct,
        timeSpent,
      };

      setSelectedOption(optionId);
      setAnswers((prev) => [...prev, answer]);
      recordAnswer(currentQuestion.id, correct);
      recordSessionAnswer(correct);
      setPhase('reviewing');
    },
    [phase, selectedOption, currentQuestion, recordAnswer, recordSessionAnswer]
  );

  const next = useCallback(() => {
    advanceQueue();
    setSelectedOption(null);

    if (currentIndex + 1 >= queue.length) {
      setPhase('complete');
    } else {
      setPhase('answering');
    }
  }, [currentIndex, queue.length, advanceQueue]);

  const restart = useCallback(() => {
    endSession();
    setPhase('idle');
    setSelectedOption(null);
    setAnswers([]);
    start();
  }, [endSession, start]);

  return {
    phase,
    currentQuestion,
    currentIndex,
    totalQuestions: queue.length,
    selectedOption,
    timeRemaining,
    answers,
    score,
    totalAnswered,
    isComplete,
    start,
    selectOption,
    next,
    restart,
  };
}

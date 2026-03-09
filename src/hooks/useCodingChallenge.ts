'use client';

import { useState, useCallback } from 'react';
import type { CodingChallenge } from '@/types/content';
import { useProgressStore } from '@/store/useProgressStore';

export type ChallengePhase = 'working' | 'revealed';

export function useCodingChallenge(challenge: CodingChallenge) {
  const [code, setCode] = useState(challenge.starterCode);
  const [phase, setPhase] = useState<ChallengePhase>('working');
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [solutionRevealed, setSolutionRevealed] = useState(false);

  const recordAnswer = useProgressStore((s) => s.recordAnswer);

  const revealNextHint = useCallback(() => {
    setCurrentHintIndex((prev) => Math.min(prev + 1, challenge.hints.length - 1));
  }, [challenge.hints.length]);

  const revealSolution = useCallback(() => {
    setSolutionRevealed(true);
    setPhase('revealed');
    // Revealing solution counts as not solving it yourself
    recordAnswer(challenge.id, false);
  }, [challenge.id, recordAnswer]);

  const markCorrect = useCallback(() => {
    recordAnswer(challenge.id, true);
    setPhase('revealed');
  }, [challenge.id, recordAnswer]);

  const reset = useCallback(() => {
    setCode(challenge.starterCode);
    setPhase('working');
    setCurrentHintIndex(-1);
    setSolutionRevealed(false);
  }, [challenge.starterCode]);

  const visibleHints = challenge.hints.slice(0, currentHintIndex + 1);
  const hasMoreHints = currentHintIndex < challenge.hints.length - 1;

  return {
    code,
    setCode,
    phase,
    visibleHints,
    hasMoreHints,
    solutionRevealed,
    revealNextHint,
    revealSolution,
    markCorrect,
    reset,
  };
}

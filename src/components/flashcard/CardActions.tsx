'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface CardActionsProps {
  isFlipped: boolean;
  onCorrect: () => void;
  onIncorrect: () => void;
  onSkip: () => void;
}

export function CardActions({ isFlipped, onCorrect, onIncorrect, onSkip }: CardActionsProps) {
  // Keyboard shortcuts: 1=incorrect, 2=correct, 3=skip
  useEffect(() => {
    if (!isFlipped) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === '1') onIncorrect();
      if (e.key === '2') onCorrect();
      if (e.key === '3') onSkip();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isFlipped, onCorrect, onIncorrect, onSkip]);

  if (!isFlipped) {
    return (
      <div className="flex justify-center">
        <p className="text-sm text-slate-400">Reveal the answer to continue</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-xs text-slate-400">How did you do?</p>
      <div className="flex gap-3">
        <Button
          variant="danger"
          fullWidth
          onClick={onIncorrect}
          className="flex-1"
          aria-label="I got it wrong (key: 1)"
        >
          <span className="hidden sm:inline">Incorrect</span>
          <span className="sm:hidden">✗ Wrong</span>
          <kbd className="hidden sm:inline text-xs opacity-60 bg-white/20 px-1 rounded">1</kbd>
        </Button>
        <Button
          variant="success"
          fullWidth
          onClick={onCorrect}
          className="flex-1"
          aria-label="I got it right (key: 2)"
        >
          <span className="hidden sm:inline">Correct</span>
          <span className="sm:hidden">✓ Right</span>
          <kbd className="hidden sm:inline text-xs opacity-60 bg-white/20 px-1 rounded">2</kbd>
        </Button>
      </div>
      <button
        onClick={onSkip}
        className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-1"
        aria-label="Skip this card (key: 3)"
      >
        Skip
        <kbd className="text-xs opacity-60 bg-slate-100 px-1 rounded ml-1">3</kbd>
      </button>
    </div>
  );
}

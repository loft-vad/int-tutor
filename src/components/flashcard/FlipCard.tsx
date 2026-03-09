'use client';

import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { markdownComponents, remarkPlugins } from '@/lib/markdown';
import type { FlashcardQuestion } from '@/types/content';

interface FlipCardProps {
  card: FlashcardQuestion;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ card, isFlipped, onFlip }: FlipCardProps) {
  // Keyboard: Space or Enter flips
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && e.target === document.body) {
        e.preventDefault();
        onFlip();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onFlip]);

  return (
    <div
      className="w-full cursor-pointer perspective-1000 select-none"
      onClick={onFlip}
      role="button"
      aria-label={isFlipped ? 'Card back — click to flip' : 'Card front — click to see answer'}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onFlip();
        }
      }}
    >
      <div
        className={[
          'relative w-full transition-transform duration-500 transform-style-preserve-3d',
          isFlipped ? 'rotate-y-180' : '',
        ].join(' ')}
        style={{
          minHeight: '240px',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.5s ease',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full rounded-2xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-primary-600 mb-3 uppercase tracking-wide">Question</p>
              <div className="text-lg text-slate-900 leading-relaxed font-medium">
                <ReactMarkdown components={markdownComponents} remarkPlugins={remarkPlugins}>
                  {card.front}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">Tap or press Space to reveal</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full rounded-2xl bg-primary-50 border border-primary-200 shadow-sm p-6 flex flex-col backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex-1 overflow-y-auto">
            <p className="text-sm font-medium text-primary-600 mb-3 uppercase tracking-wide">Answer</p>
            <div className="text-base text-slate-800 leading-relaxed prose prose-sm max-w-none">
              <ReactMarkdown components={markdownComponents} remarkPlugins={remarkPlugins}>
                {card.back}
              </ReactMarkdown>
            </div>
          </div>
          {card.explanation && (
            <div className="mt-4 pt-4 border-t border-primary-200">
              <p className="text-xs text-slate-500">
                <span className="font-medium">Note: </span>
                {card.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

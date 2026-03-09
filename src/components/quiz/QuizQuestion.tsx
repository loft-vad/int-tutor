'use client';

import ReactMarkdown from 'react-markdown';
import { markdownComponents, remarkPlugins } from '@/lib/markdown';
import { OptionButton } from './OptionButton';
import { Button } from '@/components/ui/Button';
import type { MultipleChoiceQuestion } from '@/types/content';

interface QuizQuestionProps {
  question: MultipleChoiceQuestion;
  selectedOption: string | null;
  phase: 'answering' | 'reviewing';
  onSelect: (optionId: string) => void;
  onNext: () => void;
  isLast: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export function QuizQuestion({
  question,
  selectedOption,
  phase,
  onSelect,
  onNext,
  isLast,
}: QuizQuestionProps) {
  const isReviewing = phase === 'reviewing';

  return (
    <div className="space-y-5">
      <div className="text-base font-medium text-slate-900 leading-relaxed prose prose-sm max-w-none">
        <ReactMarkdown components={markdownComponents} remarkPlugins={remarkPlugins}>
          {question.prompt}
        </ReactMarkdown>
      </div>

      <div className="space-y-3">
        {question.options.map((option, i) => {
          let correct: boolean | null = null;
          if (isReviewing) {
            correct = option.id === question.correctOptionId;
          }

          return (
            <OptionButton
              key={option.id}
              id={option.id}
              text={option.text}
              selected={selectedOption === option.id}
              correct={correct}
              disabled={isReviewing}
              letter={LETTERS[i] ?? String(i + 1)}
              onClick={onSelect}
            />
          );
        })}
      </div>

      {isReviewing && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Explanation</p>
            <p className="text-sm text-slate-700 leading-relaxed">{question.explanation}</p>
          </div>
          <Button fullWidth onClick={onNext}>
            {isLast ? 'See Results' : 'Next Question →'}
          </Button>
        </div>
      )}
    </div>
  );
}

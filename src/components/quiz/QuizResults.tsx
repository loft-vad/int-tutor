'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { QuizAnswer } from '@/hooks/useQuizSession';
import type { MultipleChoiceQuestion } from '@/types/content';

interface QuizResultsProps {
  score: number;
  total: number;
  answers: QuizAnswer[];
  questions: MultipleChoiceQuestion[];
  onRestart: () => void;
}

export function QuizResults({ score, total, answers, questions, onRestart }: QuizResultsProps) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const grade =
    percent >= 90
      ? { emoji: '🏆', label: 'Excellent!', color: 'text-success-600' }
      : percent >= 70
        ? { emoji: '👍', label: 'Good job!', color: 'text-primary-600' }
        : percent >= 50
          ? { emoji: '💪', label: 'Keep going!', color: 'text-warning-600' }
          : { emoji: '📚', label: 'Study more', color: 'text-danger-600' };

  return (
    <div className="px-4 pb-8 space-y-6">
      {/* Score card */}
      <div className="text-center py-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-5xl mb-2">{grade.emoji}</div>
        <p className={['text-2xl font-bold mb-1', grade.color].join(' ')}>{grade.label}</p>
        <p className="text-5xl font-bold text-slate-900 my-3">
          {score}
          <span className="text-xl text-slate-400">/{total}</span>
        </p>
        <div className="px-8 mt-4">
          <ProgressBar
            value={percent}
            showPercent
            color={percent >= 70 ? 'success' : percent >= 50 ? 'warning' : 'danger'}
          />
        </div>
      </div>

      {/* Review each answer */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Review</h3>
        {answers.map((answer) => {
          const question = questions.find((q) => q.id === answer.questionId);
          if (!question) return null;

          return (
            <div
              key={answer.questionId}
              className={[
                'p-4 rounded-xl border',
                answer.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
              ].join(' ')}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg leading-none mt-0.5">{answer.correct ? '✅' : '❌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 line-clamp-2">{question.prompt}</p>
                  {!answer.correct && (
                    <p className="text-xs text-slate-500 mt-1">
                      Correct: {question.options.find((o) => o.id === question.correctOptionId)?.text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button fullWidth onClick={onRestart}>Try Again</Button>
        <Link href="/quiz" className="block">
          <Button variant="outline" fullWidth>Change Topic</Button>
        </Link>
      </div>
    </div>
  );
}

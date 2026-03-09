'use client';

import { TopBar } from '@/components/layout/TopBar';
import { StatsCard } from '@/components/stats/StatsCard';
import { TopicBreakdown } from '@/components/stats/TopicBreakdown';
import { useCardProgress } from '@/hooks/useCardProgress';
import { useProgressStore } from '@/store/useProgressStore';
import { allQuestions } from '@/data';

export default function StatsPage() {
  const { counts, total } = useCardProgress();
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const progressValues = Object.values(useProgressStore((s) => s.progress));

  const totalAttempts = progressValues.reduce((sum, p) => sum + p.attempts, 0);
  const totalCorrect = progressValues.reduce((sum, p) => sum + p.correctCount, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const codingCount = allQuestions.filter((q) => q.type === 'coding-challenge').length;
  const quizCount = allQuestions.filter((q) => q.type === 'multiple-choice').length;
  const flashcardCount = allQuestions.filter((q) => q.type === 'flashcard').length;

  const handleReset = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  return (
    <>
      <TopBar
        title="Stats"
        action={
          <button
            onClick={handleReset}
            className="text-xs text-danger-600 hover:text-danger-700 font-medium px-2 py-1 rounded-lg hover:bg-danger-50 transition-colors"
          >
            Reset
          </button>
        }
      />
      <div className="px-4 py-6 space-y-6">
        {/* Summary grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatsCard label="Learned" value={counts.learned} icon="🏆" />
          <StatsCard label="Learning" value={counts.learning} icon="📖" />
          <StatsCard label="Accuracy" value={`${accuracy}%`} icon="🎯" sublabel="all-time" />
          <StatsCard label="Attempts" value={totalAttempts} icon="⚡" sublabel="total answers" />
        </div>

        {/* Content breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-3">Content Library</p>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>🃏 Flashcards</span>
              <span className="font-medium">{flashcardCount}</span>
            </div>
            <div className="flex justify-between">
              <span>❓ Multiple Choice</span>
              <span className="font-medium">{quizCount}</span>
            </div>
            <div className="flex justify-between">
              <span>💻 Coding Challenges</span>
              <span className="font-medium">{codingCount}</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{total}</span>
            </div>
          </div>
        </div>

        {/* Topic breakdown */}
        <div>
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">By Topic</h2>
          <TopicBreakdown />
        </div>
      </div>
    </>
  );
}

'use client';

import Link from 'next/link';
import { useCardProgress } from '@/hooks/useCardProgress';
import { SegmentedProgress } from '@/components/ui/ProgressBar';
import { TOPIC_META, ALL_TOPICS } from '@/config/topics';
import { allQuestions } from '@/data';

const STUDY_MODES = [
  {
    href: '/flashcards',
    icon: '🃏',
    title: 'Flashcards',
    description: 'Spaced repetition study',
    color: 'bg-primary-50 border-primary-200',
    iconBg: 'bg-primary-600',
  },
  {
    href: '/quiz',
    icon: '❓',
    title: 'Quiz',
    description: 'Timed multiple-choice',
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-600',
  },
  {
    href: '/coding',
    icon: '💻',
    title: 'Coding',
    description: 'Fix, complete, or read code',
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-600',
  },
];

function DashboardContent() {
  const { counts, total } = useCardProgress();
  const learnedPct = total > 0 ? Math.round((counts.learned / total) * 100) : 0;

  return (
    <div className="px-4 pb-8 space-y-6">
      {/* Hero */}
      <div className="pt-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-900">Interview Trainer</h1>
        <p className="text-slate-500 text-sm mt-1">
          {allQuestions.length} questions across {ALL_TOPICS.length} topics
        </p>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">Overall Progress</p>
          <span className="text-sm font-bold text-slate-900">{learnedPct}%</span>
        </div>
        <SegmentedProgress learned={counts.learned} learning={counts.learning} total={total} />
        <div className="flex gap-4 mt-3 text-xs text-slate-500">
          <span>🟢 {counts.learned} learned</span>
          <span>🔵 {counts.learning} learning</span>
          <span>⚪ {counts.new} new</span>
        </div>
      </div>

      {/* Study modes */}
      <div>
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Study Modes</h2>
        <div className="grid grid-cols-1 gap-3">
          {STUDY_MODES.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              className={[
                'flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md active:scale-[0.99]',
                mode.color,
              ].join(' ')}
            >
              <div className={['w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white', mode.iconBg].join(' ')}>
                {mode.icon}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{mode.title}</p>
                <p className="text-sm text-slate-500">{mode.description}</p>
              </div>
              <svg className="w-5 h-5 text-slate-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick topic pills */}
      <div>
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Topics</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_TOPICS.map((topic) => {
            const meta = TOPIC_META[topic];
            return (
              <Link
                key={topic}
                href={`/flashcards/${topic}`}
                className={[
                  'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors hover:opacity-80',
                  meta.bgColor,
                  meta.color,
                  meta.borderColor,
                ].join(' ')}
              >
                {meta.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}

'use client';

import Link from 'next/link';
import { useCardProgress } from '@/hooks/useCardProgress';
import { SegmentedProgress } from '@/components/ui/ProgressBar';
import { TOPIC_META, ALL_TOPICS, ALL_TRACKS, TRACK_META, topicsForTrack } from '@/config/topics';
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
      <div className="pt-6 pb-2 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Interview Trainer</h1>
          <p className="text-slate-500 text-sm mt-1">
            {allQuestions.length} questions across {ALL_TOPICS.length} topics
          </p>
        </div>
        {/* Settings is not in the bottom nav (five items already), so this is the
            only entry point to it — including the cross-device sync controls. */}
        <Link
          href="/settings"
          aria-label="Settings"
          className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.077-.124.072-.044.146-.087.22-.128.331-.183.581-.495.644-.869l.213-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
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

      {/* Topics, grouped by learning track */}
      {ALL_TRACKS.map((track) => {
        const trackMeta = TRACK_META[track];
        const topics = topicsForTrack(track);
        const trackTotal = allQuestions.filter((q) => TOPIC_META[q.topic].track === track).length;

        return (
          <div key={track}>
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                {trackMeta.icon} {trackMeta.label}
              </h2>
              <span className="text-xs text-slate-400">{trackTotal} questions</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{trackMeta.description}</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => {
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
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}

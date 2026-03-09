import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { TOPIC_META, ALL_TOPICS } from '@/config/topics';

export const metadata = { title: 'Quiz — Interview Trainer' };

export default function QuizPage() {
  return (
    <>
      <TopBar title="Quiz" backHref="/" />
      <div className="px-4 py-6 space-y-4">
        <p className="text-sm text-slate-500">Test your knowledge with timed multiple-choice questions.</p>

        <Link
          href="/quiz/all"
          className="flex items-center gap-4 p-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl">
            🎯
          </div>
          <div>
            <p className="font-semibold">Mixed Quiz</p>
            <p className="text-purple-200 text-sm">All topics, 10 questions</p>
          </div>
          <svg className="w-5 h-5 text-white/60 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <div className="grid grid-cols-1 gap-3">
          {ALL_TOPICS.map((topic) => {
            const meta = TOPIC_META[topic];
            return (
              <Link
                key={topic}
                href={`/quiz/${topic}`}
                className={[
                  'flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:shadow-sm',
                  meta.bgColor,
                  meta.borderColor,
                ].join(' ')}
              >
                <div className={['w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold', meta.bgColor, meta.color].join(' ')}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={['font-semibold', meta.color].join(' ')}>{meta.label}</p>
                  <p className="text-xs text-slate-500">Multiple choice quiz</p>
                </div>
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

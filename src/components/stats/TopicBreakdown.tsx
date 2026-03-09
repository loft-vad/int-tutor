'use client';

import Link from 'next/link';
import { SegmentedProgress } from '@/components/ui/ProgressBar';
import { useTopicStats } from '@/hooks/useCardProgress';
import { TOPIC_META } from '@/config/topics';

export function TopicBreakdown() {
  const topicStats = useTopicStats();

  return (
    <div className="space-y-3">
      {topicStats.map(({ topic, counts, total, learnedPercent }) => {
        const meta = TOPIC_META[topic];
        return (
          <Link
            key={topic}
            href={`/flashcards/${topic}`}
            className="block bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={['w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold', meta.bgColor, meta.color].join(' ')}>
                  {meta.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{meta.label}</p>
                  <p className="text-xs text-slate-400">{total} questions</p>
                </div>
              </div>
              <span className="text-sm font-medium text-slate-600">{learnedPercent}%</span>
            </div>
            <SegmentedProgress
              learned={counts.learned}
              learning={counts.learning}
              total={total}
            />
            <div className="flex gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success-500 inline-block" />
                {counts.learned} learned
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-400 inline-block" />
                {counts.learning} learning
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-200 inline-block" />
                {counts.new} new
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

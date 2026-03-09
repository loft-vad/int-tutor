'use client';

import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { allQuestions } from '@/data';
import { TOPIC_META } from '@/config/topics';
import type { CodingChallenge } from '@/types/content';

const MODE_LABELS: Record<string, string> = {
  read: '📖 Read',
  fix: '🔧 Fix',
  complete: '✏️ Complete',
};

export default function CodingPage() {
  const challenges = allQuestions.filter(
    (q): q is CodingChallenge => q.type === 'coding-challenge'
  );

  const byTopic = challenges.reduce(
    (acc, c) => {
      if (!acc[c.topic]) acc[c.topic] = [];
      acc[c.topic]!.push(c);
      return acc;
    },
    {} as Record<string, CodingChallenge[]>
  );

  return (
    <>
      <TopBar title="Coding Challenges" backHref="/" />
      <div className="px-4 py-6 space-y-6">
        <p className="text-sm text-slate-500">
          {challenges.length} challenges — fix bugs, complete implementations, or study patterns.
        </p>

        {Object.entries(byTopic).map(([topic, topicChallenges]) => {
          const meta = TOPIC_META[topic as keyof typeof TOPIC_META];
          return (
            <div key={topic}>
              <h2 className={['text-sm font-semibold mb-3 flex items-center gap-2', meta?.color].join(' ')}>
                <span>{meta?.icon}</span>
                {meta?.label ?? topic}
              </h2>
              <div className="space-y-3">
                {topicChallenges.map((challenge) => (
                  <Link
                    key={challenge.id}
                    href={`/coding/${challenge.id}`}
                    className="block bg-white border border-slate-200 rounded-2xl p-4 hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900 flex-1 line-clamp-2">
                        {challenge.prompt.split('\n')[0]?.replace(/^#+\s*/, '') ?? challenge.prompt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="default">{MODE_LABELS[challenge.mode]}</Badge>
                      <DifficultyBadge difficulty={challenge.difficulty} />
                      <Badge variant="info">{challenge.language}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {challenges.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-4xl mb-3">💻</p>
            <p>No coding challenges yet</p>
          </div>
        )}
      </div>
    </>
  );
}

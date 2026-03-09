'use client';

import { useMemo } from 'react';
import { useProgressStore } from '@/store/useProgressStore';
import { allQuestions } from '@/data';
import { countByStatus } from '@/lib/questionFilters';
import type { Topic } from '@/types/content';

export function useCardProgress(topic?: Topic) {
  const progress = useProgressStore((s) => s.progress);

  const filtered = useMemo(
    () => (topic ? allQuestions.filter((q) => q.topic === topic) : allQuestions),
    [topic]
  );

  const counts = useMemo(() => countByStatus(filtered, progress), [filtered, progress]);

  const total = filtered.length;
  const learnedPercent = total > 0 ? Math.round((counts.learned / total) * 100) : 0;
  const activePercent = total > 0 ? Math.round((counts.learning / total) * 100) : 0;

  return {
    counts,
    total,
    learnedPercent,
    activePercent,
    progress,
  };
}

export function useTopicStats() {
  const progress = useProgressStore((s) => s.progress);

  return useMemo(() => {
    const topics = Array.from(new Set(allQuestions.map((q) => q.topic))) as Topic[];
    return topics.map((topic) => {
      const topicQuestions = allQuestions.filter((q) => q.topic === topic);
      const counts = countByStatus(topicQuestions, progress);
      const total = topicQuestions.length;
      return {
        topic,
        counts,
        total,
        learnedPercent: total > 0 ? Math.round((counts.learned / total) * 100) : 0,
      };
    });
  }, [progress]);
}

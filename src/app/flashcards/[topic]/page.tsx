import { notFound } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { FlashcardSession } from '@/components/flashcard/FlashcardSession';
import { TOPIC_META, ALL_TOPICS } from '@/config/topics';
import type { Topic } from '@/types/content';

interface Props {
  params: { topic: string };
}

export function generateStaticParams() {
  return [...ALL_TOPICS.map((t) => ({ topic: t })), { topic: 'all' }];
}

export function generateMetadata({ params }: Props) {
  const isAll = params.topic === 'all';
  const topicMeta = isAll ? null : TOPIC_META[params.topic as Topic];
  return {
    title: `${topicMeta?.label ?? 'All Topics'} Flashcards — Interview Trainer`,
  };
}

export default function FlashcardTopicPage({ params }: Props) {
  const isAll = params.topic === 'all';
  if (!isAll && !ALL_TOPICS.includes(params.topic as Topic)) {
    notFound();
  }

  const topic = isAll ? undefined : (params.topic as Topic);
  const topicMeta = topic ? TOPIC_META[topic] : null;

  return (
    <>
      <TopBar
        title={topicMeta ? `${topicMeta.label} Flashcards` : 'Flashcards'}
        backHref="/flashcards"
      />
      <FlashcardSession topic={topic} />
    </>
  );
}

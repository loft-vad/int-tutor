import { notFound } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { ChallengeViewer } from '@/components/coding/ChallengeViewer';
import { allQuestions } from '@/data';
import type { CodingChallenge } from '@/types/content';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return allQuestions
    .filter((q) => q.type === 'coding-challenge')
    .map((q) => ({ id: q.id }));
}

export function generateMetadata({ params }: Props) {
  const challenge = allQuestions.find(
    (q) => q.id === params.id && q.type === 'coding-challenge'
  ) as CodingChallenge | undefined;

  return {
    title: challenge
      ? `${challenge.prompt.split('\n')[0]?.slice(0, 50)} — Interview Trainer`
      : 'Challenge — Interview Trainer',
  };
}

export default function ChallengeDetailPage({ params }: Props) {
  const challenge = allQuestions.find(
    (q) => q.id === params.id && q.type === 'coding-challenge'
  ) as CodingChallenge | undefined;

  if (!challenge) notFound();

  return (
    <>
      <TopBar title="Challenge" backHref="/coding" />
      <ChallengeViewer challenge={challenge} />
    </>
  );
}

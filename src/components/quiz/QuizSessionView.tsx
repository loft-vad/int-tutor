'use client';

import { TopBar } from '@/components/layout/TopBar';
import { QuizHeader } from '@/components/quiz/QuizHeader';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizResults } from '@/components/quiz/QuizResults';
import { Button } from '@/components/ui/Button';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useSettingsStore } from '@/store/useSettingsStore';
import { TOPIC_META } from '@/config/topics';
import type { Topic, MultipleChoiceQuestion } from '@/types/content';

interface QuizSessionViewProps {
  topic?: Topic;
}

export function QuizSessionView({ topic }: QuizSessionViewProps) {
  const {
    phase,
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedOption,
    timeRemaining,
    answers,
    score,
    isComplete,
    start,
    selectOption,
    next,
    restart,
  } = useQuizSession(topic);

  const timerEnabled = useSettingsStore((s) => s.settings.timerEnabled);
  const topicMeta = topic ? TOPIC_META[topic] : null;

  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="text-5xl mb-4">{topicMeta?.icon ?? '🎯'}</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {topicMeta ? `${topicMeta.label} Quiz` : 'Mixed Quiz'}
        </h2>
        <p className="text-slate-500 mb-8 max-w-xs">
          10 multiple-choice questions. {timerEnabled ? 'Each has a time limit.' : 'No time limit.'}
        </p>
        <Button size="lg" onClick={start} fullWidth className="max-w-xs">
          Start Quiz
        </Button>
      </div>
    );
  }

  if (isComplete || phase === 'complete') {
    return (
      <>
        <TopBar title="Results" backHref="/quiz" />
        <QuizResults
          score={score}
          total={answers.length}
          answers={answers}
          questions={[]}
          onRestart={restart}
        />
      </>
    );
  }

  if (!currentQuestion) return null;
  const mcQuestion = currentQuestion as MultipleChoiceQuestion;

  return (
    <div className="px-4 pb-6 space-y-5">
      <QuizHeader
        question={mcQuestion}
        currentIndex={currentIndex}
        total={totalQuestions}
        timeRemaining={timeRemaining}
        timerEnabled={timerEnabled}
      />
      <QuizQuestion
        question={mcQuestion}
        selectedOption={selectedOption}
        phase={phase}
        onSelect={selectOption}
        onNext={next}
        isLast={currentIndex === totalQuestions - 1}
      />
    </div>
  );
}

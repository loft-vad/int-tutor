import { ProgressBar } from '@/components/ui/ProgressBar';
import { Timer } from '@/components/ui/Timer';
import { DifficultyBadge } from '@/components/ui/Badge';
import type { MultipleChoiceQuestion } from '@/types/content';

interface QuizHeaderProps {
  question: MultipleChoiceQuestion;
  currentIndex: number;
  total: number;
  timeRemaining: number;
  timerEnabled: boolean;
}

export function QuizHeader({ question, currentIndex, total, timeRemaining, timerEnabled }: QuizHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          Question {currentIndex + 1} of {total}
        </span>
        <DifficultyBadge difficulty={question.difficulty} />
      </div>
      <ProgressBar value={currentIndex} max={total} size="sm" />
      {timerEnabled && (
        <Timer
          seconds={timeRemaining}
          totalSeconds={question.timeLimitSeconds}
        />
      )}
    </div>
  );
}

'use client';

interface TimerProps {
  seconds: number;
  totalSeconds: number;
  className?: string;
}

export function Timer({ seconds, totalSeconds, className = '' }: TimerProps) {
  const percent = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;
  const isUrgent = percent <= 30;
  const isCritical = percent <= 15;

  const colorClass = isCritical
    ? 'text-danger-600'
    : isUrgent
      ? 'text-warning-600'
      : 'text-slate-600';

  const barColor = isCritical
    ? 'bg-danger-500'
    : isUrgent
      ? 'bg-warning-500'
      : 'bg-primary-500';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`;

  return (
    <div className={['flex items-center gap-2', className].join(' ')}>
      <span className={['text-sm font-mono font-medium tabular-nums min-w-[2.5rem]', colorClass].join(' ')}>
        {display}
      </span>
      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={['h-full rounded-full transition-all duration-1000 linear', barColor].join(' ')}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

const colorClasses = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  color = 'primary',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-slate-600">{label}</span>}
          {showPercent && <span className="text-sm font-medium text-slate-700">{Math.round(percent)}%</span>}
        </div>
      )}
      <div
        className={['w-full bg-slate-200 rounded-full overflow-hidden', sizeClasses[size]].join(' ')}
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={['h-full rounded-full transition-all duration-500 ease-out', colorClasses[color]].join(' ')}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function SegmentedProgress({
  learned,
  learning,
  total,
}: {
  learned: number;
  learning: number;
  total: number;
}) {
  if (total === 0) return null;
  const learnedPct = (learned / total) * 100;
  const learningPct = (learning / total) * 100;

  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
      <div
        className="h-full bg-success-500 transition-all duration-500"
        style={{ width: `${learnedPct}%` }}
      />
      <div
        className="h-full bg-primary-400 transition-all duration-500"
        style={{ width: `${learningPct}%` }}
      />
    </div>
  );
}

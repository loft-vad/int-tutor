import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-600',
  danger: 'bg-danger-50 text-danger-600',
  info: 'bg-cyan-50 text-cyan-700',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: 'beginner' | 'intermediate' | 'advanced' }) {
  const map: Record<string, BadgeVariant> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  };
  return <Badge variant={map[difficulty]}>{difficulty}</Badge>;
}

export function StatusBadge({ status }: { status: 'new' | 'learning' | 'learned' | 'skipped' }) {
  const map: Record<string, BadgeVariant> = {
    new: 'default',
    learning: 'primary',
    learned: 'success',
    skipped: 'warning',
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

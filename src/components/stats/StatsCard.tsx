interface StatsCardProps {
  label: string;
  value: number | string;
  sublabel?: string;
  icon?: string;
  className?: string;
}

export function StatsCard({ label, value, sublabel, icon, className = '' }: StatsCardProps) {
  return (
    <div className={['bg-white rounded-2xl border border-slate-200 p-4 shadow-sm', className].join(' ')}>
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-600 mt-0.5">{label}</p>
      {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
    </div>
  );
}

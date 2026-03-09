import Link from 'next/link';

interface TopBarProps {
  title: string;
  backHref?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, backHref, action }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="flex items-center h-14 px-4 max-w-lg mx-auto gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
        )}
        <h1 className="text-lg font-semibold text-slate-900 flex-1 truncate">{title}</h1>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}

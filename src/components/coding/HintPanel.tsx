import { Button } from '@/components/ui/Button';

interface HintPanelProps {
  hints: string[];
  visibleHints: string[];
  hasMoreHints: boolean;
  onRevealHint: () => void;
}

export function HintPanel({ hints, visibleHints, hasMoreHints, onRevealHint }: HintPanelProps) {
  if (hints.length === 0) return null;

  return (
    <div className="space-y-3">
      {visibleHints.length > 0 && (
        <div className="space-y-2">
          {visibleHints.map((hint, i) => (
            <div key={i} className="flex gap-2 p-3 bg-warning-50 rounded-lg border border-warning-200">
              <span className="text-warning-600 text-sm font-medium flex-shrink-0">💡 Hint {i + 1}</span>
              <p className="text-sm text-slate-700">{hint}</p>
            </div>
          ))}
        </div>
      )}
      {hasMoreHints && (
        <Button variant="outline" size="sm" onClick={onRevealHint}>
          {visibleHints.length === 0 ? '💡 Show hint' : '💡 Next hint'}
          <span className="text-xs text-slate-400 ml-1">
            ({visibleHints.length + 1}/{hints.length})
          </span>
        </Button>
      )}
    </div>
  );
}

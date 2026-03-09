'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface SolutionRevealProps {
  solutionCode: string;
  language: string;
  onReveal: () => void;
  revealed: boolean;
}

export function SolutionReveal({ solutionCode, language, onReveal, revealed }: SolutionRevealProps) {
  const [confirming, setConfirming] = useState(false);

  if (revealed) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-600">Solution:</p>
        <CodeBlock code={solutionCode} language={language} />
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="p-4 bg-warning-50 rounded-xl border border-warning-200 space-y-3">
        <p className="text-sm text-slate-700">
          Revealing the solution marks this challenge as not solved. Are you sure?
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onReveal} className="flex-1 bg-warning-500 text-white hover:bg-warning-600 !bg-warning-500 !hover:bg-warning-600">
            Show solution
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
      👁 Reveal solution
    </Button>
  );
}

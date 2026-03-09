'use client';

import ReactMarkdown from 'react-markdown';
import { markdownComponents, remarkPlugins } from '@/lib/markdown';
import { CodeEditor } from './CodeEditor';
import { HintPanel } from './HintPanel';
import { SolutionReveal } from './SolutionReveal';
import { Button } from '@/components/ui/Button';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { useCodingChallenge } from '@/hooks/useCodingChallenge';
import type { CodingChallenge } from '@/types/content';
import { TOPIC_META } from '@/config/topics';

interface ChallengeViewerProps {
  challenge: CodingChallenge;
}

const MODE_LABELS: Record<string, string> = {
  read: '📖 Read & Understand',
  fix: '🔧 Fix the Bug',
  complete: '✏️ Complete the Code',
};

export function ChallengeViewer({ challenge }: ChallengeViewerProps) {
  const {
    code,
    setCode,
    phase,
    visibleHints,
    hasMoreHints,
    solutionRevealed,
    revealNextHint,
    revealSolution,
    markCorrect,
    reset,
  } = useCodingChallenge(challenge);

  const topicMeta = TOPIC_META[challenge.topic];

  return (
    <div className="space-y-5 px-4 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default">{MODE_LABELS[challenge.mode]}</Badge>
          <DifficultyBadge difficulty={challenge.difficulty} />
          <Badge variant="info">{topicMeta?.label}</Badge>
        </div>
        <div className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none">
          <ReactMarkdown components={markdownComponents} remarkPlugins={remarkPlugins}>
            {challenge.prompt}
          </ReactMarkdown>
        </div>
      </div>

      {/* Editor */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          {challenge.mode === 'read' ? 'Code to study:' : 'Your code:'}
        </p>
        <CodeEditor
          value={code}
          language={challenge.language}
          onChange={setCode}
          readOnly={challenge.mode === 'read'}
          height="280px"
        />
      </div>

      {/* Hints */}
      <HintPanel
        hints={challenge.hints}
        visibleHints={visibleHints}
        hasMoreHints={hasMoreHints}
        onRevealHint={revealNextHint}
      />

      {/* Solution */}
      {challenge.mode !== 'read' && (
        <SolutionReveal
          solutionCode={challenge.solutionCode}
          language={challenge.language}
          onReveal={revealSolution}
          revealed={solutionRevealed}
        />
      )}

      {/* Actions */}
      {phase === 'working' && (
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={reset}>
            Reset
          </Button>
          {challenge.mode !== 'read' && (
            <Button size="sm" onClick={markCorrect} className="flex-1">
              ✓ I solved it
            </Button>
          )}
          {challenge.mode === 'read' && (
            <Button size="sm" onClick={markCorrect} className="flex-1">
              ✓ I understand it
            </Button>
          )}
        </div>
      )}

      {phase === 'revealed' && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-1">Explanation</p>
          <p className="text-sm text-slate-600 leading-relaxed">{challenge.explanation}</p>
        </div>
      )}
    </div>
  );
}

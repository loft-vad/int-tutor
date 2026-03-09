'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-slate-900 rounded-xl flex items-center justify-center">
      <div className="text-slate-400 text-sm animate-pulse">Loading editor...</div>
    </div>
  ),
});

interface CodeEditorProps {
  value: string;
  language: 'javascript' | 'typescript';
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({
  value,
  language,
  onChange,
  readOnly = false,
  height = '300px',
}: CodeEditorProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700">
      <Suspense fallback={
        <div className="bg-slate-900 flex items-center justify-center" style={{ height }}>
          <span className="text-slate-400 text-sm">Loading editor…</span>
        </div>
      }>
        <MonacoEditor
          height={height}
          language={language}
          value={value}
          theme="vs-dark"
          onChange={(v) => onChange(v ?? '')}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </Suspense>
    </div>
  );
}

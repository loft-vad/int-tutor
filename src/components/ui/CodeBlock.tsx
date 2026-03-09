import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'javascript', className = '' }: CodeBlockProps) {
  return (
    <div className={['rounded-xl overflow-hidden bg-slate-900 text-slate-100', className].join(' ')}>
      {language && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs font-mono text-slate-400">{language}</span>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

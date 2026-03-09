import React from 'react';
import remarkGfm from 'remark-gfm';

export const markdownComponents = {
  code({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { node?: unknown }) {
    const match = /language-(\w+)/.exec(className ?? '');
    const isBlock = !!match;

    if (isBlock) {
      return (
        <pre className="rounded-lg bg-slate-900 p-4 overflow-x-auto text-sm my-3">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      );
    }

    return (
      <code
        className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-sm font-mono text-slate-800 dark:text-slate-200"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export const remarkPlugins = [remarkGfm];

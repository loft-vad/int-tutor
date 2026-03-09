'use client';

import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Button } from '@/components/ui/Button';

export function InstallPrompt() {
  const { isInstallable, promptInstall, dismiss } = useInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
            IT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">Install Interview Trainer</p>
            <p className="text-xs text-slate-500 mt-0.5">Add to home screen for offline access</p>
          </div>
          <button
            onClick={dismiss}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="ghost" size="sm" onClick={dismiss} className="flex-1">
            Not now
          </Button>
          <Button size="sm" onClick={promptInstall} className="flex-1">
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}

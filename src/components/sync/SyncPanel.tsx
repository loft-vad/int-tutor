'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getSyncedAdapter, getStorageAdapter } from '@/storage/adapters';
import type { SyncState } from '@/storage/SyncedAdapter';

interface Account {
  uid: string;
  email: string | null;
  isAnonymous: boolean;
}

const STATUS_LABEL: Record<SyncState['status'], { text: string; dot: string }> = {
  idle: { text: 'Not synced yet', dot: 'bg-slate-300' },
  syncing: { text: 'Syncing…', dot: 'bg-amber-400 animate-pulse' },
  synced: { text: 'Up to date', dot: 'bg-green-500' },
  offline: { text: 'Offline — will sync later', dot: 'bg-slate-400' },
  error: { text: 'Sync failed', dot: 'bg-red-500' },
};

/**
 * Optional cross-device sync controls.
 *
 * Renders nothing at all when Firebase is not configured, so the app is
 * unchanged for anyone who has not set the `NEXT_PUBLIC_FIREBASE_*` variables.
 */
export function SyncPanel() {
  const [available, setAvailable] = useState(false);
  const [state, setState] = useState<SyncState | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      // Ensure the adapter is resolved before asking for the synced instance.
      await getStorageAdapter();
      const synced = getSyncedAdapter();
      if (cancelled || !synced) return;

      setAvailable(true);
      unsubscribe = synced.subscribe(setState);

      const { getAccount } = await import('@/storage/firebase');
      if (!cancelled) setAccount(await getAccount());
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  // Flush pending writes when the tab is hidden or closed.
  useEffect(() => {
    if (!available) return;
    const flush = () => void getSyncedAdapter()?.flush();
    document.addEventListener('visibilitychange', flush);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', flush);
      window.removeEventListener('pagehide', flush);
    };
  }, [available]);

  if (!available) return null;

  const status = STATUS_LABEL[state?.status ?? 'idle'];

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const { signInWithGoogle } = await import('@/storage/firebase');
      await signInWithGoogle();
      const { getAccount } = await import('@/storage/firebase');
      setAccount(await getAccount());
      await getSyncedAdapter()?.pull();
    } catch (err) {
      console.error('[sync] sign-in failed', err);
    } finally {
      setBusy(false);
    }
  };

  const handleSyncNow = async () => {
    setBusy(true);
    try {
      const synced = getSyncedAdapter();
      await synced?.flush();
      await synced?.pull();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-slate-900">Cross-device Sync</p>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className={['w-2 h-2 rounded-full', status.dot].join(' ')} />
          {status.text}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        {account?.isAnonymous
          ? 'Progress syncs to a private anonymous account on this browser. Sign in to reach it from other devices.'
          : account?.email
            ? `Signed in as ${account.email}`
            : 'Progress syncs across your devices.'}
      </p>

      {state?.error && (
        <p className="text-xs text-red-600 mb-3 break-words">{state.error}</p>
      )}

      <div className="flex gap-2 flex-wrap">
        {account?.isAnonymous !== false && (
          <Button variant="outline" onClick={handleGoogle} disabled={busy}>
            Sign in with Google
          </Button>
        )}
        <Button variant="outline" onClick={handleSyncNow} disabled={busy}>
          Sync now
        </Button>
      </div>

      {state?.lastSyncedAt && (
        <p className="text-xs text-slate-400 mt-3">
          Last synced {new Date(state.lastSyncedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

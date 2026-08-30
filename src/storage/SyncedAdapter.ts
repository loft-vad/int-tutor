import type { StorageAdapter } from '@/types/storage';
import type { CardProgress, UserSettings } from '@/types/progress';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

export interface SyncState {
  status: SyncStatus;
  lastSyncedAt: string | null;
  error: string | null;
}

type Listener = (state: SyncState) => void;

/**
 * Offline-first {@link StorageAdapter} that composes a **local** adapter (the
 * read path, always instant) with a **remote** adapter (the sync target).
 *
 * Why compose rather than use the remote adapter directly:
 *   - the PWA must work with no network and no Firebase project configured;
 *   - reads must never wait on a round trip;
 *   - a remote failure must degrade to local-only, not break the app.
 *
 * Reads   → local, always.
 * Writes  → local synchronously, then pushed to remote (fire-and-forget, debounced).
 * Startup → {@link pull} merges remote into local before the stores hydrate.
 *
 * Conflict resolution for progress is **per-card last-write-wins** on
 * `lastAttemptedAt`, which is far better than whole-document LWW: studying on
 * a phone and then a laptop merges instead of one device clobbering the other.
 */
export class SyncedAdapter implements StorageAdapter {
  private state: SyncState = { status: 'idle', lastSyncedAt: null, error: null };
  private listeners = new Set<Listener>();
  private pushTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingProgress: Record<string, CardProgress> | null = null;
  private pendingSettings: UserSettings | null = null;

  constructor(
    private local: StorageAdapter,
    private remote: StorageAdapter,
    private debounceMs = 3000
  ) {}

  // ── Observable sync state (for the settings UI) ──────────
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  getState(): SyncState {
    return this.state;
  }

  private setState(patch: Partial<SyncState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn(this.state));
  }

  // ── StorageAdapter ───────────────────────────────────────
  getProgress(): Promise<Record<string, CardProgress>> {
    return this.local.getProgress();
  }

  async setProgress(progress: Record<string, CardProgress>): Promise<void> {
    await this.local.setProgress(progress);
    this.pendingProgress = progress;
    this.schedulePush();
  }

  getSettings(): Promise<UserSettings> {
    return this.local.getSettings();
  }

  async setSettings(settings: UserSettings): Promise<void> {
    await this.local.setSettings(settings);
    this.pendingSettings = settings;
    this.schedulePush();
  }

  async clear(): Promise<void> {
    await this.local.clear();
    try {
      await this.remote.clear();
    } catch (err) {
      this.setState({ status: 'error', error: describe(err) });
    }
  }

  // ── Sync ─────────────────────────────────────────────────

  /**
   * Merge remote state into local. Call once before the Zustand stores hydrate.
   * Never throws — a failed pull leaves the local data intact.
   */
  async pull(): Promise<void> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.setState({ status: 'offline' });
      return;
    }
    this.setState({ status: 'syncing', error: null });
    try {
      const [localProgress, remoteProgress] = await Promise.all([
        this.local.getProgress(),
        this.remote.getProgress(),
      ]);

      const merged = mergeProgress(localProgress, remoteProgress);
      await this.local.setProgress(merged);

      // Push the merge back so both sides converge.
      if (!shallowEqualProgress(merged, remoteProgress)) {
        await this.remote.setProgress(merged);
      }

      this.setState({
        status: 'synced',
        lastSyncedAt: new Date().toISOString(),
        error: null,
      });
    } catch (err) {
      console.warn('[sync] pull failed:', err);
      this.setState({ status: 'error', error: describe(err) });
    }
  }

  /** Flush any pending writes immediately (e.g. on page hide). */
  async flush(): Promise<void> {
    if (this.pushTimer) {
      clearTimeout(this.pushTimer);
      this.pushTimer = null;
    }
    await this.push();
  }

  private schedulePush() {
    if (this.pushTimer) clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => {
      this.pushTimer = null;
      void this.push();
    }, this.debounceMs);
  }

  private async push(): Promise<void> {
    const progress = this.pendingProgress;
    const settings = this.pendingSettings;
    if (!progress && !settings) return;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.setState({ status: 'offline' });
      return; // keep pending; the next successful push carries them
    }

    this.setState({ status: 'syncing', error: null });
    try {
      if (progress) await this.remote.setProgress(progress);
      if (settings) await this.remote.setSettings(settings);
      this.pendingProgress = null;
      this.pendingSettings = null;
      this.setState({
        status: 'synced',
        lastSyncedAt: new Date().toISOString(),
        error: null,
      });
    } catch (err) {
      console.warn('[sync] push failed:', err);
      this.setState({ status: 'error', error: describe(err) });
    }
  }
}

/**
 * Per-card last-write-wins merge.
 *
 * A card present on only one side is kept. A card present on both is resolved by
 * `lastAttemptedAt`; when those tie (or are both null) the record with more
 * attempts wins, so an un-synced local session is never silently discarded.
 */
export function mergeProgress(
  local: Record<string, CardProgress>,
  remote: Record<string, CardProgress>
): Record<string, CardProgress> {
  const merged: Record<string, CardProgress> = { ...remote };

  for (const [id, localCard] of Object.entries(local)) {
    const remoteCard = merged[id];
    if (!remoteCard) {
      merged[id] = localCard;
      continue;
    }
    merged[id] = pickNewer(localCard, remoteCard);
  }

  return merged;
}

function pickNewer(a: CardProgress, b: CardProgress): CardProgress {
  const ta = a.lastAttemptedAt ? Date.parse(a.lastAttemptedAt) : 0;
  const tb = b.lastAttemptedAt ? Date.parse(b.lastAttemptedAt) : 0;
  if (ta !== tb) return ta > tb ? a : b;
  return a.attempts >= b.attempts ? a : b;
}

function shallowEqualProgress(
  a: Record<string, CardProgress>,
  b: Record<string, CardProgress>
): boolean {
  const ka = Object.keys(a);
  if (ka.length !== Object.keys(b).length) return false;
  return ka.every((k) => {
    const x = a[k];
    const y = b[k];
    return (
      y !== undefined &&
      x !== undefined &&
      x.status === y.status &&
      x.attempts === y.attempts &&
      x.lastAttemptedAt === y.lastAttemptedAt
    );
  });
}

function describe(err: unknown): string {
  // Surface the provider error code too — "permission-denied" vs "unavailable"
  // vs "unauthenticated" need completely different fixes, and the bare message
  // ("Missing or insufficient permissions.") does not distinguish them.
  const code = (err as { code?: string } | null)?.code;
  const msg = err instanceof Error ? err.message : String(err);
  return code ? `${code}: ${msg}` : msg;
}

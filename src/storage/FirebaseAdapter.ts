import type { StorageAdapter } from '@/types/storage';
import type { CardProgress, UserSettings } from '@/types/progress';
import { DEFAULT_SETTINGS } from './defaults';
import { getFirebase, type FirebaseHandles } from './firebase';

/**
 * Remote {@link StorageAdapter} backed by Cloud Firestore.
 *
 * Layout — one document per user, two fields:
 *   users/{uid}  { progress: Record<string, CardProgress>, settings: UserSettings, updatedAt }
 *
 * A single document keeps reads/writes to one operation and stays far below the
 * 1 MiB document limit (~1 KB per card × a few thousand cards).
 *
 * This adapter is NOT used directly by the app — {@link SyncedAdapter} composes it
 * with a local adapter so the PWA still works offline. See `adapters.ts`.
 */
export class FirebaseAdapter implements StorageAdapter {
  private handles: Promise<FirebaseHandles>;

  constructor() {
    this.handles = getFirebase();
  }

  private async userDoc() {
    const { db, uid, firestore } = await this.handles;
    return firestore.doc(db, 'users', uid);
  }

  private async read<T>(field: 'progress' | 'settings', fallback: T): Promise<T> {
    const { firestore } = await this.handles;
    const snap = await firestore.getDoc(await this.userDoc());
    if (!snap.exists()) return fallback;
    return (snap.data()?.[field] as T) ?? fallback;
  }

  private async write(field: 'progress' | 'settings', value: unknown): Promise<void> {
    const { firestore } = await this.handles;
    await firestore.setDoc(
      await this.userDoc(),
      { [field]: value, updatedAt: firestore.serverTimestamp() },
      { merge: true }
    );
  }

  async getProgress(): Promise<Record<string, CardProgress>> {
    return this.read<Record<string, CardProgress>>('progress', {});
  }

  async setProgress(progress: Record<string, CardProgress>): Promise<void> {
    await this.write('progress', progress);
  }

  async getSettings(): Promise<UserSettings> {
    return this.read<UserSettings>('settings', DEFAULT_SETTINGS);
  }

  async setSettings(settings: UserSettings): Promise<void> {
    await this.write('settings', settings);
  }

  async clear(): Promise<void> {
    const { firestore } = await this.handles;
    await firestore.deleteDoc(await this.userDoc());
  }
}

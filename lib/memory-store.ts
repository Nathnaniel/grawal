import { newestFirst } from './order';
import { sampleEntries, SAMPLE_USER } from './sample';
import type { AppStore } from './types';

/** Stands in for Supabase on /preview. Changes last until the page reloads. */
export function createMemoryStore(): AppStore {
  const entries = new Map(sampleEntries.map((entry) => [entry.id, entry]));

  return {
    async saveEntry(entry) {
      if (!navigator.onLine) throw new Error('offline');
      entries.set(entry.id, entry);
    },
    async removeEntry(id) {
      entries.delete(id);
    },
    async entriesBefore(last, limit) {
      return [...entries.values()]
        .filter((entry) => !entry.is_pinned && newestFirst(last, entry) < 0)
        .sort(newestFirst)
        .slice(0, limit);
    },
    async saveProfile() {},
    async addCategory(name, colour) {
      return { id: crypto.randomUUID(), user_id: SAMPLE_USER, name, colour };
    },
    async removeCategory() {},
  };
}

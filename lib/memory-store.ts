import { newestFirst } from './order';
import { matchesSearch } from './search';
import { sampleEntries, SAMPLE_USER } from './sample';
import type { AppStore, Entry } from './types';

/** Stands in for Supabase on /preview. Changes last until the page reloads. */
export function createMemoryStore(initial: Entry[] = sampleEntries): AppStore {
  const entries = new Map(initial.map((entry) => [entry.id, entry]));

  return {
    async saveEntry(entry) {
      if (!navigator.onLine) throw new Error('offline');
      entries.set(entry.id, entry);
    },
    async removeEntry(id) {
      entries.delete(id);
    },
    async entriesBefore(last, limit) {
      return [...entries.values()].filter((entry) => entry.on_wall && newestFirst(last, entry) < 0).sort(newestFirst).slice(0, limit);
    },
    async search({ q, categoryId }) {
      return [...entries.values()].filter((entry) => matchesSearch(entry, { q, category: categoryId, year: '' })).sort(newestFirst);
    },
    async saveProfile() {},
    async addCategory(name, colour) {
      return { id: crypto.randomUUID(), user_id: SAMPLE_USER, name, colour };
    },
    async removeCategory() {},
    async uploadAvatar(file) {
      return { path: `${SAMPLE_USER}/${file.name}`, url: URL.createObjectURL(file) };
    },
  };
}

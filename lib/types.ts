import type { CategoryRow, EntryRow, ProfileRow } from './database.types';

export type Entry = Omit<EntryRow, 'user_id' | 'search_text'>;
export type Category = Pick<CategoryRow, 'id' | 'user_id' | 'name' | 'colour'>;
export type Profile = Omit<ProfileRow, 'created_at'>;
export type ProfilePatch = Partial<Pick<Profile, 'name' | 'timezone' | 'reminder_frequency' | 'reminder_time' | 'onboarded_at'>>;

/** What the wall's right-hand widgets show. */
export interface WallSummary {
  year: number;
  yearWins: number;
  allWins: number;
  topCategories: { category_id: string; wins: number }[];
  onThisDay: Entry[];
}

/** Everything the screens change. One version talks to Supabase, one to sample data. */
export interface AppStore {
  saveEntry(entry: Entry): Promise<void>;
  removeEntry(id: string): Promise<void>;
  /** The next page of unpinned entries, older than the one given. */
  entriesBefore(last: Entry, limit: number): Promise<Entry[]>;
  saveProfile(patch: ProfilePatch): Promise<void>;
  addCategory(name: string, colour: string): Promise<Category>;
  removeCategory(id: string): Promise<void>;
}

export const ENTRY_COLUMNS = 'id, title, reflection, category_id, scripture_ref, photo_path, is_pinned, entry_date, created_at, updated_at';
export const WALL_PAGE_SIZE = 50;

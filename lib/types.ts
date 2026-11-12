import type { CategoryRow, EntryRow, ProfileRow } from './database.types';

export type Entry = Omit<EntryRow, 'user_id' | 'search_text'>;
export type Category = Pick<CategoryRow, 'id' | 'user_id' | 'name' | 'colour'>;
export type Profile = Omit<ProfileRow, 'created_at'>;
export type ProfilePatch = Partial<Pick<Profile, 'name' | 'timezone' | 'reminder_frequency' | 'reminder_time' | 'onboarded_at' | 'avatar_path' | 'notify_on_this_day'>>;

/** What the notifications are worked out from. */
export interface WallSummary {
  year: number;
  yearWins: number;
  allWins: number;
  onThisDay: Entry[];
  /** The most recent win's day, or null before the first. */
  lastWinDay: string | null;
}

export interface EntryFilters { q: string; categoryId: string }

/** Everything the screens change. One version talks to Supabase, one to sample data. */
export interface AppStore {
  saveEntry(entry: Entry): Promise<void>;
  removeEntry(id: string): Promise<void>;
  /** The next page of the wall, older than the entry given. */
  entriesBefore(last: Entry, limit: number): Promise<Entry[]>;
  /** Wins matching a keyword, a category, or both. */
  search(filters: EntryFilters): Promise<Entry[]>;
  saveProfile(patch: ProfilePatch): Promise<void>;
  addCategory(name: string, colour: string): Promise<Category>;
  removeCategory(id: string): Promise<void>;
  /** Stores a new profile photo and returns its path and a link to show it. */
  uploadAvatar(file: File): Promise<{ path: string; url: string }>;
}

export const ENTRY_COLUMNS = 'id, title, reflection, category_id, scripture_ref, photo_path, is_pinned, entry_date, created_at, updated_at';
export const PROFILE_COLUMNS = 'id, name, timezone, reminder_frequency, reminder_time, onboarded_at, avatar_path, notify_on_this_day';
export const WALL_PAGE_SIZE = 60;

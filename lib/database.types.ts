// Written by hand to match supabase/migrations. Once a project exists, replace
// this with the output of `supabase gen types typescript`.
type Table<Row, Insert, Update = Partial<Insert>> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] };

export type ProfileRow = {
  id: string;
  name: string;
  timezone: string;
  reminder_frequency: 'off' | 'daily' | 'weekly';
  reminder_time: string;
  onboarded_at: string | null;
  created_at: string;
};

export type CategoryRow = {
  id: string;
  user_id: string | null;
  name: string;
  colour: string;
  created_at: string;
};

export type EntryRow = {
  id: string;
  user_id: string;
  title: string;
  reflection: string | null;
  category_id: string | null;
  scripture_ref: string | null;
  photo_path: string | null;
  is_pinned: boolean;
  entry_date: string;
  created_at: string;
  updated_at: string;
  search_text: string;
};

export type ShareRow = {
  id: string;
  entry_id: string;
  public_slug: string;
  created_at: string;
  revoked_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, Pick<ProfileRow, 'id'> & Partial<ProfileRow>>;
      categories: Table<CategoryRow, Pick<CategoryRow, 'name' | 'colour'> & Partial<CategoryRow>>;
      entries: Table<EntryRow, Pick<EntryRow, 'title'> & Partial<Omit<EntryRow, 'search_text'>>, Partial<Omit<EntryRow, 'search_text'>>>;
      shares: Table<ShareRow, Pick<ShareRow, 'entry_id' | 'public_slug'> & Partial<ShareRow>>;
    };
    Views: Record<never, never>;
    Functions: {
      entry_year_counts: { Args: Record<never, never>; Returns: { year: number; wins: number }[] };
      entries_on_this_day: { Args: { p_day: string }; Returns: EntryRow[] };
      year_category_counts: { Args: { p_year: number }; Returns: { category_id: string; wins: number }[] };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

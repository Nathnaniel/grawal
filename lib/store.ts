import { createClient } from './supabase/browser';
import { ENTRY_COLUMNS, type AppStore, type Entry } from './types';

const FOREIGN_KEY_VIOLATION = '23503';

export function createSupabaseStore(): AppStore {
  const supabase = createClient();
  const upsert = (entry: Entry) => supabase.from('entries').upsert(entry);

  return {
    async saveEntry(entry) {
      let { error } = await upsert(entry);
      // The category was deleted while this save waited. Keep the win without it.
      if (error?.code === FOREIGN_KEY_VIOLATION) ({ error } = await upsert({ ...entry, category_id: null }));
      if (error) throw error;
    },

    async removeEntry(id) {
      const { error } = await supabase.from('entries').delete().eq('id', id);
      if (error) throw error;
    },

    async entriesBefore(last, limit) {
      const { data, error } = await supabase
        .from('entries')
        .select(ENTRY_COLUMNS)
        .eq('is_pinned', false)
        .or(`entry_date.lt.${last.entry_date},and(entry_date.eq.${last.entry_date},created_at.lt."${last.created_at}")`)
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },

    async saveProfile(patch) {
      const { data } = await supabase.auth.getClaims();
      const { error } = await supabase.from('profiles').update(patch).eq('id', data?.claims.sub ?? '');
      if (error) throw error;
    },

    async addCategory(name, colour) {
      const { data: auth } = await supabase.auth.getClaims();
      const { data, error } = await supabase
        .from('categories')
        .insert({ name, colour, user_id: auth?.claims.sub })
        .select('id, user_id, name, colour')
        .single();
      if (error) throw error;
      return data;
    },

    async removeCategory(id) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
  };
}

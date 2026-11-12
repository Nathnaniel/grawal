import { likePattern } from './search';
import { createClient } from './supabase/browser';
import { ENTRY_COLUMNS, type AppStore, type Entry } from './types';

const FOREIGN_KEY_VIOLATION = '23503';

export function createSupabaseStore(): AppStore {
  const supabase = createClient();
  const upsert = (entry: Entry) => supabase.from('entries').upsert(entry);
  const userId = async () => (await supabase.auth.getClaims()).data?.claims.sub ?? '';

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
        .or(`entry_date.lt.${last.entry_date},and(entry_date.eq.${last.entry_date},created_at.lt."${last.created_at}")`)
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },

    async search({ q, categoryId }) {
      let query = supabase.from('entries').select(ENTRY_COLUMNS);
      if (q.trim()) query = query.like('search_text', likePattern(q));
      if (categoryId) query = query.eq('category_id', categoryId);
      const { data, error } = await query
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },

    async saveProfile(patch) {
      const { error } = await supabase.from('profiles').update(patch).eq('id', await userId());
      if (error) throw error;
    },

    async addCategory(name, colour) {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name, colour, user_id: await userId() })
        .select('id, user_id, name, colour')
        .single();
      if (error) throw error;
      return data;
    },

    async removeCategory(id) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },

    async uploadAvatar(file) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      // A new name each time, so browsers never show a cached old photo.
      const path = `${await userId()}/avatar-${Date.now()}.${extension}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file, { contentType: file.type });
      if (error) throw error;
      const { data, error: linkError } = await supabase.storage.from('avatars').createSignedUrl(path, 60 * 60 * 24);
      if (linkError) throw linkError;
      return { path, url: data.signedUrl };
    },
  };
}

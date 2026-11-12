import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { supabaseUrl } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';

// Deletes the signed-in person's account and everything in it. Removing a sign-in
// needs Supabase's secret key, which only this server route ever sees. Until
// SUPABASE_SECRET_KEY is set, it answers 503 and nothing is touched.
export async function DELETE() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) return NextResponse.json({ error: 'signed_out' }, { status: 401 });

  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const admin = createAdminClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } });

  // Photos first: storage isn't removed by the database's cascade.
  for (const bucket of ['avatars', 'entry-photos']) {
    const { data: files } = await admin.storage.from(bucket).list(userId, { limit: 1000 });
    if (files?.length) await admin.storage.from(bucket).remove(files.map((file) => `${userId}/${file.name}`));
  }

  // Deleting the sign-in cascades to the profile, wins, categories and shares.
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: 'delete_failed' }, { status: 500 });

  await supabase.auth.signOut();
  return NextResponse.json({ deleted: true });
}

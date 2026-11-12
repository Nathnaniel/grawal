import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../database.types';
import { supabaseKey, supabaseUrl } from './config';

export const createClient = () => createBrowserClient<Database>(supabaseUrl, supabaseKey);

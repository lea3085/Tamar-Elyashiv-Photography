import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const PUBLIC_BUCKET = 'TAMARELYASHIV';

let cachedPublicClient: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient {
  if (cachedPublicClient) return cachedPublicClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase public env vars');
  }

  cachedPublicClient = createClient(supabaseUrl, supabaseAnonKey);
  return cachedPublicClient;
}

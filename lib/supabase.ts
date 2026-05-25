import { createClient } from '@supabase/supabase-js';

export const getSupabasePublic = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return createClient('https://placeholder.supabase.co', 'placeholder');
  }

  return createClient(url, key);
};

export const PUBLIC_BUCKET = 'TAMARELYASHIV';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

// Default Project URL Supabase
const DEFAULT_URL = 'https://wndxdmzrgqrqvogmbipg.supabase.co';

export function getSupabaseClient(): SupabaseClient | null {
  // Ambil URL & Key dari Environment Variables Vercel
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  const activeUrl =
    envUrl && envUrl.startsWith('https://') && !envUrl.includes('your-project')
      ? envUrl
      : DEFAULT_URL;

  const activeKey =
    envKey && envKey.length > 20 && !envKey.includes('GANTI_DENGAN')
      ? envKey
      : '';

  if (!activeUrl || !activeKey) {
    return null;
  }

  const currentKey = `${activeUrl}__${activeKey}`;
  if (cachedClient && cachedConfigKey === currentKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(activeUrl, activeKey);
    cachedConfigKey = currentKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

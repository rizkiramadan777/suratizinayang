import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  // Check env first
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  let activeUrl = envUrl;
  let activeKey = envKey;

  // If not in env, check localStorage config if on client
  if ((!activeUrl || !activeKey) && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('kip_couple_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.supabaseUrl && parsed.supabaseKey) {
          activeUrl = parsed.supabaseUrl.trim();
          activeKey = parsed.supabaseKey.trim();
        }
      }
    } catch (e) {
      console.warn('Error reading stored Supabase config:', e);
    }
  }

  if (!activeUrl || !activeKey || activeUrl === 'https://your-project-id.supabase.co') {
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

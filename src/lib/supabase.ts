import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

function isValidKey(key?: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed.length < 20) return false;
  if (trimmed.includes('GANTI_DENGAN')) return false;
  if (trimmed.includes('your-project')) return false;
  return true;
}

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('https://')) return false;
  if (trimmed.includes('your-project-id')) return false;
  return true;
}

export function getSupabaseClient(): SupabaseClient | null {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  let activeUrl = isValidUrl(envUrl) ? envUrl : '';
  let activeKey = isValidKey(envKey) ? envKey : '';

  // Jika di browser client, cek konfigurasi dari Pengaturan Profil (localStorage)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('kip_couple_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isValidUrl(parsed.supabaseUrl)) {
          activeUrl = parsed.supabaseUrl.trim();
        }
        if (isValidKey(parsed.supabaseKey)) {
          activeKey = parsed.supabaseKey.trim();
        }
      }
    } catch (e) {
      console.warn('Error reading stored Supabase config:', e);
    }
  }

  // Fallback URL project jika belum terisi
  if (!activeUrl) {
    activeUrl = 'https://wndxdmzrgqrqvogmbipg.supabase.co';
  }

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


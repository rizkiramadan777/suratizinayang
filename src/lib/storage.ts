import { PermitLetter, CoupleProfile, PermitStatus } from '@/types/permit';
import { getSupabaseClient } from './supabase';

const STORAGE_KEY_PERMITS = 'kip_permits_list_v1';
const STORAGE_KEY_PROFILE = 'kip_couple_profile';

const DEFAULT_PROFILE: CoupleProfile = {
  maleName: 'Ahmad Futsal',
  femaleName: 'Ayang Tercinta',
  relationshipDate: '2023-01-01',
  whatsappMale: '',
  whatsappFemale: '',
};

export function getStoredProfile(): CoupleProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Error reading profile from localStorage:', e);
  }
  return DEFAULT_PROFILE;
}

export function saveStoredProfile(profile: CoupleProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile to localStorage:', e);
  }
}

// Convert DB row to PermitLetter object
function mapDbRowToPermit(row: any): PermitLetter {
  return {
    id: row.id,
    letterNumber: row.letter_number,
    applicantName: row.applicant_name,
    approverName: row.approver_name,
    category: row.category,
    categoryName: row.category_name,
    title: row.title,
    activityDescription: row.activity_description || '',
    location: row.location,
    eventDate: row.event_date,
    startTime: row.start_time,
    endTime: row.end_time,
    companions: row.companions || '',
    promises: Array.isArray(row.promises) ? row.promises : [],
    customPromise: row.custom_promise || '',
    applicantSignature: row.applicant_signature || '',
    applicantSignedAt: row.applicant_signed_at || '',
    status: (row.status as PermitStatus) || 'pending',
    approverNotes: row.approver_notes || '',
    demands: Array.isArray(row.demands) ? row.demands : [],
    approverSignature: row.approver_signature || '',
    decidedAt: row.decided_at || '',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

// Convert PermitLetter to DB row
function mapPermitToDbRow(permit: PermitLetter): any {
  return {
    id: permit.id,
    letter_number: permit.letterNumber,
    applicant_name: permit.applicantName,
    approver_name: permit.approverName,
    category: permit.category,
    category_name: permit.categoryName || '',
    title: permit.title,
    activity_description: permit.activityDescription || '',
    location: permit.location,
    event_date: permit.eventDate,
    start_time: permit.startTime,
    end_time: permit.endTime,
    companions: permit.companions || '',
    promises: permit.promises || [],
    custom_promise: permit.customPromise || '',
    applicant_signature: permit.applicantSignature || '',
    applicant_signed_at: permit.applicantSignedAt || '',
    status: permit.status,
    approver_notes: permit.approverNotes || '',
    demands: permit.demands || [],
    approver_signature: permit.approverSignature || '',
    decided_at: permit.decidedAt || '',
    updated_at: new Date().toISOString(),
  };
}

// Get all from local storage
function getLocalPermits(): PermitLetter[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PERMITS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading local permits:', e);
  }
  return [];
}

// Save all to local storage
function saveLocalPermits(permits: PermitLetter[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PERMITS, JSON.stringify(permits));
  } catch (e) {
    console.error('Error saving local permits:', e);
  }
}

// Save or Update Permit
export async function savePermit(permit: PermitLetter): Promise<PermitLetter> {
  // Always update local storage first for instant responsiveness
  const localList = getLocalPermits();
  const existingIdx = localList.findIndex((p) => p.id === permit.id);
  let updatedList: PermitLetter[];
  if (existingIdx >= 0) {
    updatedList = [...localList];
    updatedList[existingIdx] = permit;
  } else {
    updatedList = [permit, ...localList];
  }
  saveLocalPermits(updatedList);

  // If Supabase is available, sync to Supabase
  const client = getSupabaseClient();
  if (client) {
    try {
      const dbRow = mapPermitToDbRow(permit);
      const { error } = await client.from('permits').upsert(dbRow, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase upsert warning:', error.message);
      }
    } catch (err) {
      console.warn('Error syncing with Supabase:', err);
    }
  }

  return permit;
}

// Fetch single permit by ID
export async function getPermitById(id: string): Promise<PermitLetter | null> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('permits')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        const permit = mapDbRowToPermit(data);
        // cache locally
        await savePermit(permit);
        return permit;
      }
    } catch (err) {
      console.warn('Supabase fetch error, fallback to local storage:', err);
    }
  }

  // Fallback to local storage
  const list = getLocalPermits();
  const found = list.find((p) => p.id === id);
  return found || null;
}

// Fetch all permits
export async function getAllPermits(): Promise<PermitLetter[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('permits')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(mapDbRowToPermit);
        // update local list cache
        saveLocalPermits(mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetch all error, using local storage:', err);
    }
  }

  return getLocalPermits();
}

// Delete permit
export async function deletePermit(id: string): Promise<boolean> {
  const localList = getLocalPermits().filter((p) => p.id !== id);
  saveLocalPermits(localList);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('permits').delete().eq('id', id);
    } catch (err) {
      console.warn('Error deleting from Supabase:', err);
    }
  }
  return true;
}

// Encode permit into share URL hash (safe base64 json)
export function encodePermitToUrl(permit: PermitLetter, baseUrl?: string): string {
  try {
    // Compress lightweight version without huge signature if too large, or include full
    const jsonStr = JSON.stringify(permit);
    const encoded = typeof window !== 'undefined' ? btoa(encodeURIComponent(jsonStr)) : '';
    const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${origin}/letter/${permit.id}?data=${encoded}`;
  } catch (e) {
    console.error('Error encoding permit to URL:', e);
    const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${origin}/letter/${permit.id}`;
  }
}

// Decode permit from share URL
export function decodePermitFromDataParam(dataParam: string): PermitLetter | null {
  try {
    const jsonStr = decodeURIComponent(atob(dataParam));
    const parsed = JSON.parse(jsonStr);
    return parsed as PermitLetter;
  } catch (e) {
    console.warn('Failed to decode data param:', e);
    return null;
  }
}

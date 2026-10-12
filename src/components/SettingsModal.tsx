'use client';

import React, { useState, useEffect } from 'react';
import { CoupleProfile } from '@/types/permit';
import { getStoredProfile, saveStoredProfile } from '@/lib/storage';
import { getSupabaseClient } from '@/lib/supabase';
import {
  X,
  Settings,
  Heart,
  Database,
  Phone,
  Check,
  ShieldAlert,
  Save,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function SettingsModal({ isOpen, onClose, onSaved }: SettingsModalProps) {
  const [profile, setProfile] = useState<CoupleProfile>(() => getStoredProfile());
  const [dbStatus, setDbStatus] = useState<string>('');
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProfile(getStoredProfile());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredProfile(profile);
    setSavedSuccess(true);
    if (onSaved) onSaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleTestSupabase = async () => {
    setIsTestingDb(true);
    setDbStatus('');
    try {
      // Temporarily store in memory or local to test
      saveStoredProfile(profile);
      const client = getSupabaseClient();
      if (!client) {
        setDbStatus('⚠️ URL / Key Supabase belum lengkap.');
        setIsTestingDb(false);
        return;
      }
      const { data, error } = await client.from('permits').select('id').limit(1);
      if (error) {
        setDbStatus(`❌ Gagal terhubung: ${error.message}`);
      } else {
        setDbStatus('✅ Terhubung sukses ke Supabase Database!');
      }
    } catch (err: any) {
      setDbStatus(`❌ Error koneksi: ${err.message || 'Gagal'}`);
    } finally {
      setIsTestingDb(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-7 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
          <div className="rounded-2xl bg-rose-100 p-2.5 text-rose-600">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Pengaturan Profil & Cloud Sync
            </h3>
            <p className="text-xs text-stone-500">
              Konfigurasi data pasangan dan koneksi Supabase Cloud
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Pengaturan berhasil disimpan!
          </div>
        )}

        {/* 1. Profil Pasangan */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            Identitas Default Pasangan
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Nama Kamu (Cowok)
              </label>
              <input
                type="text"
                value={profile.maleName}
                onChange={(e) => setProfile({ ...profile, maleName: e.target.value })}
                placeholder="Contoh: Ahmad"
                className="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Nama Pasangan (Ayang)
              </label>
              <input
                type="text"
                value={profile.femaleName}
                onChange={(e) => setProfile({ ...profile, femaleName: e.target.value })}
                placeholder="Contoh: Ayang Tercinta"
                className="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Nomor WhatsApp Ayang (Format: 628xxxxxxxx)
            </label>
            <input
              type="text"
              value={profile.whatsappFemale || ''}
              onChange={(e) => setProfile({ ...profile, whatsappFemale: e.target.value })}
              placeholder="Contoh: 6281234567890 (otomatis buka chat Ayang)"
              className="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Jika diisi, tombol kirim surat akan otomatis membuka chat WhatsApp langsung ke nomor Ayang.
            </p>
          </div>
        </div>

        {/* 2. Supabase Integration */}
        <div className="space-y-3 pt-3 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              Database Supabase (Opsional)
            </h4>
            <span className="text-[10px] text-stone-400">Real-time sync</span>
          </div>

          <p className="text-xs text-stone-600">
            Jika diisi, surat akan tersimpan di cloud Supabase secara real-time. Jika dikosongkan, aplikasi tetap 100% berjalan lancar via LocalStorage & URL State!
          </p>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={profile.supabaseUrl || ''}
              onChange={(e) => setProfile({ ...profile, supabaseUrl: e.target.value })}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full rounded-xl border border-stone-300 p-2.5 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Supabase Anon Key
            </label>
            <input
              type="password"
              value={profile.supabaseKey || ''}
              onChange={(e) => setProfile({ ...profile, supabaseKey: e.target.value })}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full rounded-xl border border-stone-300 p-2.5 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              disabled={isTestingDb}
              onClick={handleTestSupabase}
              className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-50"
            >
              {isTestingDb ? 'Menguji Koneksi...' : 'Uji Koneksi Supabase'}
            </button>
            {dbStatus && <span className="text-xs font-medium">{dbStatus}</span>}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 px-4 text-xs sm:text-sm font-bold text-white hover:bg-rose-700 transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

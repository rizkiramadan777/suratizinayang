'use client';

import React, { useState, useEffect } from 'react';
import { CoupleProfile } from '@/types/permit';
import { getStoredProfile, saveStoredProfile, syncLocalPermitsToSupabase } from '@/lib/storage';
import {
  X,
  Settings,
  Heart,
  Phone,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function SettingsModal({ isOpen, onClose, onSaved }: SettingsModalProps) {
  const [profile, setProfile] = useState<CoupleProfile>(() => getStoredProfile());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProfile(getStoredProfile());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    saveStoredProfile(profile);
    setSavedSuccess(true);
    await syncLocalPermitsToSupabase();
    if (onSaved) onSaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
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

        <div className="flex items-center gap-3 border-b border-pink-100 pb-3">
          <div className="rounded-2xl bg-pink-100 p-2.5 text-pink-600">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Pengaturan Profil Pasangan
            </h3>
            <p className="text-xs text-stone-500">
              Konfigurasi identitas pasangan dan kontak WhatsApp
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}

        {/* Form Biodata Pasangan */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-600 text-pink-600" />
            Identitas Pasangan Resmi
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Nama Lengkap Pria (Pemohon)
              </label>
              <input
                type="text"
                value={profile.maleName}
                onChange={(e) => setProfile({ ...profile, maleName: e.target.value })}
                placeholder="Rizki Ramadan"
                className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Nama Lengkap Wanita (Penyetuju)
              </label>
              <input
                type="text"
                value={profile.femaleName}
                onChange={(e) => setProfile({ ...profile, femaleName: e.target.value })}
                placeholder="Lisa Suryani Purba"
                className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Tanggal Hubungan / Jadian
            </label>
            <input
              type="date"
              value={profile.relationshipDate || ''}
              onChange={(e) => setProfile({ ...profile, relationshipDate: e.target.value })}
              className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Nomor WhatsApp Lisa (Format: 628xxxxxxxx)
            </label>
            <input
              type="text"
              value={profile.whatsappFemale || ''}
              onChange={(e) => setProfile({ ...profile, whatsappFemale: e.target.value })}
              placeholder="Contoh: 6281234567890"
              className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Jika nomor diisi, tombol bagikan akan langsung membuka chat WhatsApp ke kontak Lisa Suryani Purba.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-pink-600 py-3 px-4 text-xs sm:text-sm font-bold text-white hover:bg-pink-700 transition-colors shadow-md shadow-pink-600/20"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { PermitLetter, PermitCategory } from '@/types/permit';
import { getStoredProfile, savePermit } from '@/lib/storage';
import SignaturePad from './SignaturePad';
import {
  FileText,
  Clock,
  MapPin,
  Users,
  Shield,
  Heart,
  Sparkles,
  ArrowRight,
  CheckSquare,
  Square,
  CalendarDays,
  SendHorizontal,
} from 'lucide-react';

interface CreatePermitFormProps {
  onSuccess: (createdPermit: PermitLetter) => void;
}

const PRESET_CATEGORIES: { id: PermitCategory; label: string; icon: string; defaultTitle: string }[] = [
  { id: 'futsal', label: 'Futsal', icon: '⚽', defaultTitle: 'Izin Bermain Futsal Mingguan' },
  { id: 'nongkrong', label: 'Nongkrong', icon: '☕', defaultTitle: 'Izin Nongkrong & Ngopi Santai' },
  { id: 'mabar', label: 'Mabar Game', icon: '🎮', defaultTitle: 'Izin Mabar Online Push Rank' },
  { id: 'touring', label: 'Sunmori / Riding', icon: '🏍️', defaultTitle: 'Izin Riding Motor Santai' },
  { id: 'ngopi', label: 'Ngopi', icon: '🧋', defaultTitle: 'Izin Ngopi di Kafe Bareng Kawan' },
  { id: 'reuni', label: 'Reuni / Teman', icon: '👥', defaultTitle: 'Izin Kumpul Reuni Teman Lama' },
  { id: 'custom', label: 'Lainnya', icon: '✨', defaultTitle: 'Permohonan Izin Khusus' },
];

const PRESET_PROMISES = [
  'Wajib video call / kirim PAP berkala minimal tiap 1 jam sekali',
  'Tidak akan melirik apalagi tebar pesona ke cewek lain',
  'Pulang tepat waktu sebelum batas jam malam yang ditentukan',
  'Membawakan makanan / cemilan favorit Ayang saat perjalanan pulang',
  'Baterai HP selalu terjaga & tidak akan pernah di-silent',
  'Fokus olahraga / ngobrol tanpa macam-macam',
];

export default function CreatePermitForm({ onSuccess }: CreatePermitFormProps) {
  const [profile, setProfile] = useState(() => getStoredProfile());

  const [applicantName, setApplicantName] = useState(profile.maleName || 'Cowok');
  const [approverName, setApproverName] = useState(profile.femaleName || 'Ayang Tercinta');
  const [category, setCategory] = useState<PermitCategory>('futsal');
  const [title, setTitle] = useState('Izin Bermain Futsal Bareng Teman');
  const [location, setLocation] = useState('Planet Futsal / Lapangan Futsal');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('22:00');
  const [companions, setCompanions] = useState('Rian, Budi, Dimas, Kevin');
  const [activityDescription, setActivityDescription] = useState('Pertandingan sparing futsal 5 vs 5 ramah tamah');
  
  const [selectedPromises, setSelectedPromises] = useState<string[]>([
    PRESET_PROMISES[0],
    PRESET_PROMISES[1],
    PRESET_PROMISES[2],
    PRESET_PROMISES[3],
  ]);
  const [customPromise, setCustomPromise] = useState('');
  const [applicantSignature, setApplicantSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setEventDate(new Date().toISOString().split('T')[0]);
    const prof = getStoredProfile();
    setProfile(prof);
    if (prof.maleName) setApplicantName(prof.maleName);
    if (prof.femaleName) setApproverName(prof.femaleName);
  }, []);

  const handleCategorySelect = (cat: typeof PRESET_CATEGORIES[0]) => {
    setCategory(cat.id);
    setTitle(cat.defaultTitle);
    if (cat.id === 'futsal') {
      setLocation('Planet Futsal Arena');
      setActivityDescription('Pertandingan sparing futsal 5 vs 5 ramah tamah');
    } else if (cat.id === 'nongkrong') {
      setLocation('Kopi Kenangan / Kafe Sebelah');
      setActivityDescription('Diskusi santai dan curhat teman');
    } else if (cat.id === 'mabar') {
      setLocation('Discord / Warung Game');
      setActivityDescription('Push rank party 5 orang');
    }
  };

  const togglePromise = (promise: string) => {
    if (selectedPromises.includes(promise)) {
      setSelectedPromises(selectedPromises.filter((p) => p !== promise));
    } else {
      setSelectedPromises([...selectedPromises, promise]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!applicantName.trim()) {
      setErrorMsg('Nama pemohon wajib diisi!');
      return;
    }
    if (!approverName.trim()) {
      setErrorMsg('Nama Ayang (Penyetuju) wajib diisi!');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Lokasi kegiatan wajib diisi!');
      return;
    }
    if (!applicantSignature) {
      setErrorMsg('Mohon tanda tangan terlebih dahulu sebagai bukti keseriusan!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate registration number
      const now = new Date();
      const monthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][now.getMonth()];
      const randomNum = Math.floor(100 + Math.random() * 900);
      const letterNumber = `${randomNum}/IZIN-${category.toUpperCase()}/KIP-RI/${monthRoman}/${now.getFullYear()}`;
      const uniqueId = `permit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newPermit: PermitLetter = {
        id: uniqueId,
        letterNumber,
        applicantName: applicantName.trim(),
        approverName: approverName.trim(),
        category,
        title: title.trim(),
        activityDescription: activityDescription.trim(),
        location: location.trim(),
        eventDate,
        startTime,
        endTime,
        companions: companions.trim(),
        promises: selectedPromises,
        customPromise: customPromise.trim(),
        applicantSignature,
        applicantSignedAt: now.toISOString(),
        status: 'pending',
        demands: [],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      await savePermit(newPermit);
      onSuccess(newPermit);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal menyimpan surat permohonan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Banner / Header intro */}
      <div className="rounded-2xl bg-linear-to-r from-rose-500 via-rose-600 to-amber-500 p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-md">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              Formulir Permohonan Izin Keluar
            </h2>
            <p className="text-xs text-white/90">
              Isi data dengan jujur & transparan demi kelancaran restu Ayang
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* 1. Kategori Izin (Pilihan Cepat) */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          1. Pilih Jenis Kegiatan
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all ${
                category === cat.id
                  ? 'border-rose-500 bg-rose-50/80 font-bold text-rose-950 shadow-xs ring-2 ring-rose-300'
                  : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Profil Pemohon & Pasangan */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          2. Identitas Pemohon & Ayang
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Nama Pemohon (Cowok)
            </label>
            <input
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Contoh: Ahmad Futsal"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Nama Ayang (Penyetuju Resmi)
            </label>
            <input
              type="text"
              required
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              placeholder="Contoh: Ayang Tercinta"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-700 block mb-1">
            Judul / Perihal Izin
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Waktu & Lokasi */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          3. Waktu & Lokasi Kegiatan
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Hari / Tanggal
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Jam Mulai
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Batas Jam Pulang (Curfew)
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-700 block mb-1">
            Lokasi / Tempat Spesifik
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Planet Futsal Kuningan Kav. 12"
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-stone-700 block mb-1">
            Daftar Teman / Saksi di Lapangan
          </label>
          <input
            type="text"
            value={companions}
            onChange={(e) => setCompanions(e.target.value)}
            placeholder="Tulis nama teman-teman agar Ayang tidak curiga"
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-stone-700 block mb-1">
            Deskripsi / Alasan Khusus
          </label>
          <textarea
            rows={2}
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            placeholder="Jelaskan secara meyakinkan agar cepat disetujui..."
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Pakta Integritas (Janji Setia) */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          4. Pakta Integritas & Janji Setia (Pilih yang disanggupi)
        </label>
        
        <div className="space-y-2">
          {PRESET_PROMISES.map((promise, index) => {
            const isChecked = selectedPromises.includes(promise);
            return (
              <button
                key={index}
                type="button"
                onClick={() => togglePromise(promise)}
                className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition-all ${
                  isChecked
                    ? 'border-rose-300 bg-rose-50/60 text-stone-900'
                    : 'border-stone-200 bg-stone-50/30 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                )}
                <span>{promise}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <label className="text-xs font-medium text-stone-700 block mb-1">
            Janji Tambahan Pribadi (Opsional):
          </label>
          <input
            type="text"
            value={customPromise}
            onChange={(e) => setCustomPromise(e.target.value)}
            placeholder="Contoh: Besok gantian nemenin Ayang belanja sepuasnya"
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
          />
        </div>
      </div>

      {/* 5. Tanda Tangan Pemohon */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          5. Tanda Tangan Pemohon (Cowok)
        </label>
        <SignaturePad
          label="Tanda Tangan Elektronik Pemohon"
          subLabel="Tanda tangani di bawah ini menggunakan jari / stylus"
          onSave={(dataUrl) => setApplicantSignature(dataUrl)}
          height={140}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-600 via-rose-500 to-amber-500 py-3.5 px-6 text-sm sm:text-base font-bold text-white shadow-xl transition-all duration-300 hover:from-rose-700 hover:to-amber-600 hover:shadow-rose-500/25 active:scale-[0.99] disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Menerbitkan Surat Resmi...</span>
          ) : (
            <>
              <SendHorizontal className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <span>Terbitkan Surat & Minta Tanda Tangan Ayang</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

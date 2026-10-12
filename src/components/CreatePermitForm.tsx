'use client';

import React, { useState, useEffect } from 'react';
import { PermitLetter, ActivityCategory } from '@/types/permit';
import { getStoredProfile, getStoredCategories, saveStoredCategories, savePermit } from '@/lib/storage';
import SignaturePad from './SignaturePad';
import CategoryIcon from './CategoryIcon';
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
  Plus,
  Trash2,
  AlertCircle,
  X,
} from 'lucide-react';

interface CreatePermitFormProps {
  onSuccess: (createdPermit: PermitLetter) => void;
}

const PRESET_PROMISES = [
  'Wajib video call atau kirim dokumentasi berkala minimal setiap 1 jam sekali',
  'Tidak akan melirik apalagi membuka obrolan dengan wanita lain',
  'Pulang tepat waktu sebelum batas jam malam yang telah disepakati',
  'Membawakan makanan atau minuman kesukaan Lisa Suryani Purba saat perjalanan pulang',
  'Baterai ponsel senantiasa terisi dan tidak akan pernah diatur ke mode hening',
  'Fokus pada kegiatan positif tanpa melanggar komitmen bersama',
];

const AVAILABLE_ICONS = [
  { id: 'activity', label: 'Olahraga' },
  { id: 'coffee', label: 'Ngopi / Santai' },
  { id: 'gamepad-2', label: 'Game / Mabar' },
  { id: 'bike', label: 'Riding / Motor' },
  { id: 'users', label: 'Kumpul Teman' },
  { id: 'utensils', label: 'Kuliner' },
  { id: 'dumbbell', label: 'Gym / Fitness' },
  { id: 'music', label: 'Musik / Acara' },
  { id: 'sparkles', label: 'Lainnya' },
];

export default function CreatePermitForm({ onSuccess }: CreatePermitFormProps) {
  const [profile, setProfile] = useState(() => getStoredProfile());
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  
  const [applicantName, setApplicantName] = useState('Rizki Ramadan');
  const [approverName, setApproverName] = useState('Lisa Suryani Purba');
  const [selectedCategoryId, setSelectedCategoryId] = useState('futsal');
  const [title, setTitle] = useState('Izin Bermain Futsal Bareng Kawan');
  const [location, setLocation] = useState('Planet Futsal Arena');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('22:00');
  const [companions, setCompanions] = useState('Rekan satu tim futsal');
  const [activityDescription, setActivityDescription] = useState('Pertandingan sparing futsal 5 vs 5');
  const [letterContent, setLetterContent] = useState(
    'Dengan penuh rasa hormat dan kasih sayang, saya bermaksud memohon izin dan restu kepada Lisa Suryani Purba untuk mengikuti kegiatan tersebut di atas. Saya berjanji akan menjaga amanah dan kepercayaan, senantiasa mengabari secara berkala, serta kembali tepat waktu.'
  );

  // Add category state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('activity');
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryLocation, setNewCategoryLocation] = useState('');

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
    setApplicantName(prof.maleName || 'Rizki Ramadan');
    setApproverName(prof.femaleName || 'Lisa Suryani Purba');

    const cats = getStoredCategories();
    setCategories(cats);
    if (cats.length > 0) {
      setSelectedCategoryId(cats[0].id);
      setTitle(cats[0].defaultTitle);
      if (cats[0].defaultLocation) setLocation(cats[0].defaultLocation);
    }
  }, []);

  const handleSelectCategory = (cat: ActivityCategory) => {
    setSelectedCategoryId(cat.id);
    setTitle(cat.defaultTitle || `Izin Kegiatan ${cat.label}`);
    if (cat.defaultLocation) {
      setLocation(cat.defaultLocation);
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryLabel.trim()) return;

    const id = `cat_${Date.now()}`;
    const newCat: ActivityCategory = {
      id,
      label: newCategoryLabel.trim(),
      iconName: newCategoryIcon,
      defaultTitle: newCategoryTitle.trim() || `Izin Kegiatan ${newCategoryLabel.trim()}`,
      defaultLocation: newCategoryLocation.trim() || 'Lokasi Kegiatan',
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    saveStoredCategories(updated);
    setSelectedCategoryId(newCat.id);
    setTitle(newCat.defaultTitle);
    setLocation(newCat.defaultLocation || '');

    // Reset modal
    setNewCategoryLabel('');
    setNewCategoryTitle('');
    setNewCategoryLocation('');
    setShowAddCategoryModal(false);
  };

  const handleDeleteCategory = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (categories.length <= 1) {
      alert('Minimal harus ada 1 jenis kegiatan.');
      return;
    }
    const updated = categories.filter((c) => c.id !== catId);
    setCategories(updated);
    saveStoredCategories(updated);
    if (selectedCategoryId === catId) {
      setSelectedCategoryId(updated[0].id);
      setTitle(updated[0].defaultTitle);
      if (updated[0].defaultLocation) setLocation(updated[0].defaultLocation);
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
      setErrorMsg('Nama pemohon wajib diisi.');
      return;
    }
    if (!approverName.trim()) {
      setErrorMsg('Nama pasangan (penyetuju) wajib diisi.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Lokasi kegiatan wajib diisi.');
      return;
    }
    if (!applicantSignature) {
      setErrorMsg('Mohon bubuhkan tanda tangan pemohon terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const monthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][now.getMonth()];
      const randomNum = Math.floor(100 + Math.random() * 900);
      const activeCat = categories.find((c) => c.id === selectedCategoryId);
      const categoryCode = (activeCat?.label || selectedCategoryId).toUpperCase().replace(/[^A-Z0-9]/g, '');
      const letterNumber = `${randomNum}/IZIN-${categoryCode}/KIP-RI/${monthRoman}/${now.getFullYear()}`;
      const uniqueId = `permit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newPermit: PermitLetter = {
        id: uniqueId,
        letterNumber,
        applicantName: applicantName.trim(),
        approverName: approverName.trim(),
        category: selectedCategoryId,
        categoryName: activeCat?.label || selectedCategoryId,
        title: title.trim(),
        letterContent: letterContent.trim(),
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
      setErrorMsg('Gagal memproses permohonan. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pink Header Banner */}
      <div className="rounded-2xl bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 p-4 sm:p-6 text-white shadow-lg shadow-pink-500/10">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-md">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              Formulir Permohonan Izin Keluar
            </h2>
            <p className="text-xs text-pink-100">
              Pelayanan perizinan resmi berbasis kejujuran dan komitmen kasih sayang
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Jenis Kegiatan (Bisa Tambah dan Hapus) */}
      <div className="rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            1. Jenis Kegiatan
          </label>
          <button
            type="button"
            onClick={() => setShowAddCategoryModal(true)}
            className="flex items-center gap-1 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-200 px-2.5 py-1 text-[11px] font-semibold text-pink-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Jenis Kegiatan</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`group relative flex items-center justify-between rounded-xl border p-2.5 cursor-pointer text-xs transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50/80 font-bold text-pink-950 shadow-xs ring-2 ring-pink-300'
                    : 'border-stone-200 bg-stone-50/40 hover:bg-pink-50/30 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-pink-200 text-pink-700' : 'bg-stone-100 text-stone-500 group-hover:text-pink-600'}`}>
                    <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                  </div>
                  <span className="truncate">{cat.label}</span>
                </div>

                {/* Delete button (only show when more than 1 category) */}
                {categories.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteCategory(cat.id, e)}
                    className="p-1 rounded text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Hapus jenis kegiatan ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Identitas Pemohon & Pasangan */}
      <div className="rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5" />
          2. Identitas Pasangan
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Nama Pemohon (Pria)
            </label>
            <input
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Nama Pasangan (Penyetuju)
            </label>
            <input
              type="text"
              required
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
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
            className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Waktu & Lokasi */}
      <div className="rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" />
          3. Waktu & Lokasi Kegiatan
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Hari / Tanggal
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
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
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Batas Jam Pulang (Maksimal)
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-700 block mb-1">
            Lokasi Kegiatan
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Planet Futsal Kuningan"
            className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-stone-700 block mb-1">
            Daftar Rekan / Saksi di Tempat
          </label>
          <input
            type="text"
            value={companions}
            onChange={(e) => setCompanions(e.target.value)}
            placeholder="Nama rekan-rekan yang turut hadir"
            className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-stone-700 block mb-1">
            Keterangan Tambahan
          </label>
          <textarea
            rows={2}
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            placeholder="Keterangan singkat mengenai agenda kegiatan..."
            className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Isi Surat Permohonan (Bisa Diedit Bebas) */}
      <div className="rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            4. Isi Surat Permohonan (Bisa Kamu Ketik Sendiri)
          </label>
          <span className="text-[11px] text-pink-600 font-semibold bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
            Dapat Diedit Bebas
          </span>
        </div>
        <p className="text-[11px] text-stone-500">
          Ketik pesan, permohonan, atau alasan khusus kamu untuk Lisa Suryani Purba. Teks ini akan tampil langsung di badan surat resmi:
        </p>
        <textarea
          rows={4}
          required
          value={letterContent}
          onChange={(e) => setLetterContent(e.target.value)}
          placeholder="Tuliskan isi pernyataan atau pesan permohonan izin kamu di sini..."
          className="w-full rounded-xl border border-stone-200 p-3 text-xs sm:text-sm text-stone-900 leading-relaxed focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none bg-pink-50/20"
        />
      </div>

      {/* 5. Pakta Integritas (Janji Setia) */}
      <div className="rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          5. Pakta Integritas & Komitmen Bersama
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
                    ? 'border-pink-300 bg-pink-50/60 text-stone-900'
                    : 'border-stone-200 bg-stone-50/30 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
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
            Janji Tambahan Khusus (Opsional):
          </label>
          <input
            type="text"
            value={customPromise}
            onChange={(e) => setCustomPromise(e.target.value)}
            placeholder="Contoh: Menemani Lisa berbelanja di akhir pekan"
            className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
          />
        </div>
      </div>

      {/* 6. Tanda Tangan Pemohon */}
      <div className="rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          6. Tanda Tangan Pemohon ({applicantName})
        </label>
        <SignaturePad
          label="Tanda Tangan Digital Pemohon"
          subLabel="Tanda tangani di area ini menggunakan jari atau stylus"
          onSave={(dataUrl) => setApplicantSignature(dataUrl)}
          height={140}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-pink-600 via-rose-500 to-pink-500 py-3.5 px-6 text-sm sm:text-base font-bold text-white shadow-xl shadow-pink-500/25 transition-all duration-300 hover:from-pink-700 hover:to-rose-600 active:scale-[0.99] disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Menerbitkan Surat Resmi...</span>
          ) : (
            <>
              <SendHorizontal className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <span>Terbitkan Surat & Ajukan ke {approverName}</span>
            </>
          )}
        </button>
      </div>

      {/* Modal Tambah Kategori */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-pink-600" />
                Tambah Jenis Kegiatan Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="rounded-full p-1 text-stone-400 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Nama Kegiatan
              </label>
              <input
                type="text"
                required
                value={newCategoryLabel}
                onChange={(e) => setNewCategoryLabel(e.target.value)}
                placeholder="Contoh: Kulineran, Badminton, Gym"
                className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Pilih Icon SVG
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_ICONS.map((ic) => (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setNewCategoryIcon(ic.id)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center text-[10px] transition-all ${
                      newCategoryIcon === ic.id
                        ? 'border-pink-500 bg-pink-50 text-pink-800 font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-pink-50/50'
                    }`}
                  >
                    <CategoryIcon name={ic.id} className="w-4 h-4 mb-1" />
                    <span className="truncate">{ic.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Default Lokasi (Opsional)
              </label>
              <input
                type="text"
                value={newCategoryLocation}
                onChange={(e) => setNewCategoryLocation(e.target.value)}
                placeholder="Contoh: GOR Bulutangkis"
                className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={!newCategoryLabel.trim()}
                className="flex-1 rounded-xl bg-pink-600 py-2.5 text-xs font-bold text-white hover:bg-pink-700 disabled:opacity-50"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

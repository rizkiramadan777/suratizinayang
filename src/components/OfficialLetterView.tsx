'use client';

import React, { forwardRef } from 'react';
import { PermitLetter } from '@/types/permit';
import Emblem from './Emblem';
import Stamp from './Stamp';
import Materai from './Materai';
import { MapPin, Calendar, Clock, Users, ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';

interface OfficialLetterViewProps {
  permit: PermitLetter;
  id?: string;
}

const OfficialLetterView = forwardRef<HTMLDivElement, OfficialLetterViewProps>(
  ({ permit, id = 'official-permit-letter' }, ref) => {
    const formattedDate = permit.eventDate
      ? new Date(permit.eventDate).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '-';

    const categoryIcons: Record<string, string> = {
      futsal: '⚽ Futsal / Sepak Bola',
      nongkrong: '☕ Nongkrong / Ngopi Santai',
      mabar: '🎮 Mabar Game Online',
      touring: '🏍️ Touring / Sunmori',
      ngopi: '🧋 Ngopi Santai',
      reuni: '👥 Reuni Teman',
      custom: '✨ Kegiatan Khusus',
    };

    return (
      <div
        id={id}
        ref={ref}
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-stone-200 bg-[#FCFBF7] p-5 md:p-10 text-stone-900 shadow-2xl transition-all"
        style={{
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)',
        }}
      >
        {/* Subtle Paper Background Texture Border */}
        <div className="pointer-events-none absolute inset-2 rounded-xl border border-stone-300/40" />
        <div className="pointer-events-none absolute inset-3 rounded-lg border border-dashed border-stone-200" />

        {/* Diagonal Watermark for Official Authenticity */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none rotate-[-30deg]">
          <span className="text-7xl font-black tracking-widest text-stone-900">
            DOKUMEN SAH KASIH SAYANG
          </span>
        </div>

        {/* ===================== KOP SURAT ===================== */}
        <div className="relative mb-6 border-b-4 border-double border-stone-900 pb-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-2">
            <Emblem className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />
            <div className="text-center sm:text-left">
              <h1 className="text-sm sm:text-lg font-black tracking-wider uppercase text-stone-900 font-serif leading-tight">
                KEMENTERIAN HUBUNGAN & KASIH SAYANG
              </h1>
              <h2 className="text-xs sm:text-sm font-bold tracking-normal uppercase text-stone-700 font-serif leading-tight">
                DIREKTORAT JENDERAL PERIZINAN KELUAR RUMAH & KESELAMATAN ASMARA
              </h2>
              <p className="mt-1 text-[10px] sm:text-[11px] text-stone-500 font-mono">
                Jalan Menuju Bahagia Selamanya No. 1 • Hotline Ayang 24 Jam • RI-KIP
              </p>
            </div>
          </div>
        </div>

        {/* ===================== NOMOR & PERIHAL ===================== */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-mono border-b border-stone-200 pb-4">
          <div className="space-y-1">
            <p>
              <span className="text-stone-500">Nomor Registrasi:</span>{' '}
              <strong className="text-stone-900 font-bold">{permit.letterNumber}</strong>
            </p>
            <p>
              <span className="text-stone-500">Sifat:</span>{' '}
              <span className="inline-block rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                SANGAT PENTING & SEGERA
              </span>
            </p>
            <p>
              <span className="text-stone-500">Lampiran:</span> 1 (Satu) Berkas Janji Setia
            </p>
          </div>
          <div className="space-y-1 sm:text-right">
            <p>
              <span className="text-stone-500">Perihal:</span>{' '}
              <strong className="text-stone-900">
                Permohonan Izin {categoryIcons[permit.category] || permit.category}
              </strong>
            </p>
            <p className="text-[11px] text-stone-500">
              Diterbitkan: {permit.createdAt ? new Date(permit.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
            </p>
          </div>
        </div>

        {/* ===================== KEPADA ===================== */}
        <div className="mb-6 text-xs sm:text-sm">
          <p className="text-stone-700">Kepada Yang Terhormat,</p>
          <p className="text-sm sm:text-base font-bold text-stone-900">
            {permit.approverName || 'Ayang Tercinta'}
          </p>
          <p className="text-stone-600 italic text-[11px] sm:text-xs">
            Selaku Pemegang Otoritas Penuh & Menteri Keuangan / Keamanan Hati
          </p>
          <p className="text-stone-600 text-xs">Di Tempat Peristirahatan Hati</p>
        </div>

        {/* ===================== ISI SURAT PERMOHONAN ===================== */}
        <div className="mb-6 space-y-3 text-xs sm:text-sm leading-relaxed text-stone-800 text-justify">
          <p>
            Dengan hormat dan penuh rasa kasih sayang serta kerendahan hati, saya yang bertanda tangan di bawah ini:
          </p>

          <div className="my-2 rounded-xl bg-stone-100/80 p-3 sm:p-4 text-xs font-mono space-y-1.5 border border-stone-200">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-stone-500">Nama Pemohon</span>
              <span className="col-span-2 font-bold text-stone-900">: {permit.applicantName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-stone-500">Status Jabatan</span>
              <span className="col-span-2 text-stone-800">: Pacar Sah Berdedikasi Tinggi</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-stone-500">Tingkat Kepatuhan</span>
              <span className="col-span-2 text-emerald-700 font-semibold">: 100% Taat Perintah Ayang</span>
            </div>
          </div>

          <p>
            Bermaksud mengajukan permohonan dispensasi waktu untuk mengikuti kegiatan luar rumah dengan rincian sebagai berikut:
          </p>

          {/* Rincian Kegiatan Box */}
          <div className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-4 space-y-2.5 shadow-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 text-[11px] block">Hari & Tanggal</span>
                <strong className="text-stone-900 font-semibold">{formattedDate}</strong>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 text-[11px] block">Rentang Waktu Kegiatan</span>
                <span className="font-semibold text-stone-900">
                  {permit.startTime} WIB s/d {permit.endTime} WIB{' '}
                  <span className="text-[11px] font-normal text-stone-500 italic">
                    (Sudah termasuk waktu mandi & perjalanan pulang)
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 text-[11px] block">Lokasi / Tempat Kegiatan</span>
                <span className="font-semibold text-stone-900">{permit.location}</span>
              </div>
            </div>

            {permit.companions && (
              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 text-[11px] block">Daftar Rekan / Saksi di Tempat</span>
                  <span className="text-stone-800">{permit.companions}</span>
                </div>
              </div>
            )}

            {permit.activityDescription && (
              <div className="text-[12px] text-stone-600 pt-1 border-t border-stone-100">
                <strong>Catatan Kegiatan:</strong> {permit.activityDescription}
              </div>
            )}
          </div>
        </div>

        {/* ===================== PAKTA INTEGRITAS / JANJI ===================== */}
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 mb-2 text-rose-900 font-bold text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>PAKTA INTEGRITAS & JANJI KESELAMATAN HATI</span>
          </div>
          <p className="text-[11px] sm:text-xs text-rose-800 mb-2">
            Dengan menandatangani surat ini, Pemohon berjanji secara sadar dan tanpa paksaan:
          </p>
          <ul className="space-y-1.5 text-[11px] sm:text-xs text-stone-800">
            {permit.promises.map((p, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✓</span>
                <span>{p}</span>
              </li>
            ))}
            {permit.customPromise && (
              <li className="flex items-start gap-2 font-medium text-rose-950">
                <span className="text-rose-600 font-bold">★</span>
                <span>{permit.customPromise}</span>
              </li>
            )}
          </ul>
        </div>

        {/* ===================== SYARAT DARI AYANG (JIKA STATUS ACC BERSYARAT) ===================== */}
        {(permit.demands && permit.demands.length > 0) && (
          <div className="mb-6 rounded-xl border-2 border-amber-300 bg-amber-50/80 p-3.5 sm:p-4">
            <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-xs sm:text-sm">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>KLAUSUL & TUNTUTAN KHUSUS DARI AYANG</span>
            </div>
            <ul className="space-y-1 text-xs text-amber-950">
              {permit.demands.map((d, i) => (
                <li key={i} className="flex items-start gap-2 font-semibold">
                  <span className="text-amber-600">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ===================== CATATAN KEPUTUSAN AYANG ===================== */}
        {permit.approverNotes && (
          <div className="mb-6 rounded-xl bg-stone-100 p-3 sm:p-4 text-xs italic text-stone-800 border-l-4 border-stone-800">
            <div className="font-bold text-stone-900 not-italic mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-stone-700" />
              Pesan Resmi dari {permit.approverName}:
            </div>
            &ldquo;{permit.approverNotes}&rdquo;
          </div>
        )}

        {/* ===================== AREA TANDA TANGAN & STEMPEL ===================== */}
        <div className="mt-8 pt-4 border-t-2 border-stone-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
            
            {/* Tanda Tangan Pemohon (Cowok) */}
            <div className="flex flex-col items-center">
              <p className="text-[11px] text-stone-600 mb-1">Pemohon Izin,</p>
              <div className="h-20 w-36 sm:w-44 flex items-center justify-center border-b border-stone-400 pb-1">
                {permit.applicantSignature ? (
                  <img
                    src={permit.applicantSignature}
                    alt="TTD Pemohon"
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                  />
                ) : (
                  <span className="text-[10px] text-stone-400 italic">Belum Bertanda Tangan</span>
                )}
              </div>
              <p className="mt-1 text-xs font-bold text-stone-900 uppercase">
                ( {permit.applicantName} )
              </p>
              <p className="text-[10px] text-stone-500">Pacar Tersayang</p>
            </div>

            {/* Bagian Tengah: e-Materai + Stempel Resmi */}
            <div className="flex flex-col items-center justify-center my-2 sm:my-0 space-y-2">
              <Materai date={permit.eventDate} />
              <Stamp
                status={permit.status}
                date={permit.decidedAt || permit.createdAt}
                approverName={permit.approverName}
              />
            </div>

            {/* Tanda Tangan Penyetuju (Ayang) */}
            <div className="flex flex-col items-center">
              <p className="text-[11px] text-stone-600 mb-1">
                Disahkan & Disetujui Oleh,
              </p>
              <div className="h-20 w-36 sm:w-44 flex items-center justify-center border-b border-stone-400 pb-1">
                {permit.approverSignature ? (
                  <img
                    src={permit.approverSignature}
                    alt="TTD Ayang"
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                  />
                ) : (
                  <span className="text-[10px] text-rose-400 italic font-medium">
                    Menunggu Tanda Tangan Ayang
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs font-bold text-stone-900 uppercase">
                ( {permit.approverName} )
              </p>
              <p className="text-[10px] text-stone-500">Menteri Otoritas Perizinan</p>
            </div>
          </div>
        </div>

        {/* ===================== FOOTER DOKUMEN ===================== */}
        <div className="mt-8 pt-3 border-t border-stone-200 text-center text-[9.5px] text-stone-500 font-mono">
          <p>DOKUMEN ELEKTRONIK SAH & MENGIKAT SECARA ASMARA • KEMENTERIAN KASIH SAYANG RI</p>
          <p className="text-stone-400 mt-0.5">
            Surat ini dapat diunduh atau ditunjukkan ke tongkrongan sebagai bukti izin resmi.
          </p>
        </div>
      </div>
    );
  }
);

OfficialLetterView.displayName = 'OfficialLetterView';

export default OfficialLetterView;

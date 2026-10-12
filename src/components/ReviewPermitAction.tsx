'use client';

import React, { useState } from 'react';
import { PermitLetter, PermitStatus } from '@/types/permit';
import { savePermit } from '@/lib/storage';
import SignaturePad from './SignaturePad';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Heart,
  FileCheck2,
  Share2,
  Download,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ReviewPermitActionProps {
  permit: PermitLetter;
  onUpdated: (updatedPermit: PermitLetter) => void;
  onOpenShareModal?: () => void;
  onDownloadImage?: () => void;
}

const PRESET_DEMANDS = [
  'Wajib membawakan makanan atau minuman favorit saat perjalanan pulang',
  'Denda keterlambatan jika melewati batas jam yang telah disepakati',
  'Menemani Lisa jalan-jalan atau berbelanja di akhir pekan',
  'Mengirimkan kabar dan dokumentasi setiap 45 menit sekali',
];

const REJECT_REASONS = [
  'Sudah izin kemarin, hari ini agenda bersama Lisa di rumah.',
  'Batas jam malam terlalu larut dan kurang aman.',
  'Ada agenda keluarga atau keperluan penting bersama yang harus didahulukan.',
  'Perlu istirahat yang cukup untuk kesehatan.',
];

export default function ReviewPermitAction({
  permit,
  onUpdated,
  onOpenShareModal,
  onDownloadImage,
}: ReviewPermitActionProps) {
  const [selectedDecision, setSelectedDecision] = useState<'approved' | 'conditional' | 'rejected'>('approved');
  const [approverNotes, setApproverNotes] = useState('');
  const [demands, setDemands] = useState<string[]>([PRESET_DEMANDS[0]]);
  const [newDemandInput, setNewDemandInput] = useState('');
  const [signature, setSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const applicant = permit.applicantName || 'Rizki Ramadan';
  const approver = permit.approverName || 'Lisa Suryani Purba';

  // If already reviewed
  if (permit.status !== 'pending') {
    return (
      <div className="rounded-2xl border border-pink-200 bg-white p-5 shadow-lg space-y-4 text-center">
        <div className="flex items-center justify-center">
          {permit.status === 'approved' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              SURAT TELAH DISETUJUI RESMI
            </div>
          )}
          {permit.status === 'conditional' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              SURAT DISETUJUI DENGAN SYARAT
            </div>
          )}
          {permit.status === 'rejected' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold text-rose-800">
              <XCircle className="w-4 h-4 text-rose-600" />
              PERMOHONAN IZIN DITOLAK
            </div>
          )}
        </div>

        <p className="text-xs text-stone-600">
          Surat permohonan nomor <strong>{permit.letterNumber}</strong> telah disahkan oleh{' '}
          <strong>{approver}</strong> pada{' '}
          {permit.decidedAt ? new Date(permit.decidedAt).toLocaleString('id-ID') : '-'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onOpenShareModal && (
            <button
              type="button"
              onClick={onOpenShareModal}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-pink-700 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan ke WhatsApp</span>
            </button>
          )}

          {onDownloadImage && (
            <button
              type="button"
              onClick={onDownloadImage}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Surat Sah (PNG)</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleAddDemand = () => {
    if (newDemandInput.trim()) {
      setDemands([...demands, newDemandInput.trim()]);
      setNewDemandInput('');
    }
  };

  const handleRemoveDemand = (idx: number) => {
    setDemands(demands.filter((_, i) => i !== idx));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EC4899', '#F43F5E', '#FB7185', '#FDA4AF'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleDecisionSubmit = async () => {
    setErrorMsg('');

    if (!signature) {
      setErrorMsg(`Mohon bubuhkan tanda tangan digital ${approver} terlebih dahulu.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const updated: PermitLetter = {
        ...permit,
        status: selectedDecision,
        approverNotes: approverNotes.trim(),
        demands: selectedDecision === 'conditional' ? demands : [],
        approverSignature: signature,
        decidedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await savePermit(updated);

      if (selectedDecision === 'approved' || selectedDecision === 'conditional') {
        triggerCelebration();
      }

      onUpdated(updated);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal memproses keputusan permohonan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-pink-200 bg-white p-4 sm:p-6 shadow-xl space-y-5">
      <div className="border-b border-pink-100 pb-3">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
          <h3 className="text-base font-bold text-stone-900">
            Meja Pengesahan & Keputusan ({approver})
          </h3>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          Tinjau dan tentukan status permohonan izin dari <strong>{applicant}</strong>
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Decision Radio Cards */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-600 block uppercase tracking-wider">
          Pilih Keputusan:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. SETUJU */}
          <button
            type="button"
            onClick={() => setSelectedDecision('approved')}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 text-center transition-all ${
              selectedDecision === 'approved'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm ring-2 ring-emerald-300'
                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
            }`}
          >
            <CheckCircle className="h-5 w-5 text-emerald-600 mb-1" />
            <span className="text-xs font-bold">DISETUJUI RESMI</span>
            <span className="text-[10px] text-stone-500">Izin diberikan sepenuhnya</span>
          </button>

          {/* 2. BERSYARAT */}
          <button
            type="button"
            onClick={() => setSelectedDecision('conditional')}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 text-center transition-all ${
              selectedDecision === 'conditional'
                ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm ring-2 ring-amber-300'
                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
            }`}
          >
            <AlertTriangle className="h-5 w-5 text-amber-600 mb-1" />
            <span className="text-xs font-bold">DISETUJUI BERSYARAT</span>
            <span className="text-[10px] text-stone-500">Wajib penuhi syarat</span>
          </button>

          {/* 3. TOLAK */}
          <button
            type="button"
            onClick={() => setSelectedDecision('rejected')}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 text-center transition-all ${
              selectedDecision === 'rejected'
                ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm ring-2 ring-rose-300'
                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
            }`}
          >
            <XCircle className="h-5 w-5 text-rose-600 mb-1" />
            <span className="text-xs font-bold">TOLAK PERMOHONAN</span>
            <span className="text-[10px] text-stone-500">Tetap berkegiatan bersama</span>
          </button>
        </div>
      </div>

      {/* Conditional Demands Panel */}
      {selectedDecision === 'conditional' && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 space-y-3">
          <label className="text-xs font-bold text-amber-900 block">
            Daftar Syarat & Ketentuan Tambahan dari {approver}:
          </label>

          <div className="space-y-1.5">
            {demands.map((demand, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs text-stone-800 shadow-2xs border border-amber-200"
              >
                <span>{demand}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDemand(i)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_DEMANDS.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (!demands.includes(item)) setDemands([...demands, item]);
                }}
                className="rounded-full bg-amber-200/70 hover:bg-amber-300 px-2.5 py-1 text-[10px] font-semibold text-amber-950 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{item}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newDemandInput}
              onChange={(e) => setNewDemandInput(e.target.value)}
              placeholder="Tulis syarat tambahan lainnya..."
              className="flex-1 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={handleAddDemand}
              className="rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
            >
              Tambah
            </button>
          </div>
        </div>
      )}

      {/* Reject Preset Reasons */}
      {selectedDecision === 'rejected' && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 space-y-2">
          <label className="text-xs font-bold text-rose-900 block">
            Pilih Alasan Penolakan:
          </label>
          <div className="space-y-1.5">
            {REJECT_REASONS.map((reason, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setApproverNotes(reason)}
                className={`w-full text-left rounded-lg p-2 text-xs transition-colors border ${
                  approverNotes === reason
                    ? 'border-rose-400 bg-white text-rose-950 font-bold'
                    : 'border-rose-200 bg-white/70 text-rose-800 hover:bg-white'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pesan Tambahan dari Ayang */}
      <div>
        <label className="text-xs font-medium text-stone-700 block mb-1">
          Catatan / Pesan untuk {applicant}:
        </label>
        <textarea
          rows={2}
          value={approverNotes}
          onChange={(e) => setApproverNotes(e.target.value)}
          placeholder="Tuliskan catatan khusus atau pesan untuk pasangan..."
          className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>

      {/* Signature Pad */}
      <div className="rounded-xl border border-pink-100 p-3 sm:p-4 bg-pink-50/30">
        <SignaturePad
          label={`Tanda Tangan Pengesahan (${approver})`}
          subLabel="Tanda tangani di area ini menggunakan jari atau stylus"
          onSave={(dataUrl) => setSignature(dataUrl)}
          height={140}
        />
      </div>

      {/* Submit Decision Button */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleDecisionSubmit}
        className={`w-full rounded-2xl py-3 px-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 ${
          selectedDecision === 'approved'
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : selectedDecision === 'conditional'
            ? 'bg-amber-600 hover:bg-amber-700'
            : 'bg-rose-600 hover:bg-rose-700'
        }`}
      >
        {isSubmitting ? (
          <span>Menyimpan Pengesahan...</span>
        ) : (
          <>
            {selectedDecision === 'approved' && (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Sahkan & Berikan Izin Resmi</span>
              </>
            )}
            {selectedDecision === 'conditional' && (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Sahkan Permohonan dengan Syarat</span>
              </>
            )}
            {selectedDecision === 'rejected' && (
              <>
                <XCircle className="w-4 h-4" />
                <span>Tetapkan Penolakan Permohonan</span>
              </>
            )}
          </>
        )}
      </button>
    </div>
  );
}

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
} from 'lucide-react';

interface ReviewPermitActionProps {
  permit: PermitLetter;
  onUpdated: (updatedPermit: PermitLetter) => void;
  onOpenShareModal?: () => void;
  onDownloadImage?: () => void;
}

const PRESET_DEMANDS = [
  'Wajib bawain Seblak / Makanan favorit pas pulang',
  'Denda Rp 50.000 per 10 menit jika lewat dari jam batas',
  'Besok wajib nemenin jalan seharian tanpa mengeluh',
  'Kirim PAP wajah ganteng tiap 45 menit sekali',
];

const REJECT_REASONS = [
  'Kemarin udah keluar, hari ini jatah di rumah bareng Ayang!',
  'Batas jam malam terlalu larut, berbahaya bagi ketentraman batin.',
  'Harus nemenin Ayang nonton serial & teleponan.',
  'Teman-temannya terlalu asyik, nanti lupa waktu.',
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

  // If already reviewed
  if (permit.status !== 'pending') {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-lg space-y-4 text-center">
        <div className="flex items-center justify-center">
          {permit.status === 'approved' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              SURAT INI TELAH DISETUJUI RESMI
            </div>
          )}
          {permit.status === 'conditional' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              SURAT INI DISETUJUI DENGAN SYARAT
            </div>
          )}
          {permit.status === 'rejected' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-xs font-bold text-red-800">
              <XCircle className="w-4 h-4 text-red-600" />
              PERMOHONAN RESMI TELAH DITOLAK
            </div>
          )}
        </div>

        <p className="text-xs text-stone-600">
          Surat izin nomor <strong>{permit.letterNumber}</strong> telah disahkan oleh{' '}
          <strong>{permit.approverName}</strong> pada{' '}
          {permit.decidedAt ? new Date(permit.decidedAt).toLocaleString('id-ID') : '-'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onOpenShareModal && (
            <button
              type="button"
              onClick={onOpenShareModal}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              Bagikan ke WhatsApp
            </button>
          )}

          {onDownloadImage && (
            <button
              type="button"
              onClick={onDownloadImage}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Unduh Surat Sah (PNG)
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
        colors: ['#EF4444', '#F43F5E', '#F59E0B', '#10B981'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleDecisionSubmit = async () => {
    setErrorMsg('');

    if (!signature) {
      setErrorMsg('Ayang wajib memberikan tanda tangan digital terlebih dahulu!');
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
      setErrorMsg('Gagal memproses keputusan surat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-rose-200 bg-white p-4 sm:p-6 shadow-xl space-y-5">
      <div className="border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500 fill-rose-500 animate-pulse" />
          <h3 className="text-base font-bold text-stone-900">
            Meja Pengesahan & Keputusan Ayang
          </h3>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          Tentukan nasib permohonan izin dari <strong>{permit.applicantName}</strong>
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
          ⚠️ {errorMsg}
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
            <span className="text-xs font-bold">DISETUJUI PENUH</span>
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
            <span className="text-xs font-bold">ACC BERSYARAT</span>
            <span className="text-[10px] text-stone-500">Boleh, asal penuhi klausul</span>
          </button>

          {/* 3. TOLAK */}
          <button
            type="button"
            onClick={() => setSelectedDecision('rejected')}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 text-center transition-all ${
              selectedDecision === 'rejected'
                ? 'border-red-500 bg-red-50 text-red-900 shadow-sm ring-2 ring-red-300'
                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
            }`}
          >
            <XCircle className="h-5 w-5 text-red-600 mb-1" />
            <span className="text-xs font-bold">TOLAK PERMOHONAN</span>
            <span className="text-[10px] text-stone-500">Tetap di rumah bersamaku</span>
          </button>
        </div>
      </div>

      {/* Conditional Demands Panel */}
      {selectedDecision === 'conditional' && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 space-y-3">
          <label className="text-xs font-bold text-amber-900 block">
            Daftar Tuntutan & Syarat Wajib Dipenuhi:
          </label>

          <div className="space-y-1.5">
            {demands.map((demand, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs text-stone-800 shadow-2xs border border-amber-200"
              >
                <span>• {demand}</span>
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

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_DEMANDS.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (!demands.includes(item)) setDemands([...demands, item]);
                }}
                className="rounded-full bg-amber-200/70 hover:bg-amber-300 px-2.5 py-1 text-[10px] font-semibold text-amber-950 transition-colors"
              >
                + {item}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newDemandInput}
              onChange={(e) => setNewDemandInput(e.target.value)}
              placeholder="Ketik tuntutan lainnya..."
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
        <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 space-y-2">
          <label className="text-xs font-bold text-red-900 block">
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
                    ? 'border-red-400 bg-white text-red-950 font-bold'
                    : 'border-red-200 bg-white/70 text-red-800 hover:bg-white'
                }`}
              >
                &ldquo;{reason}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pesan Tambahan dari Ayang */}
      <div>
        <label className="text-xs font-medium text-stone-700 block mb-1">
          Catatan / Pesan Kasih Sayang untuk Cowok:
        </label>
        <textarea
          rows={2}
          value={approverNotes}
          onChange={(e) => setApproverNotes(e.target.value)}
          placeholder="Tuliskan wejangan atau pesan manis untuk pasangan..."
          className="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      {/* Signature Pad for Ayang */}
      <div className="rounded-xl border border-stone-200 p-3 sm:p-4 bg-stone-50/50">
        <SignaturePad
          label={`Tanda Tangan Pengesahan (${permit.approverName})`}
          subLabel="Tanda tangani dengan jari atau stylus di layar"
          onSave={(dataUrl) => setSignature(dataUrl)}
          height={140}
        />
      </div>

      {/* Submit Decision Button */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleDecisionSubmit}
        className={`w-full rounded-2xl py-3 px-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 ${
          selectedDecision === 'approved'
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : selectedDecision === 'conditional'
            ? 'bg-amber-600 hover:bg-amber-700'
            : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {isSubmitting ? (
          <span>Menyimpan Pengesahan...</span>
        ) : (
          <span>
            {selectedDecision === 'approved' && 'SAHKAN & BERIKAN IZIN (ACC) ❤️'}
            {selectedDecision === 'conditional' && 'SAHKAN DENGAN SYARAT (ACC BERSYARAT) ⚠️'}
            {selectedDecision === 'rejected' && 'TETAPKAN PENOLAKAN IZIN ❌'}
          </span>
        )}
      </button>
    </div>
  );
}

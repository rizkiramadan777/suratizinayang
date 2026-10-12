'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PermitLetter } from '@/types/permit';
import { getAllPermits, getStoredProfile } from '@/lib/storage';
import CreatePermitForm from '@/components/CreatePermitForm';
import PermitHistory from '@/components/PermitHistory';
import OfficialLetterView from '@/components/OfficialLetterView';
import ReviewPermitAction from '@/components/ReviewPermitAction';
import ShareModal from '@/components/ShareModal';
import SettingsModal from '@/components/SettingsModal';
import Emblem from '@/components/Emblem';
import html2canvas from 'html2canvas';
import {
  FileText,
  History,
  Settings,
  Heart,
  Share2,
  Download,
  PlusCircle,
  ShieldCheck,
  CheckCircle,
  Hourglass,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [permits, setPermits] = useState<PermitLetter[]>([]);
  const [selectedPermit, setSelectedPermit] = useState<PermitLetter | null>(null);
  const [justCreatedPermit, setJustCreatedPermit] = useState<PermitLetter | null>(null);
  const [shareModalPermit, setShareModalPermit] = useState<PermitLetter | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const letterRef = useRef<HTMLDivElement | null>(null);

  const profile = getStoredProfile();

  const loadData = async () => {
    const list = await getAllPermits();
    setPermits(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePermitCreated = (newPermit: PermitLetter) => {
    setJustCreatedPermit(newPermit);
    loadData();
  };

  const handleDownloadImage = async () => {
    const active = justCreatedPermit || selectedPermit;
    if (!letterRef.current || !active) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(letterRef.current, {
        scale: 2,
        backgroundColor: '#FCFBF7',
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Surat-Izin-${active.category}-${active.letterNumber.replace(/\//g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
      alert('Gagal mengunduh gambar surat.');
    } finally {
      setIsExporting(false);
    }
  };

  // Quick stats
  const totalPermits = permits.length;
  const approvedPermits = permits.filter((p) => p.status === 'approved' || p.status === 'conditional').length;
  const pendingPermits = permits.filter((p) => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-stone-900 pb-20 font-sans">
      {/* ================= TOP BRANDING NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Emblem className="w-9 h-9" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-wider text-stone-900 font-serif">
                  SI-IZIN AYANG
                </span>
                <span className="rounded-md bg-rose-100 px-1.5 py-0.2 text-[9px] font-bold text-rose-700">
                  KIP-RI
                </span>
              </div>
              <p className="text-[10px] text-stone-500 hidden sm:block">
                Kementerian Izin Pasangan & Perlindungan Nongkrong
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs"
            >
              <Settings className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Pengaturan Pasangan</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-4xl px-4 flex gap-2 border-t border-stone-100 pt-2 pb-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('create');
              setJustCreatedPermit(null);
              setSelectedPermit(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'create' && !justCreatedPermit && !selectedPermit
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajukan Izin Baru</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              setJustCreatedPermit(null);
              setSelectedPermit(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all relative ${
              activeTab === 'history' && !selectedPermit
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Izin</span>
            {pendingPermits > 0 && (
              <span className="ml-1 rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-amber-950">
                {pendingPermits}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ================= HERO STATS WIDGET ================= */}
      <div className="mx-auto max-w-4xl px-4 pt-5">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 rounded-2xl bg-white border border-stone-200 p-3 sm:p-4 shadow-xs">
          <div className="text-center border-r border-stone-100">
            <span className="text-base sm:text-xl font-black text-stone-800 block">
              {totalPermits}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500">Total Diajukan</span>
          </div>
          <div className="text-center border-r border-stone-100">
            <span className="text-base sm:text-xl font-black text-emerald-600 block">
              {approvedPermits}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500">Izin Disetujui (ACC)</span>
          </div>
          <div className="text-center">
            <span className="text-base sm:text-xl font-black text-amber-500 block">
              {pendingPermits}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500">Menunggu Ayang</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="mx-auto max-w-4xl px-4 pt-6">
        {/* CASE 1: JUST CREATED SUCCESS VIEW */}
        {justCreatedPermit && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/90 p-4 sm:p-6 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-emerald-950">
                Surat Izin Resmi Berhasil Diterbitkan!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                Nomor Registrasi: <strong>{justCreatedPermit.letterNumber}</strong>. Sekarang kirimkan surat ini ke Ayang agar segera diperiksa dan ditandatangani!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShareModalPermit(justCreatedPermit)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Kirim ke WhatsApp Ayang Sekarang</span>
                </button>

                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadImage}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border-2 border-stone-800 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Mengunduh...' : 'Unduh Surat Sah (PNG)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setJustCreatedPermit(null);
                    setActiveTab('history');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 rounded-xl bg-stone-200 px-4 py-3 text-xs font-semibold text-stone-700 hover:bg-stone-300 transition-colors"
                >
                  <span>Lihat Riwayat</span>
                </button>
              </div>
            </div>

            {/* Official Letter Document View */}
            <OfficialLetterView ref={letterRef} permit={justCreatedPermit} />
          </div>
        )}

        {/* CASE 2: SELECTED EXISTING PERMIT FROM HISTORY */}
        {!justCreatedPermit && selectedPermit && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedPermit(null)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
              >
                ← Kembali ke Daftar Riwayat
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShareModalPermit(selectedPermit)}
                  className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Bagikan</span>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadImage}
                  className="flex items-center gap-1 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-stone-800 shadow-2xs disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Mengunduh...' : 'Unduh PNG'}</span>
                </button>
              </div>
            </div>

            {/* Document Render */}
            <OfficialLetterView ref={letterRef} permit={selectedPermit} />

            {/* Ayang Review Box */}
            <ReviewPermitAction
              permit={selectedPermit}
              onUpdated={(updated) => {
                setSelectedPermit(updated);
                loadData();
              }}
              onOpenShareModal={() => setShareModalPermit(selectedPermit)}
              onDownloadImage={handleDownloadImage}
            />
          </div>
        )}

        {/* CASE 3: TABS VIEW (CREATE OR HISTORY) */}
        {!justCreatedPermit && !selectedPermit && (
          <>
            {activeTab === 'create' && (
              <CreatePermitForm onSuccess={handlePermitCreated} />
            )}

            {activeTab === 'history' && (
              <PermitHistory
                permits={permits}
                onSelectPermit={(p) => setSelectedPermit(p)}
                onRefresh={loadData}
                onShare={(p) => setShareModalPermit(p)}
              />
            )}
          </>
        )}
      </main>

      {/* Share Modal */}
      {shareModalPermit && (
        <ShareModal
          permit={shareModalPermit}
          isOpen={!!shareModalPermit}
          onClose={() => setShareModalPermit(null)}
          onDownloadImage={handleDownloadImage}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
}

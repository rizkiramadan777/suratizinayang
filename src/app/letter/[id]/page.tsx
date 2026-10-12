'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { PermitLetter } from '@/types/permit';
import { getPermitById, decodePermitFromDataParam } from '@/lib/storage';
import OfficialLetterView from '@/components/OfficialLetterView';
import ReviewPermitAction from '@/components/ReviewPermitAction';
import ShareModal from '@/components/ShareModal';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import { ArrowLeft, Share2, Download, Heart, Loader2, FileX } from 'lucide-react';

function LetterDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const dataParam = searchParams.get('data');

  const [permit, setPermit] = useState<PermitLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const letterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadLetter() {
      setLoading(true);

      // Check if data is passed via URL query
      if (dataParam) {
        const decoded = decodePermitFromDataParam(dataParam);
        if (decoded) {
          setPermit(decoded);
          setLoading(false);
          return;
        }
      }

      // Check DB or local storage
      if (id) {
        const loaded = await getPermitById(id);
        if (loaded) {
          setPermit(loaded);
        }
      }
      setLoading(false);
    }

    loadLetter();
  }, [id, dataParam]);

  const handleDownloadImage = async () => {
    if (!letterRef.current || !permit) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(letterRef.current, {
        scale: 2,
        backgroundColor: '#FFFDFE',
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Surat-Izin-${permit.category}-${permit.letterNumber.replace(/\//g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
      alert('Gagal mengunduh gambar. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#FFF5F7]">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-3" />
        <p className="text-sm font-semibold text-stone-700">
          Memuat Berkas Surat Resmi...
        </p>
      </div>
    );
  }

  if (!permit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-[#FFF5F7]">
        <div className="rounded-3xl bg-white p-8 max-w-md shadow-xl space-y-4 border border-pink-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
            <FileX className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-stone-800">
            Surat Izin Tidak Ditemukan
          </h2>
          <p className="text-xs text-stone-500">
            Berkas permohonan izin ini mungkin belum tersimpan atau link yang dibuka tidak lengkap.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-pink-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    );
  }

  const approver = permit.approverName || 'Lisa Suryani Purba';

  return (
    <div className="min-h-screen bg-[#FFF5F7] pb-16 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-pink-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-mono text-stone-400">
              {permit.letterNumber}
            </span>
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-pink-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-pink-50 shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-pink-600" />
              <span>Bagikan</span>
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadImage}
              className="flex items-center gap-1.5 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 shadow-2xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Mengunduh...' : 'Unduh'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Document & Decision Container */}
      <main className="mx-auto max-w-4xl px-3 sm:px-6 pt-6 space-y-6">
        {/* Ayang Attention Banner */}
        {permit.status === 'pending' && (
          <div className="rounded-2xl bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 p-4 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 fill-white shrink-0" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold">
                  Surat Menunggu Tinjauan {approver}
                </h3>
                <p className="text-[11px] text-pink-100">
                  Periksa rincian kegiatan dan berikan persetujuan di bagian bawah surat.
                </p>
              </div>
            </div>
            <a
              href="#review-section"
              className="hidden sm:inline-flex rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-pink-600 hover:bg-pink-50 transition-colors shrink-0"
            >
              Tinjau Sekarang
            </a>
          </div>
        )}

        {/* The Official Document */}
        <div className="relative">
          <OfficialLetterView ref={letterRef} permit={permit} />
        </div>

        {/* Review & Signing Action Section */}
        <div id="review-section" className="pt-2">
          <ReviewPermitAction
            permit={permit}
            onUpdated={(updated) => setPermit(updated)}
            onOpenShareModal={() => setShareModalOpen(true)}
            onDownloadImage={handleDownloadImage}
          />
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        permit={permit}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onDownloadImage={handleDownloadImage}
      />
    </div>
  );
}

export default function LetterDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4 bg-[#FFF5F7]">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        </div>
      }
    >
      <LetterDetailContent />
    </Suspense>
  );
}

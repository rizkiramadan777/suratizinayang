'use client';

import React, { useState } from 'react';
import { PermitLetter } from '@/types/permit';
import { encodePermitToUrl, getStoredProfile } from '@/lib/storage';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  MessageCircle,
  QrCode,
} from 'lucide-react';

interface ShareModalProps {
  permit: PermitLetter;
  isOpen: boolean;
  onClose: () => void;
  onDownloadImage?: () => void;
}

export default function ShareModal({
  permit,
  isOpen,
  onClose,
  onDownloadImage,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const profile = getStoredProfile();

  if (!isOpen) return null;

  const shareUrl = encodePermitToUrl(permit);

  // Generate WhatsApp message
  const isApproved = permit.status === 'approved' || permit.status === 'conditional';
  let waText = '';

  if (permit.status === 'pending') {
    waText = `Halo Yang Mulia ${permit.approverName} tercinta ❤️%0A%0AIni surat permohonan dispensasi resmi saya untuk kegiatan *${permit.title}* (Nomor: ${permit.letterNumber}).%0A%0AMohon ditinjau, diberikan wejangan, dan ditandatangani secara digital ya:%0A${shareUrl}%0A%0ALove you banyak-banyak! 🥰`;
  } else if (isApproved) {
    waText = `Lapor Yang Mulia ${permit.approverName}! ❤️%0A%0ASurat Izin *${permit.title}* (No: ${permit.letterNumber}) telah resmi berstatus *DISAHKAN*.%0A%0ABukti surat sah bermaterai dapat dilihat di:%0A${shareUrl}%0A%0ASiap mematuhi segala pakta integritas! 🫡`;
  } else {
    waText = `Surat Izin *${permit.title}* (No: ${permit.letterNumber}) telah diputuskan *DITOLAK* oleh ${permit.approverName}.%0A%0ASaya akan tetap di rumah menemani Ayang tercinta 🥺❤️%0A${shareUrl}`;
  }

  const waTarget = profile.whatsappFemale ? profile.whatsappFemale.replace(/[^0-9]/g, '') : '';
  const waUrl = waTarget
    ? `https://api.whatsapp.com/send?phone=${waTarget}&text=${waText}`
    : `https://api.whatsapp.com/send?text=${waText}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Kirim & Bagikan Surat Izin
          </h3>
          <p className="text-xs text-stone-500">
            Nomor: <span className="font-mono font-bold text-stone-700">{permit.letterNumber}</span>
          </p>
        </div>

        {/* WhatsApp Button */}
        <div className="space-y-2 pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-lg transition-transform active:scale-[0.99]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Kirim ke WhatsApp Ayang Langsung</span>
          </a>

          {/* Copy Link */}
          <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 p-1.5">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent px-2 text-xs text-stone-700 select-all outline-hidden font-mono truncate"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Download Image Button */}
        {onDownloadImage && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                onDownloadImage();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-stone-800 bg-white py-3 px-4 text-xs sm:text-sm font-bold text-stone-900 hover:bg-stone-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Foto Surat Sah (PNG)</span>
            </button>
          </div>
        )}

        <div className="rounded-xl bg-amber-50 p-3 text-center text-[11px] text-amber-800">
          💡 Pasangan Anda bisa membuka link ini di HP atau Tablet tanpa perlu install aplikasi apapun!
        </div>
      </div>
    </div>
  );
}

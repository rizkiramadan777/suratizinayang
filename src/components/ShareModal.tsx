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
  MessageCircle,
  Info,
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

  // Generate WhatsApp message (tanpa emoji, sopan & romantis)
  const isApproved = permit.status === 'approved' || permit.status === 'conditional';
  let waText = '';

  const approver = permit.approverName || 'Lisa Suryani Purba';
  const applicant = permit.applicantName || 'Rizki Ramadan';

  if (permit.status === 'pending') {
    waText = `Kepada ${approver},%0A%0ABerikut surat permohonan izin resmi dari ${applicant} untuk kegiatan *${permit.title}* (No. Registrasi: ${permit.letterNumber}).%0A%0AMohon ditinjau dan ditandatangani secara digital melalui tautan resmi:%0A${shareUrl}%0A%0ATerima kasih banyak atas perhatian dan kasih sayangnya.`;
  } else if (isApproved) {
    waText = `Pemberitahuan Resmi untuk ${approver}:%0A%0ASurat Izin *${permit.title}* (No: ${permit.letterNumber}) telah resmi *DISAHKAN*.%0A%0ABukti surat sah bermaterai dapat dilihat di:%0A${shareUrl}%0A%0A${applicant} siap mematuhi seluruh komitmen dan pakta integritas.`;
  } else {
    waText = `Pemberitahuan untuk ${approver}:%0A%0ASurat Izin *${permit.title}* (No: ${permit.letterNumber}) telah berstatus *DITOLAK*.%0A%0A${applicant} akan tetap berada di rumah berkegiatan bersama.%0A${shareUrl}`;
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
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Bagikan Surat Izin Resmi
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
            <span>Kirim ke WhatsApp {approver}</span>
          </a>

          {/* Copy Link */}
          <div className="flex items-center gap-2 rounded-xl border border-pink-100 bg-pink-50/40 p-1.5">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent px-2 text-xs text-stone-700 select-all outline-hidden font-mono truncate"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Tersalin</span>
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

        <div className="rounded-xl bg-pink-50 border border-pink-100 p-3 text-center text-[11px] text-pink-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-pink-600 shrink-0" />
          <span>Pasangan dapat membuka tautan ini langsung di ponsel atau tablet tanpa mengunduh aplikasi tambahan.</span>
        </div>
      </div>
    </div>
  );
}

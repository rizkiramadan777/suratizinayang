import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Materai({ date }: { date?: string }) {
  const displayDate = date
    ? new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'RESMI';

  return (
    <div className="relative inline-block select-none overflow-hidden rounded-md border-2 border-dashed border-pink-300 bg-linear-to-br from-pink-50 via-rose-100 to-pink-100 p-2.5 text-center shadow-xs">
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-pink-700" />
          <span className="text-[9px] font-bold tracking-widest text-pink-900 uppercase">
            E-MATERAI ASMARA
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-pink-600 animate-pulse" />
        </div>

        <div className="my-0.5 rounded border border-pink-300 bg-white/80 px-2 py-0.5 shadow-inner">
          <div className="text-[12px] font-extrabold tracking-tight text-pink-700">
            Rp 10.000.000
          </div>
          <div className="text-[7.5px] font-semibold text-pink-600">
            SEPULUH JUTA SAYANG
          </div>
        </div>

        {/* Barcode representation */}
        <div className="flex w-full items-center justify-between px-1 text-[7px] text-pink-900 font-mono">
          <span>KIP-RI</span>
          <span>{displayDate}</span>
          <span className="font-bold">SAH</span>
        </div>

        {/* Security watermark pattern */}
        <div className="text-[6.5px] text-pink-600 tracking-tighter opacity-80 uppercase font-semibold">
          DOKUMEN RESMI MENGIKAT ASMARA
        </div>
      </div>
    </div>
  );
}

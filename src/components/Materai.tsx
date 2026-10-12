import React from 'react';

export default function Materai({ date }: { date?: string }) {
  const displayDate = date
    ? new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'RESMI';

  return (
    <div className="relative inline-block select-none overflow-hidden rounded-md border-2 border-dashed border-red-300 bg-linear-to-br from-rose-50 via-red-100 to-amber-50 p-2.5 text-center shadow-xs">
      {/* Perforated border look */}
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-bold tracking-widest text-red-800 uppercase">
            E-MATERAI ASMARA
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
        </div>

        <div className="my-0.5 rounded border border-red-400/60 bg-white/70 px-2 py-0.5 shadow-inner">
          <div className="text-[12px] font-extrabold tracking-tight text-red-700">
            Rp 10.000.000
          </div>
          <div className="text-[7.5px] font-semibold text-red-600">
            SEPULUH JUTA SAYANG
          </div>
        </div>

        {/* Barcode representation & Hologram symbol */}
        <div className="flex w-full items-center justify-between px-1 text-[7px] text-red-800/80 font-mono">
          <span>KIP-RI</span>
          <span>{displayDate}</span>
          <span className="font-bold">SAH</span>
        </div>

        {/* Security watermark pattern */}
        <div className="text-[6.5px] text-red-500 tracking-tighter opacity-75">
          ★ TIDAK DAPAT DIGUGAT TEMAN NONGKRONG ★
        </div>
      </div>
    </div>
  );
}

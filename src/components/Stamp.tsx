import React from 'react';
import { PermitStatus } from '@/types/permit';

interface StampProps {
  status: PermitStatus;
  date?: string;
  approverName?: string;
  className?: string;
}

export default function Stamp({ status, date, approverName = 'LISA SURYANI PURBA', className = '' }: StampProps) {
  const formattedDate = date 
    ? new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

  if (status === 'pending') {
    return (
      <div className={`inline-flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-pink-300 p-2.5 text-pink-700 font-mono rotate-[-6deg] opacity-75 ${className}`}>
        <span className="text-[10px] font-bold tracking-wider uppercase">MENUNGGU ACC</span>
        <span className="text-[9px]">DIPERIKSA: {approverName}</span>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className={`relative inline-block select-none rotate-[-8deg] transition-transform duration-300 ${className}`}>
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-double border-rose-600/90 bg-rose-500/5 p-1 text-center shadow-xs">
          {/* Inner circle */}
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-rose-600/80 p-1">
            <span className="text-[7.5px] font-black tracking-widest text-rose-600 uppercase">
              • REPUBLIK PERCINTAAN •
            </span>
            <div className="my-0.5 border-y border-rose-600/80 py-0.5 w-full">
              <span className="block text-[13px] font-black tracking-wider text-rose-700 leading-none">
                DISETUJUI
              </span>
              <span className="block text-[8px] font-bold text-rose-600 leading-tight">
                RESMI & SAH
              </span>
            </div>
            <span className="text-[7px] font-bold text-rose-600">
              ACC: {approverName.slice(0, 16)}
            </span>
            <span className="text-[6.5px] font-mono text-rose-600/90">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'conditional') {
    return (
      <div className={`relative inline-block select-none rotate-[-6deg] transition-transform duration-300 ${className}`}>
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-double border-amber-600/90 bg-amber-500/5 p-1 text-center shadow-xs">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-amber-600/80 p-1">
            <span className="text-[7px] font-black tracking-widest text-amber-700 uppercase">
              • DISPENSASI KHUSUS •
            </span>
            <div className="my-0.5 border-y border-amber-600/80 py-0.5 w-full">
              <span className="block text-[11px] font-black tracking-wider text-amber-800 leading-none">
                ACC BERSYARAT
              </span>
              <span className="block text-[7.5px] font-bold text-amber-700 leading-tight">
                WAJIB PATUH
              </span>
            </div>
            <span className="text-[7px] font-bold text-amber-700">
              OLEH: {approverName.slice(0, 16)}
            </span>
            <span className="text-[6.5px] font-mono text-amber-700/90">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // rejected
  return (
    <div className={`relative inline-block select-none rotate-[-12deg] transition-transform duration-300 ${className}`}>
      <div className="rounded-md border-4 border-double border-rose-700 bg-rose-600/10 px-4 py-2 text-center shadow-md">
        <span className="block text-base font-black tracking-widest text-rose-700 uppercase">
          PERMOHONAN DITOLAK
        </span>
        <span className="block text-[9px] font-bold tracking-wider text-rose-600 uppercase">
          TETAP DI RUMAH BERSAMA PASANGAN
        </span>
        <span className="block text-[8px] font-mono text-rose-700 mt-0.5">
          TGL: {formattedDate}
        </span>
      </div>
    </div>
  );
}

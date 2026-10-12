'use client';

import React, { useState } from 'react';
import { PermitLetter, PermitStatus } from '@/types/permit';
import { deletePermit } from '@/lib/storage';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Hourglass,
  Share2,
  Trash2,
  Eye,
  Search,
  FileText,
} from 'lucide-react';

interface PermitHistoryProps {
  permits: PermitLetter[];
  onSelectPermit: (permit: PermitLetter) => void;
  onRefresh: () => void;
  onShare: (permit: PermitLetter) => void;
}

export default function PermitHistory({
  permits,
  onSelectPermit,
  onRefresh,
  onShare,
}: PermitHistoryProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPermits = permits.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.letterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Yakin ingin menghapus arsip surat permohonan ini?')) {
      await deletePermit(id);
      onRefresh();
    }
  };

  const getStatusBadge = (status: PermitStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            DISETUJUI
          </span>
        );
      case 'conditional':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            BERSYARAT
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" />
            DITOLAK
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-700">
            <Hourglass className="w-3 h-3 text-stone-500 animate-spin" />
            MENUNGGU ACC
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-2.5 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari surat izin, nomor, atau lokasi kegiatan..."
            className="w-full rounded-2xl border border-stone-200 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pending', label: 'Menunggu' },
            { id: 'approved', label: 'Disetujui' },
            { id: 'rejected', label: 'Ditolak' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-pink-50/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List Content */}
      {filteredPermits.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-pink-200 bg-white/70 p-8 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
            <FileText className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-stone-800">
            Belum Ada Arsip Surat Izin
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Tidak ada permohonan yang sesuai dengan kata kunci pencarian.'
              : 'Belum ada surat permohonan izin yang diterbitkan. Silakan buat permohonan baru.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredPermits.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPermit(item)}
              className="group relative cursor-pointer rounded-2xl border border-pink-100 bg-white p-4 shadow-xs transition-all hover:border-pink-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 block mb-0.5">
                    {item.letterNumber}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900 group-hover:text-pink-600 transition-colors">
                    {item.title}
                  </h4>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <div className="space-y-1 text-xs text-stone-600 my-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" />
                  <span>
                    {new Date(item.eventDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-stone-300">•</span>
                  <Clock className="w-3.5 h-3.5 text-pink-500" />
                  <span>
                    {item.startTime} - {item.endTime} WIB
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-pink-500" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between border-t border-pink-50 pt-2.5 mt-2">
                <span className="text-[11px] text-stone-400">
                  Untuk: <strong>{item.approverName || 'Lisa Suryani Purba'}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare(item);
                    }}
                    className="p-1.5 rounded-lg text-stone-500 hover:bg-pink-50 hover:text-pink-700"
                    title="Bagikan ke WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600"
                    title="Hapus Surat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 ml-1"
                  >
                    <span>Buka</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trash2, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  initialDataUrl?: string;
  onSave: (dataUrl: string) => void;
  onClear?: () => void;
  label?: string;
  subLabel?: string;
  height?: number;
}

export default function SignaturePad({
  initialDataUrl,
  onSave,
  onClear,
  label = 'Tanda Tangan Digital',
  subLabel = 'Gunakan jari atau stylus untuk menandatangani',
  height = 200,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#1E3A8A');
  const [lineWidth, setLineWidth] = useState(4);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Setup canvas size with DPI scaling
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;

      // If initial dataUrl exists, draw it
      if (initialDataUrl && !hasDrawn) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, height);
          setHasDrawn(true);
        };
        img.src = initialDataUrl;
      }
    }
  }, [height, initialDataUrl, strokeColor, lineWidth, hasDrawn]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas]);

  // Pointer position helper
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history snapshot before new stroke
    const dpr = window.devicePixelRatio || 1;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), snapshot]);

    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.closePath();

    setIsDrawing(false);

    // Export PNG
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setHasDrawn(false);
    if (onClear) onClear();
    onSave('');
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevSnapshot = history[history.length - 1];
    ctx.putImageData(prevSnapshot, 0, 0);
    setHistory((prev) => prev.slice(0, prev.length - 1));

    if (history.length === 1) {
      setHasDrawn(false);
      onSave('');
    } else {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-rose-500" />
          {label}
        </label>
        <span className="text-[11px] text-gray-400">{subLabel}</span>
      </div>

      <div
        ref={containerRef}
        className="relative w-full rounded-xl border-2 border-dashed border-gray-300 bg-white/90 shadow-inner overflow-hidden transition-all duration-200 hover:border-rose-300 focus-within:border-rose-400"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          className="w-full touch-none cursor-crosshair block select-none"
        />

        {/* Guidelines watermark */}
        <div className="pointer-events-none absolute inset-x-4 bottom-7 border-b border-gray-200/60" />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[10px] text-gray-300 font-mono select-none">
          GARIS DASAR TANDA TANGAN
        </div>

        {!hasDrawn && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-gray-400 select-none">
            Sentuh & goreskan jari di sini...
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between text-xs pt-1">
        {/* Ink Color Picker */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500">Tinta:</span>
          {[
            { color: '#1E3A8A', name: 'Biru Resmi' },
            { color: '#111827', name: 'Hitam' },
            { color: '#DC2626', name: 'Merah' },
          ].map((item) => (
            <button
              key={item.color}
              type="button"
              onClick={() => setStrokeColor(item.color)}
              className={`h-5 w-5 rounded-full border transition-all ${
                strokeColor === item.color
                  ? 'ring-2 ring-rose-400 ring-offset-1 scale-110'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: item.color }}
              title={item.name}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100 rounded-md transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasDrawn}
            className="flex items-center gap-1 px-2.5 py-1 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-40 disabled:hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [strokeColor, setStrokeColor] = useState('#1E3A8A'); // Tinta biru resmi
  const [lineWidth, setLineWidth] = useState(4.5);
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

  // Potong padding transparan kosong di sekeliling TTD
  const trimCanvas = (canvas: HTMLCanvasElement): string => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return canvas.toDataURL('image/png');

      const width = canvas.width;
      const height = canvas.height;
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX === -1) {
        return '';
      }

      // Beri sedikit margin 10px agar goresan tidak terpotong pas di tepi
      const padding = 12;
      const cropX = Math.max(0, minX - padding);
      const cropY = Math.max(0, minY - padding);
      const cropW = Math.min(width - cropX, maxX - minX + padding * 2);
      const cropH = Math.min(height - cropY, maxY - minY + padding * 2);

      const trimmedCanvas = document.createElement('canvas');
      trimmedCanvas.width = cropW;
      trimmedCanvas.height = cropH;

      const trimmedCtx = trimmedCanvas.getContext('2d');
      if (!trimmedCtx) return canvas.toDataURL('image/png');

      trimmedCtx.drawImage(
        canvas,
        cropX, cropY, cropW, cropH,
        0, 0, cropW, cropH
      );

      return trimmedCanvas.toDataURL('image/png');
    } catch (e) {
      return canvas.toDataURL('image/png');
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.closePath();

    setIsDrawing(false);

    // Export PNG tanpa margin transparan kosong
    const dataUrl = trimCanvas(canvas);
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
      const dataUrl = trimCanvas(canvas);
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
        {/* Ink & Thickness Controls */}
        <div className="flex items-center gap-2 flex-wrap">
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
          <span className="text-[11px] text-gray-400 mx-1">|</span>
          <span className="text-[11px] text-gray-500">Tebal:</span>
          {[
            { size: 3, label: 'S' },
            { size: 4.5, label: 'M' },
            { size: 7, label: 'L' },
          ].map((item) => (
            <button
              key={item.size}
              type="button"
              onClick={() => setLineWidth(item.size)}
              className={`h-6 w-6 rounded-full text-[10px] font-bold border transition-all flex items-center justify-center ${
                lineWidth === item.size
                  ? 'bg-rose-500 text-white border-rose-500 scale-110'
                  : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
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

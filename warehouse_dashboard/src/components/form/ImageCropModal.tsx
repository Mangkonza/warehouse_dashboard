'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaCrop, FaSearchPlus, FaSearchMinus, FaCheck, FaTimes, FaUndo } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onConfirm: (croppedBase64: string) => void;
  onCancel: () => void;
}

const CONTAINER_SIZE = 320; // viewport สี่เหลี่ยมจัตุรัส 320x320
const OUTPUT_SIZE = 400; // ไฟล์ผลลัพธ์ 400x400 (แสดงเป็นวงกลมในหน้าฟอร์ม)
const MIN_SCALE = 0.6;
const MAX_SCALE = 3;

const clampScale = (v: number) => Math.min(Math.max(MIN_SCALE, v), MAX_SCALE);

export function ImageCropModal({
  isOpen,
  imageSrc,
  onConfirm,
  onCancel,
}: ImageCropModalProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale((prev) => clampScale(prev + delta));
  };

  const handleConfirmCrop = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background white fill
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // Compute drawing dimensions on canvas
    const ratio = OUTPUT_SIZE / CONTAINER_SIZE;
    const renderedWidth = img.width * scale * ratio;
    const renderedHeight = img.height * scale * ratio;

    const centerX = OUTPUT_SIZE / 2;
    const centerY = OUTPUT_SIZE / 2;

    const drawX = centerX - renderedWidth / 2 + offset.x * ratio;
    const drawY = centerY - renderedHeight / 2 + offset.y * ratio;

    ctx.drawImage(img, drawX, drawY, renderedWidth, renderedHeight);

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onConfirm(croppedDataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaCrop className="text-emerald-400 text-sm" />
            <h3 className="font-bold text-sm text-white m-0">ตัดและจัดตำแหน่งรูปภาพประจำตัว</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <FaTimes className="size-4" />
          </button>
        </div>

        {/* Viewport container */}
        <div className="p-5 flex flex-col items-center">
          <div
            style={{ width: `${CONTAINER_SIZE}px`, height: `${CONTAINER_SIZE}px` }}
            className="relative overflow-hidden rounded-lg border border-dashed border-emerald-500 bg-slate-100 flex items-center justify-center cursor-move select-none shadow-inner"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onWheel={handleWheel}
          >
            {/* Target Image */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                maxWidth: 'none',
                maxHeight: 'none',
                userSelect: 'none',
              }}
              className="pointer-events-none transition-transform duration-75 ease-out"
            />

            {/* วงกลมเต็มกรอบ = ขอบเขตที่จะเห็นจริงในรูปโปรไฟล์ (พื้นที่นอกวงกลมถูกหรี่ลง) */}
            <div className="absolute inset-0 pointer-events-none rounded-full border border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
          </div>

          <div className="text-[11.5px] text-slate-500 mt-2 text-center">
            ลากเพื่อเลื่อนตำแหน่งภาพ • เลื่อนแถบด้านล่างหรือหมุนลูกกลิ้งเมาส์เพื่อซูม
            <br />
            ส่วนที่อยู่ในวงกลมคือรูปที่จะแสดงเป็นรูปโปรไฟล์
          </div>

          {/* Zoom slider control */}
          <div className="w-full max-w-xs mt-3 flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setScale((s) => clampScale(s - 0.15))}
              className="text-slate-500 hover:text-emerald-600 p-1"
              title="ย่อ"
            >
              <FaSearchMinus className="size-3.5" />
            </button>
            <input
              type="range"
              min={MIN_SCALE}
              max={MAX_SCALE}
              step="0.05"
              value={scale}
              onChange={(e) => setScale(clampScale(parseFloat(e.target.value)))}
              className="flex-1 accent-[#00A651] cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setScale((s) => clampScale(s + 0.15))}
              className="text-slate-500 hover:text-emerald-600 p-1"
              title="ขยาย"
            >
              <FaSearchPlus className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setScale(1);
                setOffset({ x: 0, y: 0 });
              }}
              className="text-xs text-slate-400 hover:text-slate-700 ml-1 p-1"
              title="รีเซ็ตตำแหน่ง"
            >
              <FaUndo className="size-3" />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-8 px-4 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100"
          >
            ยกเลิก
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirmCrop}
            className="h-8 px-4 text-xs font-semibold text-white bg-[#00A651] hover:bg-[#008a43] shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <FaCheck className="size-3" />
            <span>ยืนยัน</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
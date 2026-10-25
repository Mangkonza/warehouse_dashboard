'use client';

import React, { useState, useRef } from 'react';
import { FaUserTie, FaUpload, FaCrop, FaTrashAlt, FaImage } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ImageCropModal } from './ImageCropModal';
import { cn } from '@/lib/utils';

export interface AvatarImageFieldProps {
  value?: string | null;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function AvatarImageField({
  value,
  onChange,
  className,
  disabled = false,
}: AvatarImageFieldProps) {
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      const src = uploadEvt.target?.result as string;
      if (src) {
        setRawImageSrc(src);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so re-selecting same file triggers onChange
    e.target.value = '';
  };

  const handleOpenReCrop = () => {
    if (value) {
      setRawImageSrc(value);
      setCropModalOpen(true);
    }
  };

  const handleConfirmCrop = (croppedBase64: string) => {
    onChange(croppedBase64);
    setCropModalOpen(false);
  };

  const handleRemoveImage = () => {
    onChange('');
  };

  const hasImage = Boolean(value && String(value).trim() !== '');

  return (
    <div className={cn('p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3', className)}>
      <div className="flex items-center gap-4 flex-wrap">
        {/* Avatar Display Frame (วงกลม) */}
        <div className="relative size-18 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-xs shrink-0 flex items-center justify-center">
          {hasImage ? (
            <img
              src={value || ''}
              alt="รูปภาพประจำตัว"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <FaUserTie className="text-slate-400 text-2xl" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="h-8 px-3 text-xs font-semibold text-slate-700 bg-white border-slate-300 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
            >
              <FaUpload className="text-[11px] text-[#00A651]" />
              <span>{hasImage ? 'เปลี่ยนรูปภาพ' : 'เลือกรูปภาพ'}</span>
            </Button>

            {hasImage && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenReCrop}
                disabled={disabled}
                className="h-8 px-3 text-xs font-semibold text-slate-700 bg-white border-slate-300 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
              >
                <FaCrop className="text-[11px] text-blue-600" />
                <span>ปรับแต่งการตัดรูป</span>
              </Button>
            )}

            {hasImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                disabled={disabled}
                className="h-8 px-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer flex items-center gap-1"
              >
                <FaTrashAlt className="text-[11px]" />
                <span>ลบรูป</span>
              </Button>
            )}
          </div>
          <span className="text-[11px] text-slate-500">
            เลือกไฟล์ภาพจากเครื่องเพื่อตัดภาพเป็นสี่เหลี่ยมจัตุรัส (แสดงผลเป็นวงกลม) หรือระบุ URL / Path ด้านล่าง
          </span>
        </div>
      </div>

      {/* URL / Path Direct Input */}
      <div className="pt-2 border-t border-slate-200/80">
        <div className="flex items-center gap-2">
          <FaImage className="text-slate-400 text-xs shrink-0" />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="URL หรือ Path รูปภาพประจำตัว"
            className="flex-1 h-8 px-2.5 text-xs rounded-md border border-slate-300 bg-white text-slate-700 outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
          />
        </div>
      </div>

      {/* Image Crop Dialog */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={rawImageSrc}
        onConfirm={handleConfirmCrop}
        onCancel={() => setCropModalOpen(false)}
      />
    </div>
  );
}
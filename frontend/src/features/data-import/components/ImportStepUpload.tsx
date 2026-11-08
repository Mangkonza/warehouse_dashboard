'use client';

import React, { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaDownload, FaSpinner } from 'react-icons/fa';
import { CategoryKey } from '@/types/dataManagement';
import { Alert } from '@/components/ui/Alert';
import { downloadExcelTemplate } from '@/lib/etlEngine';
import { CATEGORY_LABELS_TH } from '../etl/importEtl';
import { cn } from '@/lib/utils';

export interface ImportStepUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
  activeCategory?: CategoryKey;
}

export const ImportStepUpload: React.FC<ImportStepUploadProps> = ({
  onFileSelect,
  isLoading,
  errorMessage,
  onClearError,
  activeCategory = 'academic',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    onClearError();
    onFileSelect(file);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center p-[clamp(1.25rem,3vw,2.5rem)]">
      <div className="w-full max-w-[38rem] space-y-[1.25rem]">
        {errorMessage && (
          <Alert
            variant="error"
            title="ไม่สามารถอ่านไฟล์ได้"
            action={
              <button
                type="button"
                onClick={onClearError}
                className="text-[0.75rem] font-bold underline cursor-pointer"
              >
                ปิด
              </button>
            }
          >
            {errorMessage}
          </Alert>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const dropped = e.dataTransfer.files?.[0];
            handleFile(dropped);
          }}
          onClick={() => {
            if (!isLoading) inputRef.current?.click();
          }}
          className={cn(
            'rounded-[1rem] border-2 border-dashed p-[clamp(1.75rem,4vw,3rem)] flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none',
            isDragging
              ? 'border-[#00A651] bg-emerald-50/70'
              : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/70'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              handleFile(f);
              e.target.value = '';
            }}
          />

          <div className="w-[3.75rem] h-[3.75rem] rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-[1rem]">
            {isLoading ? (
              <FaSpinner className="text-[1.5rem] animate-spin" />
            ) : (
              <FaCloudUploadAlt className="text-[1.75rem]" />
            )}
          </div>

          <h3 className="text-[1rem] font-bold text-slate-800 mb-[0.375rem]">
            {isLoading
              ? 'กำลังวิเคราะห์โครงสร้างชีตและตรวจสอบข้อมูล...'
              : 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์ Excel มาวางที่นี่'}
          </h3>

          <p className="text-[0.8125rem] text-slate-500 max-w-[28rem] leading-relaxed">
            รองรับไฟล์ <strong className="text-slate-700">.xlsx, .xls, .csv</strong> ทั้งไฟล์แยกหมวดหมู่และไฟล์รวมหลายชีต ระบบจะจำแนกหมวดหมู่และแปลงปี พ.ศ. ให้อัตโนมัติ
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-[0.75rem] px-[1rem] py-[0.75rem] rounded-[0.75rem] bg-slate-50 border border-slate-200">
          <div className="text-[0.75rem] text-slate-600">
            ต้องการไฟล์ตัวอย่างสำหรับหมวด{' '}
            <strong className="text-slate-800">
              {CATEGORY_LABELS_TH[activeCategory] || 'โครงการพัฒนาวิชาการ'}
            </strong>{' '}
            หรือไม่?
          </div>

          <button
            type="button"
            onClick={() => downloadExcelTemplate(activeCategory)}
            className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.375rem] rounded-[0.5rem] bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-emerald-700 text-[0.75rem] font-bold transition-colors cursor-pointer"
          >
            <FaDownload className="text-[0.6875rem]" />
            <span>ดาวน์โหลดเทมเพลต Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaFileExcel, FaDownload, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { downloadExcelTemplate } from '@/lib/etlEngine';
import { cn } from '@/lib/utils';

interface ImportStepUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

export const ImportStepUpload: React.FC<ImportStepUploadProps> = ({
  onFileSelect,
  isLoading,
  errorMessage,
  onClearError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSubmit(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSubmit(file);
    }
  };

  const validateAndSubmit = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      alert('กรุณาเลือกไฟล์ Excel นามสกุล .xlsx หรือ .xls เท่านั้น');
      return;
    }
    onClearError();
    onFileSelect(file);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full text-center space-y-6">
      {/* Error alert if file parsing failed */}
      {errorMessage && (
        <div className="w-full p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between text-left animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <FaTimesCircle className="text-rose-500 text-lg shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="text-rose-500 hover:text-rose-800 text-xs font-semibold px-2 py-1"
          >
            ปิด
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={cn(
          'w-full p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 group',
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50/80 bg-white'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
          {isLoading ? (
            <FaSpinner className="text-2xl animate-spin text-emerald-600" />
          ) : (
            <FaCloudUploadAlt className="text-3xl" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">
            {isLoading ? 'กำลังอ่านและประมวลผลไฟล์...' : 'ลากไฟล์ Excel มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์'}
          </h3>
          <p className="text-xs text-slate-500">
            รองรับไฟล์สมุดงานโครงการพัฒนาวิชาการ (.xlsx, .xls) ที่มีแผ่นงานแยกตามรายเดือน (เช่น ม.ค.68 - ธ.ค.68)
          </p>
        </div>

        {!isLoading && (
          <button
            type="button"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            เลือกไฟล์จากเครื่องคอมพิวเตอร์
          </button>
        )}
      </div>

      {/* Download Template button */}
      <div className="pt-2 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => downloadExcelTemplate('academic')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition-colors shadow-2xs"
        >
          <FaDownload className="text-emerald-600" />
          <span>ดาวน์โหลดแบบฟอร์มมาตรฐาน (Excel Template)</span>
        </button>
      </div>
    </div>
  );
};

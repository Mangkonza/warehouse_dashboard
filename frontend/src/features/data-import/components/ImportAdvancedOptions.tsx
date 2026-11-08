'use client';

import React from 'react';
import { FaCog } from 'react-icons/fa';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export interface ImportAdvancedOptionsProps {
  importMode: 'append' | 'overwrite';
  onChangeMode: (mode: 'append' | 'overwrite') => void;
}

export const ImportAdvancedOptions: React.FC<ImportAdvancedOptionsProps> = ({
  importMode,
  onChangeMode,
}) => {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        className="inline-flex items-center gap-[0.375rem] px-[0.625rem] py-[0.375rem] rounded-[0.5rem] text-[0.75rem] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
      >
        <FaCog className="text-[0.75rem]" />
        <span>ตัวเลือกขั้นสูง</span>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-[18rem] p-[0.875rem] rounded-[0.875rem] bg-white border border-slate-200 shadow-xl text-slate-800 space-y-[0.5rem]"
      >
        <div className="text-[0.8125rem] font-bold text-slate-800">โหมดการนำเข้าข้อมูล</div>

        <label className="flex items-start gap-[0.5rem] p-[0.5rem] rounded-[0.5rem] hover:bg-slate-50 cursor-pointer">
          <input
            type="radio"
            name="importMode"
            checked={importMode === 'append'}
            onChange={() => onChangeMode('append')}
            className="mt-[0.1875rem] text-emerald-600"
          />
          <div>
            <div className="text-[0.75rem] font-bold text-slate-800">
              เพิ่มต่อท้าย (แนะนำ)
            </div>
            <div className="text-[0.6875rem] text-slate-500">
              เพิ่มข้อมูลใหม่โดยไม่ลบข้อมูลเก่า และข้ามรายการที่ซ้ำอัตโนมัติ
            </div>
          </div>
        </label>

        <label className="flex items-start gap-[0.5rem] p-[0.5rem] rounded-[0.5rem] hover:bg-rose-50/50 cursor-pointer">
          <input
            type="radio"
            name="importMode"
            checked={importMode === 'overwrite'}
            onChange={() => onChangeMode('overwrite')}
            className="mt-[0.1875rem] text-rose-600"
          />
          <div>
            <div className="text-[0.75rem] font-bold text-rose-700">
              เขียนทับข้อมูลเดิม
            </div>
            <div className="text-[0.6875rem] text-slate-500">
              นำเข้าชุดข้อมูลใหม่แทนที่ข้อมูลเดิม (ต้องยืนยันก่อนดำเนินการ)
            </div>
          </div>
        </label>
      </PopoverContent>
    </Popover>
  );
};

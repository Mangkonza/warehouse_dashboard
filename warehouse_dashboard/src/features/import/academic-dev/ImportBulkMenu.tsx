'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaWrench, FaCalendarAlt, FaBuilding, FaFilter, FaBan, FaCheck, FaChevronDown } from 'react-icons/fa';
import { DepartmentSelect } from '@/components/ui/department-select';
import { DatePicker } from '@/components/ui/date-picker';
import { ImportRow } from './importAcademicDev.types';

interface ImportBulkMenuProps {
  filteredRows: ImportRow[];
  onApplyFillMonthDates: () => void;
  onApplyBatchDate: (startDate: string, endDate: string) => void;
  onApplyBatchDepartment: (deptCode: string) => void;
  onExcludeDuplicates: () => void;
  onExcludeErrors: () => void;
}

export const ImportBulkMenu: React.FC<ImportBulkMenuProps> = ({
  filteredRows,
  onApplyFillMonthDates,
  onApplyBatchDate,
  onApplyBatchDepartment,
  onExcludeDuplicates,
  onExcludeErrors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubModal, setActiveSubModal] = useState<'date' | 'dept' | null>(null);

  // Submodal form states
  const [batchStartDate, setBatchStartDate] = useState('');
  const [batchEndDate, setBatchEndDate] = useState('');
  const [batchDept, setBatchDept] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const count = filteredRows.length;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
        title="เครื่องมือช่วยแก้ไขหลายรายการพร้อมกันในแถวที่กำลังแสดง"
      >
        <FaWrench className="text-slate-500 text-xs" />
        <span>แก้ไขหลายแถว ({count})</span>
        <FaChevronDown className="text-slate-400 text-[10px]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white border border-slate-200 ring-1 ring-black/5 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 text-[11px] text-slate-500 font-medium bg-slate-50/70 rounded-t-xl">
            ใช้กับ <strong className="text-slate-800 font-bold">{count} แถว</strong> ที่ผ่านตัวกรองในขณะนี้
          </div>

          <div className="p-1 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onApplyFillMonthDates();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg flex items-center gap-2.5 transition-colors"
            >
              <FaCalendarAlt className="text-emerald-600 text-sm shrink-0" />
              <div>
                <div className="font-semibold">ใช้เดือนของ Sheet เป็นวันที่</div>
                <div className="text-[10px] text-slate-500">เติมวันแรก-วันสุดท้ายของเดือนให้แถวที่ว่าง</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSubModal('date');
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg flex items-center gap-2.5 transition-colors"
            >
              <FaCalendarAlt className="text-indigo-600 text-sm shrink-0" />
              <div>
                <div className="font-semibold">กำหนดวันที่ให้ทุกแถวที่ว่าง</div>
                <div className="text-[10px] text-slate-500">ระบุวันที่เริ่มและสิ้นสุดครั้งเดียว</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSubModal('dept');
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-800 rounded-lg flex items-center gap-2.5 transition-colors"
            >
              <FaBuilding className="text-blue-600 text-sm shrink-0" />
              <div>
                <div className="font-semibold">กำหนดสังกัดให้ทุกแถวที่ว่าง</div>
                <div className="text-[10px] text-slate-500">เลือกภาควิชา/ศูนย์สำหรับแถวที่ยังไม่มีสังกัด</div>
              </div>
            </button>
          </div>

          <div className="p-1 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onExcludeDuplicates();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800 rounded-lg flex items-center gap-2.5 transition-colors"
            >
              <FaBan className="text-amber-600 text-sm shrink-0" />
              <div>
                <div className="font-semibold">ไม่นำเข้าทุกแถวที่ซ้ำ</div>
                <div className="text-[10px] text-slate-500">ข้ามแถวที่ตรงกับฐานข้อมูลเดิมหรือในไฟล์</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onExcludeErrors();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-800 rounded-lg flex items-center gap-2.5 transition-colors"
            >
              <FaBan className="text-rose-600 text-sm shrink-0" />
              <div>
                <div className="font-semibold text-rose-700">ไม่นำเข้าทุกแถวที่ยังต้องแก้</div>
                <div className="text-[10px] text-slate-500">ยกเว้นแถวที่ข้อมูลไม่ครบถ้วนทั้งหมด</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Submodal for Batch Date */}
      {activeSubModal === 'date' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 w-full max-w-md space-y-4 animate-in fade-in zoom-in-95">
            <div>
              <h4 className="text-base font-bold text-slate-900">กำหนดวันที่ให้ทุกแถวที่ว่าง</h4>
              <p className="text-xs text-slate-500 mt-1">
                จะมีผลเฉพาะ {count} แถวที่กำลังแสดง และยังไม่มีการระบุวันที่เริ่มต้น/สิ้นสุด
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">วันที่เริ่มต้นดำเนินการ</label>
                <DatePicker
                  value={batchStartDate}
                  onChange={(_, dateStr) => setBatchStartDate(dateStr)}
                  placeholder="เลือกวันที่เริ่มต้น (พ.ศ.)..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">วันที่สิ้นสุดดำเนินการ</label>
                <DatePicker
                  value={batchEndDate}
                  onChange={(_, dateStr) => setBatchEndDate(dateStr)}
                  placeholder="เลือกวันที่สิ้นสุด (พ.ศ.)..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveSubModal(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={!batchStartDate || !batchEndDate}
                onClick={() => {
                  onApplyBatchDate(batchStartDate, batchEndDate);
                  setActiveSubModal(null);
                  setBatchStartDate('');
                  setBatchEndDate('');
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
              >
                ปรับใช้ข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submodal for Batch Department */}
      {activeSubModal === 'dept' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 w-full max-w-md space-y-4 animate-in fade-in zoom-in-95">
            <div>
              <h4 className="text-base font-bold text-slate-900">กำหนดสังกัดให้ทุกแถวที่ว่าง</h4>
              <p className="text-xs text-slate-500 mt-1">
                จะมีผลเฉพาะ {count} แถวที่กำลังแสดง และยังไม่มีการระบุสังกัดภาควิชา
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">เลือกสังกัดภาควิชา/ศูนย์</label>
              <DepartmentSelect
                value={batchDept}
                onChange={(code) => setBatchDept(code)}
                returnFormat="code"
                placeholder="-- เลือกสังกัดที่ต้องการ --"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveSubModal(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={!batchDept}
                onClick={() => {
                  onApplyBatchDepartment(batchDept);
                  setActiveSubModal(null);
                  setBatchDept('');
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
              >
                ปรับใช้ข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

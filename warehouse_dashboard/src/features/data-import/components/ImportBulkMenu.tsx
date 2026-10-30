'use client';

import React, { useState, useMemo } from 'react';
import {
  FaMagic,
  FaChevronDown,
  FaCalendarAlt,
  FaBuilding,
  FaBan,
  FaUndo,
  FaCheck,
  FaArrowLeft,
  FaClock,
} from 'react-icons/fa';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { DatePicker } from '@/components/ui/date-picker';
import { DEPARTMENTS as CANONICAL_DEPTS } from '@/lib/departments';
import { ImportRow, ImportRowData } from '../types';
import { deriveSheetMonthDateRange } from '../etl/importEtl';

export interface ImportBulkMenuProps {
  visibleRows: ImportRow[];
  onBulkApplyData: (
    targetRowIds: Set<string>,
    updater: (row: ImportRow) => Partial<ImportRowData> | null,
    actionDescription?: string
  ) => number;
  onBulkSetExcluded: (
    targetRowIds: Set<string>,
    excluded: boolean,
    actionDescription?: string
  ) => number;
}

type BulkCommandType =
  | 'menu'
  | 'fill_dept'
  | 'fill_fiscal_year'
  | 'fill_dates'
  | 'fill_sheet_dates'
  | 'exclude_duplicates'
  | 'exclude_errors'
  | 'restore_excluded';

export const ImportBulkMenu: React.FC<ImportBulkMenuProps> = ({
  visibleRows,
  onBulkApplyData,
  onBulkSetExcluded,
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<BulkCommandType>('menu');

  // Form states for bulk actions
  const [selectedDept, setSelectedDept] = useState<string>(CANONICAL_DEPTS[0]?.code || 'CPE');
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<number>(2568);
  const [overwriteFiscalYear, setOverwriteFiscalYear] = useState<boolean>(false);
  const [bulkStartDate, setBulkStartDate] = useState<string>('');
  const [bulkEndDate, setBulkEndDate] = useState<string>('');

  const resetMenu = () => {
    setStep('menu');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setStep('menu');
    }
  };

  // Candidate row sets in visibleRows
  const emptyDeptRows = useMemo(
    () =>
      visibleRows.filter(
        (r) => !r.excluded && (!r.data.department_code || !r.data.department_code.trim())
      ),
    [visibleRows]
  );

  const fiscalYearTargetRows = useMemo(
    () =>
      visibleRows.filter((r) => {
        if (r.excluded) return false;
        if (overwriteFiscalYear) return r.data.fiscal_year !== selectedFiscalYear;
        return !r.data.fiscal_year;
      }),
    [visibleRows, overwriteFiscalYear, selectedFiscalYear]
  );

  const emptyDateRows = useMemo(
    () => visibleRows.filter((r) => !r.excluded && (!r.data.start_date || !r.data.end_date)),
    [visibleRows]
  );

  const sheetMonthDateRows = useMemo(
    () =>
      visibleRows.filter(
        (r) =>
          !r.excluded &&
          (!r.data.start_date || !r.data.end_date) &&
          deriveSheetMonthDateRange(r.sheetName) !== null
      ),
    [visibleRows]
  );

  const duplicateRows = useMemo(
    () => visibleRows.filter((r) => !r.excluded && r.status === 'duplicate'),
    [visibleRows]
  );

  const errorRows = useMemo(
    () => visibleRows.filter((r) => !r.excluded && r.status === 'error'),
    [visibleRows]
  );

  const excludedRows = useMemo(
    () => visibleRows.filter((r) => r.excluded),
    [visibleRows]
  );

  // Confirm handlers
  const handleConfirmFillDept = () => {
    if (!selectedDept || emptyDeptRows.length === 0) return;
    const ids = new Set(emptyDeptRows.map((r) => r.rowId));
    onBulkApplyData(
      ids,
      (row) => {
        if (!row.data.department_code || !row.data.department_code.trim()) {
          return { department_code: selectedDept };
        }
        return null;
      },
      `เติมภาควิชา ${selectedDept} แล้ว ${ids.size} แถว`
    );
    handleOpenChange(false);
  };

  const handleConfirmFillFiscalYear = () => {
    if (!selectedFiscalYear || fiscalYearTargetRows.length === 0) return;
    const ids = new Set(fiscalYearTargetRows.map((r) => r.rowId));
    onBulkApplyData(
      ids,
      () => ({ fiscal_year: selectedFiscalYear }),
      `ตั้งค่าปีงบประมาณ พ.ศ. ${selectedFiscalYear} แล้ว ${ids.size} แถว`
    );
    handleOpenChange(false);
  };

  const handleConfirmFillDates = () => {
    if ((!bulkStartDate && !bulkEndDate) || emptyDateRows.length === 0) return;
    if (bulkStartDate && bulkEndDate && bulkEndDate < bulkStartDate) return;
    const ids = new Set(emptyDateRows.map((r) => r.rowId));
    onBulkApplyData(
      ids,
      (row) => {
        const next: Partial<ImportRowData> = {};
        if (!row.data.start_date && bulkStartDate) next.start_date = bulkStartDate;
        if (!row.data.end_date && bulkEndDate) next.end_date = bulkEndDate;
        return Object.keys(next).length > 0 ? next : null;
      },
      `เติมวันเริ่ม–สิ้นสุดแล้ว ${ids.size} แถว`
    );
    handleOpenChange(false);
  };

  const handleConfirmSheetDates = () => {
    if (sheetMonthDateRows.length === 0) return;
    const ids = new Set(sheetMonthDateRows.map((r) => r.rowId));
    onBulkApplyData(
      ids,
      (row) => {
        const range = deriveSheetMonthDateRange(row.sheetName);
        if (!range) return null;
        return {
          start_date: row.data.start_date || range.startDate,
          end_date: row.data.end_date || range.endDate,
        };
      },
      `เติมวันที่ตามเดือนของชีตแล้ว ${ids.size} แถว`
    );
    handleOpenChange(false);
  };

  const handleConfirmExcludeDuplicates = () => {
    if (duplicateRows.length === 0) return;
    const ids = new Set(duplicateRows.map((r) => r.rowId));
    onBulkSetExcluded(ids, true, `ไม่นำเข้าแถวซ้ำ ${ids.size} แถวแล้ว`);
    handleOpenChange(false);
  };

  const handleConfirmExcludeErrors = () => {
    if (errorRows.length === 0) return;
    const ids = new Set(errorRows.map((r) => r.rowId));
    onBulkSetExcluded(ids, true, `ไม่นำเข้าแถวที่ต้องแก้ ${ids.size} แถวแล้ว`);
    handleOpenChange(false);
  };

  const handleConfirmRestoreExcluded = () => {
    if (excludedRows.length === 0) return;
    const ids = new Set(excludedRows.map((r) => r.rowId));
    onBulkSetExcluded(ids, false, `คืนค่า ${ids.size} แถวกลับมาพร้อมนำเข้าแล้ว`);
    handleOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        type="button"
        className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.5rem] rounded-[0.625rem] border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800 text-[0.75rem] font-bold transition-colors cursor-pointer shrink-0"
      >
        <FaMagic className="text-emerald-600 text-[0.75rem]" />
        <span>แก้ไขหลายแถว</span>
        <FaChevronDown className="text-[0.625rem] opacity-70" />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[min(22rem,92vw)] p-[0.875rem] rounded-[0.875rem] bg-white border border-slate-200 shadow-xl text-slate-800"
      >
        {step === 'menu' && (
          <div className="space-y-[0.375rem]">
            <div className="pb-[0.375rem] mb-[0.25rem] border-b border-slate-100">
              <div className="text-[0.8125rem] font-bold text-slate-800">
                คำสั่งจัดการหลายแถว (จากรายการที่กรองอยู่ {visibleRows.length} แถว)
              </div>
              <div className="text-[0.6875rem] text-slate-500">
                เลือกคำสั่งเพื่อตรวจสอบจำนวนแถวก่อนยืนยัน
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('fill_dept')}
              className="w-full flex items-center justify-between gap-[0.5rem] px-[0.625rem] py-[0.5rem] rounded-[0.5rem] hover:bg-slate-50 text-left text-[0.75rem] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-[0.5rem] font-semibold text-slate-700">
                <FaBuilding className="text-emerald-600 shrink-0" />
                <span>เติมภาควิชาให้แถวที่ว่าง</span>
              </span>
              <span className="px-[0.375rem] py-[0.0625rem] rounded-full bg-slate-100 text-slate-600 font-bold text-[0.6875rem]">
                {emptyDeptRows.length} แถว
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOverwriteFiscalYear(
                  visibleRows.filter((r) => !r.excluded && !r.data.fiscal_year).length === 0
                );
                setStep('fill_fiscal_year');
              }}
              className="w-full flex items-center justify-between gap-[0.5rem] px-[0.625rem] py-[0.5rem] rounded-[0.5rem] hover:bg-slate-50 text-left text-[0.75rem] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-[0.5rem] font-semibold text-slate-700">
                <FaClock className="text-emerald-600 shrink-0" />
                <span>เติมปีงบประมาณให้แถวที่ว่าง</span>
              </span>
              <span className="px-[0.375rem] py-[0.0625rem] rounded-full bg-slate-100 text-slate-600 font-bold text-[0.6875rem]">
                เลือกปี
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStep('fill_dates')}
              className="w-full flex items-center justify-between gap-[0.5rem] px-[0.625rem] py-[0.5rem] rounded-[0.5rem] hover:bg-slate-50 text-left text-[0.75rem] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-[0.5rem] font-semibold text-slate-700">
                <FaCalendarAlt className="text-emerald-600 shrink-0" />
                <span>เติมวันเริ่ม–สิ้นสุดให้แถวที่ว่าง</span>
              </span>
              <span className="px-[0.375rem] py-[0.0625rem] rounded-full bg-slate-100 text-slate-600 font-bold text-[0.6875rem]">
                {emptyDateRows.length} แถว
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStep('fill_sheet_dates')}
              className="w-full flex items-center justify-between gap-[0.5rem] px-[0.625rem] py-[0.5rem] rounded-[0.5rem] hover:bg-slate-50 text-left text-[0.75rem] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-[0.5rem] font-semibold text-slate-700">
                <FaMagic className="text-emerald-600 shrink-0" />
                <span>เติมวันที่ตามเดือนของชีตให้แถวที่ว่าง</span>
              </span>
              <span className="px-[0.375rem] py-[0.0625rem] rounded-full bg-slate-100 text-slate-600 font-bold text-[0.6875rem]">
                {sheetMonthDateRows.length} แถว
              </span>
            </button>

            <div className="my-[0.25rem] border-t border-slate-100" />

            <button
              type="button"
              onClick={() => setStep('exclude_duplicates')}
              className="w-full flex items-center justify-between gap-[0.5rem] px-[0.625rem] py-[0.5rem] rounded-[0.5rem] hover:bg-purple-50 text-left text-[0.75rem] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-[0.5rem] font-semibold text-purple-700">
                <FaBan className="text-purple-600 shrink-0" />
                <span>ไม่นำเข้าแถวซ้ำทั้งหมด</span>
              </span>
              <span className="px-[0.375rem] py-[0.0625rem] rounded-full bg-purple-100 text-purple-700 font-bold text-[0.6875rem]">
                {duplicateRows.length} แถว
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStep('exclude_errors')}
              className="w-full flex items-center justify-between gap-[0.5rem] px-[0.625rem] py-[0.5rem] rounded-[0.5rem] hover:bg-rose-50 text-left text-[0.75rem] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-[0.5rem] font-semibold text-rose-700">
                <FaBan className="text-rose-600 shrink-0" />
                <span>ไม่นำเข้าแถวที่ต้องแก้ทั้งหมด</span>
              </span>
              <span className="px-[0.375rem] py-[0.0625rem] rounded-full bg-rose-100 text-rose-700 font-bold text-[0.6875rem]">
                {errorRows.length} แถว
              </span>
            </button>

            {excludedRows.length > 0 && (
              <button
                type="button"
                onClick={() => setStep('restore_excluded')}
                className="w-full flex items-center justify-between gap-[0.5rem] px-[0.625rem] py-[0.5rem] rounded-[0.5rem] hover:bg-emerald-50 text-left text-[0.75rem] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-[0.5rem] font-semibold text-emerald-700">
                  <FaUndo className="text-emerald-600 shrink-0" />
                  <span>คืนค่าแถวที่ยกเว้นกลับมาทั้งหมด</span>
                </span>
                <span className="px-[0.375rem] py-[0.0625rem] rounded-full bg-emerald-100 text-emerald-700 font-bold text-[0.6875rem]">
                  {excludedRows.length} แถว
                </span>
              </button>
            )}
          </div>
        )}

        {/* 1. Fill Department */}
        {step === 'fill_dept' && (
          <div className="space-y-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="p-[0.25rem] rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <FaArrowLeft className="text-[0.75rem]" />
              </button>
              <span className="text-[0.8125rem] font-bold text-slate-800">
                เติมภาควิชาให้แถวที่ว่าง
              </span>
            </div>

            <div className="space-y-[0.375rem]">
              <label className="block text-[0.75rem] font-semibold text-slate-600">
                เลือกภาควิชา/หน่วยงาน
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-[0.625rem] py-[0.4375rem] rounded-[0.5rem] border border-slate-200 text-[0.75rem] bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                {CANONICAL_DEPTS.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-[0.625rem] rounded-[0.5rem] bg-emerald-50 border border-emerald-200 text-[0.75rem] text-emerald-900">
              จะแก้ <strong>{emptyDeptRows.length} แถว</strong> (เฉพาะแถวที่ยังไม่มีภาควิชาในรายการที่แสดงอยู่)
            </div>

            <div className="flex items-center justify-end gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="px-[0.75rem] py-[0.375rem] rounded-[0.5rem] border border-slate-200 text-[0.75rem] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={emptyDeptRows.length === 0}
                onClick={handleConfirmFillDept}
                className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.375rem] rounded-[0.5rem] bg-[#00A651] hover:bg-[#008f45] text-white text-[0.75rem] font-bold disabled:opacity-40 cursor-pointer"
              >
                <FaCheck className="text-[0.6875rem]" />
                <span>ยืนยัน ({emptyDeptRows.length} แถว)</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Fill Fiscal Year */}
        {step === 'fill_fiscal_year' && (
          <div className="space-y-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="p-[0.25rem] rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <FaArrowLeft className="text-[0.75rem]" />
              </button>
              <span className="text-[0.8125rem] font-bold text-slate-800">
                เติมปีงบประมาณ (พ.ศ.)
              </span>
            </div>

            <div className="space-y-[0.375rem]">
              <label className="block text-[0.75rem] font-semibold text-slate-600">
                เลือกปีงบประมาณ พ.ศ.
              </label>
              <select
                value={selectedFiscalYear}
                onChange={(e) => setSelectedFiscalYear(Number(e.target.value))}
                className="w-full px-[0.625rem] py-[0.4375rem] rounded-[0.5rem] border border-slate-200 text-[0.75rem] bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                {[2569, 2568, 2567, 2566, 2565].map((y) => (
                  <option key={y} value={y}>
                    พ.ศ. {y}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-[0.5rem] text-[0.75rem] text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={overwriteFiscalYear}
                onChange={(e) => setOverwriteFiscalYear(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span>ใช้กับทุกแถวในรายการที่กรองอยู่</span>
            </label>

            <div className="p-[0.625rem] rounded-[0.5rem] bg-emerald-50 border border-emerald-200 text-[0.75rem] text-emerald-900">
              จะแก้ <strong>{fiscalYearTargetRows.length} แถว</strong> เป็นปีงบประมาณ พ.ศ.{' '}
              <strong>{selectedFiscalYear}</strong>
            </div>

            <div className="flex items-center justify-end gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="px-[0.75rem] py-[0.375rem] rounded-[0.5rem] border border-slate-200 text-[0.75rem] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={fiscalYearTargetRows.length === 0}
                onClick={handleConfirmFillFiscalYear}
                className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.375rem] rounded-[0.5rem] bg-[#00A651] hover:bg-[#008f45] text-white text-[0.75rem] font-bold disabled:opacity-40 cursor-pointer"
              >
                <FaCheck className="text-[0.6875rem]" />
                <span>ยืนยัน ({fiscalYearTargetRows.length} แถว)</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Fill Start & End Date */}
        {step === 'fill_dates' && (
          <div className="space-y-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="p-[0.25rem] rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <FaArrowLeft className="text-[0.75rem]" />
              </button>
              <span className="text-[0.8125rem] font-bold text-slate-800">
                เติมวันเริ่ม–สิ้นสุดให้แถวที่ว่าง
              </span>
            </div>

            <div className="space-y-[0.5rem]">
              <div>
                <label className="block text-[0.75rem] font-semibold text-slate-600 mb-[0.25rem]">
                  วันเริ่มต้น
                </label>
                <DatePicker
                  value={bulkStartDate}
                  onChange={(_, dateStr) => setBulkStartDate(dateStr)}
                  placeholder="เลือกวันเริ่มต้น"
                />
              </div>
              <div>
                <label className="block text-[0.75rem] font-semibold text-slate-600 mb-[0.25rem]">
                  วันสิ้นสุด
                </label>
                <DatePicker
                  value={bulkEndDate}
                  onChange={(_, dateStr) => setBulkEndDate(dateStr)}
                  placeholder="เลือกวันสิ้นสุด"
                />
              </div>
            </div>

            {bulkStartDate && bulkEndDate && bulkEndDate < bulkStartDate && (
              <div className="text-[0.75rem] text-rose-600 font-semibold">
                วันสิ้นสุดต้องไม่ก่อนวันเริ่มต้น
              </div>
            )}

            <div className="p-[0.625rem] rounded-[0.5rem] bg-emerald-50 border border-emerald-200 text-[0.75rem] text-emerald-900">
              จะแก้ <strong>{emptyDateRows.length} แถว</strong> (เฉพาะช่องวันที่ที่ยังว่างอยู่)
            </div>

            <div className="flex items-center justify-end gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="px-[0.75rem] py-[0.375rem] rounded-[0.5rem] border border-slate-200 text-[0.75rem] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={
                  emptyDateRows.length === 0 ||
                  (!bulkStartDate && !bulkEndDate) ||
                  Boolean(bulkStartDate && bulkEndDate && bulkEndDate < bulkStartDate)
                }
                onClick={handleConfirmFillDates}
                className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.375rem] rounded-[0.5rem] bg-[#00A651] hover:bg-[#008f45] text-white text-[0.75rem] font-bold disabled:opacity-40 cursor-pointer"
              >
                <FaCheck className="text-[0.6875rem]" />
                <span>ยืนยัน ({emptyDateRows.length} แถว)</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Fill Dates from Sheet Month */}
        {step === 'fill_sheet_dates' && (
          <div className="space-y-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="p-[0.25rem] rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <FaArrowLeft className="text-[0.75rem]" />
              </button>
              <span className="text-[0.8125rem] font-bold text-slate-800">
                เติมวันที่ตามเดือนของชีต
              </span>
            </div>

            <p className="text-[0.75rem] text-slate-600 leading-relaxed">
              ระบบจะกำหนดวันเริ่มต้นเป็นวันที่ 1 และวันสิ้นสุดเป็นวันสุดท้ายของเดือนตามชื่อชีตให้เฉพาะแถวที่ยังไม่มีวันที่
            </p>

            <div className="p-[0.625rem] rounded-[0.5rem] bg-emerald-50 border border-emerald-200 text-[0.75rem] text-emerald-900">
              จะแก้ <strong>{sheetMonthDateRows.length} แถว</strong>
            </div>

            <div className="flex items-center justify-end gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="px-[0.75rem] py-[0.375rem] rounded-[0.5rem] border border-slate-200 text-[0.75rem] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={sheetMonthDateRows.length === 0}
                onClick={handleConfirmSheetDates}
                className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.375rem] rounded-[0.5rem] bg-[#00A651] hover:bg-[#008f45] text-white text-[0.75rem] font-bold disabled:opacity-40 cursor-pointer"
              >
                <FaCheck className="text-[0.6875rem]" />
                <span>ยืนยัน ({sheetMonthDateRows.length} แถว)</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. Exclude Duplicates */}
        {step === 'exclude_duplicates' && (
          <div className="space-y-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="p-[0.25rem] rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <FaArrowLeft className="text-[0.75rem]" />
              </button>
              <span className="text-[0.8125rem] font-bold text-slate-800">
                ไม่นำเข้าแถวซ้ำทั้งหมด
              </span>
            </div>

            <div className="p-[0.625rem] rounded-[0.5rem] bg-purple-50 border border-purple-200 text-[0.75rem] text-purple-900">
              จะแก้ <strong>{duplicateRows.length} แถว</strong> ให้เป็นสถานะ &ldquo;ไม่นำเข้า&rdquo;
            </div>

            <div className="flex items-center justify-end gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="px-[0.75rem] py-[0.375rem] rounded-[0.5rem] border border-slate-200 text-[0.75rem] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={duplicateRows.length === 0}
                onClick={handleConfirmExcludeDuplicates}
                className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.375rem] rounded-[0.5rem] bg-purple-600 hover:bg-purple-700 text-white text-[0.75rem] font-bold disabled:opacity-40 cursor-pointer"
              >
                <FaCheck className="text-[0.6875rem]" />
                <span>ยืนยัน ({duplicateRows.length} แถว)</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. Exclude Errors */}
        {step === 'exclude_errors' && (
          <div className="space-y-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="p-[0.25rem] rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <FaArrowLeft className="text-[0.75rem]" />
              </button>
              <span className="text-[0.8125rem] font-bold text-slate-800">
                ไม่นำเข้าแถวที่ต้องแก้ทั้งหมด
              </span>
            </div>

            <div className="p-[0.625rem] rounded-[0.5rem] bg-rose-50 border border-rose-200 text-[0.75rem] text-rose-900">
              จะแก้ <strong>{errorRows.length} แถว</strong> ที่ข้อมูลไม่ครบให้เป็นสถานะ &ldquo;ไม่นำเข้า&rdquo;
            </div>

            <div className="flex items-center justify-end gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="px-[0.75rem] py-[0.375rem] rounded-[0.5rem] border border-slate-200 text-[0.75rem] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={errorRows.length === 0}
                onClick={handleConfirmExcludeErrors}
                className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.375rem] rounded-[0.5rem] bg-rose-600 hover:bg-rose-700 text-white text-[0.75rem] font-bold disabled:opacity-40 cursor-pointer"
              >
                <FaCheck className="text-[0.6875rem]" />
                <span>ยืนยัน ({errorRows.length} แถว)</span>
              </button>
            </div>
          </div>
        )}

        {/* 7. Restore Excluded */}
        {step === 'restore_excluded' && (
          <div className="space-y-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="p-[0.25rem] rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <FaArrowLeft className="text-[0.75rem]" />
              </button>
              <span className="text-[0.8125rem] font-bold text-slate-800">
                คืนค่าแถวที่ถูกยกเว้น
              </span>
            </div>

            <div className="p-[0.625rem] rounded-[0.5rem] bg-emerald-50 border border-emerald-200 text-[0.75rem] text-emerald-900">
              จะแก้ <strong>{excludedRows.length} แถว</strong> กลับมาคำนวณสถานะนำเข้าตามปกติ
            </div>

            <div className="flex items-center justify-end gap-[0.5rem]">
              <button
                type="button"
                onClick={resetMenu}
                className="px-[0.75rem] py-[0.375rem] rounded-[0.5rem] border border-slate-200 text-[0.75rem] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={excludedRows.length === 0}
                onClick={handleConfirmRestoreExcluded}
                className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.375rem] rounded-[0.5rem] bg-[#00A651] hover:bg-[#008f45] text-white text-[0.75rem] font-bold disabled:opacity-40 cursor-pointer"
              >
                <FaCheck className="text-[0.6875rem]" />
                <span>ยืนยัน ({excludedRows.length} แถว)</span>
              </button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

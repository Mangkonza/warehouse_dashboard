'use client';

import React, { useMemo } from 'react';
import { getStandardYearOptions } from '@/lib/fiscalYears';

export interface YearSelectDropdownProps {
  /** ค่าปีที่เลือกอยู่ เช่น '2569', '2568', '2567', หรือ 'all' (รองรับทั้ง string และ number) */
  value: string | number;
  /** Callback เมื่อผู้ใช้เปลี่ยนปี (ส่งค่าปี string เช่น '2569' หรือ 'all') */
  onChange: (year: string) => void;
  /** ข้อความป้ายกำกับด้านหน้า (ค่าเริ่มต้น: 'ปี') */
  label?: string;
  /** แสดงตัวเลือก 'ทั้งหมด' ('all') หรือไม่ (ค่าเริ่มต้น: true หากไม่ได้ระบุ excludeYear) */
  includeAll?: boolean;
  /** ข้อความสำหรับตัวเลือก 'all' (ค่าเริ่มต้น: 'ทั้งหมด') */
  allLabel?: string;
  /** ตำแหน่งของตัวเลือก 'all': 'top' หรือ 'bottom' (ค่าเริ่มต้น: 'top' เพื่อความสะดวกในการดูภาพรวม) */
  allPosition?: 'top' | 'bottom';
  /** ปีที่ต้องการซ่อนออกจากตัวเลือก (ใช้สำหรับ dropdown 'เทียบกับปี') */
  excludeYear?: string | number;
  /** แผนที่ระบุว่าปีใดมีข้อมูลหรือไม่ (สำหรับแสดง '(ไม่มีข้อมูล)' ต่อท้ายในโหมดเปรียบเทียบ) */
  hasDataByYear?: Record<string, boolean>;
  /** รูปแบบการแสดงผล:
   * - 'chart': ปุ่มเลือกปีมาตรฐานมุมขวาบนของการ์ดกราฟ (.rr-sel)
   * - 'capsule': ปุ่มเลือกปีในแคปซูลหน้า SDGs (ปี พ.ศ. และ ค.ศ.)
   * - 'select-only': แท็ก <select> มาตรฐานสำหรับใช้ในตารางหรือ Popover
   */
  variant?: 'chart' | 'capsule' | 'select-only';
  /** จำนวนปีย้อนหลังจากปีปัจจุบัน (ค่าเริ่มต้น: 2 = ปีปัจจุบัน + ย้อนหลัง 2 ปี รวม 3 ปี) */
  backYears?: number;
  /** แสดงปี ค.ศ. ในวงเล็บต่อท้ายหรือไม่ เช่น '2569 (2026)' */
  showCeYear?: boolean;
  /** คำนำหน้าตัวเลขปีในตัวเลือก เช่น 'ปี ' */
  yearPrefix?: string;
  className?: string;
  selectClassName?: string;
  ariaLabel?: string;
}

const CHEVRON_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center/14px`;

export function YearSelectDropdown({
  value,
  onChange,
  label = 'ปี',
  includeAll,
  allLabel,
  allPosition = 'top',
  excludeYear,
  hasDataByYear,
  variant = 'chart',
  backYears = 2,
  showCeYear,
  yearPrefix,
  className = '',
  selectClassName = '',
  ariaLabel,
}: YearSelectDropdownProps) {
  const standardYears = useMemo(() => getStandardYearOptions(backYears), [backYears]);

  const strVal = String(value ?? 'all');
  const strExclude = excludeYear !== undefined && excludeYear !== null ? String(excludeYear) : undefined;

  const shouldIncludeAll = includeAll !== undefined ? includeAll : !strExclude;
  const resolvedAllLabel =
    allLabel ?? (variant === 'capsule' ? 'ทุกปีงบประมาณ' : 'ทั้งหมด');
  const resolvedPrefix = yearPrefix ?? (variant === 'capsule' ? 'ปี ' : '');
  const resolvedShowCe = showCeYear ?? variant === 'capsule';

  const filteredYears = useMemo(() => {
    return standardYears.filter((y) => !strExclude || y !== strExclude);
  }, [standardYears, strExclude]);

  const isCustomValue =
    Boolean(strVal) &&
    strVal !== 'all' &&
    !filteredYears.includes(strVal) &&
    (!strExclude || strVal !== strExclude);

  const formatYearLabel = (y: string) => {
    const numY = Number(y);
    const cePart = resolvedShowCe && !isNaN(numY) ? ` (${numY - 543})` : '';
    const noDataPart =
      hasDataByYear && hasDataByYear[y] === false ? ' (ไม่มีข้อมูล)' : '';
    return `${resolvedPrefix}${y}${cePart}${noDataPart}`;
  };

  const renderOptions = () => (
    <>
      {shouldIncludeAll && allPosition === 'top' && (
        <option value="all">{resolvedAllLabel}</option>
      )}
      {filteredYears.map((y) => (
        <option key={y} value={y}>
          {formatYearLabel(y)}
        </option>
      ))}
      {isCustomValue && (
        <option key={strVal} value={strVal}>{formatYearLabel(strVal)}</option>
      )}
      {shouldIncludeAll && allPosition === 'bottom' && (
        <option value="all">{resolvedAllLabel}</option>
      )}
    </>
  );

  if (variant === 'capsule') {
    return (
      <select
        value={strVal}
        onChange={(e) => onChange(e.target.value)}
        className={
          selectClassName ||
          'bg-transparent border-0 rounded-full px-2.5 py-1 font-medium text-slate-800 hover:bg-slate-50 cursor-pointer focus:outline-none'
        }
        aria-label={ariaLabel || label || 'ปีงบประมาณ'}
      >
        {renderOptions()}
      </select>
    );
  }

  if (variant === 'select-only') {
    return (
      <select
        value={strVal}
        onChange={(e) => onChange(e.target.value)}
        className={selectClassName}
        aria-label={ariaLabel || label || 'ปีงบประมาณ'}
      >
        {renderOptions()}
      </select>
    );
  }

  return (
    <label
      className={`rr-sel ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 4px 4px 14px',
        borderRadius: '14px',
        background: 'var(--seg, #eef2f6)',
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--muted, #64748b)',
        userSelect: 'none',
      }}
    >
      <span>{label}</span>
      <select
        value={strVal}
        onChange={(e) => onChange(e.target.value)}
        className={selectClassName}
        aria-label={ariaLabel || label}
        style={{
          font: 'inherit',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--ink, #0f172a)',
          minHeight: '36px',
          padding: '6px 34px 6px 12px',
          border: 0,
          borderRadius: '10px',
          cursor: 'pointer',
          background: `var(--segon, #ffffff) ${CHEVRON_BG}`,
          WebkitAppearance: 'none',
          appearance: 'none',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.12)',
          outline: 'none',
        }}
      >
        {renderOptions()}
      </select>
    </label>
  );
}

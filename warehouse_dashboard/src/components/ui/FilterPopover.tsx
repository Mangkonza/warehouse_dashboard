'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FaFilter,
  FaTimes,
  FaUndo,
  FaChevronRight,
  FaSearch,
  FaCheck,
} from 'react-icons/fa';
import { DEPARTMENTS, DepartmentInfo, DepartmentGroup } from '@/lib/departments';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { DatePicker } from '@/components/ui/date-picker';
import { SDGTagSelector } from '@/app/(dashboard)/manage/_components/SDGTagSelector';
import { BlockSingleSelect, BlockSelectOption } from '@/components/ui/BlockSingleSelect';
import { EvaluationTag } from '@/components/ui/evaluation-tag';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------
export type EvalFramework = 'all' | 'i_am' | 'i_see';
export type ImageStatus = 'all' | 'has_image' | 'no_image';
export type Completeness = 'all' | 'complete' | 'incomplete';

export interface FilterState {
  departments: string[];
  deptCustomText?: string;
  dateFrom?: string;
  dateTo?: string;
  numericRanges?: Record<string, [number | null, number | null]>;
  journals?: string[];
  role?: string;
  imageStatus?: ImageStatus;
  completeness?: Completeness;
  subFilter?: string;
  sdgs?: string[];
  framework?: EvalFramework;
  kpiStrategy?: string;
  kpiStatus?: string;
}

export interface NumericFieldDef {
  key: string;
  label: string;
  stops: number[];
  unit?: string;
}

export interface FilterPopoverProps {
  category: string;
  categoryTitle?: string;
  totalCount?: number;
  matchCount?: number;
  filters: FilterState;
  onApply: (newFilters: FilterState) => void;
  onReset: () => void;
  hideNumericRanges?: boolean;
  align?: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

type FlyoutTab =
  | 'department'
  | 'dates'
  | 'budget'
  | 'evaluation'
  | 'journals'
  | 'personnel_role'
  | 'personnel_status'
  | null;

// ---------------------------------------------------------------------------
// Constants & Scales
// ---------------------------------------------------------------------------
const M = [0, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7, 5e7, 1e8];
const H = [0, 5, 10, 20, 50, 100, 200, 500, 1000];
const P = [0, 10, 25, 50, 100, 250, 500, 1000, 5000];

export const CATEGORY_NUMERIC_FIELDS: Record<string, { section: string; fields: NumericFieldDef[] }> = {
  research: {
    section: 'งบประมาณ',
    fields: [
      { key: 'budget_internal', label: 'งบประมาณภายใน (บาท)', stops: M, unit: 'บาท' },
      { key: 'budget_external', label: 'งบประมาณภายนอก (บาท)', stops: M, unit: 'บาท' },
    ],
  },
  academic: {
    section: 'งบประมาณและชั่วโมง',
    fields: [
      { key: 'budget', label: 'งบประมาณ (บาท)', stops: M, unit: 'บาท' },
      { key: 'hours', label: 'จำนวนชั่วโมง', stops: H, unit: 'ชม.' },
    ],
  },
  service: {
    section: 'งบประมาณและผู้เข้าร่วม',
    fields: [
      { key: 'budget', label: 'งบประมาณ (บาท)', stops: M, unit: 'บาท' },
      { key: 'participants', label: 'จำนวนผู้เข้าร่วม (คน)', stops: P, unit: 'คน' },
    ],
  },
  publications: {
    section: 'ข้อมูลตีพิมพ์',
    fields: [
      { key: 'impact_factor', label: 'Impact Factor', stops: [0, 1, 2, 5, 10, 20, 50], unit: '' },
    ],
  },
  ip: {
    section: 'ค่าใช้จ่ายสิทธิบัตร',
    fields: [
      { key: 'budget', label: 'ค่าใช้จ่าย (บาท)', stops: M, unit: 'บาท' },
    ],
  },
};

const JOURNALS_OPTIONS: BlockSelectOption[] = [
  { label: 'Q1', value: 'Q1' },
  { label: 'Q2', value: 'Q2' },
  { label: 'Q3', value: 'Q3' },
  { label: 'Q4', value: 'Q4' },
  { label: 'TCI 1', value: 'TCI 1' },
  { label: 'TCI 2', value: 'TCI 2' },
  { label: 'TCI 3', value: 'TCI 3' },
];

const ROLES_LIST = [
  { val: '', label: 'ทั้งหมด' },
  { val: 'อาจารย์', label: 'อาจารย์' },
  { val: 'นักวิจัย', label: 'นักวิจัย' },
  { val: 'เจ้าหน้าที่', label: 'เจ้าหน้าที่' },
  { val: 'ผู้บริหาร', label: 'ผู้บริหาร' },
];

function posToVal(stops: number[], pos: number): number {
  if (pos <= 0) return stops[0];
  if (pos >= 1000) return stops[stops.length - 1];
  const segs = stops.length - 1;
  const segIdx = Math.min(Math.floor((pos / 1000) * segs), segs - 1);
  const frac = (pos / 1000) * segs - segIdx;
  return Math.round(stops[segIdx] + frac * (stops[segIdx + 1] - stops[segIdx]));
}

function valToPos(stops: number[], val: number): number {
  if (val <= stops[0]) return 0;
  if (val >= stops[stops.length - 1]) return 1000;
  const segs = stops.length - 1;
  for (let i = 0; i < segs; i++) {
    if (val <= stops[i + 1]) {
      const frac = (val - stops[i]) / (stops[i + 1] - stops[i]);
      return Math.round(((i + frac) / segs) * 1000);
    }
  }
  return 1000;
}

function formatNumberAbbr(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1)}K`;
  return n.toLocaleString();
}

function formatRangeText(min: number | null, max: number | null, unit: string = ''): string {
  if (min == null && max == null) return '';
  const u = unit ? ` ${unit}` : '';
  if (min != null && max != null) {
    return `${min.toLocaleString()} - ${max.toLocaleString()}${u}`;
  }
  if (min != null) return `≥ ${min.toLocaleString()}${u}`;
  if (max != null) return `≤ ${max.toLocaleString()}${u}`;
  return '';
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function FilterPopover({
  category,
  categoryTitle = 'ข้อมูล',
  totalCount,
  matchCount,
  filters,
  onApply,
  onReset,
  hideNumericRanges = false,
  align = 'left',
  className = '',
  style,
}: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFlyout, setActiveFlyout] = useState<FlyoutTab>(null);

  // Local draft state
  const [draft, setDraft] = useState<FilterState>({
    departments: filters.departments || [],
    deptCustomText: filters.deptCustomText || '',
    dateFrom: filters.dateFrom || '',
    dateTo: filters.dateTo || '',
    numericRanges: filters.numericRanges || {},
    journals: filters.journals || [],
    role: filters.role || '',
    imageStatus: filters.imageStatus || 'all',
    completeness: filters.completeness || 'all',
    subFilter: filters.subFilter || '',
    sdgs: filters.sdgs || [],
    framework: filters.framework || 'all',
  });

  const [deptSearch, setDeptSearch] = useState('');

  // Sync draft whenever popover opens or prop filters change
  useEffect(() => {
    if (isOpen) {
      setDraft({
        departments: filters.departments || [],
        deptCustomText: filters.deptCustomText || '',
        dateFrom: filters.dateFrom || '',
        dateTo: filters.dateTo || '',
        numericRanges: filters.numericRanges || {},
        journals: filters.journals || [],
        role: filters.role || '',
        imageStatus: filters.imageStatus || 'all',
        completeness: filters.completeness || 'all',
        subFilter: filters.subFilter || '',
        sdgs: filters.sdgs || [],
        framework: filters.framework || 'all',
      });
      setActiveFlyout(null);
      setDeptSearch('');
    }
  }, [isOpen, filters]);

  // Click outside listener
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!isOpen) return;
      const target = e.target as Node;
      // Don't close if clicking within datepicker calendar popovers or modals
      const isInsideDatePicker = (target as HTMLElement)?.closest?.('[data-radix-popper-content-wrapper], .rdp, .rdp-month');
      if (isInsideDatePicker) return;

      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        (!flyoutRef.current || !flyoutRef.current.contains(target)) &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Active filters count badge on the trigger button
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.departments && filters.departments.length > 0) count++;
    if (filters.deptCustomText) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.numericRanges) {
      const hasRanges = Object.values(filters.numericRanges).some(
        ([lo, hi]) => lo != null || hi != null
      );
      if (hasRanges) count++;
    }
    if (filters.journals && filters.journals.length > 0) count++;
    if (filters.role) count++;
    if (filters.imageStatus && filters.imageStatus !== 'all') count++;
    if (filters.completeness && filters.completeness !== 'all') count++;
    if (filters.subFilter) count++;
    if (filters.sdgs && filters.sdgs.length > 0) count++;
    if (filters.framework && filters.framework !== 'all') count++;
    return count;
  }, [filters]);

  const numericConfig = CATEGORY_NUMERIC_FIELDS[category];

  // Helper to toggle department
  const toggleDept = (code: string) => {
    setDraft((prev) => {
      const exists = prev.departments.includes(code);
      const next = exists
        ? prev.departments.filter((c) => c !== code)
        : [...prev.departments, code];
      return { ...prev, departments: next };
    });
  };

  // Helper to update numeric ranges
  const setNumericRange = (key: string, min: number | null, max: number | null) => {
    setDraft((prev) => ({
      ...prev,
      numericRanges: {
        ...(prev.numericRanges || {}),
        [key]: [min, max],
      },
    }));
  };

  // Filtered department list for flyout
  const filteredDepartments = useMemo(() => {
    const q = deptSearch.trim().toLowerCase();
    if (!q) return DEPARTMENTS;
    return DEPARTMENTS.filter(
      (d) =>
        d.code.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.group.toLowerCase().includes(q)
    );
  }, [deptSearch]);

  const deptGroups: DepartmentGroup[] = ['ภาควิชา', 'ศูนย์', 'สำนักงาน', 'อื่นๆ'];

  // Summary labels for main rows
  const budgetSummaryText = useMemo(() => {
    if (!numericConfig) return '';
    const parts: string[] = [];
    numericConfig.fields.forEach((f) => {
      const rng = draft.numericRanges?.[f.key];
      if (rng && (rng[0] != null || rng[1] != null)) {
        parts.push(formatRangeText(rng[0], rng[1], f.unit));
      }
    });
    return parts.join(', ');
  }, [numericConfig, draft.numericRanges]);

  const hasNumericActive = Boolean(budgetSummaryText);

  // SDGs handlers
  const handleSdgSelect = (selectedCodes: string[]) => {
    setDraft((prev) => ({ ...prev, sdgs: selectedCodes }));
  };

  // Journal toggle
  const toggleJournal = (j: string) => {
    setDraft((prev) => {
      const curr = prev.journals || [];
      const exists = curr.includes(j);
      const next = exists ? curr.filter((x) => x !== j) : [...curr, j];
      return { ...prev, journals: next };
    });
  };

  const handleApply = () => {
    onApply(draft);
    setIsOpen(false);
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const emptyState: FilterState = {
      departments: [],
      deptCustomText: '',
      dateFrom: '',
      dateTo: '',
      numericRanges: {},
      journals: [],
      role: '',
      imageStatus: 'all',
      completeness: 'all',
      subFilter: '',
      sdgs: [],
      framework: 'all',
    };
    setDraft(emptyState);
    setActiveFlyout(null);
    setDeptSearch('');
    if (onReset) {
      try {
        onReset();
      } catch (err) {
        console.warn('onReset error', err);
      }
    }
    onApply(emptyState);
    setIsOpen(false);
  };

  // Fixed width for right flyout window (fits widest content - SDGs 2 columns comfortably with no horizontal scroll)
  const flyoutWidth = '640px';

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={{ position: 'relative', zIndex: isOpen ? 90 : 10, ...style }}
    >
      {/* Scoped CSS to enforce strict normal font weight and dual-range slider thumb pointer events */}
      <style jsx global>{`
        .filter-scope-root * {
          font-weight: 400 !important;
        }
        .filter-range-track {
          position: relative;
          height: 24px;
        }
        .filter-range-input {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 24px;
          margin: 0;
          background: transparent;
          pointer-events: none;
          -webkit-appearance: none;
          appearance: none;
          z-index: 5;
        }
        .filter-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #00A651;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: transform 0.1s;
        }
        .filter-range-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .filter-range-input::-moz-range-thumb {
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #00A651;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
      `}</style>

      {/* 1. Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          height: '36px',
          boxSizing: 'border-box',
          backgroundColor: isOpen || activeCount > 0 ? '#f0fdf4' : '#ffffff',
          border: isOpen || activeCount > 0 ? '1px solid #00A651' : '1px solid #cbd5e1',
          borderRadius: '8px',
          color: isOpen || activeCount > 0 ? '#00A651' : '#334155',
          fontSize: '13px',
          fontWeight: 400,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.15s ease',
        }}
        title="เปิดตัวกรองข้อมูล"
      >
        <FaFilter style={{ fontSize: '12px', flexShrink: 0 }} />
        <span style={{ fontWeight: 400 }}>ตัวกรอง</span>
        {activeCount > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#00A651',
              color: '#ffffff',
              fontSize: '11px',
              borderRadius: '999px',
              padding: '0 6px',
              height: '18px',
              fontWeight: 400,
              marginLeft: '2px',
            }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* 2. Main Popover Container */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="ตัวกรองข้อมูล"
          className="filter-scope-root"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            ...(align === 'right' ? { right: 0 } : { left: 0 }),
            width: 'min(380px, calc(100vw - 32px))',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
            zIndex: 100,
            overflow: 'visible',
          }}
        >
          {/* Header: Matches Right Window (White background, green accent line, normal font weight, no white halo border) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 18px',
              borderBottom: '1px solid #f1f5f9',
              flexShrink: 0,
            }}
          >
            <span style={{ width: '4px', height: '16px', backgroundColor: '#00A651', borderRadius: '2px' }} />
            <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 400 }}>
              ตัวกรองข้อมูล: {categoryTitle}
            </span>
            <span style={{ flex: 1 }} />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="ปิด"
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '2px 6px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Rows List (แต่ละแถวกดแล้วเปิดหน้าต่างด้านข้างขวา) */}
          <div style={{ flex: 1, padding: 0 }}>
            {/* 1. สังกัดที่รับผิดชอบ */}
            <button
              type="button"
              onClick={() => setActiveFlyout(activeFlyout === 'department' ? null : 'department')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '12px 18px',
                border: 'none',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: activeFlyout === 'department' ? '#f0fbf5' : '#ffffff',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
            >
              <span style={{ flex: 1, fontSize: '13.5px', color: '#1f2937', fontWeight: 400 }}>
                สังกัดที่รับผิดชอบ
              </span>
              <span
                style={{
                  fontStyle: 'normal',
                  fontSize: '12.5px',
                  maxWidth: '50%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: draft.departments.length > 0 ? '#00A651' : '#6b7280',
                  fontWeight: 400,
                }}
              >
                {draft.departments.length > 0
                  ? draft.departments.map((c) => (c === 'OTH' ? 'อื่น ๆ' : c)).join(', ')
                  : 'ทั้งหมด'}
              </span>
              <FaChevronRight style={{ color: '#94a3b8', fontSize: '11px', flexShrink: 0 }} />
            </button>

            {/* 2. ช่วงเวลา */}
            <button
              type="button"
              onClick={() => setActiveFlyout(activeFlyout === 'dates' ? null : 'dates')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '12px 18px',
                border: 'none',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: activeFlyout === 'dates' ? '#f0fbf5' : '#ffffff',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
            >
              <span style={{ flex: 1, fontSize: '13.5px', color: '#1f2937', fontWeight: 400 }}>
                ช่วงเวลา
              </span>
              <span
                style={{
                  fontStyle: 'normal',
                  fontSize: '12.5px',
                  maxWidth: '50%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: draft.dateFrom || draft.dateTo ? '#00A651' : '#6b7280',
                  fontWeight: 400,
                }}
              >
                {draft.dateFrom && draft.dateTo
                  ? `${draft.dateFrom} - ${draft.dateTo}`
                  : draft.dateFrom
                  ? `ตั้งแต่ ${draft.dateFrom}`
                  : draft.dateTo
                  ? `ถึง ${draft.dateTo}`
                  : 'ทั้งหมด'}
              </span>
              <FaChevronRight style={{ color: '#94a3b8', fontSize: '11px', flexShrink: 0 }} />
            </button>

            {/* 3. งบประมาณ / ค่าตัวเลข */}
            {!hideNumericRanges && numericConfig && (
              <button
                type="button"
                onClick={() => setActiveFlyout(activeFlyout === 'budget' ? null : 'budget')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '12px 18px',
                  border: 'none',
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: activeFlyout === 'budget' ? '#f0fbf5' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
              >
                <span style={{ flex: 1, fontSize: '13.5px', color: '#1f2937', fontWeight: 400 }}>
                  {numericConfig.section}
                </span>
                <span
                  style={{
                    fontStyle: 'normal',
                    fontSize: '12.5px',
                    maxWidth: '50%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: hasNumericActive ? '#00A651' : '#6b7280',
                    fontWeight: 400,
                  }}
                >
                  {budgetSummaryText || 'ไม่จำกัด'}
                </span>
                <FaChevronRight style={{ color: '#94a3b8', fontSize: '11px', flexShrink: 0 }} />
              </button>
            )}

            {/* 4. การประเมิน (SDGs / Framework / Journals) */}
            <button
              type="button"
              onClick={() => setActiveFlyout(activeFlyout === 'evaluation' ? null : 'evaluation')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '12px 18px',
                border: 'none',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: activeFlyout === 'evaluation' ? '#f0fbf5' : '#ffffff',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
            >
              <span style={{ flex: 1, fontSize: '13.5px', color: '#1f2937', fontWeight: 400 }}>
                การประเมิน
              </span>
              <span
                style={{
                  fontStyle: 'normal',
                  fontSize: '12.5px',
                  maxWidth: '50%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color:
                    (draft.sdgs && draft.sdgs.length > 0) ||
                    (draft.framework && draft.framework !== 'all') ||
                    (draft.journals && draft.journals.length > 0)
                      ? '#00A651'
                      : '#6b7280',
                  fontWeight: 400,
                }}
              >
                {draft.sdgs && draft.sdgs.length > 0
                  ? `${draft.sdgs.length} SDGs`
                  : draft.framework && draft.framework !== 'all'
                  ? draft.framework === 'i_am'
                    ? 'I AM'
                    : 'I SEE'
                  : 'ทั้งหมด'}
              </span>
              <FaChevronRight style={{ color: '#94a3b8', fontSize: '11px', flexShrink: 0 }} />
            </button>

            {/* 5. Publications: กลุ่มวารสาร / คุณภาพ */}
            {category === 'publications' && (
              <button
                type="button"
                onClick={() => setActiveFlyout(activeFlyout === 'journals' ? null : 'journals')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '12px 18px',
                  border: 'none',
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: activeFlyout === 'journals' ? '#f0fbf5' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
              >
                <span style={{ flex: 1, fontSize: '13.5px', color: '#1f2937', fontWeight: 400 }}>
                  ระดับคุณภาพวารสาร (Q / TCI)
                </span>
                <span
                  style={{
                    fontStyle: 'normal',
                    fontSize: '12.5px',
                    maxWidth: '50%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: draft.journals && draft.journals.length > 0 ? '#00A651' : '#6b7280',
                    fontWeight: 400,
                  }}
                >
                  {draft.journals && draft.journals.length > 0
                    ? draft.journals.join(', ')
                    : 'ทั้งหมด'}
                </span>
                <FaChevronRight style={{ color: '#94a3b8', fontSize: '11px', flexShrink: 0 }} />
              </button>
            )}

            {/* 6. Personnel: ตำแหน่ง */}
            {category === 'personnel' && (
              <button
                type="button"
                onClick={() => setActiveFlyout(activeFlyout === 'personnel_role' ? null : 'personnel_role')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '12px 18px',
                  border: 'none',
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: activeFlyout === 'personnel_role' ? '#f0fbf5' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
              >
                <span style={{ flex: 1, fontSize: '13.5px', color: '#1f2937', fontWeight: 400 }}>
                  บทบาท / ตำแหน่ง
                </span>
                <span
                  style={{
                    fontStyle: 'normal',
                    fontSize: '12.5px',
                    maxWidth: '50%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: draft.role ? '#00A651' : '#6b7280',
                    fontWeight: 400,
                  }}
                >
                  {ROLES_LIST.find((r) => r.val === draft.role)?.label || 'ทั้งหมด'}
                </span>
                <FaChevronRight style={{ color: '#94a3b8', fontSize: '11px', flexShrink: 0 }} />
              </button>
            )}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: '12px 18px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              backgroundColor: '#fafafa',
              borderRadius: '0 0 14px 14px',
            }}
          >
            <button
              type="button"
              onClick={handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#64748b',
                fontSize: '12.5px',
                fontWeight: 400,
                cursor: 'pointer',
              }}
            >
              <FaUndo style={{ fontSize: '10px' }} />
              <span style={{ fontWeight: 400 }}>ล้างค่า</span>
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              

              <button
                type="button"
                onClick={handleApply}
                style={{
                  border: 'none',
                  backgroundColor: '#00A651',
                  borderRadius: '8px',
                  padding: '6px 16px',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 400,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0, 166, 81, 0.25)',
                }}
              >
                <span style={{ fontWeight: 400 }}>ใช้งานตัวกรอง</span>
              </button>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* 3. Sub Flyout Window (หน้าต่างย่อยด้านข้างขวา - ทุกหน้าต่างขนาดเท่ากัน) */}
          {/* --------------------------------------------------------------- */}
          {activeFlyout && (
            <aside
              ref={flyoutRef}
              role="dialog"
              aria-label="ตัวกรองย่อย"
              className="filter-scope-root"
              style={{
                position: 'absolute',
                top: 0,
                left: 'calc(100% + 8px)',
                width: `min(${flyoutWidth}, calc(100vw - 32px))`,
                maxHeight: 'calc(85vh - 40px)',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
                zIndex: 110,
                overflowX: 'hidden',
              }}
            >
              {/* Flyout Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 18px',
                  borderBottom: '1px solid #f1f5f9',
                  flexShrink: 0,
                }}
              >
                <span style={{ width: '4px', height: '16px', backgroundColor: '#00A651', borderRadius: '2px' }} />
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 400 }}>
                  {activeFlyout === 'department' && 'สังกัดที่รับผิดชอบ'}
                  {activeFlyout === 'dates' && 'ช่วงเวลา'}
                  {activeFlyout === 'budget' && (numericConfig?.section || 'งบประมาณ')}
                  {activeFlyout === 'evaluation' && 'การประเมิน (SDGs / Framework)'}
                  {activeFlyout === 'journals' && 'ระดับคุณภาพวารสาร (Q / TCI)'}
                  {activeFlyout === 'personnel_role' && 'บทบาท / ตำแหน่ง'}
                </span>
                <span style={{ flex: 1 }} />
                <button
                  type="button"
                  onClick={() => setActiveFlyout(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    lineHeight: 1,
                  }}
                  title="ปิดหน้าต่างย่อย"
                >
                  ✕
                </button>
              </div>

              {/* Flyout Scrollable Body */}
              <div
                style={{
                  padding: '16px 18px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  flex: 1,
                }}
              >
                {/* ========================================================= */}
                {/* 1. สังกัดที่รับผิดชอบ (ใช้ DepartmentBadge ตามที่ร้องขอ) */}
                {/* ========================================================= */}
                {activeFlyout === 'department' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Search Input */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '6px 12px',
                      }}
                    >
                      <FaSearch style={{ color: '#94a3b8', marginRight: '8px', fontSize: '12px' }} />
                      <input
                        type="text"
                        placeholder="ค้นหาภาควิชา / สังกัด..."
                        value={deptSearch}
                        onChange={(e) => setDeptSearch(e.target.value)}
                        style={{
                          border: 'none',
                          background: 'none',
                          outline: 'none',
                          width: '100%',
                          fontSize: '12.5px',
                          color: '#1e293b',
                          fontWeight: 400,
                        }}
                      />
                      {deptSearch && (
                        <button
                          type="button"
                          onClick={() => setDeptSearch('')}
                          style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Selected Tags Display using DepartmentBadge */}
                    {draft.departments.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 400 }}>
                            เลือกแล้ว ({draft.departments.length} สังกัด)
                          </span>
                          <button
                            type="button"
                            onClick={() => setDraft((prev) => ({ ...prev, departments: [], deptCustomText: '' }))}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                              fontWeight: 400,
                            }}
                          >
                            ล้างสังกัดที่เลือก
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {draft.departments.map((code) => {
                            const dInfo = DEPARTMENTS.find((d) => d.code === code);
                            return (
                              <span
                                key={code}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '3px 8px 3px 4px',
                                  backgroundColor: '#f1f5f9',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 400,
                                }}
                              >
                                <DepartmentBadge value={code} showTooltip={false} />
                                <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 400 }}>
                                  {dInfo?.name || (code === 'OTH' ? 'อื่นๆ' : code)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleDept(code)}
                                  style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                                >
                                  ✕
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Department Groups List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {deptGroups.map((grp) => {
                        const itemsInGrp = filteredDepartments.filter((d) => d.group === grp);
                        if (itemsInGrp.length === 0) return null;

                        return (
                          <div key={grp}>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 400 }}>
                              {grp}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px' }}>
                              {itemsInGrp.map((d) => {
                                const isSelected = draft.departments.includes(d.code);
                                return (
                                  <button
                                    key={d.code}
                                    type="button"
                                    onClick={() => toggleDept(d.code)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      padding: '6px 10px',
                                      backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                                      border: isSelected ? '1px solid #00A651' : '1px solid #e2e8f0',
                                      borderRadius: '8px',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      transition: 'all 0.15s ease',
                                    }}
                                  >
                                    <DepartmentBadge value={d.code} showTooltip={false} />
                                    <span
                                      style={{
                                        flex: 1,
                                        fontSize: '12.5px',
                                        color: '#334155',
                                        fontWeight: 400,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                      title={d.name}
                                    >
                                      {d.name}
                                    </span>
                                    {isSelected && <FaCheck style={{ color: '#00A651', fontSize: '11px', flexShrink: 0 }} />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* OTH Custom Input */}
                    {draft.departments.includes('OTH') && (
                      <div style={{ marginTop: '8px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', marginBottom: '4px', fontWeight: 400 }}>
                          ระบุชื่อสังกัด / ภาควิชาอื่น ๆ:
                        </label>
                        <input
                          type="text"
                          value={draft.deptCustomText || ''}
                          onChange={(e) => setDraft((prev) => ({ ...prev, deptCustomText: e.target.value }))}
                          placeholder="พิมพ์ชื่อสังกัด..."
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12.5px',
                            color: '#1e293b',
                            boxSizing: 'border-box',
                            fontWeight: 400,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================================= */}
                {/* 2. ช่วงเวลา (แค่ ตั้งแต่วันที่ ถึงวันที่ ใช้ DatePicker พ.ศ.) */}
                {/* ========================================================= */}
                {activeFlyout === 'dates' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 400 }}>
                      เลือกช่วงวันที่เริ่มต้นและสิ้นสุด (ปฏิทิน พ.ศ.)
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '6px', fontWeight: 400 }}>
                          ตั้งแต่วันที่
                        </label>
                        <DatePicker
                          value={draft.dateFrom || ''}
                          onChange={(_d, dateStr) => setDraft((prev) => ({ ...prev, dateFrom: dateStr }))}
                          placeholder="ตั้งแต่วันที่ (พ.ศ.)"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '6px', fontWeight: 400 }}>
                          ถึงวันที่
                        </label>
                        <DatePicker
                          value={draft.dateTo || ''}
                          onChange={(_d, dateStr) => setDraft((prev) => ({ ...prev, dateTo: dateStr }))}
                          placeholder="ถึงวันที่ (พ.ศ.)"
                        />
                      </div>
                    </div>

                    {(draft.dateFrom || draft.dateTo) && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setDraft((prev) => ({ ...prev, dateFrom: '', dateTo: '' }))}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 400,
                          }}
                        >
                          ล้างช่วงเวลา
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================================= */}
                {/* 3. แถบตัวเลข / งบประมาณ (ลากกลมๆ ได้จริง + 2 บล็อกพิมพ์) */}
                {/* ========================================================= */}
                {activeFlyout === 'budget' && numericConfig && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {numericConfig.fields.map((f) => {
                      const rng = draft.numericRanges?.[f.key] || [null, null];
                      const [minVal, maxVal] = rng;
                      const s = f.stops;
                      const posLo = minVal == null ? 0 : valToPos(s, minVal);
                      const posHi = maxVal == null ? 1000 : valToPos(s, maxVal);

                      return (
                        <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#1f2937', fontWeight: 400 }}>
                            <span>{f.label}</span>
                            <span style={{ color: '#00A651', fontWeight: 400 }}>
                              {formatRangeText(minVal, maxVal, f.unit) || 'ไม่จำกัด'}
                            </span>
                          </div>

                          {/* 2 ช่องพิมพ์: ต่ำสุด และ สูงสุด */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '3px', fontWeight: 400 }}>
                                ต่ำสุด {f.unit ? `(${f.unit})` : ''}
                              </label>
                              <input
                                type="number"
                                placeholder="0"
                                value={minVal ?? ''}
                                onChange={(e) => {
                                  const v = e.target.value === '' ? null : Number(e.target.value);
                                  setNumericRange(f.key, v, maxVal);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '7px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  fontSize: '12.5px',
                                  color: '#1e293b',
                                  boxSizing: 'border-box',
                                  fontWeight: 400,
                                }}
                              />
                            </div>
                            <span style={{ color: '#94a3b8', marginTop: '16px', fontWeight: 400 }}>–</span>
                            <div style={{ flex: 1 }}>
                              <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '3px', fontWeight: 400 }}>
                                สูงสุด {f.unit ? `(${f.unit})` : ''}
                              </label>
                              <input
                                type="number"
                                placeholder="ไม่จำกัด"
                                value={maxVal ?? ''}
                                onChange={(e) => {
                                  const v = e.target.value === '' ? null : Number(e.target.value);
                                  setNumericRange(f.key, minVal, v);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '7px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  fontSize: '12.5px',
                                  color: '#1e293b',
                                  boxSizing: 'border-box',
                                  fontWeight: 400,
                                }}
                              />
                            </div>
                          </div>

                          {/* Interactive Dual-Range Track (ลากกลม ๆ บนเส้นได้จริง) */}
                          <div className="filter-range-track">
                            <div
                              style={{
                                position: 'absolute',
                                top: '10px',
                                left: 0,
                                right: 0,
                                height: '4px',
                                backgroundColor: '#e2e8f0',
                                borderRadius: '4px',
                              }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                top: '10px',
                                left: `${posLo / 10}%`,
                                right: `${100 - posHi / 10}%`,
                                height: '4px',
                                backgroundColor: '#00A651',
                                borderRadius: '4px',
                              }}
                            />
                            <input
                              type="range"
                              min="0"
                              max="1000"
                              value={posLo}
                              onChange={(e) => {
                                const p = Math.min(+e.target.value, posHi - 15);
                                setNumericRange(f.key, p <= 0 ? null : posToVal(s, p), maxVal);
                              }}
                              className="filter-range-input"
                              aria-label="ค่าต่ำสุด"
                            />
                            <input
                              type="range"
                              min="0"
                              max="1000"
                              value={posHi}
                              onChange={(e) => {
                                const p = Math.max(+e.target.value, posLo + 15);
                                setNumericRange(f.key, minVal, p >= 1000 ? null : posToVal(s, p));
                              }}
                              className="filter-range-input"
                              aria-label="ค่าสูงสุด"
                            />
                          </div>

                          {/* Presets */}
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => setNumericRange(f.key, null, s[4])}
                              style={{
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#fff',
                                color: '#475569',
                                borderRadius: '999px',
                                padding: '2px 8px',
                                fontSize: '11px',
                                fontWeight: 400,
                                cursor: 'pointer',
                              }}
                            >
                              ≤ {formatNumberAbbr(s[4])}
                            </button>
                            <button
                              type="button"
                              onClick={() => setNumericRange(f.key, s[4], s[6])}
                              style={{
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#fff',
                                color: '#475569',
                                borderRadius: '999px',
                                padding: '2px 8px',
                                fontSize: '11px',
                                fontWeight: 400,
                                cursor: 'pointer',
                              }}
                            >
                              {formatNumberAbbr(s[4])} - {formatNumberAbbr(s[6])}
                            </button>
                            <button
                              type="button"
                              onClick={() => setNumericRange(f.key, s[6], null)}
                              style={{
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#fff',
                                color: '#475569',
                                borderRadius: '999px',
                                padding: '2px 8px',
                                fontSize: '11px',
                                fontWeight: 400,
                                cursor: 'pointer',
                              }}
                            >
                              ≥ {formatNumberAbbr(s[6])}
                            </button>
                            {(minVal != null || maxVal != null) && (
                              <button
                                type="button"
                                onClick={() => setNumericRange(f.key, null, null)}
                                style={{
                                  border: '1px dashed #cbd5e1',
                                  backgroundColor: '#fff',
                                  color: '#ef4444',
                                  borderRadius: '999px',
                                  padding: '2px 8px',
                                  fontSize: '11px',
                                  fontWeight: 400,
                                  cursor: 'pointer',
                                }}
                              >
                                ล้างค่า
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ========================================================= */}
                {/* 4. การประเมิน (SDGs, I AM / I SEE, Q / TCI ใช้ shared components) */}
                {/* ========================================================= */}
                {activeFlyout === 'evaluation' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* SDGs 1-17 Grid using SDGTagSelector (variant="evaluation") */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <SDGTagSelector
                        selectedSDGs={draft.sdgs || []}
                        onChange={handleSdgSelect}
                        variant="evaluation"
                      />
                    </div>

                    {/* Framework I AM / I SEE */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#1f2937', fontWeight: 400 }}>
                          กรอบการประเมิน
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 400 }}>
                          เลือกได้ 1 รายการ
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setDraft((prev) => ({ ...prev, framework: 'all' }))}
                          style={{
                            padding: '7px 18px',
                            borderRadius: '8px',
                            border: draft.framework === 'all' || !draft.framework ? '1px solid #1e293b' : '1px solid #cbd5e1',
                            backgroundColor: draft.framework === 'all' || !draft.framework ? '#1e293b' : '#ffffff',
                            color: draft.framework === 'all' || !draft.framework ? '#ffffff' : '#334155',
                            fontSize: '12.5px',
                            fontWeight: 400,
                            cursor: 'pointer',
                          }}
                        >
                          ทั้งหมด
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              framework: prev.framework === 'i_am' ? 'all' : 'i_am',
                            }))
                          }
                          style={{
                            padding: '7px 18px',
                            borderRadius: '8px',
                            border: draft.framework === 'i_am' ? '1px solid #7c2d12' : '1px solid #cbd5e1',
                            backgroundColor: draft.framework === 'i_am' ? '#7c2d12' : '#ffffff',
                            color: draft.framework === 'i_am' ? '#ffffff' : '#334155',
                            fontSize: '12.5px',
                            fontWeight: 400,
                            cursor: 'pointer',
                          }}
                        >
                          I AM
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              framework: prev.framework === 'i_see' ? 'all' : 'i_see',
                            }))
                          }
                          style={{
                            padding: '7px 18px',
                            borderRadius: '8px',
                            border: draft.framework === 'i_see' ? '1px solid #064e3b' : '1px solid #cbd5e1',
                            backgroundColor: draft.framework === 'i_see' ? '#064e3b' : '#ffffff',
                            color: draft.framework === 'i_see' ? '#ffffff' : '#334155',
                            fontSize: '12.5px',
                            fontWeight: 400,
                            cursor: 'pointer',
                          }}
                        >
                          I SEE
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 5. ระดับคุณภาพวารสาร (Q / TCI) */}
                {/* ========================================================= */}
                {activeFlyout === 'journals' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 400 }}>
                      เลือกระดับคุณภาพวารสาร (เลือกได้หลายรายการ)
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {JOURNALS_OPTIONS.map((opt) => {
                        const isSelected = (draft.journals || []).includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => toggleJournal(opt.value)}
                            style={{
                              padding: '7px 16px',
                              borderRadius: '8px',
                              border: isSelected ? '1px solid #00A651' : '1px solid #cbd5e1',
                              backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                              color: isSelected ? '#00A651' : '#334155',
                              fontSize: '12.5px',
                              fontWeight: 400,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span style={{ fontWeight: 400 }}>{opt.label}</span>
                            {isSelected && <FaCheck style={{ fontSize: '10px' }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 6. Personnel Role */}
                {/* ========================================================= */}
                {activeFlyout === 'personnel_role' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px', fontWeight: 400 }}>
                      เลือกตำแหน่งหรือบทบาท
                    </div>
                    {ROLES_LIST.map((r) => {
                      const isSelected = draft.role === r.val;
                      return (
                        <button
                          key={r.val}
                          type="button"
                          onClick={() => setDraft((prev) => ({ ...prev, role: r.val }))}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: isSelected ? '1px solid #00A651' : '1px solid #e2e8f0',
                            backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                            color: isSelected ? '#00A651' : '#334155',
                            fontSize: '13px',
                            fontWeight: 400,
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ fontWeight: 400 }}>{r.label}</span>
                          {isSelected && <FaCheck style={{ fontSize: '11px' }} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterPopover;


// Companion Component: ActiveFilterChips
// ---------------------------------------------------------------------------
export interface ActiveFilterChipsProps {
  filters: FilterState;
  onRemove: (key: keyof FilterState, extra?: any) => void;
  onClearAll: () => void;
  category?: string;
  hideNumericRanges?: boolean;
  className?: string;
}

export function ActiveFilterChips({
  filters,
  onRemove,
  onClearAll,
  category = '',
  hideNumericRanges = false,
  className = '',
}: ActiveFilterChipsProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  // 1. Departments
  if (filters.departments && filters.departments.length > 0) {
    chips.push({
      label: `สังกัด: ${filters.departments.map((c) => (c === 'OTH' && filters.deptCustomText ? `อื่นๆ (${filters.deptCustomText})` : c)).join(', ')}`,
      onRemove: () => onRemove('departments'),
    });
  }

  // 2. Dates
  if (filters.dateFrom && filters.dateTo) {
    chips.push({
      label: `ช่วงเวลา: ${filters.dateFrom} - ${filters.dateTo}`,
      onRemove: () => {
        onRemove('dateFrom');
        onRemove('dateTo');
      },
    });
  } else if (filters.dateFrom) {
    chips.push({
      label: `ตั้งแต่: ${filters.dateFrom}`,
      onRemove: () => onRemove('dateFrom'),
    });
  } else if (filters.dateTo) {
    chips.push({
      label: `ถึง: ${filters.dateTo}`,
      onRemove: () => onRemove('dateTo'),
    });
  }

  // 3. Numeric Ranges
  if (!hideNumericRanges && filters.numericRanges) {
    const numConf = CATEGORY_NUMERIC_FIELDS[category];
    Object.entries(filters.numericRanges).forEach(([fKey, [min, max]]) => {
      if (min != null || max != null) {
        const fieldDef = numConf?.fields.find((f) => f.key === fKey);
        const fLabel = fieldDef?.label.replace(/ \(.+\)/, '') || fKey;
        chips.push({
          label: `${fLabel}: ${formatRangeText(min, max, fieldDef?.unit)}`,
          onRemove: () => onRemove('numericRanges', fKey),
        });
      }
    });
  }

  // 4. Journals
  if (filters.journals && filters.journals.length > 0) {
    chips.push({
      label: `วารสาร: ${filters.journals.join(', ')}`,
      onRemove: () => onRemove('journals'),
    });
  }

  // 5. Role
  if (filters.role) {
    chips.push({
      label: `บทบาท: ${filters.role}`,
      onRemove: () => onRemove('role'),
    });
  }

  // 6. Completeness
  if (filters.completeness && filters.completeness !== 'all') {
    chips.push({
      label: `ข้อมูล: ${filters.completeness === 'complete' ? 'สมบูรณ์' : 'ไม่สมบูรณ์'}`,
      onRemove: () => onRemove('completeness'),
    });
  }

  // 7. SDGs
  if (filters.sdgs && filters.sdgs.length > 0) {
    chips.push({
      label: `SDGs: ${filters.sdgs.join(', ')}`,
      onRemove: () => onRemove('sdgs'),
    });
  }

  // 8. Framework
  if (filters.framework && filters.framework !== 'all') {
    chips.push({
      label: `กรอบ: ${filters.framework.toUpperCase()}`,
      onRemove: () => onRemove('framework'),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className={`flex items-center gap-2 flex-wrap text-xs ${className}`}
      style={{ padding: '6px 0' }}
    >
      <span style={{ color: '#64748b', fontWeight: 400 }}>ตัวกรองที่เลือก:</span>
      {chips.map((chip, idx) => (
        <span
          key={idx}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 9px',
            borderRadius: '999px',
            backgroundColor: '#f0fbf5',
            border: '1px solid #bbf7d0',
            color: '#047857',
            fontSize: '12px',
            fontWeight: 400,
          }}
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            style={{
              background: 'none',
              border: 'none',
              color: '#047857',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FaTimes style={{ fontSize: '10px' }} />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        style={{
          border: 'none',
          background: 'none',
          color: '#dc2626',
          cursor: 'pointer',
          fontSize: '11.5px',
          fontWeight: 400,
          textDecoration: 'underline',
          padding: '2px 6px',
        }}
      >
        ล้างทั้งหมด
      </button>
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { CategoryConfig } from '@/types/dataManagement';
import { DepartmentBadge } from '@/components/ui/department-badge';
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrashAlt,
} from 'react-icons/fa';

export function formatDateBE(val?: any): string {
  if (val === null || val === undefined || val === '' || val === '-' || val === 'nan' || val === 'NaT') {
    return '-';
  }
  const str = String(val).trim();
  if (!str) return '-';

  // YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    const beYear = y < 2400 ? y + 543 : y;
    return `${d}/${m}/${beYear}`;
  }

  // YYYY-MM
  const ymMatch = str.match(/^(\d{4})-(\d{1,2})$/);
  if (ymMatch) {
    const y = parseInt(ymMatch[1], 10);
    const m = ymMatch[2].padStart(2, '0');
    const beYear = y < 2400 ? y + 543 : y;
    return `${m}/${beYear}`;
  }

  // DD/MM/YYYY or D/M/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = parseInt(dmyMatch[3], 10);
    const beYear = y < 2400 ? y + 543 : y;
    return `${d}/${m}/${beYear}`;
  }

  // Fallback Date object parsing
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const d = String(parsed.getDate()).padStart(2, '0');
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const y = parsed.getFullYear();
    const beYear = y < 2400 ? y + 543 : y;
    return `${d}/${m}/${beYear}`;
  }

  return str;
}

export function formatMoney(val?: any): string {
  if (val === null || val === undefined || val === '' || val === '-' || val === 'nan') {
    return '-';
  }
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export interface RecordDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: Record<string, any> | null;
  config?: CategoryConfig;
  onEdit?: (item: any, index: number) => void;
  onDelete?: (item: any, index: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalInPage?: number;
  readOnly?: boolean;
}

export const RecordDetailDrawer: React.FC<RecordDetailDrawerProps> = ({
  isOpen,
  onClose,
  item,
  config,
  onEdit,
  onDelete,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex = 0,
  totalInPage = 0,
  readOnly = false,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and Esc key handler
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  // Title of the record
  const recordTitle = String(
    item.name || item.title || item.topic_title || item.id || 'รายละเอียด'
  ).replace(/[\r\n]+/g, ' ').trim();

  // Helper to render field value
  const renderFieldValue = (field: any) => {
    const rawVal = field.getValue ? field.getValue(item) : item[field.key];

    if (field.format) {
      return <span>{field.format(rawVal, item)}</span>;
    }

    if (rawVal === undefined || rawVal === null || rawVal === '' || rawVal === 'nan' || rawVal === 'NaT') {
      return <span className="text-slate-400 font-normal">-</span>;
    }

    switch (field.type) {
      case 'currency': {
        const num = Number(rawVal);
        if (isNaN(num)) return <span className="text-slate-400 font-normal">-</span>;
        return (
          <span className="font-semibold text-emerald-700 font-mono text-[13.5px]">
            {formatMoney(num)} บาท
          </span>
        );
      }

      case 'date': {
        const formatted = formatDateBE(rawVal);
        return <span className="text-slate-800 font-medium text-[13.5px]">{formatted}</span>;
      }

      case 'department': {
        return (
          <div className="pt-0.5">
            <DepartmentBadge value={String(rawVal)} />
          </div>
        );
      }

      case 'person': {
        const personName = String(rawVal).replace(/[\r\n]+/g, ' ').trim();
        const dept = item.department || item.head_dept || item.person_dept;
        return (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-800 font-normal text-[13.5px]">{personName}</span>
            {dept && (
              <DepartmentBadge value={dept} />
            )}
          </div>
        );
      }

      case 'person_list': {
        // Co-researchers, inventors, co-authors
        if (Array.isArray(rawVal) && rawVal.length > 0) {
          return (
            <div className="flex flex-col gap-1.5 pt-0.5">
              {rawVal.map((p: any, idx: number) => {
                if (typeof p === 'object' && p !== null) {
                  const pName = p.name || p.clean_name || p.title || '';
                  const pDept = p.department || p.dept || '';
                  const pRole = p.role ? ` (${p.role})` : '';
                  if (!pName) return null;
                  return (
                    <div key={idx} className="flex items-center gap-2 flex-wrap text-[13.5px]">
                      <span className="text-slate-800 font-normal">{pName}{pRole}</span>
                      {pDept && <DepartmentBadge value={pDept} />}
                    </div>
                  );
                }
                const str = String(p).trim();
                if (!str) return null;
                return (
                  <div key={idx} className="text-slate-800 font-normal text-[13.5px]">
                    {str}
                  </div>
                );
              })}
            </div>
          );
        }

        // Comma-separated string of names
        if (typeof rawVal === 'string' && rawVal.trim()) {
          const names = rawVal.split(',').map((s) => s.trim()).filter(Boolean);
          if (names.length > 1) {
            return (
              <div className="flex flex-col gap-1 pt-0.5">
                {names.map((n, idx) => (
                  <div key={idx} className="text-slate-800 font-normal text-[13.5px]">
                    {n}
                  </div>
                ))}
              </div>
            );
          }
          return <span className="text-slate-800 font-normal text-[13.5px]">{rawVal}</span>;
        }

        return <span className="text-slate-400 font-normal">-</span>;
      }

      case 'allocation': {
        if (typeof rawVal === 'object' && rawVal !== null) {
          const percent = rawVal.percent !== undefined ? Number(rawVal.percent) : null;
          const amount = rawVal.amount !== undefined ? Number(rawVal.amount) : null;
          if (percent === null && amount === null) {
            return <span className="text-slate-400 font-normal">-</span>;
          }
          return (
            <span className="text-slate-800 font-semibold text-[13.5px] font-mono">
              {percent !== null ? `${percent}%` : '-'}
              <span className="text-slate-600 font-normal ml-1.5">
                ({amount !== null ? `${formatMoney(amount)} บาท` : '-'})
              </span>
            </span>
          );
        }
        return <span className="text-slate-800 font-normal text-[13.5px]">{String(rawVal)}</span>;
      }

      case 'list': {
        if (Array.isArray(rawVal) && rawVal.length > 0) {
          return (
            <div className="flex flex-col gap-1 pt-0.5">
              {rawVal.map((itemRow: any, idx: number) => {
                const text = typeof itemRow === 'object' && itemRow !== null
                  ? `${itemRow.code ? `[${itemRow.code}] ` : ''}${itemRow.name || JSON.stringify(itemRow)}`
                  : String(itemRow);
                return (
                  <div key={idx} className="text-slate-800 font-normal text-[13.5px]">
                    {text}
                  </div>
                );
              })}
            </div>
          );
        }
        return <span className="text-slate-400 font-normal">-</span>;
      }

      case 'badge': {
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {String(rawVal)}
          </span>
        );
      }

      default:
        return <span className="text-slate-800 font-normal text-[13.5px] break-words">{String(rawVal)}</span>;
    }
  };

  // Group definitions from category config
  const detailGroups = config?.detailGroups || [];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="รายละเอียดรายการ"
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[560px] max-w-full bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out"
      >
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-5 py-4 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            {/* Previous and Next Navigation */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev}
                title="รายการก่อนหน้า"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
              >
                <FaChevronLeft />
              </button>
              {totalInPage > 0 && (
                <span className="text-xs font-medium text-slate-500 px-2 select-none">
                  {currentIndex + 1} / {totalInPage}
                </span>
              )}
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                title="รายการถัดไป"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Actions: Edit, Delete, Close */}
            <div className="flex items-center gap-1.5">
              {!readOnly && onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onEdit(item, currentIndex);
                    onClose();
                  }}
                  title="แก้ไขข้อมูล"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <FaEdit className="text-amber-600" />
                  <span>แก้ไข</span>
                </button>
              )}

              {!readOnly && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(item, currentIndex);
                    onClose();
                  }}
                  title="ลบรายการ"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  <FaTrashAlt className="text-rose-600" />
                  <span>ลบ</span>
                </button>
              )}

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                title="ปิดหน้าต่าง"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
              >
                <FaTimes className="text-base" />
              </button>
            </div>
          </div>

          {/* Record Title: truncated to two lines */}
          <h3
            className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-2"
            title={recordTitle}
          >
            {recordTitle}
          </h3>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {detailGroups.length > 0 ? (
            detailGroups.map((group, gIdx) => {
              const isUngrouped = !group.groupLabel;
              return (
                <div key={gIdx} className={isUngrouped ? '' : 'pt-2'}>
                  {/* Parent Group Header (only if groupLabel exists) */}
                  {!isUngrouped && (
                    <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
                      <span className="w-1.5 h-3.5 bg-[#00A651] rounded-full" />
                      <h4 className="text-xs font-bold text-slate-700 tracking-wide">
                        {group.groupLabel}
                      </h4>
                    </div>
                  )}

                  {/* 2-column grid of fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3.5">
                    {group.fields.map((f, fIdx) => {
                      const isSpanFull = f.span === 2 || f.type === 'person_list' || f.type === 'list';
                      return (
                        <div
                          key={fIdx}
                          className={isSpanFull ? 'sm:col-span-2' : 'sm:col-span-1'}
                        >
                          <span className="block text-[12px] font-medium text-slate-500 mb-0.5">
                            {f.label}
                          </span>
                          <div className="text-slate-800">
                            {renderFieldValue(f)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">
              ไม่มีข้อมูลรายละเอียด
            </div>
          )}
        </div>
      </div>
    </>
  );
};

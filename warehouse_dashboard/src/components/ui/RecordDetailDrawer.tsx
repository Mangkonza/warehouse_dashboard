'use client';

import React, { useEffect, useRef } from 'react';
import { CategoryConfig, CategoryKey } from '@/types/dataManagement';
import { CATEGORIES_CONFIG } from '@/config/dataManagementConfig';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { ServiceTypeBadge } from '@/components/ui/service-type-badge';
import { IPTypeBadge } from '@/components/ui/ip-type-badge';
import { PublicationTypeBadge } from '@/components/ui/publication-type-badge';
import { TrlBadge } from '@/components/ui/trl-badge';
import { LevelBadge, RecordEvaluationTags, getItemEvaluation } from '@/components/ui/evaluation-tag';
import { Drawer } from '@/components/ui/Drawer';
import { EvaluationValue, isEvaluated } from '@/types/evaluation';
import { useAuth } from '@/features/auth';
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrashAlt,
} from 'react-icons/fa';

function normalizeBuddhistYear(y: number): number {
  if (y >= 1960 && y <= 1980) {
    return y + 600; // Excel 2-digit BE year (e.g., 68 -> 1968 -> 2568)
  }
  return y < 2400 ? y + 543 : y;
}

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
    const beYear = normalizeBuddhistYear(y);
    return `${d}/${m}/${beYear}`;
  }

  // YYYY-MM
  const ymMatch = str.match(/^(\d{4})-(\d{1,2})$/);
  if (ymMatch) {
    const y = parseInt(ymMatch[1], 10);
    const m = ymMatch[2].padStart(2, '0');
    const beYear = normalizeBuddhistYear(y);
    return `${m}/${beYear}`;
  }

  // DD/MM/YYYY or D/M/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = parseInt(dmyMatch[3], 10);
    const beYear = normalizeBuddhistYear(y);
    return `${d}/${m}/${beYear}`;
  }

  // Fallback Date object parsing
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const d = String(parsed.getDate()).padStart(2, '0');
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const y = parsed.getFullYear();
    const beYear = normalizeBuddhistYear(y);
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
  item?: Record<string, any> | null;
  record?: Record<string, any> | null;
  config?: CategoryConfig;
  categoryKey?: CategoryKey | string;
  evaluation?: EvaluationValue | null;
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
  item: itemProp,
  record,
  config: configProp,
  categoryKey,
  evaluation: evaluationProp,
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
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const item = itemProp ?? record ?? null;
  const config =
    configProp ??
    (categoryKey && CATEGORIES_CONFIG[categoryKey as CategoryKey]
      ? CATEGORIES_CONFIG[categoryKey as CategoryKey]
      : undefined);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const lastItemRef = useRef<Record<string, any> | null>(item);
  if (item) {
    lastItemRef.current = item;
  }
  const displayItem = item || lastItemRef.current;

  const [evalRecord, setEvalRecord] = React.useState<EvaluationValue | null>(() => {
    if (evaluationProp !== undefined && evaluationProp !== null) return evaluationProp;
    if (!item || !categoryKey) return null;
    return getItemEvaluation(item, String(categoryKey));
  });

  React.useEffect(() => {
    if (evaluationProp !== undefined && evaluationProp !== null) {
      setEvalRecord(evaluationProp);
      return;
    }
    if (!displayItem || !categoryKey) {
      setEvalRecord(null);
      return;
    }
    setEvalRecord(getItemEvaluation(displayItem, String(categoryKey)));

    const handleUpdate = () => {
      setEvalRecord(getItemEvaluation(displayItem, String(categoryKey)));
    };
    window.addEventListener('ku_evaluations_updated', handleUpdate);
    return () => window.removeEventListener('ku_evaluations_updated', handleUpdate);
  }, [displayItem, categoryKey, evaluationProp]);

  // Focus trap and Esc key handler
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
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
        previouslyFocusedElement.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose]);

  // Scroll body back to top when switching records via Prev/Next
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [displayItem?.id, displayItem?._id, currentIndex]);

  if (!displayItem) return null;

  // Title of the record
  const recordTitle = String(
    displayItem.name || displayItem.title || displayItem.topic_title || displayItem.id || 'รายละเอียด'
  ).replace(/[\r\n]+/g, ' ').trim();

  // Helper to render field value (normal font weight for all field values; bold only on section headers)
  const renderFieldValue = (field: any) => {
    const rawVal = field.getValue ? field.getValue(displayItem) : displayItem[field.key];

    if (field.format) {
      return <span className="text-slate-800 font-normal text-[13.5px]">{field.format(rawVal, displayItem)}</span>;
    }

    if (rawVal === undefined || rawVal === null || rawVal === '' || rawVal === 'nan' || rawVal === 'NaT') {
      return <span className="text-slate-800 font-normal text-[13.5px]">-</span>;
    }

    if (field.key === 'level') {
      return (
        <div className="pt-0.5">
          <LevelBadge value={String(rawVal)} />
        </div>
      );
    }

    if (field.key === 'service_type' || field.key === 'service_category') {
      return (
        <div className="pt-0.5">
          <ServiceTypeBadge value={String(rawVal)} />
        </div>
      );
    }

    if (field.key === 'type' && (categoryKey === 'ip' || ['สิทธิบัตร', 'อนุสิทธิบัตร', 'ลิขสิทธิ์'].some((t) => String(rawVal).includes(t)))) {
      return (
        <div className="pt-0.5">
          <IPTypeBadge value={String(rawVal)} />
        </div>
      );
    }

    if (field.key === 'type' && (categoryKey === 'publications' || ['เตรียมความพร้อมตีพิมพ์', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ตีพิมพ์'].some((t) => String(rawVal).includes(t)))) {
      return (
        <div className="pt-0.5">
          <PublicationTypeBadge value={String(rawVal)} />
        </div>
      );
    }

    if (field.key === 'trl' || field.key === 'trl_start' || field.key === 'trl_end') {
      if (String(rawVal).trim() === '-') {
        return <span className="text-slate-800 font-normal text-[13.5px]">-</span>;
      }
      return (
        <div className="pt-0.5">
          <TrlBadge value={rawVal} />
        </div>
      );
    }

    if (field.key === 'trl_outputs') {
      const rawOutputs = displayItem.trl_outputs;
      if (Array.isArray(rawOutputs) && rawOutputs.length > 0) {
        const validOutputs = rawOutputs.filter(
          (o: any) => o && typeof o === 'object' && (o.name || o.output_name || o.title || o.trl || o.trl_level)
        );
        if (validOutputs.length > 0) {
          return (
            <div className="flex flex-col gap-1.5 pt-0.5">
              {validOutputs.map((o: any, idx: number) => {
                const oName = o.name || o.output_name || o.title || '-';
                const oTrl = o.trl ?? o.trl_level ?? null;
                const oNote = o.note || o.description || '';
                return (
                  <div key={idx} className="flex items-center gap-2 flex-wrap text-[13.5px]">
                    <span className="text-slate-800 font-normal">
                      {oName}
                      {oNote ? ` (${oNote})` : ''}
                    </span>
                    {oTrl && <TrlBadge value={oTrl} />}
                  </div>
                );
              })}
            </div>
          );
        }
      }
    }

    switch (field.type) {
      case 'currency': {
        const num = Number(rawVal);
        if (isNaN(num)) return <span className="text-slate-800 font-normal text-[13.5px]">-</span>;
        return (
          <span className="font-normal text-emerald-700 font-mono text-[13.5px]">
            {formatMoney(num)} บาท
          </span>
        );
      }

      case 'date': {
        const formatted = formatDateBE(rawVal);
        return <span className="text-slate-800 font-normal text-[13.5px]">{formatted}</span>;
      }

      case 'department': {
        const depts = Array.isArray(rawVal)
          ? rawVal.map((s) => String(s).trim()).filter((s) => Boolean(s) && s !== '-' && s !== 'nan')
          : String(rawVal)
              .split(',')
              .map((s) => s.trim())
              .filter((s) => Boolean(s) && s !== '-' && s !== 'nan');
        if (depts.length === 0) {
          return <span className="text-slate-800 font-normal text-[13.5px]">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {Array.from(new Set(depts)).map((d, idx) => (
              <DepartmentBadge key={idx} value={d} />
            ))}
          </div>
        );
      }

      case 'person': {
        const personName = String(rawVal).replace(/[\r\n]+/g, ' ').trim();
        if (!personName || personName === '-' || personName === 'nan') {
          return <span className="text-slate-800 font-normal text-[13.5px]">-</span>;
        }
        return (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-800 font-normal text-[13.5px]">{personName}</span>
          </div>
        );
      }

      case 'person_list': {
        // For publications co-authors (ต่างชาติ / ภายในประเทศ): display status มี / ไม่มี
        if (field.key === 'co_authors_foreign' || field.key === 'co_authors_domestic') {
          const isForeign = field.key === 'co_authors_foreign';
          const hasCoAuthor = isForeign
            ? Boolean(
                displayItem.has_foreign_coauthor ??
                displayItem.has_international_coauthor ??
                ((Array.isArray(rawVal) && rawVal.length > 0 && rawVal[0] !== '') ||
                (typeof rawVal === 'string' && rawVal.trim() !== '' && rawVal !== '-' && rawVal !== 'nan'))
              )
            : Boolean(
                displayItem.has_domestic_coauthor ??
                ((Array.isArray(rawVal) && rawVal.length > 0 && rawVal[0] !== '') ||
                (typeof rawVal === 'string' && rawVal.trim() !== '' && rawVal !== '-' && rawVal !== 'nan'))
              );

          return (
            <div className="pt-0.5">
              <span
                className={
                  hasCoAuthor
                    ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-slate-100 text-slate-600 border border-slate-200'
                }
              >
                {hasCoAuthor ? 'มี' : 'ไม่มี'}
              </span>
            </div>
          );
        }
        // Co-researchers, inventors, co-authors
        if (Array.isArray(rawVal) && rawVal.length > 0) {
          const validItems = rawVal.filter((p) => {
            if (typeof p === 'object' && p !== null) {
              return Boolean(p.name || p.clean_name || p.title || p.personName);
            }
            const s = String(p).trim();
            return Boolean(s) && s !== '-' && s !== 'nan' && s !== '[object Object]';
          });
          if (validItems.length === 0) {
            return <span className="text-slate-800 font-normal text-[13.5px]">-</span>;
          }
          return (
            <div className="flex flex-col gap-1.5 pt-0.5">
              {validItems.map((p: any, idx: number) => {
                if (typeof p === 'object' && p !== null) {
                  const pName = p.name || p.clean_name || p.title || p.personName || '';
                  const pDept = p.department || p.dept || '';
                  const pContrib =
                    p.contributionPercent !== undefined && p.contributionPercent !== null && p.contributionPercent !== ''
                      ? ` (${p.contributionPercent}%)`
                      : '';
                  return (
                    <div key={idx} className="flex items-center gap-2 flex-wrap text-[13.5px]">
                      <span className="text-slate-800 font-normal">
                        {pName}
                        {pContrib}
                      </span>
                      {pDept && <DepartmentBadge value={pDept} />}
                    </div>
                  );
                }
                const str = String(p).trim();
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
        if (typeof rawVal === 'string' && rawVal.trim() && rawVal.trim() !== '-' && rawVal.trim() !== 'nan') {
          const names = rawVal
            .split(',')
            .map((s) => s.trim())
            .filter((s) => Boolean(s) && s !== '[object Object]');
          if (names.length === 0) {
            return <span className="text-slate-800 font-normal text-[13.5px]">-</span>;
          }
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
          return <span className="text-slate-800 font-normal text-[13.5px]">{names[0]}</span>;
        }

        return <span className="text-slate-800 font-normal text-[13.5px]">-</span>;
      }

      case 'allocation': {
        if (typeof rawVal === 'object' && rawVal !== null) {
          const percent = rawVal.percent !== undefined ? Number(rawVal.percent) : null;
          const amount = rawVal.amount !== undefined ? Number(rawVal.amount) : null;
          if (percent === null && amount === null) {
            return <span className="text-slate-800 font-normal text-[13.5px]">-</span>;
          }
          return (
            <span className="text-slate-800 font-normal text-[13.5px] font-mono">
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
                const text =
                  typeof itemRow === 'object' && itemRow !== null
                    ? `${itemRow.code ? `[${itemRow.code}] ` : ''}${itemRow.name || itemRow.title || JSON.stringify(itemRow)}`
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
        return <span className="text-slate-800 font-normal text-[13.5px]">-</span>;
      }

      case 'badge': {
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[12px] font-normal bg-slate-100 text-slate-700 border border-slate-200">
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

  const headerSlot = (
    <div className="border-b border-slate-200 bg-white px-5 py-4 shrink-0">
      <div className="flex items-center justify-between gap-3 mb-2">
        {/* Previous and Next Navigation */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            title="รายการก่อนหน้า"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
          >
            <FaChevronLeft />
          </button>
          {totalInPage > 0 && (
            <span className="text-xs font-normal text-slate-500 px-2 select-none">
              {currentIndex + 1} / {totalInPage}
            </span>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            title="รายการถัดไป"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Actions: Edit, Delete, Close */}
        <div className="flex items-center gap-1.5">
          {!readOnly && isAdmin && onEdit && (
            <button
              type="button"
              onClick={() => {
                onEdit(displayItem, currentIndex);
                onClose();
              }}
              title="แก้ไขข้อมูล"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-normal rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <FaEdit className="text-amber-600" />
              <span>แก้ไข</span>
            </button>
          )}

          {!readOnly && isAdmin && onDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete(displayItem, currentIndex);
                onClose();
              }}
              title="ลบรายการ"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-normal rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
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
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
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
  );

  return (
    <Drawer
      isOpen={isOpen && !!item}
      onClose={onClose}
      width="w-full sm:w-[580px]"
      headerSlot={headerSlot}
      bodyRef={bodyRef}
      aria-label="รายละเอียดรายการ"
    >
      <div className="px-6 py-5 space-y-6">
        {/* Evaluation Block at top of scrollable body before first group/field */}
        {categoryKey && ['research', 'academic', 'publications', 'service', 'ip'].includes(String(categoryKey).toLowerCase()) && isEvaluated(String(categoryKey), evalRecord) && (
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-200">
              <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
              <h4 className="text-[13px] font-bold text-slate-700 tracking-wide">
                ผลการประเมิน
              </h4>
            </div>
            <div>
              <RecordEvaluationTags
                category={String(categoryKey)}
                item={displayItem}
                evaluation={evalRecord}
                className="mt-0"
                wrap={true}
              />
            </div>
          </div>
        )}
        {detailGroups.length > 0 ? (
          detailGroups.map((group, gIdx) => {
            const isUngrouped = !group.groupLabel;
            return (
              <div key={gIdx} className={isUngrouped ? '' : 'pt-1'}>
                {/* Parent Group Header (Bold ONLY on section headers as in reference image) */}
                {!isUngrouped && (
                  <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-200">
                    <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
                    <h4 className="text-[13px] font-bold text-slate-700 tracking-wide">
                      {group.groupLabel}
                    </h4>
                  </div>
                )}

                {/* 2-column grid of fields (normal weight for labels and values) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {group.fields.map((f, fIdx) => {
                    const isSpanFull = f.span === 2 || f.type === 'person_list' || f.type === 'list';
                    return (
                      <div
                        key={fIdx}
                        className={isSpanFull ? 'sm:col-span-2' : 'sm:col-span-1'}
                      >
                        <span className="block text-[12.5px] font-normal text-slate-500 mb-1">
                          {f.label}
                        </span>
                        <div className="text-slate-800 font-normal">
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
          <div className="text-center py-10 text-slate-400 text-sm font-normal">
            ไม่มีข้อมูลรายละเอียด
          </div>
        )}
      </div>
    </Drawer>
  );
};

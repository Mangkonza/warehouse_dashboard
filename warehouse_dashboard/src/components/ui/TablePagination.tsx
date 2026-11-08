'use client';

import React, { useMemo } from 'react';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  unitLabel?: string;
  extraInfo?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

type PageSlot =
  | { type: 'page'; page: number; key: string }
  | { type: 'ellipsis'; key: string };

/**
 * Generates a deterministic, constant-count list of page slots so pagination
 * buttons never shift or jump horizontally when changing pages.
 * - If totalPages <= 7: returns 1..totalPages
 * - If totalPages > 7: always returns exactly 7 slots
 */
function buildPageSlots(currentPage: number, totalPages: number): PageSlot[] {
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);

  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, i) => ({
      type: 'page',
      page: i + 1,
      key: `page-${i + 1}`,
    }));
  }

  if (safeCurrent <= 4) {
    return [
      { type: 'page', page: 1, key: 'page-1' },
      { type: 'page', page: 2, key: 'page-2' },
      { type: 'page', page: 3, key: 'page-3' },
      { type: 'page', page: 4, key: 'page-4' },
      { type: 'page', page: 5, key: 'page-5' },
      { type: 'ellipsis', key: 'ellipsis-right' },
      { type: 'page', page: safeTotal, key: `page-${safeTotal}` },
    ];
  }

  if (safeCurrent >= safeTotal - 3) {
    return [
      { type: 'page', page: 1, key: 'page-1' },
      { type: 'ellipsis', key: 'ellipsis-left' },
      { type: 'page', page: safeTotal - 4, key: `page-${safeTotal - 4}` },
      { type: 'page', page: safeTotal - 3, key: `page-${safeTotal - 3}` },
      { type: 'page', page: safeTotal - 2, key: `page-${safeTotal - 2}` },
      { type: 'page', page: safeTotal - 1, key: `page-${safeTotal - 1}` },
      { type: 'page', page: safeTotal, key: `page-${safeTotal}` },
    ];
  }

  return [
    { type: 'page', page: 1, key: 'page-1' },
    { type: 'ellipsis', key: 'ellipsis-left' },
    { type: 'page', page: safeCurrent - 1, key: `page-${safeCurrent - 1}` },
    { type: 'page', page: safeCurrent, key: `page-${safeCurrent}` },
    { type: 'page', page: safeCurrent + 1, key: `page-${safeCurrent + 1}` },
    { type: 'ellipsis', key: 'ellipsis-right' },
    { type: 'page', page: safeTotal, key: `page-${safeTotal}` },
  ];
}

const BASE_BUTTON_STYLE: React.CSSProperties = {
  width: '32px',
  minWidth: '32px',
  height: '32px',
  padding: 0,
  borderRadius: '6px',
  fontSize: '12px',
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  flexShrink: 0,
  userSelect: 'none',
  fontVariantNumeric: 'tabular-nums',
  transition: 'background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease',
};

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  unitLabel = 'รายการ',
  extraInfo,
  className,
  style,
}: TablePaginationProps) {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeCurrentPage = Math.min(Math.max(1, currentPage || 1), safeTotalPages);

  const startItem = totalItems > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(safeCurrentPage * pageSize, totalItems) : 0;

  const slots = useMemo(
    () => buildPageSlots(safeCurrentPage, safeTotalPages),
    [safeCurrentPage, safeTotalPages]
  );

  const isFirstDisabled = safeCurrentPage <= 1;
  const isLastDisabled = safeCurrentPage >= safeTotalPages;

  const getNavButtonStyle = (disabled: boolean): React.CSSProperties => ({
    ...BASE_BUTTON_STYLE,
    border: disabled ? '1px solid #e2e8f0' : '1px solid #cbd5e1',
    backgroundColor: disabled ? '#f8fafc' : '#ffffff',
    color: disabled ? '#cbd5e1' : '#475569',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 500,
  });

  const getPageButtonStyle = (isActive: boolean): React.CSSProperties => ({
    ...BASE_BUTTON_STYLE,
    border: isActive ? '1px solid #94a3b8' : '1px solid #cbd5e1',
    backgroundColor: isActive ? '#e2e8f0' : '#ffffff',
    color: isActive ? '#0f172a' : '#475569',
    fontWeight: isActive ? 700 : 500,
    cursor: 'pointer',
  });

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        fontSize: '13px',
        color: '#64748b',
        flexWrap: 'wrap',
        gap: '12px',
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      <div>
        แสดง <strong style={{ color: '#1e293b', fontWeight: 600 }}>{startItem.toLocaleString()}</strong> ถึง{' '}
        <strong style={{ color: '#1e293b', fontWeight: 600 }}>{endItem.toLocaleString()}</strong> จากทั้งหมด{' '}
        <strong style={{ color: '#1e293b', fontWeight: 600 }}>{totalItems.toLocaleString()}</strong> {unitLabel}
        {extraInfo}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>แสดง:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
              }}
              style={{
                height: '32px',
                padding: '0 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                color: '#334155',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                outline: 'none',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Fixed-width neutral pagination button group */}
        <div
          role="navigation"
          aria-label="เปลี่ยนหน้าข้อมูล"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
          }}
        >
          {/* หน้าแรก */}
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={isFirstDisabled}
            style={getNavButtonStyle(isFirstDisabled)}
            title="หน้าแรก"
            aria-label="หน้าแรก"
          >
            <FaAngleDoubleLeft style={{ fontSize: '11px' }} />
          </button>

          {/* หน้าก่อนหน้า */}
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
            disabled={isFirstDisabled}
            style={getNavButtonStyle(isFirstDisabled)}
            title="หน้าก่อนหน้า"
            aria-label="หน้าก่อนหน้า"
          >
            <FaChevronLeft style={{ fontSize: '10px' }} />
          </button>

          {/* หมายเลขหน้าแบบคงที่ ไม่กระโดด */}
          {slots.map((slot) => {
            if (slot.type === 'ellipsis') {
              return (
                <span
                  key={slot.key}
                  style={{
                    ...BASE_BUTTON_STYLE,
                    border: '1px solid transparent',
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    cursor: 'default',
                  }}
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }

            const isCurrent = slot.page === safeCurrentPage;
            return (
              <button
                key={slot.key}
                type="button"
                onClick={() => onPageChange(slot.page)}
                style={getPageButtonStyle(isCurrent)}
                title={`หน้าที่ ${slot.page}`}
                aria-label={`หน้าที่ ${slot.page}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {slot.page}
              </button>
            );
          })}

          {/* หน้าถัดไป */}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(safeTotalPages, safeCurrentPage + 1))}
            disabled={isLastDisabled}
            style={getNavButtonStyle(isLastDisabled)}
            title="หน้าถัดไป"
            aria-label="หน้าถัดไป"
          >
            <FaChevronRight style={{ fontSize: '10px' }} />
          </button>

          {/* หน้าสุดท้าย */}
          <button
            type="button"
            onClick={() => onPageChange(safeTotalPages)}
            disabled={isLastDisabled}
            style={getNavButtonStyle(isLastDisabled)}
            title="หน้าสุดท้าย"
            aria-label="หน้าสุดท้าย"
          >
            <FaAngleDoubleRight style={{ fontSize: '11px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default TablePagination;

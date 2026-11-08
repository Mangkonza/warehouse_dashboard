'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  ImportRow,
  ImportFiltersState,
  ImportCategoryFilter,
  ImportStatusFilter,
  ImportSummary,
} from '../types';
import { computeGlobalSummary } from '../etl/importEtl';

export function useImportFilters(
  rows: ImportRow[],
  recentlyFixedIds: Set<string>,
  onClearRecentlyFixed?: () => void
) {
  const [filters, setFilters] = useState<ImportFiltersState>({
    category: 'all',
    status: 'all',
    query: '',
  });

  const setCategory = useCallback(
    (category: ImportCategoryFilter) => {
      onClearRecentlyFixed?.();
      setFilters((prev) => ({ ...prev, category }));
    },
    [onClearRecentlyFixed]
  );

  const toggleStatus = useCallback(
    (status: ImportStatusFilter) => {
      onClearRecentlyFixed?.();
      setFilters((prev) => ({
        ...prev,
        status: prev.status === status ? 'all' : status,
      }));
    },
    [onClearRecentlyFixed]
  );

  const setStatus = useCallback(
    (status: ImportStatusFilter) => {
      onClearRecentlyFixed?.();
      setFilters((prev) => ({ ...prev, status }));
    },
    [onClearRecentlyFixed]
  );

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const resetFilters = useCallback(() => {
    onClearRecentlyFixed?.();
    setFilters({ category: 'all', status: 'all', query: '' });
  }, [onClearRecentlyFixed]);

  // T3.4: Summary cards show counts filtered by the selected category only (ignoring status & query)
  const categorySummary: ImportSummary = useMemo(() => {
    return computeGlobalSummary(rows, filters.category);
  }, [rows, filters.category]);

  // T3.3 + T5: visibleRows combines category AND status AND query, while keeping recentlyFixedIds temporarily visible under 'error' filter
  const visibleRows: ImportRow[] = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    return rows.filter((r) => {
      // 1. Category filter
      if (filters.category !== 'all' && r.category !== filters.category) {
        return false;
      }

      // 2. Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'ready') {
          if (r.excluded || (r.status !== 'ready' && r.status !== 'warning')) return false;
        } else if (filters.status === 'error') {
          const isTempFixed = recentlyFixedIds.has(r.rowId) && !r.excluded;
          if ((r.excluded || r.status !== 'error') && !isTempFixed) return false;
        } else if (filters.status === 'warning') {
          if (r.excluded || r.status !== 'warning') return false;
        } else if (filters.status === 'duplicate') {
          if (r.excluded || r.status !== 'duplicate') return false;
        }
      }

      // 3. Query filter
      if (q) {
        const hay = [
          r.data.name,
          r.data.head_name,
          r.data.client,
          r.data.department_code,
          r.data.record_number,
          r.sheetName,
          r.categoryLabel,
          String(r.excelRowNumber),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [rows, filters, recentlyFixedIds]);

  return {
    filters,
    setCategory,
    toggleStatus,
    setStatus,
    setQuery,
    resetFilters,
    categorySummary,
    visibleRows,
  };
}

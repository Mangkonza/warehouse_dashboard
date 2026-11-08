'use client';

import { useState, useCallback, useMemo } from 'react';
import { ImportRow, ImportRowData, ImportSummary, RowStatus } from '../types';
import {
  computeGlobalSummary,
  validateRowUniversal,
  enrichRowUniversal,
  recalculateAcademicAllocations,
} from '../etl/importEtl';

export function useImportRows(initialRows: ImportRow[] = []) {
  const [rows, setRows] = useState<ImportRow[]>(initialRows);
  const [isDirty, setIsDirty] = useState(false);
  const [recentlyFixedIds, setRecentlyFixedIds] = useState<Set<string>>(new Set());
  const [undoState, setUndoState] = useState<{
    message: string;
    snapshot: ImportRow[];
  } | null>(null);

  const resetRows = useCallback((nextRows: ImportRow[] = []) => {
    setRows(nextRows);
    setIsDirty(false);
    setRecentlyFixedIds(new Set());
    setUndoState(null);
  }, []);

  const clearRecentlyFixed = useCallback(() => {
    setRecentlyFixedIds((prev) => (prev.size === 0 ? prev : new Set()));
  }, []);

  const updateRowData = useCallback(
    (rowId: string, updatedFields: Partial<ImportRowData>) => {
      setRows((prev) =>
        prev.map((r) => {
          if (r.rowId !== rowId) return r;

          const prevStatus = r.status;
          let nextData: ImportRowData = { ...r.data, ...updatedFields };

          // Recalculate 5% academic allocations when budget or percentage changes
          if (
            updatedFields.budget !== undefined ||
            updatedFields.percent_faculty !== undefined ||
            updatedFields.percent_dept !== undefined ||
            updatedFields.percent_ku !== undefined
          ) {
            nextData = recalculateAcademicAllocations(nextData);
          }

          // Re-enrich personnel match if head_name changed without explicit head_personnel_id
          if (updatedFields.head_name !== undefined && updatedFields.head_personnel_id === undefined) {
            nextData = enrichRowUniversal({ ...nextData, head_personnel_id: null });
          }

          const issues = validateRowUniversal(nextData, r.category);
          const isDuplicate = Boolean(r.duplicateOf);
          const nextStatus: RowStatus = r.excluded
            ? 'excluded'
            : isDuplicate
            ? 'duplicate'
            : issues.some((i) => i.severity === 'error')
            ? 'error'
            : issues.some((i) => i.severity === 'warning')
            ? 'warning'
            : 'ready';

          if (prevStatus === 'error' && (nextStatus === 'ready' || nextStatus === 'warning')) {
            setRecentlyFixedIds((prevSet) => {
              const nextSet = new Set(prevSet);
              nextSet.add(rowId);
              return nextSet;
            });
          } else if (nextStatus === 'error') {
            setRecentlyFixedIds((prevSet) => {
              if (!prevSet.has(rowId)) return prevSet;
              const nextSet = new Set(prevSet);
              nextSet.delete(rowId);
              return nextSet;
            });
          }

          return {
            ...r,
            data: nextData,
            issues,
            status: nextStatus,
          };
        })
      );
      setIsDirty(true);
    },
    []
  );

  const toggleExclude = useCallback((rowId: string) => {
    setRows((prev) => {
      const target = prev.find((r) => r.rowId === rowId);
      if (!target) return prev;

      const nextExcluded = !target.excluded;
      setUndoState({
        message: nextExcluded
          ? `ไม่นำเข้าแถว #${target.excelRowNumber} แล้ว`
          : `คืนค่าแถว #${target.excelRowNumber} กลับมาพร้อมนำเข้าแล้ว`,
        snapshot: prev,
      });

      return prev.map((r) => {
        if (r.rowId !== rowId) return r;
        const isDuplicate = Boolean(r.duplicateOf);
        const status: RowStatus = nextExcluded
          ? 'excluded'
          : isDuplicate
          ? 'duplicate'
          : r.issues.some((i) => i.severity === 'error')
          ? 'error'
          : r.issues.some((i) => i.severity === 'warning')
          ? 'warning'
          : 'ready';

        return {
          ...r,
          excluded: nextExcluded,
          status,
        };
      });
    });
    setIsDirty(true);
  }, []);

  const bulkApplyData = useCallback(
    (
      targetRowIds: Set<string>,
      updater: (row: ImportRow) => Partial<ImportRowData> | null,
      actionDescription?: string
    ): number => {
      let modifiedCount = 0;
      setRows((prev) => {
        const next = prev.map((r) => {
          if (!targetRowIds.has(r.rowId)) return r;
          const updates = updater(r);
          if (!updates) return r;

          modifiedCount++;
          let nextData: ImportRowData = { ...r.data, ...updates };
          if (updates.budget !== undefined) {
            nextData = recalculateAcademicAllocations(nextData);
          }
          if (updates.head_name !== undefined && updates.head_personnel_id === undefined) {
            nextData = enrichRowUniversal({ ...nextData, head_personnel_id: null });
          }

          const issues = validateRowUniversal(nextData, r.category);
          const isDuplicate = Boolean(r.duplicateOf);
          const status: RowStatus = r.excluded
            ? 'excluded'
            : isDuplicate
            ? 'duplicate'
            : issues.some((i) => i.severity === 'error')
            ? 'error'
            : issues.some((i) => i.severity === 'warning')
            ? 'warning'
            : 'ready';

          return {
            ...r,
            data: nextData,
            issues,
            status,
          };
        });

        if (modifiedCount > 0) {
          setUndoState({
            message: actionDescription || `แก้ไขแล้ว ${modifiedCount} แถว`,
            snapshot: prev,
          });
        }

        return modifiedCount > 0 ? next : prev;
      });

      if (modifiedCount > 0) {
        setIsDirty(true);
      }
      return modifiedCount;
    },
    []
  );

  const bulkSetExcluded = useCallback(
    (targetRowIds: Set<string>, excluded: boolean, actionDescription?: string): number => {
      let modifiedCount = 0;
      setRows((prev) => {
        const next = prev.map((r) => {
          if (!targetRowIds.has(r.rowId)) return r;
          if (r.excluded === excluded) return r;

          modifiedCount++;
          const isDuplicate = Boolean(r.duplicateOf);
          const status: RowStatus = excluded
            ? 'excluded'
            : isDuplicate
            ? 'duplicate'
            : r.issues.some((i) => i.severity === 'error')
            ? 'error'
            : r.issues.some((i) => i.severity === 'warning')
            ? 'warning'
            : 'ready';

          return {
            ...r,
            excluded,
            status,
          };
        });

        if (modifiedCount > 0) {
          setUndoState({
            message:
              actionDescription ||
              (excluded
                ? `ไม่นำเข้า ${modifiedCount} แถวแล้ว`
                : `คืนค่า ${modifiedCount} แถวกลับมาพร้อมนำเข้าแล้ว`),
            snapshot: prev,
          });
        }

        return modifiedCount > 0 ? next : prev;
      });

      if (modifiedCount > 0) {
        setIsDirty(true);
      }
      return modifiedCount;
    },
    []
  );

  const undoLastAction = useCallback(() => {
    if (!undoState) return;
    setRows(undoState.snapshot);
    setUndoState(null);
  }, [undoState]);

  const dismissUndo = useCallback(() => {
    setUndoState(null);
  }, []);

  const globalSummary: ImportSummary = useMemo(() => {
    return computeGlobalSummary(rows, 'all');
  }, [rows]);

  return {
    rows,
    setRows,
    resetRows,
    isDirty,
    setIsDirty,
    recentlyFixedIds,
    clearRecentlyFixed,
    updateRowData,
    toggleExclude,
    bulkApplyData,
    bulkSetExcluded,
    undoState,
    undoLastAction,
    dismissUndo,
    globalSummary,
  };
}

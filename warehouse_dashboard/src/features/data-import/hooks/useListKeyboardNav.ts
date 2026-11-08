'use client';

import { useEffect, useCallback, RefObject } from 'react';
import { ImportRow } from '../types';

export interface UseListKeyboardNavOptions {
  visibleRows: ImportRow[];
  selectedRowId: string | null;
  onSelectRow: (rowId: string | null) => void;
  listContainerRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
}

export function useListKeyboardNav({
  visibleRows,
  selectedRowId,
  onSelectRow,
  listContainerRef,
  enabled = true,
}: UseListKeyboardNavOptions) {
  const scrollRowIntoView = useCallback(
    (rowId: string) => {
      if (!listContainerRef.current) return;
      const el = listContainerRef.current.querySelector<HTMLElement>(
        `[data-row-id="${CSS.escape(rowId)}"]`
      );
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    },
    [listContainerRef]
  );

  const selectPrev = useCallback(() => {
    if (visibleRows.length === 0) return;
    const idx = visibleRows.findIndex((r) => r.rowId === selectedRowId);
    const nextIdx = idx > 0 ? idx - 1 : 0;
    const nextId = visibleRows[nextIdx]?.rowId;
    if (nextId) {
      onSelectRow(nextId);
      scrollRowIntoView(nextId);
    }
  }, [visibleRows, selectedRowId, onSelectRow, scrollRowIntoView]);

  const selectNext = useCallback(() => {
    if (visibleRows.length === 0) return;
    const idx = visibleRows.findIndex((r) => r.rowId === selectedRowId);
    const nextIdx = idx >= 0 && idx < visibleRows.length - 1 ? idx + 1 : 0;
    const nextId = visibleRows[nextIdx]?.rowId;
    if (nextId) {
      onSelectRow(nextId);
      scrollRowIntoView(nextId);
    }
  }, [visibleRows, selectedRowId, onSelectRow, scrollRowIntoView]);

  const selectNextNeedsFix = useCallback(() => {
    const errorRows = visibleRows.filter((r) => !r.excluded && r.status === 'error');
    if (errorRows.length === 0) {
      onSelectRow(null);
      return;
    }
    const currentIdx = errorRows.findIndex((r) => r.rowId === selectedRowId);
    const nextRow =
      currentIdx >= 0 && currentIdx < errorRows.length - 1
        ? errorRows[currentIdx + 1]
        : errorRows[0];
    if (nextRow) {
      onSelectRow(nextRow.rowId);
      scrollRowIntoView(nextRow.rowId);
    }
  }, [visibleRows, selectedRowId, onSelectRow, scrollRowIntoView]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isFormElement =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (isFormElement) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, selectNext, selectPrev]);

  return {
    selectPrev,
    selectNext,
    selectNextNeedsFix,
    scrollRowIntoView,
  };
}

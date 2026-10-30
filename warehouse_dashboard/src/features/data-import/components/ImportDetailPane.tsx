'use client';

import React, { useRef, useMemo, useCallback } from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck, FaWrench } from 'react-icons/fa';
import {
  ResearchFormFields,
  AcademicFormFields,
  ServiceFormFields,
  PublicationFormFields,
  IpFormFields,
} from '@/components/form/domain-forms';
import { ImportDetailHeader } from './ImportDetailHeader';
import { ImportIssueAlert } from './ImportIssueAlert';
import { ImportRow, ImportRowData } from '../types';

export interface ImportDetailPaneProps {
  row: ImportRow;
  rowIndex: number;
  totalVisible: number;
  remainingErrorCount: number;
  onUpdateRowData: (rowId: string, updatedFields: Partial<ImportRowData>) => void;
  onToggleExclude: (rowId: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onNextNeedsFix: () => void;
  onClose: () => void;
}

export const ImportDetailPane: React.FC<ImportDetailPaneProps> = ({
  row,
  rowIndex,
  totalVisible,
  remainingErrorCount,
  onUpdateRowData,
  onToggleExclude,
  onPrev,
  onNext,
  onNextNeedsFix,
  onClose,
}) => {
  const formScrollRef = useRef<HTMLDivElement | null>(null);
  const isReadOnly = row.status === 'duplicate';

  const fieldErrors = useMemo(() => {
    const map: Record<string, string> = {};
    for (const iss of row.issues) {
      if (iss.severity === 'error' && !map[iss.field]) {
        map[iss.field] = iss.message;
      }
    }
    return map;
  }, [row.issues]);

  // Prepare formData object expected by shared domain forms
  const domainFormData: Record<string, any> = useMemo(
    () => ({
      ...row.data,
      fund_source: row.data.fund_source || row.data.client || '',
      client: row.data.client || row.data.fund_source || '',
    }),
    [row.data]
  );

  const handleFieldChange = useCallback(
    (field: string, value: any) => {
      if (isReadOnly) return;
      const updates: Partial<ImportRowData> = { [field]: value };
      if (field === 'fund_source') {
        updates.client = value;
      } else if (field === 'client') {
        updates.fund_source = value;
      }
      onUpdateRowData(row.rowId, updates);
    },
    [isReadOnly, onUpdateRowData, row.rowId]
  );

  const handleSetFormData: React.Dispatch<React.SetStateAction<Record<string, any>>> = useCallback(
    (updaterOrNext) => {
      if (isReadOnly) return;
      const nextObj =
        typeof updaterOrNext === 'function' ? updaterOrNext(domainFormData) : updaterOrNext;
      const updates: Partial<ImportRowData> = { ...nextObj };
      if (updates.fund_source !== undefined && updates.client === undefined) {
        updates.client = String(updates.fund_source || '');
      }
      onUpdateRowData(row.rowId, updates);
    },
    [isReadOnly, domainFormData, onUpdateRowData, row.rowId]
  );

  const handleFocusField = useCallback((fieldName: string) => {
    if (!formScrollRef.current) return;
    const selector =
      fieldName === 'client'
        ? '[data-field="client"], [data-field="fund_source"], [name="client"], [name="fund_source"]'
        : `[data-field="${fieldName}"], [name="${fieldName}"]`;
    const container = formScrollRef.current.querySelector<HTMLElement>(selector);
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const focusable =
        container.matches('input, select, textarea, button')
          ? container
          : container.querySelector<HTMLElement>('input, select, textarea, button');
      if (focusable) {
        setTimeout(() => focusable.focus(), 150);
      }
    }
  }, []);

  return (
    <div className="imp-detail-container h-full flex flex-col bg-white overflow-hidden">
      {/* 1. Sticky Header */}
      <ImportDetailHeader
        row={row}
        rowIndex={rowIndex}
        totalVisible={totalVisible}
        onPrev={onPrev}
        onNext={onNext}
        onToggleExclude={onToggleExclude}
        onClose={onClose}
      />

      {/* 2. Scrollable Body: Issue Alert + Shared Domain Form */}
      <div
        ref={formScrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-[1.25rem] py-[1rem] space-y-[1rem]"
      >
        <ImportIssueAlert row={row} onFocusField={handleFocusField} />

        {row.category === 'research' && (
          <ResearchFormFields
            formData={domainFormData}
            onChange={handleFieldChange}
            setFormData={handleSetFormData}
            isEdit={true}
            readOnly={isReadOnly}
          />
        )}

        {row.category === 'academic' && (
          <AcademicFormFields
            formData={domainFormData}
            onChange={handleFieldChange}
            setFormData={handleSetFormData}
            readOnly={isReadOnly}
          />
        )}

        {row.category === 'service' && (
          <ServiceFormFields
            formData={domainFormData}
            onChange={handleFieldChange}
            setFormData={handleSetFormData}
            isEdit={true}
            readOnly={isReadOnly}
          />
        )}

        {row.category === 'publications' && (
          <PublicationFormFields
            formData={domainFormData}
            onChange={handleFieldChange}
            setFormData={handleSetFormData}
            isEdit={true}
            errors={fieldErrors}
            readOnly={isReadOnly}
          />
        )}

        {row.category === 'ip' && (
          <IpFormFields
            formData={domainFormData}
            onChange={handleFieldChange}
            setFormData={handleSetFormData}
            isEdit={true}
            errors={fieldErrors}
            readOnly={isReadOnly}
          />
        )}

        {row.category !== 'research' &&
          row.category !== 'academic' &&
          row.category !== 'service' &&
          row.category !== 'publications' &&
          row.category !== 'ip' && (
            <ResearchFormFields
              formData={domainFormData}
              onChange={handleFieldChange}
              setFormData={handleSetFormData}
              isEdit={true}
              readOnly={isReadOnly}
            />
          )}
      </div>

      {/* 3. Sticky Footer inside Detail Pane */}
      <div className="shrink-0 px-[1rem] py-[0.75rem] border-t border-slate-200 bg-slate-50/90 flex items-center justify-between gap-[0.5rem]">
        <div className="flex items-center gap-[0.5rem]">
          <button
            type="button"
            disabled={totalVisible <= 1}
            onClick={onPrev}
            className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.4375rem] rounded-[0.5rem] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[0.75rem] font-semibold disabled:opacity-40 cursor-pointer"
          >
            <FaArrowLeft className="text-[0.6875rem]" />
            <span>ก่อนหน้า</span>
          </button>

          <button
            type="button"
            disabled={totalVisible <= 1}
            onClick={onNext}
            className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.4375rem] rounded-[0.5rem] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[0.75rem] font-semibold disabled:opacity-40 cursor-pointer"
          >
            <span>ถัดไป</span>
            <FaArrowRight className="text-[0.6875rem]" />
          </button>
        </div>

        {remainingErrorCount > 0 ? (
          <button
            type="button"
            onClick={onNextNeedsFix}
            className="inline-flex items-center gap-[0.375rem] px-[0.875rem] py-[0.4375rem] rounded-[0.5rem] bg-rose-600 hover:bg-rose-700 text-white text-[0.75rem] font-bold shadow-xs transition-colors cursor-pointer"
          >
            <FaWrench className="text-[0.6875rem]" />
            <span>ถัดไปที่ต้องแก้ ({remainingErrorCount}) →</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-[0.375rem] px-[0.875rem] py-[0.4375rem] rounded-[0.5rem] bg-[#00A651] hover:bg-[#008f45] text-white text-[0.75rem] font-bold shadow-xs transition-colors cursor-pointer"
          >
            <FaCheck className="text-[0.6875rem]" />
            <span>เสร็จ — กลับรายการ</span>
          </button>
        )}
      </div>
    </div>
  );
};

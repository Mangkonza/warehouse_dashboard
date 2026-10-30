'use client';

import React, { useState, memo, useCallback, useId } from 'react';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaBan,
  FaChevronDown,
  FaChevronUp,
  FaUndo,
  FaTrashAlt,
  FaUserCheck,
  FaUserTimes,
  FaInfoCircle,
} from 'react-icons/fa';
import { ImportRow, RowIssue } from './importAcademicDev.types';
import { PersonPicker, PersonValue } from '@/components/form/PersonPicker';
import { DepartmentSelect } from '@/components/ui/department-select';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { DatePicker, formatThaiBuddhistDate, parseDate } from '@/components/ui/date-picker';
import { MoneyInput, formatTwoDecimals } from '@/components/form/MoneyInput';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ImportReviewRowProps {
  row: ImportRow;
  displayIndex: number;
  isExpanded: boolean;
  onToggleExpand: (rowId: string) => void;
  onUpdateRowData: (rowId: string, updatedFields: Partial<ImportRow['data']>) => void;
  onToggleExclude: (rowId: string) => void;
}

export const ImportReviewRow = memo(function ImportReviewRow({
  row,
  displayIndex,
  isExpanded,
  onToggleExpand,
  onUpdateRowData,
  onToggleExclude,
}: ImportReviewRowProps) {
  const { data, status, excluded, issues, duplicateOf } = row;

  // Inline editing states for cells
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(data.name || '');

  // Helper to find issue for a specific field
  const getFieldIssue = useCallback(
    (field: keyof ImportRow['data']) => {
      return issues.find((i) => i.field === field);
    },
    [issues]
  );

  const nameIssue = getFieldIssue('name');
  const headIssue = getFieldIssue('head_name');
  const deptIssue = getFieldIssue('department_code');
  const budgetIssue = getFieldIssue('budget');
  const startDateIssue = getFieldIssue('start_date');
  const endDateIssue = getFieldIssue('end_date');

  // Status Badge Rendering
  const renderStatusBadge = () => {
    if (excluded) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
          <FaBan className="text-[10px]" /> ไม่นำเข้า
        </span>
      );
    }
    if (status === 'duplicate') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
          <FaBan className="text-[10px] text-slate-400" /> รายการซ้ำ
        </span>
      );
    }
    if (status === 'error') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <FaTimesCircle className="text-[11px] text-rose-500" /> ต้องแก้ไข
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <FaExclamationTriangle className="text-[10px] text-amber-500" /> ควรตรวจ
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <FaCheckCircle className="text-[10px] text-emerald-500" /> พร้อม
      </span>
    );
  };

  const isDimmed = excluded || status === 'duplicate';

  return (
    <>
      <tr
        id={`row-${row.rowId}`}
        className={cn(
          'border-b border-slate-100 transition-colors h-[56px] text-sm group',
          isDimmed ? 'opacity-55 bg-slate-50/50' : 'hover:bg-slate-50/80 bg-white',
          status === 'error' && !excluded && 'bg-rose-50/30',
          status === 'warning' && !excluded && 'bg-amber-50/20'
        )}
      >
        {/* 1. Row Index (#) - Sticky Left 0 */}
        <td className="sticky left-0 z-20 w-[48px] px-2 text-center text-xs font-semibold text-slate-500 bg-inherit border-r border-slate-200 shadow-[1px_0_2px_rgba(0,0,0,0.02)]">
          {displayIndex}
        </td>

        {/* 2. Status Badge with Popover - Sticky Left 48px */}
        <td className="sticky left-[48px] z-20 w-[120px] px-2 text-center bg-inherit border-r border-slate-200 shadow-[2px_0_3px_rgba(0,0,0,0.03)]">
          <Popover>
            <PopoverTrigger
              className="cursor-pointer inline-flex items-center justify-center outline-hidden focus:ring-2 focus:ring-emerald-500 rounded-full bg-transparent border-none p-0"
              title="คลิกเพื่อดูรายละเอียดปัญหาของแถวนี้"
            >
              {renderStatusBadge()}
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="w-72 p-3 text-xs z-50">
              <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <FaInfoCircle className="text-slate-500" />
                <span>สถานะแถวที่ {displayIndex} (แถว Excel {row.excelRowNumber})</span>
              </div>
              {duplicateOf && (
                <div className="p-2 mb-2 bg-slate-100 rounded-lg text-slate-700 border border-slate-200">
                  {duplicateOf}
                </div>
              )}
              {issues.length > 0 ? (
                <div className="space-y-1.5">
                  {issues.map((iss, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'p-2 rounded-lg flex items-start gap-1.5 text-xs font-medium',
                        iss.severity === 'error'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      )}
                    >
                      {iss.severity === 'error' ? (
                        <FaTimesCircle className="text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <FaExclamationTriangle className="text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <span>{iss.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-emerald-700 font-medium">ข้อมูลครบถ้วน พร้อมสำหรับการนำเข้า</div>
              )}
            </PopoverContent>
          </Popover>
        </td>

        {/* 3. Month from sheet */}
        <td className="w-[80px] px-2 text-center text-xs font-medium text-slate-600 truncate">
          {row.sheetName}
        </td>

        {/* 4. Project Name (Editable Inline) */}
        <td
          className={cn(
            'min-w-[280px] max-w-[360px] px-3 py-1.5 text-slate-800 font-medium align-middle',
            nameIssue?.severity === 'error' && 'bg-rose-50/60 rounded-xs ring-1 ring-rose-300 ring-inset'
          )}
        >
          {isEditingName ? (
            <input
              type="text"
              autoFocus
              disabled={excluded}
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={() => {
                setIsEditingName(false);
                if (nameVal.trim() !== data.name) {
                  onUpdateRowData(row.rowId, { name: nameVal.trim() });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                } else if (e.key === 'Escape') {
                  setNameVal(data.name || '');
                  setIsEditingName(false);
                }
              }}
              className="w-full text-sm px-2 py-1 border border-emerald-500 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-white"
            />
          ) : (
            <div
              onClick={() => !excluded && setIsEditingName(true)}
              className={cn(
                'cursor-pointer line-clamp-2 leading-snug py-1 hover:text-emerald-700 transition-colors',
                !data.name && 'text-rose-500 italic font-semibold'
              )}
              title={data.name || 'คลิกเพื่อระบุชื่อโครงการ (จำเป็น)'}
            >
              {data.name || (
                <span className="flex items-center gap-1 text-rose-600 font-semibold text-xs">
                  <FaExclamationTriangle className="text-[10px]" /> ต้องระบุชื่อโครงการ
                </span>
              )}
            </div>
          )}
        </td>

        {/* 5. Head of Project with PersonPicker */}
        <td
          className={cn(
            'w-[200px] px-2 py-1.5 align-middle',
            headIssue?.severity === 'error' && 'bg-rose-50/60 rounded-xs ring-1 ring-rose-300 ring-inset'
          )}
        >
          <div className="w-full flex items-center gap-1">
            <div className="flex-1 min-w-0">
              <PersonPicker
                value={{
                  person_id: data.head_personnel_id,
                  name: data.head_name || '',
                }}
                onChange={(val: PersonValue | null) => {
                  onUpdateRowData(row.rowId, {
                    head_name: val ? val.name : '',
                    head_personnel_id: val?.person_id || null,
                    department_code: val?.department ? data.department_code || val.department : data.department_code,
                  });
                }}
                disabled={excluded}
                placeholder="ระบุหัวหน้าโครงการ..."
                className="text-xs h-8"
              />
            </div>
            {data.head_personnel_id ? (
              <span title="จับคู่กับฐานข้อมูลบุคลากรแล้ว" className="text-emerald-600 shrink-0">
                <FaUserCheck className="text-xs" />
              </span>
            ) : data.head_name ? (
              <span title="ยังไม่พบในฐานข้อมูลบุคลากร (จะบันทึกเป็นชื่อข้อความ)" className="text-amber-500 shrink-0">
                <FaUserTimes className="text-xs" />
              </span>
            ) : null}
          </div>
        </td>

        {/* 6. Department with DepartmentSelect */}
        <td
          className={cn(
            'w-[130px] px-2 py-1.5 align-middle',
            deptIssue?.severity === 'error' && 'bg-rose-50/60 rounded-xs ring-1 ring-rose-300 ring-inset'
          )}
        >
          <DepartmentSelect
            value={data.department_code}
            onChange={(code) => onUpdateRowData(row.rowId, { department_code: code })}
            disabled={excluded}
            returnFormat="code"
            size="sm"
            placeholder="-- เลือกสังกัด --"
            className="text-xs h-8"
          />
        </td>

        {/* 7. Budget with MoneyInput */}
        <td
          className={cn(
            'w-[120px] px-2 py-1.5 align-middle text-right',
            budgetIssue?.severity === 'error' && 'bg-rose-50/60 rounded-xs ring-1 ring-rose-300 ring-inset'
          )}
        >
          <MoneyInput
            value={data.budget}
            onChange={(num) => onUpdateRowData(row.rowId, { budget: num ?? 0 })}
            disabled={excluded}
            className="text-xs h-8 text-right font-medium"
            placeholder="0.00"
          />
        </td>

        {/* 8. Start Date with DatePicker (พ.ศ.) */}
        <td
          className={cn(
            'w-[130px] px-2 py-1.5 align-middle',
            startDateIssue?.severity === 'error' && 'bg-rose-50/60 rounded-xs ring-1 ring-rose-300 ring-inset'
          )}
        >
          <DatePicker
            value={data.start_date}
            onChange={(_, dateStr) => onUpdateRowData(row.rowId, { start_date: dateStr || null })}
            disabled={excluded}
            placeholder="วันเริ่มต้น..."
            className="text-xs h-8"
          />
        </td>

        {/* 9. End Date with DatePicker (พ.ศ.) */}
        <td
          className={cn(
            'w-[130px] px-2 py-1.5 align-middle',
            endDateIssue?.severity === 'error' && 'bg-rose-50/60 rounded-xs ring-1 ring-rose-300 ring-inset'
          )}
        >
          <DatePicker
            value={data.end_date}
            onChange={(_, dateStr) => onUpdateRowData(row.rowId, { end_date: dateStr || null })}
            disabled={excluded}
            placeholder="วันสิ้นสุด..."
            className="text-xs h-8"
          />
        </td>

        {/* 10. Actions (Expand & Exclude/Restore) */}
        <td className="w-[96px] px-2 py-1.5 text-center align-middle whitespace-nowrap">
          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => onToggleExpand(row.rowId)}
              className={cn(
                'p-1.5 rounded-md text-xs transition-colors',
                isExpanded
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              )}
              title={isExpanded ? 'ย่อรายละเอียด' : 'ดู/แก้ไขข้อมูลเพิ่มเติม (ผู้ว่าจ้าง, ปีงบฯ, บูรณาการ)'}
            >
              {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            </button>

            <button
              type="button"
              onClick={() => onToggleExclude(row.rowId)}
              className={cn(
                'p-1.5 rounded-md text-xs transition-colors',
                excluded
                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold'
                  : 'text-rose-500 hover:bg-rose-50 hover:text-rose-700'
              )}
              title={excluded ? 'คืนค่าแถวนี้ให้นำเข้า' : 'ไม่นำเข้าแถวนี้'}
            >
              {excluded ? <FaUndo className="text-xs" /> : <FaTrashAlt className="text-xs" />}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Row Detail Section */}
      {isExpanded && (
        <tr className="bg-slate-50 border-b border-slate-200">
          <td colSpan={10} className="px-6 py-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  รายละเอียดข้อมูลเพิ่มเติม — แถวที่ {displayIndex} (แผ่นงาน {row.sheetName}, แถว Excel {row.excelRowNumber})
                </h5>
                <span className="text-[11px] text-slate-400">
                  รหัสระเบียนโครงการ: <strong className="text-slate-700">{data.record_number || '-'}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">หน่วยงานผู้ว่าจ้าง / ผู้ขอรับบริการ</label>
                  <input
                    type="text"
                    value={data.client || ''}
                    disabled={excluded}
                    onChange={(e) => onUpdateRowData(row.rowId, { client: e.target.value })}
                    placeholder="เช่น กรมส่งเสริมอุตสาหกรรม"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">ปีงบประมาณ (พ.ศ.)</label>
                  <input
                    type="number"
                    value={data.fiscal_year || ''}
                    disabled={excluded}
                    onChange={(e) => onUpdateRowData(row.rowId, { fiscal_year: e.target.value ? Number(e.target.value) : null })}
                    placeholder="เช่น 2568"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">บูรณาการกับโครงการวิจัย (รหัส/ชื่อ)</label>
                  <input
                    type="text"
                    value={data.research_projects || ''}
                    disabled={excluded}
                    onChange={(e) => onUpdateRowData(row.rowId, { research_projects: e.target.value })}
                    placeholder="เช่น 2207351 Computer Application"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">บูรณาการกับสิทธิบัตร/อนุสิทธิบัตร</label>
                  <input
                    type="text"
                    value={data.patent_integration || ''}
                    disabled={excluded}
                    onChange={(e) => onUpdateRowData(row.rowId, { patent_integration: e.target.value })}
                    placeholder="ระบุสิทธิบัตรที่นำมาบูรณาการ"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">วันที่เริ่มต้นบูรณาการ</label>
                  <DatePicker
                    value={data.integration_start_date}
                    onChange={(_, dateStr) => onUpdateRowData(row.rowId, { integration_start_date: dateStr || null })}
                    disabled={excluded}
                    placeholder="วันเริ่มบูรณาการ..."
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">วันที่สิ้นสุดบูรณาการ</label>
                  <DatePicker
                    value={data.integration_end_date}
                    onChange={(_, dateStr) => onUpdateRowData(row.rowId, { integration_end_date: dateStr || null })}
                    disabled={excluded}
                    placeholder="วันสิ้นสุดบูรณาการ..."
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-slate-600 font-semibold mb-1">หมายเหตุเพิ่มเติม</label>
                  <input
                    type="text"
                    value={data.remarks || ''}
                    disabled={excluded}
                    onChange={(e) => onUpdateRowData(row.rowId, { remarks: e.target.value })}
                    placeholder="บันทึกข้อความหรือเงื่อนไขเพิ่มเติม"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
});

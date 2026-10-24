'use client';

import React, { useMemo } from 'react';
import { FormField } from './FormField';
import { PersonPicker, PersonValue } from './PersonPicker';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { DepartmentSelect } from '@/components/ui/department-select';
import { DatePicker } from '@/components/ui/date-picker';
import { DateRangePickerBE, DateRangeBEValue } from './DateRangePickerBE';
import { MoneyInput } from './MoneyInput';
import { Check, Square, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IntellectualPropertyFormData {
  id?: string | number;
  _id?: string;
  name?: string;               // ชื่อเรื่อง
  title?: string;              // alias ชื่อเรื่อง
  inventors?: PersonValue[];   // ผู้ประดิษฐ์
  creator?: string;            // string fallback
  department?: string;         // สังกัด
  departments?: string[];      // รายการสังกัดที่ derived มา
  type?: string;               // 'อนุสิทธิบัตร' | 'สิทธิบัตร'
  filing_date?: string;        // วันที่ยื่น (YYYY-MM-DD)
  application_number?: string; // เลขที่คำขอ 10 หลัก
  registration_number?: string;// เลขที่ (ทะเบียน) 10 หลัก
  protection_start?: string;   // วันที่เริ่มต้นความคุ้มครอง
  protection_end?: string;     // วันที่สิ้นสุดความคุ้มครอง
  support_amount?: number;     // คณะฯ สนับสนุน
  remarks?: string;            // หมายเหตุ
  req_no?: string;             // legacy combined string
  status?: string;             // legacy status
  [key: string]: any;
}

export interface IntellectualPropertyFormProps {
  formData: IntellectualPropertyFormData;
  onChange: (key: string, val: any) => void;
  setFormData?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isEdit?: boolean;
  errors?: Record<string, string>;
}

export function IntellectualPropertyForm({
  formData,
  onChange,
  setFormData,
  isEdit = false,
  errors = {},
}: IntellectualPropertyFormProps) {
  // Normalize inventors list
  const selectedInventors: PersonValue[] = useMemo(() => {
    if (Array.isArray(formData.inventors) && formData.inventors.length > 0) {
      return formData.inventors;
    }
    // Fallback: parse from creator string if editing legacy record
    if (formData.creator && typeof formData.creator === 'string') {
      const names = formData.creator.split(',').map((s) => s.trim()).filter(Boolean);
      return names.map((n) => ({
        name: n,
        person_id: formData.person_id || null,
        department: formData.department || '',
      }));
    }
    return [];
  }, [formData.inventors, formData.creator, formData.person_id, formData.department]);

  // Derived distinct affiliations from inventors
  const distinctAffiliations = useMemo(() => {
    const list: string[] = [];
    selectedInventors.forEach((inv) => {
      if (inv.department && inv.department.trim() && inv.department !== '-' && inv.department !== 'nan') {
        const parts = inv.department.split(',').map((s) => s.trim()).filter(Boolean);
        parts.forEach((p) => {
          if (!list.includes(p)) list.push(p);
        });
      }
    });
    return list;
  }, [selectedInventors]);

  // Handle inventors change: update inventors, creator string, and auto-populate department if needed
  const handleInventorsChange = (newInventors: PersonValue[]) => {
    onChange('inventors', newInventors);

    // Derived creator string
    const creatorStr = newInventors.map((i) => i.name).filter(Boolean).join(', ');
    onChange('creator', creatorStr);

    // Derived distinct affiliations
    const depts: string[] = [];
    newInventors.forEach((inv) => {
      if (inv.department && inv.department.trim() && inv.department !== '-' && inv.department !== 'nan') {
        const parts = inv.department.split(',').map((s) => s.trim()).filter(Boolean);
        parts.forEach((p) => {
          if (!depts.includes(p)) depts.push(p);
        });
      }
    });

    onChange('departments', depts);
    onChange('department', depts.join(', '));
  };

  // Block non-digit keys for 10-digit fields
  const handleKeyDown10Digits = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/^\d$/.test(e.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key) &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
    }
  };

  // Clean input to digits only, max 10
  const handle10DigitChange = (field: string, raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 10);
    onChange(field, digitsOnly);
  };

  const handlePasteDigits = (field: string, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const digitsOnly = pasted.replace(/\D/g, '').slice(0, 10);
    onChange(field, digitsOnly);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: ข้อมูลทั่วไป */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        {/* 1. ชื่อเรื่อง */}
        <FormField
          label="ชื่อเรื่อง"
          required
          error={errors.name || errors.title}
        >
          <textarea
            value={formData.name || formData.title || ''}
            onChange={(e) => {
              onChange('name', e.target.value);
              onChange('title', e.target.value);
            }}
            rows={3}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className={cn(
              'w-full p-3 text-sm rounded-lg border border-slate-300 bg-white shadow-2xs transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]',
              (errors.name || errors.title) && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            )}
          />
        </FormField>

        {/* 2. ผู้ประดิษฐ์ */}
        <FormField
          label="ผู้ประดิษฐ์"
          required
          error={errors.inventors || errors.creator}
        >
          <PersonPicker
            multiple={true}
            values={selectedInventors}
            onChangeMultiple={handleInventorsChange}
            placeholder="ค้นหาหรือระบุชื่อผู้ประดิษฐ์..."
          />
        </FormField>

        {/* 3. สังกัด */}
        <FormField
          label="สังกัด"
          error={errors.department}
        >
          <div className="space-y-2">
            {/* Auto-filled Affiliation Badges */}
            <div className="flex items-center gap-2 flex-wrap min-h-8 p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 mr-1 select-none">
                สังกัดของผู้ประดิษฐ์:
              </span>
              {distinctAffiliations.length > 0 ? (
                distinctAffiliations.map((dept, idx) => (
                  <DepartmentBadge key={idx} value={dept} />
                ))
              ) : (
                <span className="text-xs text-slate-400">-</span>
              )}
            </div>

            {/* Manual Affiliation adjustment select */}
            <DepartmentSelect
              value={formData.department || ''}
              onChange={(dept) => onChange('department', dept)}
              className="w-full"
            />
          </div>
        </FormField>

        {/* 4. ประเภททรัพย์สินทางปัญญา (Single choice checkbox style) */}
        <FormField
          label="ประเภททรัพย์สินทางปัญญา"
          required
          error={errors.type}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Option: อนุสิทธิบัตร */}
            <button
              type="button"
              onClick={() => onChange('type', 'อนุสิทธิบัตร')}
              className={cn(
                'flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all select-none',
                formData.type === 'อนุสิทธิบัตร'
                  ? 'border-[#00A651] bg-emerald-50/60 ring-2 ring-[#00A651]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              )}
            >
              <div
                className={cn(
                  'size-5 rounded flex items-center justify-center border transition-colors shrink-0',
                  formData.type === 'อนุสิทธิบัตร'
                    ? 'border-[#00A651] bg-[#00A651] text-white'
                    : 'border-slate-300 bg-white'
                )}
              >
                {formData.type === 'อนุสิทธิบัตร' && <Check className="size-3.5 stroke-[3]" />}
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-800">อนุสิทธิบัตร</span>
              </div>
            </button>

            {/* Option: สิทธิบัตร */}
            <button
              type="button"
              onClick={() => onChange('type', 'สิทธิบัตร')}
              className={cn(
                'flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all select-none',
                formData.type === 'สิทธิบัตร'
                  ? 'border-[#00A651] bg-emerald-50/60 ring-2 ring-[#00A651]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              )}
            >
              <div
                className={cn(
                  'size-5 rounded flex items-center justify-center border transition-colors shrink-0',
                  formData.type === 'สิทธิบัตร'
                    ? 'border-[#00A651] bg-[#00A651] text-white'
                    : 'border-slate-300 bg-white'
                )}
              >
                {formData.type === 'สิทธิบัตร' && <Check className="size-3.5 stroke-[3]" />}
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-800">สิทธิบัตร</span>
              </div>
            </button>
          </div>
        </FormField>
      </div>

      {/* SECTION 2: ขั้นตอนดำเนินการ */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
          ขั้นตอนดำเนินการ
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* วันที่ยื่น */}
          <FormField
            label="วันที่ยื่น"
            error={errors.filing_date}
          >
            <DatePicker
              value={formData.filing_date || ''}
              onChange={(_date, dateStr) => onChange('filing_date', dateStr)}
            />
          </FormField>

          {/* เลขที่คำขอ (10 digits) */}
          <FormField
            label="เลขที่คำขอ"
            error={errors.application_number}
          >
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={formData.application_number || ''}
                onChange={(e) => handle10DigitChange('application_number', e.target.value)}
                onKeyDown={handleKeyDown10Digits}
                onPaste={(e) => handlePasteDigits('application_number', e)}
                className={cn(
                  'w-full h-10 px-3 font-mono text-sm rounded-lg border border-slate-300 bg-white shadow-2xs transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]',
                  errors.application_number && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                )}
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono select-none">
                {(formData.application_number || '').length}/10
              </span>
            </div>
          </FormField>
        </div>
      </div>

      {/* SECTION 3: ได้รับความคุ้มครอง */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
          ได้รับความคุ้มครอง
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* เลขที่ (10 digits) */}
          <FormField
            label="เลขที่"
            error={errors.registration_number}
          >
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={formData.registration_number || ''}
                onChange={(e) => handle10DigitChange('registration_number', e.target.value)}
                onKeyDown={handleKeyDown10Digits}
                onPaste={(e) => handlePasteDigits('registration_number', e)}
                className={cn(
                  'w-full h-10 px-3 font-mono text-sm rounded-lg border border-slate-300 bg-white shadow-2xs transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]',
                  errors.registration_number && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                )}
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono select-none">
                {(formData.registration_number || '').length}/10
              </span>
            </div>
          </FormField>

          {/* ระยะเวลาคุ้มครอง (วันที่เริ่มต้น - วันที่สิ้นสุด) */}
          <FormField
            label="ระยะเวลาคุ้มครอง"
            error={errors.protection_dates}
          >
            <DateRangePickerBE
              value={{
                start: formData.protection_start || null,
                end: formData.protection_end || null,
              }}
              onChange={(range: DateRangeBEValue) => {
                onChange('protection_start', range.start || '');
                onChange('protection_end', range.end || '');
              }}
              startPlaceholder="วันที่เริ่มต้น"
              endPlaceholder="วันที่สิ้นสุด"
            />
          </FormField>
        </div>
      </div>

      {/* SECTION 4: การสนับสนุนและหมายเหตุ */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        {/* 7. คณะฯ สนับสนุน */}
        <FormField
          label="คณะฯ สนับสนุน"
          error={errors.support_amount}
        >
          <MoneyInput
            value={formData.support_amount !== undefined && formData.support_amount !== null ? Number(formData.support_amount) : 0}
            onChange={(val) => onChange('support_amount', val ?? 0)}
            className="w-full"
            min={0}
          />
        </FormField>

        {/* 8. หมายเหตุ */}
        <FormField
          label="หมายเหตุ"
          error={errors.remarks}
        >
          <textarea
            value={formData.remarks || ''}
            onChange={(e) => onChange('remarks', e.target.value)}
            rows={3}
            className={cn(
              'w-full p-3 text-sm rounded-lg border border-slate-300 bg-white shadow-2xs transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]'
            )}
          />
        </FormField>
      </div>
    </div>
  );
}

export default IntellectualPropertyForm;

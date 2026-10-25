'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { FormField } from './FormField';
import { PersonPicker, PersonValue } from './PersonPicker';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { DepartmentSelect } from '@/components/ui/department-select';
import { DatePicker } from '@/components/ui/date-picker';
import { MoneyInput } from './MoneyInput';
import { Check, Info, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IP_TYPE_COLOR } from '@/components/ui/ip-type-badge';

export const IP_TYPES = [
  { id: 'petty_patent', label: 'อนุสิทธิบัตร' },
  { id: 'patent', label: 'สิทธิบัตร' },
  { id: 'copyright', label: 'ลิขสิทธิ์' },
] as const;

export const COPYRIGHT_WORK_CATEGORIES = [
  'วรรณกรรม',
  'นาฏกรรม',
  'ศิลปกรรม',
  'ดนตรีกรรม',
  'โสตทัศนวัสดุ',
  'ภาพยนตร์',
  'สิ่งบันทึกเสียง',
  'งานแพร่เสียงแพร่ภาพ',
  'อื่น ๆ',
] as const;

export interface IntellectualPropertyFormData {
  id?: string | number;
  _id?: string;
  name?: string;               // ชื่อเรื่อง / ชื่อผลงาน
  title?: string;              // alias ชื่อเรื่อง
  inventors?: PersonValue[];   // ผู้ประดิษฐ์
  creator?: string;            // string fallback
  department?: string;         // สังกัด
  departments?: string[];      // รายการสังกัดที่ derived มา
  type?: string;               // 'อนุสิทธิบัตร' | 'สิทธิบัตร' | 'ลิขสิทธิ์'
  owner?: string;              // เจ้าของสิทธิ (default: มหาวิทยาลัยเกษตรศาสตร์)
  right_holder?: string;       // alias เจ้าของสิทธิ
  filing_date?: string;        // วันที่ยื่น / วันที่แจ้งข้อมูลลิขสิทธิ์ (YYYY-MM-DD)
  application_number?: string; // เลขที่คำขอ (10 หลัก สำหรับสิทธิบัตร, 1-10 หลัก สำหรับลิขสิทธิ์)
  registration_number?: string;// เลขทะเบียน (string e.g. 28565 หรือ ว1.000033)
  protection_start?: string;   // วันที่ออกให้ / วันที่ออกหนังสือรับรอง
  protection_end?: string;     // วันหมดอายุ (เฉพาะสิทธิบัตร/อนุสิทธิบัตร)
  work_category?: string;      // ประเภทงาน (เฉพาะลิขสิทธิ์)
  work_character?: string;     // ลักษณะงาน (เฉพาะลิขสิทธิ์ e.g. โปรแกรมคอมพิวเตอร์)
  support_amount?: number;     // เงินสนับสนุนจากคณะ (บาท)
  remarks?: string;            // หมายเหตุ
  req_no?: string;             // legacy combined string
  status?: string;             // status string
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
  const currentType = formData.type || '';
  const isCopyright = currentType === 'ลิขสิทธิ์';
  const isPatent = currentType === 'สิทธิบัตร';
  const isPettyPatent = currentType === 'อนุสิทธิบัตร';
  const isTypeSelected = Boolean(currentType);

  // ตรวจสอบว่าประเภทงานปัจจุบันเป็นหนึ่งในตัวเลือกมาตรฐาน (ไม่รวม "อื่น ๆ") หรือไม่
  const isStandardCategory = useMemo(() => {
    return COPYRIGHT_WORK_CATEGORIES.filter((c) => c !== 'อื่น ๆ').includes(
      formData.work_category as any
    );
  }, [formData.work_category]);

  // สถานะว่าช่องประเภทงานกำลังอยู่ในโหมดพิมพ์เองหรือไม่
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(() => {
    return Boolean(formData.work_category && !isStandardCategory);
  });

  // Sync state ประเภทงานเมื่อโหลดข้อมูลมาแก้ไข
  useEffect(() => {
    if (formData.work_category && !isStandardCategory) {
      setIsCustomCategory(true);
    } else if (isStandardCategory) {
      setIsCustomCategory(false);
    }
  }, [formData.work_category, isStandardCategory]);

  // Initialize default owner if empty
  useEffect(() => {
    if (!formData.owner && !formData.right_holder) {
      onChange('owner', 'มหาวิทยาลัยเกษตรศาสตร์');
      onChange('right_holder', 'มหาวิทยาลัยเกษตรศาสตร์');
    }
  }, [formData.owner, formData.right_holder, onChange]);

  // Normalize inventors / creators list
  const selectedInventors: PersonValue[] = useMemo(() => {
    if (Array.isArray(formData.inventors) && formData.inventors.length > 0) {
      return formData.inventors;
    }
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
    const creatorStr = newInventors.map((i) => i.name).filter(Boolean).join(', ');
    onChange('creator', creatorStr);
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
    if (!formData.department || formData.department === '-') {
      onChange('department', depts.join(', '));
    }
  };

  // Handle switching IP Type
  const handleSelectType = (targetType: string) => {
    if (currentType === targetType) return;
    if (isEdit && currentType) {
      const ok = window.confirm(
        `คุณต้องการเปลี่ยนประเภทจาก "${currentType}" เป็น "${targetType}" ใช่หรือไม่?\n(ข้อมูลเฉพาะประเภทเดิม เช่น ข้อมูลงานลิขสิทธิ์ หรือวันหมดอายุ จะถูกล้าง)`
      );
      if (!ok) return;
    }
    onChange('type', targetType);
    // Clear type-specific fields when switching
    if (targetType === 'ลิขสิทธิ์') {
      onChange('protection_end', '');
    } else {
      onChange('work_category', '');
      onChange('work_character', '');
      setIsCustomCategory(false);
    }
  };

  // Handle numeric application number
  const handleAppNumberChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 10);
    onChange('application_number', digitsOnly);
  };

  // Handle registration number (can be letters, numbers, dots for copyright; string for patents)
  const handleRegNumberChange = (raw: string) => {
    onChange('registration_number', raw.slice(0, 50));
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: ประเภททรัพย์สินทางปัญญา และข้อมูลพื้นฐาน */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        {/* เลือกประเภท (3 การ์ด ด้านบนสุด) */}
        <div>
          <label className="text-[13px] font-semibold text-slate-800 flex items-center gap-1 select-none mb-2">
            <span>ประเภททรัพย์สินทางปัญญา</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {IP_TYPES.map((t) => {
              const isSelected = currentType === t.label;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectType(t.label)}
                  className={cn(
                    'flex items-center justify-between min-h-[46px] px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer relative select-none text-left',
                    isSelected
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#D4AF37]/50 text-slate-700 hover:text-slate-900'
                  )}
                  style={
                    isSelected
                      ? {
                          backgroundColor: IP_TYPE_COLOR,
                          borderColor: IP_TYPE_COLOR,
                        }
                      : undefined
                  }
                >
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-normal leading-normal',
                      isSelected ? 'text-white' : 'text-slate-700'
                    )}
                  >
                    {t.label}
                  </span>
                  {isSelected && (
                    <Check className="size-4 text-white stroke-[3] shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
          {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
        </div>

        {!isTypeSelected ? (
          <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-4 text-amber-800 text-xs sm:text-sm flex items-center gap-2.5">
            <Info className="size-4 text-amber-600 shrink-0" />
            <span>กรุณาเลือกประเภททรัพย์สินทางปัญญาด้านบนเพื่อเริ่มกรอกข้อมูล</span>
          </div>
        ) : (
          <>
            {/* 1. ชื่อผลงาน / ชื่อที่แสดงถึงการประดิษฐ์ */}
            <FormField
              label={
                isCopyright
                  ? 'ชื่อผลงาน'
                  : 'ชื่อผลงาน / ชื่อที่แสดงถึงการประดิษฐ์'
              }
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
                spellCheck={false}
                placeholder={
                  isCopyright
                    ? 'กรอกชื่อผลงานลิขสิทธิ์...'
                    : 'กรอกชื่อผลงานหรือชื่อสิ่งประดิษฐ์...'
                }
                className={cn(
                  'w-full p-3 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white shadow-2xs transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]',
                  (errors.name || errors.title) && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                )}
              />
            </FormField>

            {/* ฟิลด์เฉพาะลิขสิทธิ์: ประเภทงาน และ ลักษณะงาน */}
            {isCopyright && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-amber-50/30 border border-amber-100">
                <FormField
                  label="ประเภทงาน"
                  required
                  error={errors.work_category}
                  
                >
                  <div className="relative">
                    {isCustomCategory ? (
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          autoFocus
                          value={formData.work_category || ''}
                          onChange={(e) => onChange('work_category', e.target.value)}
                          placeholder="พิมพ์ระบุประเภทงาน..."
                          className={cn(
                            'w-full h-10 pl-3 pr-9 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white shadow-2xs transition-colors',
                            'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]',
                            errors.work_category && 'border-red-500'
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomCategory(false);
                            onChange('work_category', '');
                          }}
                          title="กลับไปเลือกรายการตัวเลือก"
                          className="absolute right-2 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <RotateCcw className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <select
                        value={formData.work_category || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'อื่น ๆ') {
                            setIsCustomCategory(true);
                            onChange('work_category', '');
                          } else {
                            onChange('work_category', val);
                          }
                        }}
                        className={cn(
                          'w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white shadow-2xs transition-colors',
                          'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]',
                          errors.work_category && 'border-red-500'
                        )}
                      >
                        <option value="">-- เลือกประเภทงานลิขสิทธิ์ --</option>
                        {COPYRIGHT_WORK_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </FormField>

                <FormField
                  label="ลักษณะงาน"

                >
                  <input
                    type="text"
                    value={formData.work_character || ''}
                    onChange={(e) => onChange('work_character', e.target.value)}
                    placeholder="ระบุลักษณะงานลิขสิทธิ์..."
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                  />
                </FormField>
              </div>
            )}

            {/* 2. ผู้ประดิษฐ์ */}
            <FormField
              label={isCopyright ? 'ผู้สร้างสรรค์' : 'ผู้ประดิษฐ์'}
              required
              error={errors.inventors || errors.creator}
            >
              <PersonPicker
                multiple={true}
                values={selectedInventors}
                onChangeMultiple={handleInventorsChange}
                placeholder={
                  isCopyright
                    ? 'ค้นหาหรือระบุชื่อผู้สร้างสรรค์...'
                    : 'ค้นหาหรือระบุชื่อผู้ประดิษฐ์...'
                }
              />
            </FormField>

            {/* 3. สังกัด */}
            <FormField label="สังกัด" error={errors.department}>
              <div className="flex items-center gap-2 flex-wrap min-h-10 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 mr-1 select-none">
                  {isCopyright ? 'สังกัดของผู้สร้างสรรค์:' : 'สังกัดของผู้ประดิษฐ์:'}
                </span>
                {distinctAffiliations.length > 0 ? (
                  distinctAffiliations.map((dept, idx) => (
                    <DepartmentBadge key={idx} value={dept} />
                  ))
                ) : (
                  <span className="text-xs text-slate-400">ระบุสังกัดอัตโนมัติตามรายชื่อด้านบน</span>
                )}
              </div>
            </FormField>

            {/* 4. เจ้าของสิทธิ */}
            <FormField
              label={
                isCopyright
                  ? 'เจ้าของลิขสิทธิ์ / ผู้แจ้งข้อมูล'
                  : 'ชื่อผู้ทรงอนุสิทธิบัตร/สิทธิบัตร / เจ้าของสิทธิ'
              }
              required
              hint="ค่าเริ่มต้น: มหาวิทยาลัยเกษตรศาสตร์ (สามารถแก้ไขได้)"
            >
              <input
                type="text"
                value={formData.owner || formData.right_holder || 'มหาวิทยาลัยเกษตรศาสตร์'}
                onChange={(e) => {
                  onChange('owner', e.target.value);
                  onChange('right_holder', e.target.value);
                }}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
              />
            </FormField>
          </>
        )}
      </div>

      {isTypeSelected && (
        <>
          {/* SECTION 2: ขั้นตอนดำเนินการ */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              ขั้นตอนดำเนินการ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* วันที่ยื่นคำขอ */}
              <FormField
                label={
                  isCopyright
                    ? 'วันที่แจ้งข้อมูลลิขสิทธิ์ (วันยื่นเรื่อง)'
                    : 'วันที่ยื่นคำขอ'
                }
                required
                error={errors.filing_date}
              >
                <DatePicker
                  value={formData.filing_date || ''}
                  onChange={(_date, dateStr) => onChange('filing_date', dateStr)}
                  placeholder={isCopyright ? 'เลือกวันที่แจ้งข้อมูลลิขสิทธิ์ (พ.ศ.)' : 'เลือกวันที่ยื่นคำขอ (พ.ศ.)'}
                />
              </FormField>

              {/* เลขที่คำขอ */}
              <FormField
                label={
                  isCopyright
                    ? 'คำขอแจ้งข้อมูลเลขที่'
                    : 'เลขที่คำขอ'
                }
                required
                error={errors.application_number}
                
              >
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.application_number || ''}
                    onChange={(e) => handleAppNumberChange(e.target.value)}
                    placeholder={isCopyright ? 'ระบุเลขที่คำขอแจ้งข้อมูลลิขสิทธิ์' : 'ระบุเลขที่คำขอ 10 หลัก'}
                    className={cn(
                      'w-full h-10 px-3 font-mono text-xs sm:text-sm rounded-lg border border-slate-300 bg-white shadow-2xs transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]',
                      errors.application_number && 'border-red-500'
                    )}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono select-none">
                    {(formData.application_number || '').length}/10
                  </span>
                </div>
              </FormField>
            </div>
          </div>

          {/* SECTION 3: ได้รับความคุ้มครอง / ออกให้ */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              {isCopyright ? 'การออกหนังสือรับรอง' : 'ได้รับความคุ้มครอง'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* เลขทะเบียน (String, รองรับ ว1.000033) */}
              <FormField
                label={
                  isCopyright
                    ? 'ทะเบียนข้อมูลเลขที่'
                    : isPettyPatent
                    ? 'เลขที่อนุสิทธิบัตร'
                    : 'เลขที่สิทธิบัตร'
                }
                error={errors.registration_number}
              >
                <div className="relative">
                  <input
                    type="text"
                    maxLength={50}
                    value={formData.registration_number || ''}
                    onChange={(e) => handleRegNumberChange(e.target.value)}
                    placeholder={
                      isCopyright
                        ? 'ระบุเลขทะเบียนลิขสิทธิ์รูปแบบ ว1.000033'
                        : isPettyPatent
                        ? 'กรอกเลขทะเบียนอนุสิทธิบัตร'
                        : 'กรอกเลขทะเบียนสิทธิบัตร'
                    }
                    className={cn(
                      'w-full h-10 px-3 font-mono text-xs sm:text-sm rounded-lg border border-slate-300 bg-white shadow-2xs transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]',
                      errors.registration_number && 'border-red-500'
                    )}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono select-none">
                    {(formData.registration_number || '').length}/{isCopyright ? 9 : 5}
                  </span>
                </div>
              </FormField>

              {/* วันที่ออกให้ / ออกหนังสือรับรอง */}
              <FormField
                label={
                  isCopyright
                    ? 'วันที่ออกหนังสือรับรอง'
                    : 'วันที่ออกให้ (เริ่มต้นความคุ้มครอง)'
                }
                error={errors.protection_start}
              >
                <DatePicker
                  value={formData.protection_start || ''}
                  onChange={(_date, dateStr) => onChange('protection_start', dateStr)}
                  placeholder={isCopyright ? 'เลือกวันที่ออกหนังสือรับรอง (พ.ศ.)' : 'เลือกวันที่เริ่มคุ้มครอง (พ.ศ.)'}
                />
              </FormField>

              {/* วันหมดอายุ (เฉพาะสิทธิบัตร/อนุสิทธิบัตร, ซ่อนสำหรับลิขสิทธิ์) */}
              {!isCopyright && (
                <FormField
                  label="วันหมดอายุ (ระยะเวลาคุ้มครองสิ้นสุด)"
                  error={errors.protection_end}
                >
                  <DatePicker
                    value={formData.protection_end || ''}
                    onChange={(_date, dateStr) => onChange('protection_end', dateStr)}
                    placeholder="เลือกวันหมดอายุความคุ้มครอง (พ.ศ.)"
                  />
                </FormField>
              )}
            </div>
          </div>

          {/* SECTION 4: การสนับสนุนและหมายเหตุ */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* เงินสนับสนุนจากคณะ (บาท) */}
              <FormField
                label="เงินสนับสนุนจากคณะ (บาท) (บาท)"
                error={errors.support_amount}
              >
                <MoneyInput
                  value={formData.support_amount !== undefined && formData.support_amount !== null ? Number(formData.support_amount) : 0}
                  onChange={(val) => onChange('support_amount', val ?? 0)}
                  className="w-full"
                  min={0}
                />
              </FormField>

              {/* หมายเหตุ */}
              <FormField label="หมายเหตุ" error={errors.remarks}>
                <textarea
                  value={formData.remarks || ''}
                  onChange={(e) => onChange('remarks', e.target.value)}
                  rows={2}
                  placeholder="กรอกหมายเหตุเพิ่มเติม (ถ้ามี)..."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                />
              </FormField>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default IntellectualPropertyForm;
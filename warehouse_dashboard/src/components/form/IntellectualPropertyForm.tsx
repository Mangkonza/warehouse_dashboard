'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { FormField } from './FormField';
import { PersonPicker, PersonValue } from './PersonPicker';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { DatePicker } from '@/components/ui/date-picker';
import { MoneyInput } from './MoneyInput';
import { Info, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  name?: string;
  title?: string;
  inventors?: PersonValue[];
  creator?: string;
  department?: string;
  departments?: string[];
  type?: string;
  owner?: string;
  right_holder?: string;
  filing_date?: string;
  application_number?: string;
  registration_number?: string;
  protection_start?: string;
  protection_end?: string;
  work_category?: string;
  work_character?: string;
  support_amount?: number;
  remarks?: string;
  req_no?: string;
  status?: string;
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
  isEdit = false,
  errors = {},
}: IntellectualPropertyFormProps) {
  const currentType = formData.type || '';
  const isCopyright = currentType === 'ลิขสิทธิ์';
  const isPettyPatent = currentType === 'อนุสิทธิบัตร';
  const isTypeSelected = Boolean(currentType);

  const isStandardCategory = useMemo(() => {
    return COPYRIGHT_WORK_CATEGORIES.filter((c) => c !== 'อื่น ๆ').includes(
      formData.work_category as any
    );
  }, [formData.work_category]);

  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(() => {
    return Boolean(formData.work_category && !isStandardCategory);
  });

  useEffect(() => {
    if (formData.work_category && !isStandardCategory) {
      setIsCustomCategory(true);
    } else if (isStandardCategory) {
      setIsCustomCategory(false);
    }
  }, [formData.work_category, isStandardCategory]);

  useEffect(() => {
    if (!formData.owner && !formData.right_holder) {
      onChange('owner', 'มหาวิทยาลัยเกษตรศาสตร์');
      onChange('right_holder', 'มหาวิทยาลัยเกษตรศาสตร์');
    }
  }, [formData.owner, formData.right_holder, onChange]);

  useEffect(() => {
    if (!formData.application_number) {
      let app = formData.req_info || formData.app_no || '';
      if (!app && formData.req_no) {
        const parts = String(formData.req_no).split('/');
        app = parts[0]?.trim() || String(formData.req_no);
      }
      if (app && app !== '-' && app !== 'nan') {
        onChange('application_number', app);
      }
    }

    if (!formData.registration_number) {
      let reg = formData.reg_info || formData.reg_no || formData.patent_number || '';
      if (!reg && formData.req_no && String(formData.req_no).includes('/')) {
        const parts = String(formData.req_no).split('/');
        reg = parts[1]?.trim() || '';
      }
      if (reg && reg !== '-' && reg !== 'nan') {
        onChange('registration_number', reg);
      }
    }
  }, [
    formData.application_number,
    formData.registration_number,
    formData.req_no,
    formData.reg_no,
    formData.req_info,
    formData.reg_info,
    formData.app_no,
    formData.patent_number,
    onChange,
  ]);

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

  const handleSelectType = (targetType: string) => {
    if (currentType === targetType) return;
    if (isEdit && currentType) {
      const ok = window.confirm(
        `คุณต้องการเปลี่ยนประเภทจาก "${currentType}" เป็น "${targetType}" ใช่หรือไม่?\n(ข้อมูลเฉพาะประเภทเดิม เช่น ข้อมูลงานลิขสิทธิ์ หรือวันหมดอายุ จะถูกล้าง)`
      );
      if (!ok) return;
    }
    onChange('type', targetType);
    if (targetType === 'ลิขสิทธิ์') {
      onChange('protection_end', '');
    } else {
      onChange('work_category', '');
      onChange('work_character', '');
      setIsCustomCategory(false);
    }
  };

  const handleAppNumberChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 10);
    onChange('application_number', digitsOnly);
    onChange('req_info', digitsOnly);
    onChange('app_no', digitsOnly);
    const reg = formData.registration_number || formData.reg_no || formData.reg_info || '';
    if (reg) {
      onChange('req_no', `${digitsOnly} / ${reg}`);
    } else {
      onChange('req_no', digitsOnly);
    }
  };

  const handleRegNumberChange = (raw: string) => {
    const clean = raw.slice(0, 50);
    onChange('registration_number', clean);
    onChange('reg_info', clean);
    onChange('reg_no', clean);
    const app = formData.application_number || formData.req_no || formData.req_info || '';
    if (app) {
      const appOnly = String(app).includes('/') ? String(app).split('/')[0]?.trim() : app;
      onChange('req_no', `${appOnly} / ${clean}`);
    }
  };

  return (
    <div className="space-y-7 text-slate-800">
      {/* ========================================================================= */}
      {/* ส่วนที่ 1: ข้อมูลพื้นฐานและผู้ประดิษฐ์ / ผู้สร้างสรรค์ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ข้อมูลพื้นฐานและผู้ประดิษฐ์ / ผู้สร้างสรรค์
          </h4>
        </div>

        <FormField label="ประเภททรัพย์สินทางปัญญา" required error={errors.type}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {IP_TYPES.map((t) => {
              const isSelected = currentType === t.label;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectType(t.label)}
                  className={cn(
                    'flex items-center justify-center h-10 px-3.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer select-none',
                    isSelected
                      ? 'bg-[#00A651] text-white border-[#00A651]'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </FormField>

        {!isTypeSelected ? (
          <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-3.5 text-amber-800 text-xs sm:text-sm flex items-center gap-2.5">
            <Info className="size-4 text-amber-600 shrink-0" />
            <span>กรุณาเลือกประเภททรัพย์สินทางปัญญาด้านบนเพื่อเริ่มกรอกข้อมูล</span>
          </div>
        ) : (
          <>
            <FormField
              label={isCopyright ? 'ชื่อผลงาน' : 'ชื่อผลงาน / ชื่อที่แสดงถึงการประดิษฐ์'}
              required
              error={errors.name || errors.title}
            >
              <textarea
                value={formData.name || formData.title || ''}
                onChange={(e) => {
                  onChange('name', e.target.value);
                  onChange('title', e.target.value);
                }}
                rows={2}
                autoComplete="off"
                spellCheck={false}
                placeholder={
                  isCopyright
                    ? 'กรอกชื่อผลงานลิขสิทธิ์...'
                    : 'กรอกชื่อผลงานหรือชื่อสิ่งประดิษฐ์...'
                }
                className={cn(
                  'w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]',
                  (errors.name || errors.title) && 'border-red-500 focus:border-red-500'
                )}
              />
            </FormField>

            {isCopyright && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="ประเภทงาน" required error={errors.work_category}>
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
                            'w-full h-10 pl-3 pr-9 text-sm rounded-lg border border-slate-300 bg-white transition-colors',
                            'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]',
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
                          'w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white transition-colors',
                          'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]',
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

                <FormField label="ลักษณะงาน">
                  <input
                    type="text"
                    value={formData.work_character || ''}
                    onChange={(e) => onChange('work_character', e.target.value)}
                    placeholder="ระบุลักษณะงานลิขสิทธิ์..."
                    className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
                  />
                </FormField>
              </div>
            )}

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="สังกัด" error={errors.department}>
                <div className="flex items-center gap-1.5 flex-wrap min-h-10 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                  {distinctAffiliations.length > 0 ? (
                    distinctAffiliations.map((dept, idx) => (
                      <DepartmentBadge key={idx} value={dept} />
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">ระบุสังกัดอัตโนมัติตามรายชื่อผู้ประดิษฐ์</span>
                  )}
                </div>
              </FormField>

              <FormField
                label={
                  isCopyright
                    ? 'เจ้าของลิขสิทธิ์ / ผู้แจ้งข้อมูล'
                    : 'ชื่อผู้ทรงอนุสิทธิบัตร/สิทธิบัตร / เจ้าของสิทธิ'
                }
                required
              >
                <input
                  type="text"
                  value={formData.owner || formData.right_holder || 'มหาวิทยาลัยเกษตรศาสตร์'}
                  onChange={(e) => {
                    onChange('owner', e.target.value);
                    onChange('right_holder', e.target.value);
                  }}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
                />
              </FormField>
            </div>
          </>
        )}
      </section>

      {isTypeSelected && (
        <>
          {/* ========================================================================= */}
          {/* ส่วนที่ 2: ขั้นตอนดำเนินการยื่นคำขอ */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
              <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
                ขั้นตอนดำเนินการยื่นคำขอ
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <FormField
                label={isCopyright ? 'คำขอแจ้งข้อมูลเลขที่' : 'เลขที่คำขอ'}
                required
                error={errors.application_number}
              >
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={
                      formData.application_number ||
                      formData.req_info ||
                      formData.app_no ||
                      (formData.req_no ? String(formData.req_no).split('/')[0]?.trim() : '') ||
                      ''
                    }
                    onChange={(e) => handleAppNumberChange(e.target.value)}
                    placeholder={isCopyright ? 'ระบุเลขที่คำขอแจ้งข้อมูลลิขสิทธิ์' : 'ระบุเลขที่คำขอ 10 หลัก'}
                    className={cn(
                      'w-full h-10 px-3 font-mono text-sm rounded-lg border border-slate-300 bg-white transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]',
                      errors.application_number && 'border-red-500'
                    )}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono select-none">
                    {(formData.application_number || formData.req_info || formData.app_no || '').length}/10
                  </span>
                </div>
              </FormField>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* ส่วนที่ 3: การได้รับความคุ้มครอง / การออกหนังสือรับรอง */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
              <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
                {isCopyright ? 'การออกหนังสือรับรอง' : 'การได้รับความคุ้มครอง'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    value={
                      formData.registration_number ||
                      formData.reg_info ||
                      formData.reg_no ||
                      formData.patent_number ||
                      (formData.req_no && String(formData.req_no).includes('/')
                        ? String(formData.req_no).split('/')[1]?.trim()
                        : '') ||
                      ''
                    }
                    onChange={(e) => handleRegNumberChange(e.target.value)}
                    placeholder={
                      isCopyright
                        ? 'ระบุเลขทะเบียนลิขสิทธิ์ เช่น ว1.000033'
                        : isPettyPatent
                        ? 'กรอกเลขทะเบียนอนุสิทธิบัตร'
                        : 'กรอกเลขทะเบียนสิทธิบัตร'
                    }
                    className={cn(
                      'w-full h-10 px-3 font-mono text-sm rounded-lg border border-slate-300 bg-white transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]',
                      errors.registration_number && 'border-red-500'
                    )}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono select-none">
                    {(formData.registration_number || formData.reg_info || formData.reg_no || '').length}/
                    {isCopyright ? 9 : 5}
                  </span>
                </div>
              </FormField>

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

              {!isCopyright && (
                <FormField label="วันหมดอายุ (ระยะเวลาคุ้มครองสิ้นสุด)" error={errors.protection_end}>
                  <DatePicker
                    value={formData.protection_end || ''}
                    onChange={(_date, dateStr) => onChange('protection_end', dateStr)}
                    placeholder="เลือกวันหมดอายุความคุ้มครอง (พ.ศ.)"
                  />
                </FormField>
              )}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* ส่วนที่ 4: การสนับสนุนและหมายเหตุ */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
              <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
                การสนับสนุนและหมายเหตุ
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="เงินสนับสนุนจากคณะ" error={errors.support_amount}>
                <MoneyInput
                  value={
                    formData.support_amount !== undefined && formData.support_amount !== null
                      ? Number(formData.support_amount)
                      : 0
                  }
                  onChange={(val) => onChange('support_amount', val ?? 0)}
                  className="w-full"
                  min={0}
                />
              </FormField>

              <FormField label="หมายเหตุ" error={errors.remarks}>
                <textarea
                  value={formData.remarks || ''}
                  onChange={(e) => onChange('remarks', e.target.value)}
                  rows={2}
                  placeholder="กรอกหมายเหตุเพิ่มเติม (ถ้ามี)..."
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
                />
              </FormField>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default IntellectualPropertyForm;

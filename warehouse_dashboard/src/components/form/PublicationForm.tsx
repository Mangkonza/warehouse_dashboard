'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';
import { MoneyInput } from './MoneyInput';
import { MonthYearPicker } from './MonthYearPicker';
import { DepartmentSelect } from '@/components/ui/department-select';
import { PersonPicker } from './PersonPicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export const PUBLICATION_TYPES = [
  'เตรียมความพร้อมตีพิมพ์',
  'เตรียมความพร้อมจดอนุสิทธิบัตร',
  'ตีพิมพ์',
] as const;

export const PUBLICATION_LEVELS = [
  'ชาติ',
  'นานาชาติ',
] as const;

export interface PublicationFormProps {
  formData: Record<string, any>;
  onChange: (key: string, val: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isEdit?: boolean;
  errors?: Record<string, string>;
}

export function PublicationForm({
  formData,
  onChange,
  errors = {},
}: PublicationFormProps) {
  const hasForeignCoAuthor = Boolean(
    formData.has_foreign_coauthor ??
      formData.has_international_coauthor ??
      (Array.isArray(formData.co_authors_foreign) && formData.co_authors_foreign.length > 0)
  );

  const hasDomesticCoAuthor = Boolean(
    formData.has_domestic_coauthor ??
      (Array.isArray(formData.co_authors_domestic) && formData.co_authors_domestic.length > 0)
  );

  const handleToggleForeign = (checked: boolean) => {
    onChange('has_foreign_coauthor', checked);
    onChange('has_international_coauthor', checked);
    if (!checked) {
      onChange('co_authors_foreign', []);
    } else {
      const prev =
        Array.isArray(formData.co_authors_foreign) && formData.co_authors_foreign.length > 0
          ? formData.co_authors_foreign
          : ['มีผู้ร่วมต่างชาติ'];
      onChange('co_authors_foreign', prev);
    }
  };

  const handleToggleDomestic = (checked: boolean) => {
    onChange('has_domestic_coauthor', checked);
    if (!checked) {
      onChange('co_authors_domestic', []);
    } else {
      const prev =
        Array.isArray(formData.co_authors_domestic) && formData.co_authors_domestic.length > 0
          ? formData.co_authors_domestic
          : ['มีผู้ร่วมภายในประเทศ'];
      onChange('co_authors_domestic', prev);
    }
  };

  const handleTypeChange = (newType: string | null) => {
    const val = newType ?? '';
    onChange('type', val);
    if (val === 'เตรียมความพร้อมจดอนุสิทธิบัตร') {
      onChange('journal', 'อนุสิทธิบัตร');
      onChange('volume', '');
      onChange('issue', '');
      onChange('page_start', '');
      onChange('page_end', '');
    } else if (formData.journal === 'อนุสิทธิบัตร') {
      onChange('journal', '');
    }
  };

  const isPatentType = formData.type === 'เตรียมความพร้อมจดอนุสิทธิบัตร';

  return (
    <div className="space-y-7 text-slate-800">
      {/* ========================================================================= */}
      {/* ส่วนที่ 1: ข้อมูลผลงาน */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ข้อมูลผลงาน
          </h4>
        </div>

        <FormField label="ชื่อผลงานทางวิชาการ" required error={errors.name}>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="กรอกชื่อผลงานทางวิชาการ..."
            className={cn(
              'w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors bg-white',
              errors.name
                ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400'
                : 'border-slate-300 focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20'
            )}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="ชนิดของผลงาน" required error={errors.type}>
            <Select value={formData.type || ''} onValueChange={handleTypeChange}>
              <SelectTrigger
                className={cn(
                  'w-full h-10 bg-white text-sm rounded-lg',
                  errors.type ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300'
                )}
              >
                <SelectValue placeholder="เลือกชนิดของผลงาน" />
              </SelectTrigger>
              <SelectContent>
                {PUBLICATION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="ระดับ" required error={errors.level}>
            <Select
              value={formData.level || ''}
              onValueChange={(val) => onChange('level', val ?? '')}
            >
              <SelectTrigger
                className={cn(
                  'w-full h-10 bg-white text-sm rounded-lg',
                  errors.level ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300'
                )}
              >
                <SelectValue placeholder="เลือกระดับ" />
              </SelectTrigger>
              <SelectContent>
                {PUBLICATION_LEVELS.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="จำนวนเงินสนับสนุน" error={errors.budget}>
            <MoneyInput
              value={formData.budget !== undefined && formData.budget !== null ? Number(formData.budget) : 0}
              onChange={(val) => onChange('budget', val ?? 0)}
              className="w-full"
              min={0}
            />
          </FormField>

          <FormField label="เดือน/ปี (พ.ศ.)" error={errors.month_year}>
            <MonthYearPicker
              value={formData.month_year || ''}
              onChange={(val) => onChange('month_year', val || '')}
              className="w-full"
            />
          </FormField>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 2: ผู้เกี่ยวข้องและสังกัด */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ผู้เกี่ยวข้องและสังกัด
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="เจ้าของผลงาน" required error={errors.owner}>
            <PersonPicker
              value={
                formData.owner
                  ? {
                      person_id: formData.person_id || formData.owner_id || null,
                      name: formData.owner,
                      department: formData.department,
                    }
                  : null
              }
              onChange={(person) => {
                if (person) {
                  onChange('owner', person.name);
                  onChange('owner_id', person.person_id ?? null);
                  onChange('person_id', person.person_id ?? null);
                  if (person.department) {
                    onChange('department', person.department);
                  }
                } else {
                  onChange('owner', '');
                  onChange('owner_id', null);
                  onChange('person_id', null);
                }
              }}
              placeholder="ค้นหาหรือระบุชื่อเจ้าของผลงาน..."
            />
          </FormField>

          <FormField label="สังกัด" required error={errors.department}>
            <DepartmentSelect
              value={formData.department || ''}
              onChange={(val) => onChange('department', val)}
              className="w-full"
            />
          </FormField>
        </div>

        <FormField label="ผู้ร่วมวิจัย / ผู้แต่งร่วม">
          <div className="flex flex-wrap gap-x-8 gap-y-2 pt-1">
            <label className="inline-flex items-center gap-2.5 py-1 cursor-pointer select-none">
              <Checkbox
                checked={hasForeignCoAuthor}
                onCheckedChange={(checked) => handleToggleForeign(Boolean(checked))}
              />
              <span className={cn('text-sm', hasForeignCoAuthor ? 'text-slate-900 font-medium' : 'text-slate-700')}>
                มีผู้ร่วมต่างชาติ
              </span>
            </label>

            <label className="inline-flex items-center gap-2.5 py-1 cursor-pointer select-none">
              <Checkbox
                checked={hasDomesticCoAuthor}
                onCheckedChange={(checked) => handleToggleDomestic(Boolean(checked))}
              />
              <span className={cn('text-sm', hasDomesticCoAuthor ? 'text-slate-900 font-medium' : 'text-slate-700')}>
                มีผู้ร่วมภายในประเทศ
              </span>
            </label>
          </div>
        </FormField>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 3: รายละเอียดการตีพิมพ์และหมายเหตุ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            รายละเอียดการตีพิมพ์และหมายเหตุ
          </h4>
        </div>

        <FormField label="รายละเอียดวารสาร/การประชุม" error={errors.journal}>
          <input
            type="text"
            value={isPatentType ? 'อนุสิทธิบัตร' : formData.journal || ''}
            onChange={(e) => {
              if (!isPatentType) {
                onChange('journal', e.target.value);
              }
            }}
            disabled={isPatentType}
            placeholder="กรอกชื่อวารสารหรือการประชุม..."
            className={cn(
              'w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors',
              isPatentType
                ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200'
                : 'bg-white border-slate-300 focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20'
            )}
          />
        </FormField>

        {!isPatentType && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <FormField label="Volume" error={errors.volume}>
                <input
                  type="text"
                  value={formData.volume || ''}
                  onChange={(e) => onChange('volume', e.target.value)}
                  placeholder="ระบุเล่มที่"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20 bg-white"
                />
              </FormField>

              <FormField label="Issue" error={errors.issue}>
                <input
                  type="text"
                  value={formData.issue || ''}
                  onChange={(e) => onChange('issue', e.target.value)}
                  placeholder="ระบุฉบับที่"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20 bg-white"
                />
              </FormField>

              <FormField label="Page start" error={errors.page_start}>
                <input
                  type="text"
                  value={formData.page_start || ''}
                  onChange={(e) => onChange('page_start', e.target.value)}
                  placeholder="หน้าเริ่มต้น"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20 bg-white"
                />
              </FormField>

              <FormField label="Page end" error={errors.page_end}>
                <input
                  type="text"
                  value={formData.page_end || ''}
                  onChange={(e) => onChange('page_end', e.target.value)}
                  placeholder="หน้าสิ้นสุด"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20 bg-white"
                />
              </FormField>
            </div>
            {errors.pages && <p className="text-xs text-red-500 mt-1">{errors.pages}</p>}
          </div>
        )}

        <FormField label="หมายเหตุ">
          <textarea
            rows={2}
            value={formData.remarks || ''}
            onChange={(e) => onChange('remarks', e.target.value)}
            placeholder="กรอกหมายเหตุเพิ่มเติม..."
            className="w-full p-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-[#00A651] focus:ring-2 focus:ring-[#00A651]/20 bg-white resize-y"
          />
        </FormField>
      </section>
    </div>
  );
}

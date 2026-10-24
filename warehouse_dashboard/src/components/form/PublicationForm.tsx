'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';
import { MoneyInput } from './MoneyInput';
import { MonthYearPicker } from './MonthYearPicker';
import { DepartmentSelect } from '@/components/ui/department-select';
import { PersonPicker, PersonValue } from './PersonPicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { searchPersonnel, getAllPersonnel } from '@/lib/personnelService';
import { PersonnelRecord } from '@/types/dataManagement';
import { Plus, Trash2, BookOpen, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  setFormData,
  isEdit = false,
  errors = {},
}: PublicationFormProps) {
  // State for search suggestions on owner
  const [ownerSearch, setOwnerSearch] = React.useState('');
  const [showOwnerSuggestions, setShowOwnerSuggestions] = React.useState(false);

  const suggestedPersonnel = React.useMemo(() => {
    if (!ownerSearch.trim()) return [];
    return searchPersonnel(ownerSearch, 6);
  }, [ownerSearch]);

  const handleSelectOwner = (person: PersonnelRecord) => {
    setFormData((prev) => ({
      ...prev,
      owner: person.name,
      department: person.department || prev.department || '',
    }));
    setShowOwnerSuggestions(false);
    setOwnerSearch('');
  };

  // Boolean co-authors flags
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
      const prev = Array.isArray(formData.co_authors_foreign) && formData.co_authors_foreign.length > 0
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
      const prev = Array.isArray(formData.co_authors_domestic) && formData.co_authors_domestic.length > 0
        ? formData.co_authors_domestic
        : ['มีผู้ร่วมภายในประเทศ'];
      onChange('co_authors_domestic', prev);
    }
  };

  // Handle Type Change
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
    <div className="flex flex-col gap-5 text-slate-800">
      {/* ========================================================================= */}
      {/* ส่วนที่ 1: ข้อมูลผลงาน */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
          <div className="size-6 rounded-md bg-emerald-50 text-[#00A651] flex items-center justify-center text-xs font-bold">
            1
          </div>
          <h4 className="text-sm font-bold text-slate-800 m-0">ข้อมูลผลงาน</h4>
        </div>

        {/* 1. ชื่อผลงานทางวิชาการ */}
        <div>
          <FormField
            label="ชื่อผลงานทางวิชาการ"
            required
            error={errors.name}
          >
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              className={cn(
                'w-full h-9 px-3 rounded-md border text-sm outline-none transition-colors bg-white',
                errors.name
                  ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400'
                  : 'border-slate-300 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]'
              )}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 2. ชนิดของผลงาน */}
          <div>
            <FormField
              label="ชนิดของผลงาน"
              required
              error={errors.type}
            >
              <Select
                value={formData.type || ''}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger
                  className={cn(
                    'w-full h-9 bg-white text-sm',
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
          </div>

          {/* 3. ระดับ */}
          <div>
            <FormField
              label="ระดับ"
              required
              error={errors.level}
            >
              <Select
                value={formData.level || ''}
                onValueChange={(val) => onChange('level', val ?? '')}
              >
                <SelectTrigger
                  className={cn(
                    'w-full h-9 bg-white text-sm',
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 4. จำนวนเงินสนับสนุน */}
          <div>
            <FormField
              label="จำนวนเงินสนับสนุน"
              error={errors.budget}
            >
              <MoneyInput
                value={formData.budget !== undefined && formData.budget !== null ? Number(formData.budget) : 0}
                onChange={(val) => onChange('budget', val ?? 0)}
                className="w-full"
                min={0}
              />
            </FormField>
          </div>

          {/* เดือน/ปี (พ.ศ.) สำหรับจัดกลุ่มและกรอง */}
          <div>
            <FormField
              label="เดือน/ปี (พ.ศ.)"
              error={errors.month_year}
            >
              <MonthYearPicker
                value={formData.month_year || ''}
                onChange={(val) => onChange('month_year', val || '')}
                className="w-full"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ส่วนที่ 2: ผู้เกี่ยวข้อง */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
          <div className="size-6 rounded-md bg-emerald-50 text-[#00A651] flex items-center justify-center text-xs font-bold">
            2
          </div>
          <h4 className="text-sm font-bold text-slate-800 m-0">ผู้เกี่ยวข้อง</h4>
        </div>

        {/* 5. เจ้าของผลงาน */}
        <FormField
          label="เจ้าของผลงาน"
          required
          error={errors.owner}
        >
          <PersonPicker
            value={formData.owner ? {
              person_id: formData.person_id || formData.owner_id || null,
              name: formData.owner,
              department: formData.department,
            } : null}
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

        {/* 6. ผู้ร่วม (2 เช็คบ็อกซ์: ต่างชาติ / ภายในประเทศ) */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            ผู้ร่วม
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ต่างชาติ */}
            <label className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasForeignCoAuthor}
                onChange={(e) => handleToggleForeign(e.target.checked)}
                className="size-4.5 rounded text-[#00A651] focus:ring-[#00A651] border-slate-300 cursor-pointer accent-[#00A651]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">มีผู้ร่วมต่างชาติ</span>
                <span className="text-[11.5px] text-slate-500">ติ๊กเลือกหากผลงานนี้มีผู้ร่วมงานจากต่างประเทศ</span>
              </div>
            </label>

            {/* ภายในประเทศ */}
            <label className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasDomesticCoAuthor}
                onChange={(e) => handleToggleDomestic(e.target.checked)}
                className="size-4.5 rounded text-[#00A651] focus:ring-[#00A651] border-slate-300 cursor-pointer accent-[#00A651]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">มีผู้ร่วมภายในประเทศ</span>
                <span className="text-[11.5px] text-slate-500">ติ๊กเลือกหากผลงานนี้มีผู้ร่วมงานภายในประเทศ</span>
              </div>
            </label>
          </div>
        </div>

        {/* 7. สังกัดภาควิชา/สาขาวิชา */}
        <div>
          <FormField
            label="สังกัดภาควิชา/สาขาวิชา"
            required
            error={errors.department}
          >
            <DepartmentSelect
              value={formData.department || ''}
              onChange={(val) => onChange('department', val)}
              className="w-full"
            />
          </FormField>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ส่วนที่ 3: รายละเอียดการตีพิมพ์ */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
          <div className="size-6 rounded-md bg-emerald-50 text-[#00A651] flex items-center justify-center text-xs font-bold">
            3
          </div>
          <h4 className="text-sm font-bold text-slate-800 m-0">รายละเอียดการตีพิมพ์</h4>
        </div>

        {/* 8. รายละเอียดวารสาร/การประชุม */}
        <div>
          <FormField
            label="รายละเอียดวารสาร/การประชุม"
            error={errors.journal}
          >
            <input
              type="text"
              value={isPatentType ? 'อนุสิทธิบัตร' : formData.journal || ''}
              onChange={(e) => {
                if (!isPatentType) {
                  onChange('journal', e.target.value);
                }
              }}
              disabled={isPatentType}
              className={cn(
                'w-full h-9 px-3 rounded-md border text-sm outline-none transition-colors',
                isPatentType
                  ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200'
                  : 'bg-white border-slate-300 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]'
              )}
            />
          </FormField>
        </div>

        {/* 9. Volume, Issue, Page start, Page end (ซ่อนเมื่อเป็น เตรียมความพร้อมจดอนุสิทธิบัตร) */}
        {!isPatentType && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <FormField label="Volume" error={errors.volume}>
                  <input
                    type="text"
                    value={formData.volume || ''}
                    onChange={(e) => onChange('volume', e.target.value)}
                    className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm outline-none focus:border-[#00A651] bg-white"
                  />
                </FormField>
              </div>

              <div>
                <FormField label="Issue" error={errors.issue}>
                  <input
                    type="text"
                    value={formData.issue || ''}
                    onChange={(e) => onChange('issue', e.target.value)}
                    className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm outline-none focus:border-[#00A651] bg-white"
                  />
                </FormField>
              </div>

              <div>
                <FormField label="Page start" error={errors.page_start}>
                  <input
                    type="text"
                    value={formData.page_start || ''}
                    onChange={(e) => onChange('page_start', e.target.value)}
                    className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm outline-none focus:border-[#00A651] bg-white"
                  />
                </FormField>
              </div>

              <div>
                <FormField label="Page end" error={errors.page_end}>
                  <input
                    type="text"
                    value={formData.page_end || ''}
                    onChange={(e) => onChange('page_end', e.target.value)}
                    className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm outline-none focus:border-[#00A651] bg-white"
                  />
                </FormField>
              </div>
            </div>

            {errors.pages && (
              <p className="text-xs text-red-500 mt-1">{errors.pages}</p>
            )}
          </div>
        )}

        {/* 10. หมายเหตุ (textarea, last field, optional) */}
        <div>
          <FormField label="หมายเหตุ">
            <textarea
              rows={3}
              value={formData.remarks || ''}
              onChange={(e) => onChange('remarks', e.target.value)}
              className="w-full p-2.5 rounded-md border border-slate-300 text-sm outline-none focus:border-[#00A651] bg-white resize-y"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}

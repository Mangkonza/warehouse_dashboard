'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';
import { PrefixCombobox } from './PrefixCombobox';
import { DepartmentSelect } from '@/components/ui/department-select';
import { AvatarImageField } from './AvatarImageField';

export interface PersonnelFormProps {
  formData: Record<string, any>;
  onChange: (key: string, val: any) => void;
  setFormData?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isEdit?: boolean;
  errors?: Record<string, string>;
}

export function PersonnelForm({
  formData,
  onChange,
  errors = {},
}: PersonnelFormProps) {
  return (
    <div className="flex flex-col gap-4 text-slate-800">
      {/* 1. รูปภาพประจำตัว */}
      <FormField label="รูปภาพประจำตัว" error={errors.image_url}>
        <AvatarImageField
          value={formData.image_url || ''}
          onChange={(img) => onChange('image_url', img)}
        />
      </FormField>

      {/* 2. คำนำหน้า & 3. ชื่อ และ นามสกุล */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
        <div className="sm:col-span-4">
          <FormField label="คำนำหน้า" error={errors.title_th}>
            <PrefixCombobox
              value={formData.title_th || ''}
              onChange={(val) => onChange('title_th', val)}
              className="w-full"
            />
          </FormField>
        </div>

        <div className="sm:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              label="ชื่อ"
              required
              fieldKey="first_name"
              error={errors.first_name}
            >
              <input
                id="field-first_name"
                name="first_name"
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => onChange('first_name', e.target.value)}
                placeholder="กรอกชื่อ"
                className={cn(
                  'w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs placeholder:text-slate-400 hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]',
                  errors.first_name && 'border-destructive focus:border-destructive ring-1 ring-destructive'
                )}
              />
            </FormField>

            <FormField
              label="นามสกุล"
              required
              fieldKey="last_name"
              error={errors.last_name}
            >
              <input
                id="field-last_name"
                name="last_name"
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => onChange('last_name', e.target.value)}
                placeholder="กรอกนามสกุล"
                className={cn(
                  'w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs placeholder:text-slate-400 hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]',
                  errors.last_name && 'border-destructive focus:border-destructive ring-1 ring-destructive'
                )}
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* 4. ตำแหน่งทางวิชาการ */}
      <FormField label="ตำแหน่งทางวิชาการ" fieldKey="position" error={errors.position}>
        <input
          id="field-position"
          name="position"
          type="text"
          value={formData.position || ''}
          onChange={(e) => onChange('position', e.target.value)}
          placeholder="ระบุตำแหน่งทางวิชาการ เช่น ผู้ช่วยศาสตราจารย์"
          className={cn(
            'w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs placeholder:text-slate-400 hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]',
            errors.position && 'border-destructive focus:border-destructive ring-1 ring-destructive'
          )}
        />
      </FormField>

      {/* 5. สังกัด */}
      <FormField
        label="สังกัด"
        required
        fieldKey="department"
        error={errors.department}
      >
        <div id="field-department" data-field="department">
          <DepartmentSelect
            value={formData.department || ''}
            onChange={(dept) => onChange('department', dept)}
            className="w-full"
          />
        </div>
      </FormField>

      {/* 6. อีเมล KU */}
      <FormField label="อีเมล KU" error={errors.email}>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="ระบุอีเมล เช่น name@ku.th"
          className={cn(
            'w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs placeholder:text-slate-400 hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]',
            errors.email && 'border-destructive focus:border-destructive ring-1 ring-destructive'
          )}
        />
      </FormField>
    </div>
  );
}

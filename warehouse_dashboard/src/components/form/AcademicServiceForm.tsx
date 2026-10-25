'use client';

import * as React from 'react';
import {
  BookOpen,
  Users,
  Building2,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';
import { PrefixCombobox, THAI_PREFIXES } from './PrefixCombobox';
import { NumberUnitInput } from './NumberUnitInput';
import { DateRangePickerBE, DateRangeBEValue } from './DateRangePickerBE';
import { DepartmentSelect } from '@/components/ui/department-select';
import { PersonPicker, PersonValue } from './PersonPicker';
import { SERVICE_TYPE_COLOR } from '@/components/ui/service-type-badge';

export const ACADEMIC_SERVICE_TYPES = [
  { id: 'lecturer', label: 'วิทยากร/อาจารย์พิเศษ' },
  { id: 'academic', label: 'วิชาการ' },
  { id: 'professional', label: 'วิชาชีพ' },
  { id: 'expert', label: 'ผู้ทรงคุณวุฒิ' },
  { id: 'external_thesis', label: 'วิทยานิพนธ์ภายนอก' },
  { id: 'study_visit', label: 'ศึกษาดูงาน วศ.กพส.' },
] as const;

export interface AcademicServiceFormProps {
  formData: Record<string, any>;
  onChange: (key: string, val: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isEdit?: boolean;
}

export function AcademicServiceForm({
  formData,
  onChange,
  setFormData,
  isEdit = false,
}: AcademicServiceFormProps) {
  // Date range object
  const dateRangeValue: DateRangeBEValue = React.useMemo(() => {
    const s = formData.start_date || (formData.date ? String(formData.date).substring(0, 10) : null);
    const e = formData.end_date || s;
    return { start: s, end: e };
  }, [formData.start_date, formData.end_date, formData.date]);

  const handleDateRangeChange = (val: DateRangeBEValue) => {
    onChange('start_date', val.start || '');
    onChange('end_date', val.end || '');
    // backward compatibility with date column
    onChange('date', val.start || '');
  };

  return (
    <div className="flex flex-col gap-4 text-slate-800">
      {/* 1. เรื่อง (Text with numbers allowed) */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3.5">
        <FormField
          label="เรื่อง / ชื่องานบริการวิชาการ"
          required
          hint="ระบุชื่อหัวข้อ กิจกรรม หรือหลักสูตร (มีตัวเลขได้)"
        >
          <textarea
            rows={2}
            value={formData.name || formData.topic_title || ''}
            onChange={(e) => {
              const val = e.target.value;
              onChange('name', val);
              onChange('topic_title', val);
            }}
            placeholder="เช่น โครงการอบรมเชิงปฏิบัติการการใช้โดรนเพื่อการเกษตรแม่นยำ รุ่นที่ 2..."
            className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-input bg-background shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            required
          />
        </FormField>

        {/* 2. กลุ่มเป้าหมาย (Text) */}
        <FormField
          label="กลุ่มเป้าหมาย / ผู้เข้าร่วม"
          hint="เช่น นิสิต, เกษตรกร, บุคลากรภาครัฐ, ผู้ประกอบการ, ชุมชน"
        >
          <input
            type="text"
            value={formData.target_group || ''}
            onChange={(e) => onChange('target_group', e.target.value)}
            placeholder="เช่น เกษตรกรกลุ่มแปลงใหญ่ จ.นครปฐม, วิศวกรและสถาปนิก..."
            className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-input bg-background shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
        </FormField>
      </div>

      {/* 3. ประเภท (Exact 6 choices, no other) */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-semibold text-slate-800 flex items-center gap-1 select-none">
            <span>ประเภทงานบริการวิชาการ (เลือก 1 อย่าง)</span>
            <span className="text-red-500 font-bold">*</span>
          </label>
          <span className="text-[11.5px] text-slate-400 font-normal">
            กำหนดไว้ 6 ประเภทตามระเบียบคณะ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {ACADEMIC_SERVICE_TYPES.map((t) => {
            const isSelected =
              formData.service_type === t.label ||
              formData.service_category === t.label ||
              formData.service_type === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onChange('service_type', t.label);
                  onChange('service_category', t.label);
                }}
                className={cn(
                  'flex items-center justify-between min-h-[46px] px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer relative select-none text-left',
                  isSelected
                    ? 'border-[#2F007F] bg-[#2F007F] text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#2F007F]/40 text-slate-700 hover:text-slate-900'
                )}
                style={
                  isSelected
                    ? {
                        backgroundColor: SERVICE_TYPE_COLOR,
                        borderColor: SERVICE_TYPE_COLOR,
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
                  <CheckCircle2 className="size-4 text-white shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ผู้รับผิดชอบ / ผู้ให้บริการ */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3.5">
        

        <FormField label="ผู้ให้บริการ / ผู้รับผิดชอบ" required>
          <PersonPicker
            value={formData.person ? {
              person_id: formData.person_id || null,
              name: formData.person,
              department: formData.department,
              prefix: formData.prefix,
            } : null}
            onChange={(p) => {
              if (p) {
                onChange('person', p.name);
                onChange('person_id', p.person_id ?? null);
                if (p.prefix) onChange('prefix', p.prefix);
                if (p.department) onChange('department', p.department);
              } else {
                onChange('person', '');
                onChange('person_id', null);
              }
            }}
            defaultDepartment={formData.department || ''}
            placeholder="ค้นหาหรือระบุชื่อผู้ให้บริการวิชาการ..."
          />
        </FormField>

        {/* สังกัด */}
        <FormField label="สังกัด" required>
          <DepartmentSelect
            value={formData.department || ''}
            onChange={(dept) => onChange('department', dept)}
            placeholder="-- เลือกภาควิชา / สังกัด --"
          />
        </FormField>
      </div>

      {/* 5. วันเดือนปี เป็นช่วง พ.ศ. */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
        <FormField
          label="วันเดือนปีที่จัดกิจกรรม (ช่วงเวลา พ.ศ.)"
          hint="เลือกวันที่เริ่มต้นและสิ้นสุด (พุทธศักราช พ.ศ.)"
        >
          <DateRangePickerBE
            value={dateRangeValue}
            onChange={handleDateRangeChange}
            startPlaceholder="วันที่เริ่มต้น (พ.ศ.)"
            endPlaceholder="วันที่สิ้นสุด (พ.ศ.)"
          />
        </FormField>
      </div>

      {/* 6. จำนวนชั่วโมง และ จำนวนคนเข้าร่วม */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="จำนวนชั่วโมง"
            hint="ตัวเลข (ไม่บังคับใส่ เช่น 3, 6 หรือ 12.5)"
          >
            <NumberUnitInput
              value={formData.hours_spent !== undefined && formData.hours_spent !== '' ? Number(formData.hours_spent) : null}
              onChange={(num) => onChange('hours_spent', num)}
              unit="ชั่วโมง"
              placeholder="0"
              allowDecimals={true}
            />
          </FormField>

          <FormField
            label="จำนวนคนเข้าร่วม"
            hint="ตัวเลขจำนวนเต็ม (ไม่บังคับใส่ เช่น 50, 120)"
          >
            <NumberUnitInput
              value={formData.attendees_count !== undefined && formData.attendees_count !== '' ? Number(formData.attendees_count) : null}
              onChange={(num) => onChange('attendees_count', num)}
              unit="คน"
              placeholder="0"
              allowDecimals={false}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}

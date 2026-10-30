'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';
import { NumberUnitInput } from './NumberUnitInput';
import { DateRangePickerBE, DateRangeBEValue } from './DateRangePickerBE';
import { DepartmentSelect } from '@/components/ui/department-select';
import { PersonPicker } from './PersonPicker';

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
}: AcademicServiceFormProps) {
  const dateRangeValue: DateRangeBEValue = React.useMemo(() => {
    const s = formData.start_date || (formData.date ? String(formData.date).substring(0, 10) : null);
    const e = formData.end_date || s;
    return { start: s, end: e };
  }, [formData.start_date, formData.end_date, formData.date]);

  const handleDateRangeChange = (val: DateRangeBEValue) => {
    onChange('start_date', val.start || '');
    onChange('end_date', val.end || '');
    onChange('date', val.start || '');
  };

  return (
    <div className="space-y-7 text-slate-800">
      {/* ========================================================================= */}
      {/* ส่วนที่ 1: ข้อมูลงานบริการวิชาการ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ข้อมูลงานบริการวิชาการ
          </h4>
        </div>

        <FormField label="ชื่องานบริการวิชาการ" required>
          <textarea
            rows={2}
            value={formData.name || formData.topic_title || ''}
            onChange={(e) => {
              const val = e.target.value;
              onChange('name', val);
              onChange('topic_title', val);
            }}
            placeholder="กรอกชื่องานบริการวิชาการ..."
            className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
            required
          />
        </FormField>

        <FormField label="กลุ่มเป้าหมาย / ผู้เข้าร่วม">
          <input
            type="text"
            value={formData.target_group || ''}
            onChange={(e) => onChange('target_group', e.target.value)}
            placeholder="กรอกกลุ่มเป้าหมาย / ผู้เข้าร่วม..."
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
          />
        </FormField>

        <FormField label="ประเภทงานบริการวิชาการ" required>
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
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 2: ผู้ให้บริการและสังกัด */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ผู้ให้บริการและสังกัด
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="ผู้ให้บริการ / ผู้รับผิดชอบ" required>
            <PersonPicker
              value={
                formData.person
                  ? {
                      person_id: formData.person_id || null,
                      name: formData.person,
                      department: formData.department,
                      prefix: formData.prefix,
                    }
                  : null
              }
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

          <FormField label="สังกัด" required>
            <DepartmentSelect
              value={formData.department || ''}
              onChange={(dept) => onChange('department', dept)}
              placeholder="-- เลือกสังกัด --"
            />
          </FormField>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 3: ระยะเวลาและผู้เข้าร่วมกิจกรรม */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ระยะเวลาและผู้เข้าร่วมกิจกรรม
          </h4>
        </div>

        <FormField label="วันเดือนปีที่จัดกิจกรรม (ช่วงเวลา พ.ศ.)">
          <DateRangePickerBE
            value={dateRangeValue}
            onChange={handleDateRangeChange}
            startPlaceholder="วันที่เริ่มต้น (พ.ศ.)"
            endPlaceholder="วันที่สิ้นสุด (พ.ศ.)"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="จำนวนชั่วโมง">
            <NumberUnitInput
              value={formData.hours_spent !== undefined && formData.hours_spent !== '' ? Number(formData.hours_spent) : null}
              onChange={(num) => onChange('hours_spent', num)}
              unit="ชั่วโมง"
              placeholder="0"
              allowDecimals={true}
            />
          </FormField>

          <FormField label="จำนวนคนเข้าร่วม">
            <NumberUnitInput
              value={formData.attendees_count !== undefined && formData.attendees_count !== '' ? Number(formData.attendees_count) : null}
              onChange={(num) => onChange('attendees_count', num)}
              unit="คน"
              placeholder="0"
              allowDecimals={false}
            />
          </FormField>
        </div>
      </section>
    </div>
  );
}

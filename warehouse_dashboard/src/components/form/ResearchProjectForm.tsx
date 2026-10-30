'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  FormField,
  PersonPicker,
  PersonListField,
  CoResearcherItem,
  DepartmentMultiSelect,
  CheckboxGroupWithOther,
  MoneyInput,
  MonthYearRangePicker,
  MonthYearRangeValue,
  CourseListField,
  CourseItem,
  TrlSelect,
  TrlOutputsField,
  TrlOutputItem,
  CreatableCombobox,
} from '@/components/form';
import { DepartmentSelect } from '@/components/ui/department-select';
import fundingSourcesData from '@/data/funding_sources.json';
import researchData from '@/data/research.json';

export interface ResearchProjectFormProps {
  formData: Record<string, any>;
  onChange: (key: string, val: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isEdit?: boolean;
}

const COLLABORATION_OPTIONS = [
  { label: 'ร่วมมือกับหน่วยงานภายในมหาวิทยาลัยเกษตรศาสตร์', value: 'internal_ku' },
  { label: 'ร่วมมือกับสถาบันการศึกษา / หน่วยงานวิจัยในประเทศ', value: 'domestic_academic' },
  { label: 'ร่วมมือกับภาคเอกชน / ภาคอุตสาหกรรมในประเทศ', value: 'domestic_industry' },
  { label: 'ร่วมมือกับสถาบันหรือองค์กรต่างประเทศ', value: 'international' },
];

const PROJECT_NATURE_OPTIONS = [
  { label: 'การวิจัยพื้นฐาน', value: 'basic' },
  { label: 'การวิจัยประยุกต์', value: 'applied' },
  { label: 'การพัฒนาเชิงทดลอง', value: 'experimental' },
  { label: 'การถ่ายทอดเทคโนโลยีหรือเชิงพาณิชย์', value: 'commercialization' },
];

export function ResearchProjectForm({
  formData,
  onChange,
  isEdit = false,
}: ResearchProjectFormProps) {
  // Funding sources list with custom creatable options
  const fundingOptions = React.useMemo(() => {
    const list = fundingSourcesData.map((f) => f.name);
    researchData.forEach((r) => {
      if (r.fund_source) {
        const clean = r.fund_source.replace(/\r?\n/g, ' ').trim();
        if (clean && !list.includes(clean)) {
          list.push(clean);
        }
      }
    });
    return list;
  }, []);

  // Duplicate project code check
  const duplicateCodeWarning = React.useMemo(() => {
    const currentCode = (formData.id || '').replace(/\r?\n/g, ' ').trim();
    if (!currentCode) return null;
    const exists = researchData.some((r) => {
      const existingCode = (r.id || '').replace(/\r?\n/g, ' ').trim();
      const existingKey = (r._id || '').trim();
      const currentKey = (formData._id || '').trim();
      if (isEdit && (existingCode === currentCode || existingKey === currentKey)) {
        return false;
      }
      return existingCode.toLowerCase() === currentCode.toLowerCase();
    });
    return exists ? `รหัสโครงการ "${currentCode}" มีอยู่ในระบบแล้ว` : null;
  }, [formData.id, formData._id, isEdit]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('id', e.target.value);
  };

  const dateRangeValue: MonthYearRangeValue = React.useMemo(() => {
    return {
      start: formData.start_date || null,
      end: formData.end_date || null,
    };
  }, [formData.start_date, formData.end_date]);

  const budgetInternal = Number(formData.budget_internal) || 0;
  const budgetExternal = Number(formData.budget_external) || 0;
  const budgetTotal = budgetInternal + budgetExternal;

  return (
    <div className="space-y-7 text-slate-800">
      {/* ======================================================== */}
      {/* ส่วนที่ 1: ข้อมูลโครงการวิจัย */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ข้อมูลโครงการวิจัย
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8">
            <FormField
              label="รหัสโครงการวิจัย"
              required
              error={duplicateCodeWarning}
            >
              <input
                type="text"
                value={formData.id || ''}
                onChange={handleCodeChange}
                placeholder="เช่น วศ.กพส. 1/2568"
                className={cn(
                  'w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white font-mono transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]',
                  duplicateCodeWarning && 'border-amber-400 bg-amber-50/30'
                )}
              />
            </FormField>
          </div>

          <div className="sm:col-span-4">
            <FormField label="ปีงบประมาณ (พ.ศ.)">
              <input
                type="number"
                value={formData.fiscal_year_be || ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                  onChange('fiscal_year_be', val);
                }}
                placeholder="2568"
                className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
              />
            </FormField>
          </div>
        </div>

        <FormField label="ชื่อโครงการวิจัย (ภาษาไทย)" required>
          <textarea
            rows={2}
            value={formData.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="ระบุชื่อโครงการวิจัยภาษาไทย..."
            className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
          />
        </FormField>

        <FormField label="ชื่อโครงการวิจัย (ภาษาอังกฤษ)">
          <input
            type="text"
            value={formData.name_en || ''}
            onChange={(e) => onChange('name_en', e.target.value)}
            placeholder="English Research Project Title..."
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8">
            <FormField label="แหล่งทุนวิจัย" required>
              <CreatableCombobox
                options={fundingOptions}
                value={formData.fund_source || ''}
                onChange={(val) => {
                  onChange('fund_source', val);
                  const match = fundingSourcesData.find((f) => f.name === val);
                  if (match && !formData.fund_type) {
                    onChange('fund_type', match.type);
                  }
                }}
                placeholder="ค้นหา หรือพิมพ์ชื่อแหล่งทุนวิจัย..."
                createPlaceholder="เพิ่มแหล่งทุนใหม่..."
              />
            </FormField>
          </div>

          <div className="sm:col-span-4">
            <FormField label="ประเภททุนวิจัย">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChange('fund_type', 'ภายใน')}
                  className={cn(
                    'h-10 rounded-lg text-sm font-medium border transition-colors cursor-pointer',
                    formData.fund_type === 'ภายใน'
                      ? 'bg-[#00A651] text-white border-[#00A651]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  )}
                >
                  ทุนภายใน
                </button>
                <button
                  type="button"
                  onClick={() => onChange('fund_type', 'ภายนอก')}
                  className={cn(
                    'h-10 rounded-lg text-sm font-medium border transition-colors cursor-pointer',
                    formData.fund_type === 'ภายนอก'
                      ? 'bg-[#00A651] text-white border-[#00A651]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  )}
                >
                  ทุนภายนอก
                </button>
              </div>
            </FormField>
          </div>
        </div>

        <FormField label="ระยะเวลาดำเนินโครงการ">
          <MonthYearRangePicker
            value={dateRangeValue}
            onChange={({ start, end }) => {
              onChange('start_date', start);
              onChange('end_date', end);
            }}
          />
        </FormField>
      </section>

      {/* ======================================================== */}
      {/* ส่วนที่ 2: คณะผู้วิจัยและสังกัด */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            คณะผู้วิจัยและสังกัด
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="หัวหน้าโครงการวิจัย" required>
            <PersonPicker
              value={
                formData.head
                  ? {
                      person_id: formData.head_id || null,
                      name: formData.head,
                      department: formData.department,
                    }
                  : null
              }
              onChange={(person) => {
                if (person) {
                  onChange('head', person.name);
                  onChange('head_id', person.person_id ?? null);
                  if (person.department) {
                    onChange('department', person.department);
                  }
                } else {
                  onChange('head', '');
                  onChange('head_id', null);
                }
              }}
              placeholder="ค้นหาชื่อ-สกุลหัวหน้าโครงการ..."
            />
          </FormField>

          <FormField label="สังกัดที่รับผิดชอบ" required>
            <DepartmentSelect
              value={formData.department || ''}
              onChange={(val) => onChange('department', val)}
              placeholder="-- เลือกสังกัด --"
            />
          </FormField>
        </div>

        <FormField label="สังกัดที่ร่วมรับผิดชอบ (ถ้ามีหลายสังกัด)">
          <DepartmentMultiSelect
            value={
              Array.isArray(formData.departments)
                ? formData.departments
                : typeof formData.departments === 'string' && formData.departments.trim()
                ? formData.departments.split(',').map((s: string) => s.trim()).filter(Boolean)
                : []
            }
            onChange={(depts) => onChange('departments', depts)}
            placeholder="-- เลือกหน่วยงานร่วมรับผิดชอบเพิ่มเติม --"
          />
        </FormField>

        <FormField label="ผู้ร่วมวิจัย (Co-Researchers)">
          <PersonListField
            items={
              Array.isArray(formData.co_researchers)
                ? formData.co_researchers
                : typeof formData.co_researchers === 'string' && formData.co_researchers.trim()
                ? formData.co_researchers
                    .split(',')
                    .map((name: string) => ({
                      name: name.trim(),
                      department: '',
                      person_id: null,
                      is_custom: true,
                      role: 'ผู้ร่วมวิจัย',
                      contributionPercent: null,
                    }))
                    .filter((i: any) => Boolean(i.name))
                : []
            }
            onChange={(items: CoResearcherItem[]) => onChange('co_researchers', items)}
            showContribution
          />
        </FormField>
      </section>

      {/* ======================================================== */}
      {/* ส่วนที่ 3: ความร่วมมือ ลักษณะโครงการ และงบประมาณ */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ความร่วมมือ ลักษณะโครงการ และงบประมาณ
          </h4>
        </div>

        <FormField label="ลักษณะความร่วมมือของโครงการวิจัย">
          <CheckboxGroupWithOther
            options={COLLABORATION_OPTIONS}
            value={
              Array.isArray(formData.collaboration_type)
                ? formData.collaboration_type
                : typeof formData.collaboration_type === 'string' && formData.collaboration_type.trim()
                ? formData.collaboration_type.split(',').map((s: string) => s.trim()).filter(Boolean)
                : []
            }
            onChange={(vals) => onChange('collaboration_type', vals)}
            otherOptionLabel="ความร่วมมืออื่นๆ (โปรดระบุ)"
            orientation="grid"
          />
        </FormField>

        <FormField label="ลักษณะโครงการวิจัย">
          <CheckboxGroupWithOther
            options={PROJECT_NATURE_OPTIONS}
            value={
              Array.isArray(formData.project_nature)
                ? formData.project_nature
                : typeof formData.project_nature === 'string' && formData.project_nature.trim()
                ? formData.project_nature.split(',').map((s: string) => s.trim()).filter(Boolean)
                : []
            }
            onChange={(vals) => onChange('project_nature', vals)}
            otherOptionLabel="ลักษณะอื่นๆ (โปรดระบุ)"
            orientation="grid"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <FormField label="งบประมาณภายใน">
            <MoneyInput
              value={formData.budget_internal}
              onChange={(num) => onChange('budget_internal', num ?? 0)}
              placeholder="0.00"
            />
          </FormField>

          <FormField label="งบประมาณภายนอก">
            <MoneyInput
              value={formData.budget_external}
              onChange={(num) => onChange('budget_external', num ?? 0)}
              placeholder="0.00"
            />
          </FormField>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-700 select-none">
              งบประมาณรวม (คำนวณอัตโนมัติ)
            </label>
            <div className="h-10 px-3 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/60 font-mono font-semibold text-emerald-800 text-sm">
              <span>{budgetTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="text-xs font-medium text-emerald-700">บาท</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* ส่วนที่ 4: การบูรณาการกับการเรียนการสอนและบริการวิชาการ */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            การบูรณาการกับการเรียนการสอนและบริการวิชาการ
          </h4>
        </div>

        <FormField label="รายวิชาที่นำองค์ความรู้จากงานวิจัยไปใช้ในการเรียนการสอน">
          <CourseListField
            items={formData.teaching_courses || []}
            onChange={(courses: CourseItem[]) => onChange('teaching_courses', courses)}
            addLabel="+ เพิ่มรายวิชาที่นำไปสอน"
            emptyMessage="ยังไม่มีรายวิชาที่นำไปสอน"
          />
        </FormField>

        <FormField label="รายวิชาที่นำผลงานวิจัย / ชิ้นงาน / ต้นแบบ ไปใช้ประโยชน์">
          <CourseListField
            items={formData.applied_courses || []}
            onChange={(courses: CourseItem[]) => onChange('applied_courses', courses)}
            addLabel="+ เพิ่มรายวิชาที่นำวิจัยไปใช้"
            emptyMessage="ยังไม่มีรายวิชาที่นำวิจัยไปใช้"
          />
        </FormField>

        <FormField label="การนำผลงานไปบูรณาการกับงานบริการวิชาการ">
          <textarea
            rows={2}
            value={formData.academic_service || ''}
            onChange={(e) => onChange('academic_service', e.target.value)}
            placeholder="ระบุรายละเอียดการต่อยอดหรือบูรณาการกับงานบริการวิชาการ (ถ้ามี)..."
            className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
          />
        </FormField>

        <FormField label="การบูรณาการข้ามศาสตร์ / สหวิทยาการ">
          <input
            type="text"
            value={formData.cross_disciplinary || ''}
            onChange={(e) => onChange('cross_disciplinary', e.target.value)}
            placeholder="ระบุสาขาวิชาหรือคณะที่บูรณาการร่วมกัน (ถ้ามี)..."
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
          />
        </FormField>
      </section>

      {/* ======================================================== */}
      {/* ส่วนที่ 5: ระดับความพร้อมทางเทคโนโลยี */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ระดับความพร้อมทางเทคโนโลยี
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="ระดับ TRL เริ่มต้นโครงการ ">
            <TrlSelect
              value={formData.trl_start ?? null}
              onChange={(lvl) => onChange('trl_start', lvl)}
              placeholder="เลือกระดับ TRL เริ่มต้น"
            />
          </FormField>

          <FormField label="ระดับ TRL เมื่อสิ้นสุดโครงการ ">
            <TrlSelect
              value={formData.trl_end ?? null}
              onChange={(lvl) => onChange('trl_end', lvl)}
              placeholder="เลือกระดับ TRL เป้าหมาย"
            />
          </FormField>
        </div>

        {formData.trl_start && formData.trl_end && formData.trl_end < formData.trl_start && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
            <AlertCircle className="size-3.5 shrink-0 text-amber-600" />
            <span>คำเตือน: TRL เป้าหมายควรสูงกว่าหรือเท่ากับ TRL เริ่มต้น</span>
          </div>
        )}

        <FormField label="ผลงาน / ผลผลิตโครงการราย Output พร้อมระดับ TRL">
          <TrlOutputsField
            items={formData.trl_outputs || []}
            onChange={(outputs: TrlOutputItem[]) => onChange('trl_outputs', outputs)}
          />
        </FormField>
      </section>
    </div>
  );
}

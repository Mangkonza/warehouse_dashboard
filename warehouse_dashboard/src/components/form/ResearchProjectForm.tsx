'use client';

import * as React from 'react';
import {
  FileText,
  Users,
  Building2,
  DollarSign,
  GraduationCap,
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
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
  { label: 'ร่วมมือกับสถาบันหรือองค์กรต่างประเทศ (International Collaboration)', value: 'international' },
];

const PROJECT_NATURE_OPTIONS = [
  { label: 'การวิจัยพื้นฐาน (Basic Research)', value: 'basic', hint: 'สร้างองค์ความรู้ใหม่' },
  { label: 'การวิจัยประยุกต์ (Applied Research)', value: 'applied', hint: 'ประยุกต์ใช้แก้ปัญหา' },
  { label: 'การพัฒนาเชิงทดลอง (Experimental Development)', value: 'experimental', hint: 'สร้างต้นแบบ/กระบวนการ' },
  { label: 'การถ่ายทอดเทคโนโลยีหรือเชิงพาณิชย์', value: 'commercialization', hint: 'พร้อมขยายผลเชิงพาณิชย์' },
];

export function ResearchProjectForm({
  formData,
  onChange,
  setFormData,
  isEdit = false,
}: ResearchProjectFormProps) {
  // Section collapse states (all expanded by default)
  const [openSections, setOpenSections] = React.useState({
    basic: true,
    personnel: true,
    collabBudget: true,
    integration: true,
    trl: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Funding sources list with custom creatable options
  const fundingOptions = React.useMemo(() => {
    const list = fundingSourcesData.map((f) => f.name);
    // Add existing ones from research data
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
        // In edit mode, same item is not a duplicate
        return false;
      }
      return existingCode.toLowerCase() === currentCode.toLowerCase();
    });
    return exists ? `รหัสโครงการ "${currentCode}" มีอยู่ในระบบแล้ว` : null;
  }, [formData.id, formData._id, isEdit]);

  // Handle project code input normalization
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange('id', raw);
  };

  // Date range object
  const dateRangeValue: MonthYearRangeValue = React.useMemo(() => {
    return {
      start: formData.start_date || null,
      end: formData.end_date || null,
    };
  }, [formData.start_date, formData.end_date]);

  // Budget calculation
  const budgetInternal = Number(formData.budget_internal) || 0;
  const budgetExternal = Number(formData.budget_external) || 0;
  const budgetTotal = budgetInternal + budgetExternal;

  return (
    <div className="flex flex-col gap-4 text-slate-800">
      {/* ======================================================== */}
      {/* หมวดที่ 1: ข้อมูลโครงการวิจัย */}
      {/* ======================================================== */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection('basic')}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100/80 transition-colors cursor-pointer select-none border-b border-slate-100"
        >
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileText className="size-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                ส่วนที่ 1: ข้อมูลโครงการวิจัย
                <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  จำเป็น
                </span>
              </h4>
              <p className="text-[11.5px] text-slate-500">
                รหัสโครงการ, ชื่อโครงการภาษาไทยและอังกฤษ, แหล่งทุน, และระยะเวลาดำเนินโครงการ
              </p>
            </div>
          </div>
          <div className="text-slate-400">
            {openSections.basic ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </button>

        {openSections.basic && (
          <div className="p-4 space-y-3.5">
            {/* รหัสโครงการ และ ปีงบประมาณ พ.ศ. */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <FormField
                  label="รหัสโครงการวิจัย"
                  required
                  error={duplicateCodeWarning}
                  hint="เช่น วศ.กพส. 1/2568"
                >
                  <input
                    type="text"
                    value={formData.id || ''}
                    onChange={handleCodeChange}
                    placeholder="เช่น วศ.กพส. 1/2568"
                    className={cn(
                      'w-full h-10 px-3 text-sm rounded-lg border border-input bg-background shadow-2xs font-mono transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      duplicateCodeWarning && 'border-amber-400 bg-amber-50/30'
                    )}
                  />
                </FormField>
              </div>

              <div className="sm:col-span-4">
                <FormField label="ปีงบประมาณ (พ.ศ.)" hint="เช่น 2568">
                  <input
                    type="number"
                    value={formData.fiscal_year_be || ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                      onChange('fiscal_year_be', val);
                    }}
                    placeholder="2568"
                    className="w-full h-10 px-3 text-sm rounded-lg border border-input bg-background shadow-2xs focus:outline-none focus:border-emerald-500"
                  />
                </FormField>
              </div>
            </div>

            {/* ชื่อโครงการภาษาไทย */}
            <FormField label="ชื่อโครงการวิจัย (ภาษาไทย)" required>
              <textarea
                rows={2}
                value={formData.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="ระบุชื่อโครงการวิจัยภาษาไทย..."
                className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-input bg-background shadow-2xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </FormField>

            {/* ชื่อโครงการภาษาอังกฤษ */}
            <FormField label="ชื่อโครงการวิจัย (ภาษาอังกฤษ)" hint="ถ้ามี">
              <input
                type="text"
                value={formData.name_en || ''}
                onChange={(e) => onChange('name_en', e.target.value)}
                placeholder="English Research Project Title..."
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-input bg-background shadow-2xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </FormField>

            {/* แหล่งทุนวิจัย และ ประเภททุน */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <FormField label="แหล่งทุนวิจัย" required hint="เลือกจากรายการหรือพิมพ์ระบุแหล่งทุนใหม่">
                  <CreatableCombobox
                    options={fundingOptions}
                    value={formData.fund_source || ''}
                    onChange={(val) => {
                      onChange('fund_source', val);
                      // Auto detect fund type if known
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
                        'h-10 rounded-lg text-xs font-semibold border transition-all cursor-pointer',
                        formData.fund_type === 'ภายใน'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-input hover:bg-slate-50'
                      )}
                    >
                      ทุนภายใน
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange('fund_type', 'ภายนอก')}
                      className={cn(
                        'h-10 rounded-lg text-xs font-semibold border transition-all cursor-pointer',
                        formData.fund_type === 'ภายนอก'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-input hover:bg-slate-50'
                      )}
                    >
                      ทุนภายนอก
                    </button>
                  </div>
                </FormField>
              </div>
            </div>

            {/* ช่วงเวลาดำเนินโครงการ (พ.ศ.) */}
            <FormField label="ระยะเวลาดำเนินโครงการ (เดือน/ปี พ.ศ.)" hint="เลือกช่วงเวลาเริ่มต้นและสิ้นสุด">
              <MonthYearRangePicker
                value={dateRangeValue}
                onChange={({ start, end }) => {
                  onChange('start_date', start);
                  onChange('end_date', end);
                }}
              />
            </FormField>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* หมวดที่ 2: คณะผู้วิจัยและสังกัด */}
      {/* ======================================================== */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection('personnel')}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100/80 transition-colors cursor-pointer select-none border-b border-slate-100"
        >
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Users className="size-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                ส่วนที่ 2: คณะผู้วิจัยและสังกัด
                <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  จำเป็น
                </span>
              </h4>
              <p className="text-[11.5px] text-slate-500">
                หัวหน้าโครงการ, สังกัดภาควิชาหลัก, ผู้ร่วมวิจัย, และหน่วยงานร่วมรับผิดชอบ
              </p>
            </div>
          </div>
          <div className="text-slate-400">
            {openSections.personnel ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </button>

        {openSections.personnel && (
          <div className="p-4 space-y-3.5">
            {/* หัวหน้าโครงการ และ สังกัดหลัก */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <FormField label="หัวหน้าโครงการวิจัย" required hint="ค้นหาอาจารย์/นักวิจัย หรือพิมพ์ระบุ">
                  <PersonPicker
                    value={formData.head ? {
                      person_id: formData.head_id || null,
                      name: formData.head,
                      department: formData.department,
                    } : null}
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
              </div>

              <div className="sm:col-span-6">
                <FormField label="ภาควิชา / สังกัดหลักที่รับผิดชอบ" required>
                  <DepartmentSelect
                    value={formData.department || ''}
                    onChange={(val) => onChange('department', val)}
                    placeholder="-- เลือกภาควิชาหลัก --"
                  />
                </FormField>
              </div>
            </div>

            {/* หน่วยงานร่วมรับผิดชอบ (หลายสังกัด) */}
            <FormField
              label="หน่วยงาน / ภาควิชาร่วมรับผิดชอบ (ถ้ามีหลายสังกัด)"
              hint="เลือกได้หลายภาควิชา/ศูนย์"
            >
              <DepartmentMultiSelect
                value={formData.departments || []}
                onChange={(depts) => onChange('departments', depts)}
                placeholder="-- เลือกหน่วยงานร่วมรับผิดชอบเพิ่มเติม --"
              />
            </FormField>

            {/* ผู้ร่วมวิจัย (RepeatableList) */}
            <FormField
              label="ผู้ร่วมวิจัย (Co-Researchers)"
              hint="ระบุชื่อผู้ร่วมวิจัยและสัดส่วนการมีส่วนร่วม (ถ้ามี)"
            >
              <PersonListField
                items={formData.co_researchers || []}
                onChange={(items: CoResearcherItem[]) => onChange('co_researchers', items)}
                showContribution
              />
            </FormField>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* หมวดที่ 3: ความร่วมมือ ลักษณะโครงการ และงบประมาณ */}
      {/* ======================================================== */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection('collabBudget')}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100/80 transition-colors cursor-pointer select-none border-b border-slate-100"
        >
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <DollarSign className="size-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                ส่วนที่ 3: ความร่วมมือ ลักษณะโครงการ และงบประมาณ
              </h4>
              <p className="text-[11.5px] text-slate-500">
                ประเภทความร่วมมือ, ลักษณะโครงการ, งบประมาณภายใน/ภายนอก
              </p>
            </div>
          </div>
          <div className="text-slate-400">
            {openSections.collabBudget ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </button>

        {openSections.collabBudget && (
          <div className="p-4 space-y-4">
            {/* ความร่วมมือของโครงการ */}
            <FormField label="ลักษณะความร่วมมือของโครงการวิจัย" hint="เลือกได้มากกว่า 1 ข้อ">
              <CheckboxGroupWithOther
                options={COLLABORATION_OPTIONS}
                value={formData.collaboration_type || []}
                onChange={(vals) => onChange('collaboration_type', vals)}
                otherOptionLabel="ความร่วมมืออื่นๆ (โปรดระบุ)"
                orientation="grid"
              />
            </FormField>

            {/* ลักษณะโครงการ */}
            <FormField label="ลักษณะโครงการวิจัย" hint="เลือกได้มากกว่า 1 ข้อ">
              <CheckboxGroupWithOther
                options={PROJECT_NATURE_OPTIONS}
                value={formData.project_nature || []}
                onChange={(vals) => onChange('project_nature', vals)}
                otherOptionLabel="ลักษณะอื่นๆ (โปรดระบุ)"
                orientation="grid"
              />
            </FormField>

            {/* งบประมาณภายใน, ภายนอก และรวม */}
            <div className="pt-2 border-t border-slate-100">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                งบประมาณโครงการวิจัย
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField label="งบประมาณภายใน" hint="เช่น ทุนคณะ, ทุน มก.">
                  <MoneyInput
                    value={formData.budget_internal}
                    onChange={(num) => onChange('budget_internal', num ?? 0)}
                    placeholder="0.00"
                  />
                </FormField>

                <FormField label="งบประมาณภายนอก" hint="เช่น วช., สวก., บพข.">
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
                  <div className="h-10 px-3 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/60 font-mono font-bold text-emerald-800 text-sm shadow-2xs">
                    <span>{budgetTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <span className="text-xs font-semibold text-emerald-700">บาท</span>
                  </div>
                  <span className="text-[11px] text-slate-400">ภายใน + ภายนอก</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* หมวดที่ 4: การบูรณาการ */}
      {/* ======================================================== */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection('integration')}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100/80 transition-colors cursor-pointer select-none border-b border-slate-100"
        >
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <GraduationCap className="size-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                ส่วนที่ 4: การบูรณาการกับการเรียนการสอนและบริการวิชาการ
              </h4>
              <p className="text-[11.5px] text-slate-500">
                นำองค์ความรู้ไปสอน, นำงานวิจัยไปใช้ในรายวิชา, บริการวิชาการ, และข้ามศาสตร์
              </p>
            </div>
          </div>
          <div className="text-slate-400">
            {openSections.integration ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </button>

        {openSections.integration && (
          <div className="p-4 space-y-4">
            {/* รายวิชาที่นำความรู้ไปสอน */}
            <FormField
              label="4.1 รายวิชาที่นำองค์ความรู้จากงานวิจัยไปใช้ในการเรียนการสอน"
              hint="ระบุรหัส 8 หลักของ มก. หรือเลือกจากหลักสูตรแนะนำ"
            >
              <CourseListField
                items={formData.teaching_courses || []}
                onChange={(courses: CourseItem[]) => onChange('teaching_courses', courses)}
                addLabel="+ เพิ่มรายวิชาที่นำไปสอน"
                emptyMessage="ยังไม่มีรายวิชาที่นำไปสอน (คลิกเพิ่มเพื่อระบุรหัสวิชา)"
              />
            </FormField>

            {/* รายวิชาที่นำผลงานวิจัยไปใช้ */}
            <FormField
              label="4.2 รายวิชาที่นำผลงานวิจัย / ชิ้นงาน / ต้นแบบ ไปใช้ประโยชน์"
              hint="ระบุรหัส 8 หลักของ มก. หรือเลือกจากหลักสูตรแนะนำ"
            >
              <CourseListField
                items={formData.applied_courses || []}
                onChange={(courses: CourseItem[]) => onChange('applied_courses', courses)}
                addLabel="+ เพิ่มรายวิชาที่นำวิจัยไปใช้"
                emptyMessage="ยังไม่มีรายวิชาที่นำวิจัยไปใช้ (คลิกเพิ่มเพื่อระบุรหัสวิชา)"
              />
            </FormField>

            {/* การบริการวิชาการ */}
            <FormField
              label="4.3 การนำผลงานไปบูรณาการกับงานบริการวิชาการ"
              hint="ระบุโครงการบริการวิชาการ ชุมชน หรือผู้ได้รับประโยชน์"
            >
              <textarea
                rows={2}
                value={formData.academic_service || ''}
                onChange={(e) => onChange('academic_service', e.target.value)}
                placeholder="ระบุรายละเอียดการต่อยอดหรือบูรณาการกับงานบริการวิชาการ (ถ้ามี)..."
                className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-input bg-background shadow-2xs focus:outline-none focus:border-emerald-500"
              />
            </FormField>

            {/* การบูรณาการข้ามศาสตร์ */}
            <FormField
              label="4.4 การบูรณาการข้ามศาสตร์ / สหวิทยาการ"
              hint="เช่น ร่วมมือกับคณะเกษตร คณะศิลปศาสตร์และวิทยาศาสตร์ หรือศูนย์วิจัยภายนอก"
            >
              <input
                type="text"
                value={formData.cross_disciplinary || ''}
                onChange={(e) => onChange('cross_disciplinary', e.target.value)}
                placeholder="ระบุสาขาวิชาหรือคณะที่บูรณาการร่วมกัน (ถ้ามี)..."
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-input bg-background shadow-2xs focus:outline-none focus:border-emerald-500"
              />
            </FormField>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* หมวดที่ 5: ระดับความพร้อมทางเทคโนโลยี (TRL) */}
      {/* ======================================================== */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection('trl')}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100/80 transition-colors cursor-pointer select-none border-b border-slate-100"
        >
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Award className="size-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                ส่วนที่ 5: ระดับความพร้อมทางเทคโนโลยี (TRL 1-9)
              </h4>
              <p className="text-[11.5px] text-slate-500">
                Technology Readiness Level เริ่มต้น, สิ้นสุด, และผลผลิตราย Output
              </p>
            </div>
          </div>
          <div className="text-slate-400">
            {openSections.trl ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </button>

        {openSections.trl && (
          <div className="p-4 space-y-4">
            {/* TRL เริ่มต้น และ สิ้นสุด */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="ระดับ TRL เริ่มต้นโครงการ (TRL Start)">
                <TrlSelect
                  value={formData.trl_start ?? null}
                  onChange={(lvl) => onChange('trl_start', lvl)}
                  placeholder="เลือกระดับ TRL เริ่มต้น"
                />
              </FormField>

              <FormField label="ระดับ TRL เมื่อสิ้นสุดโครงการ (TRL Target)">
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

            {/* ผลงานราย Output */}
            <FormField
              label="ผลงาน / ผลผลิตโครงการราย Output พร้อมระดับ TRL"
              hint="ระบุชิ้นงาน ต้นแบบ เอกสาร หรือนวัตกรรมที่ได้รับจากโครงการ"
            >
              <TrlOutputsField
                items={formData.trl_outputs || []}
                onChange={(outputs: TrlOutputItem[]) => onChange('trl_outputs', outputs)}
              />
            </FormField>
          </div>
        )}
      </div>
    </div>
  );
}

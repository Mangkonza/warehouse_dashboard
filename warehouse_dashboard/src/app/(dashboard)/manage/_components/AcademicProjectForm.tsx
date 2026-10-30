'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FormField } from '@/components/form/FormField';
import { PersonPicker } from '@/components/form/PersonPicker';
import { DepartmentSelect } from '@/components/ui';
import researchData from '@/data/research.json';
import ipData from '@/data/ip.json';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { MoneyInput } from '@/components/form/MoneyInput';
import { Checkbox } from '@/components/ui/checkbox';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

interface ResearchProjectItem {
  code: string;
  name: string;
}

export interface AcademicCategoryDefinition {
  category: string;
  subTypes: string[];
}

export const ACADEMIC_PROJECT_CATEGORIES: AcademicCategoryDefinition[] = [
  {
    category: 'งานบริการด้านวิจัย',
    subTypes: ['ศึกษา', 'วิจัย', 'สำรวจ', 'วางระบบ', 'ออกแบบ', 'สร้าง', 'ประดิษฐ์', 'การพัฒนา'],
  },
  {
    category: 'งานที่ปรึกษา',
    subTypes: ['บริการให้คำปรึกษา'],
  },
  {
    category: 'งานบริการด้านฝึกอบรม',
    subTypes: ['บริการฝึกอบรม', 'สัมมนา และประชุมเชิงปฏิบัติการในลักษณะว่าจ้าง', 'การพัฒนา'],
  },
  {
    category: 'งานด้านบริการ',
    subTypes: [
      'บริการวิเคราะห์',
      'ทดสอบ',
      'ตรวจสอบ',
      'ตรวจซ่อม',
      'การผลิต',
      'การควบคุม',
      'การติดตั้ง',
      'การปรับปรุง',
      'การประกอบ',
      'การส่งเสริม',
      'การพัฒนา',
    ],
  },
  {
    category: 'งานบริการอื่นๆ',
    subTypes: ['ความร่วมมือต่างๆเป็นต้น', 'อื่นๆที่ไม่สามารถระบุกลุ่มได้'],
  },
];

interface AcademicProjectFormProps {
  formData: Record<string, any>;
  onChange: (key: string, val: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export const AcademicProjectForm: React.FC<AcademicProjectFormProps> = ({
  formData,
  onChange,
}) => {
  const [inputResearchCode, setInputResearchCode] = useState('');
  const [inputResearchName, setInputResearchName] = useState('');
  const [researchCodeError, setResearchCodeError] = useState('');

  // Budget calculations
  const totalBudget = Number(formData.budget) || 0;

  const round2 = (val: number): number => {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  };

  const percentFaculty =
    formData.percent_faculty !== undefined && formData.percent_faculty !== null && formData.percent_faculty !== ''
      ? Number(formData.percent_faculty)
      : formData.alloc_faculty !== undefined && totalBudget > 0
      ? round2((Number(formData.alloc_faculty) / totalBudget) * 100)
      : 5;

  const percentDept =
    formData.percent_dept !== undefined && formData.percent_dept !== null && formData.percent_dept !== ''
      ? Number(formData.percent_dept)
      : formData.alloc_dept !== undefined && totalBudget > 0
      ? round2((Number(formData.alloc_dept) / totalBudget) * 100)
      : 5;

  const percentKu =
    formData.percent_ku !== undefined && formData.percent_ku !== null && formData.percent_ku !== ''
      ? Number(formData.percent_ku)
      : formData.alloc_ku !== undefined && totalBudget > 0
      ? round2((Number(formData.alloc_ku) / totalBudget) * 100)
      : 5;

  const allocFaculty =
    formData.alloc_faculty !== undefined && formData.alloc_faculty !== null && formData.alloc_faculty !== ''
      ? Number(formData.alloc_faculty)
      : round2((totalBudget * percentFaculty) / 100);

  const allocDept =
    formData.alloc_dept !== undefined && formData.alloc_dept !== null && formData.alloc_dept !== ''
      ? Number(formData.alloc_dept)
      : round2((totalBudget * percentDept) / 100);

  const allocKu =
    formData.alloc_ku !== undefined && formData.alloc_ku !== null && formData.alloc_ku !== ''
      ? Number(formData.alloc_ku)
      : round2((totalBudget * percentKu) / 100);

  const totalAllocDeductions = round2(allocFaculty + allocDept + allocKu);
  const totalDeductPercent = round2(percentFaculty + percentDept + percentKu);
  const remainingPercent = Math.max(0, round2(100 - totalDeductPercent));
  const allocRemaining =
    formData.alloc_remaining !== undefined && formData.alloc_remaining !== null && formData.alloc_remaining !== ''
      ? Number(formData.alloc_remaining)
      : Math.max(0, round2(totalBudget - totalAllocDeductions));

  const isOverBudget =
    (totalBudget > 0 && totalAllocDeductions > totalBudget) || totalDeductPercent > 100;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleBudgetChange = (b: number | null) => {
    const val = b ?? 0;
    const fAmt = round2((val * percentFaculty) / 100);
    const dAmt = round2((val * percentDept) / 100);
    const kAmt = round2((val * percentKu) / 100);
    const remAmt = Math.max(0, round2(val - (fAmt + dAmt + kAmt)));

    onChange('budget', val);
    onChange('percent_faculty', percentFaculty);
    onChange('percent_dept', percentDept);
    onChange('percent_ku', percentKu);
    onChange('alloc_faculty', fAmt);
    onChange('alloc_dept', dAmt);
    onChange('alloc_ku', kAmt);
    onChange('alloc_remaining', remAmt);
  };

  const handlePercentChange = (
    key: 'percent_faculty' | 'percent_dept' | 'percent_ku',
    rawVal: string
  ) => {
    const amtKey =
      key === 'percent_faculty'
        ? 'alloc_faculty'
        : key === 'percent_dept'
        ? 'alloc_dept'
        : 'alloc_ku';

    if (rawVal === '') {
      onChange(key, '');
      onChange(amtKey, 0);

      const nextFAmt = key === 'percent_faculty' ? 0 : allocFaculty;
      const nextDAmt = key === 'percent_dept' ? 0 : allocDept;
      const nextKAmt = key === 'percent_ku' ? 0 : allocKu;
      const nextRemAmt = Math.max(0, round2(totalBudget - (nextFAmt + nextDAmt + nextKAmt)));
      onChange('alloc_remaining', nextRemAmt);
      return;
    }

    const num = parseFloat(rawVal);
    const validNum = isNaN(num) ? 0 : Math.max(0, Math.min(100, num));
    const calculatedAmt = totalBudget > 0 ? round2((totalBudget * validNum) / 100) : 0;

    const nextFAmt = key === 'percent_faculty' ? calculatedAmt : allocFaculty;
    const nextDAmt = key === 'percent_dept' ? calculatedAmt : allocDept;
    const nextKAmt = key === 'percent_ku' ? calculatedAmt : allocKu;
    const nextRemAmt = Math.max(0, round2(totalBudget - (nextFAmt + nextDAmt + nextKAmt)));

    onChange(key, validNum);
    onChange(amtKey, calculatedAmt);
    onChange('alloc_remaining', nextRemAmt);
  };

  const handlePercentBlur = (key: 'percent_faculty' | 'percent_dept' | 'percent_ku') => {
    const cur = formData[key];
    if (cur === '' || cur === undefined || cur === null) {
      onChange(key, 0);
    } else {
      const num = parseFloat(String(cur));
      onChange(key, isNaN(num) ? 0 : round2(num));
    }
  };

  const handleAmountChange = (
    key: 'alloc_faculty' | 'alloc_dept' | 'alloc_ku',
    rawAmt: number | null
  ) => {
    const validAmt = rawAmt !== null && !isNaN(rawAmt) ? Math.max(0, rawAmt) : 0;
    const percentKey =
      key === 'alloc_faculty'
        ? 'percent_faculty'
        : key === 'alloc_dept'
        ? 'percent_dept'
        : 'percent_ku';

    const calculatedPercent =
      totalBudget > 0 ? round2((validAmt / totalBudget) * 100) : 0;

    const nextFAmt = key === 'alloc_faculty' ? validAmt : allocFaculty;
    const nextDAmt = key === 'alloc_dept' ? validAmt : allocDept;
    const nextKAmt = key === 'alloc_ku' ? validAmt : allocKu;
    const nextRemAmt = Math.max(0, round2(totalBudget - (nextFAmt + nextDAmt + nextKAmt)));

    onChange(key, validAmt);
    onChange(percentKey, calculatedPercent);
    onChange('alloc_remaining', nextRemAmt);
  };

  // Section 5: Academic Project Categories & Sub-types
  const selectedCategories: string[] = React.useMemo(() => {
    if (Array.isArray(formData.project_type_categories)) {
      return formData.project_type_categories;
    }
    if (Array.isArray(formData.project_type_category)) {
      return formData.project_type_category;
    }
    if (typeof formData.project_type_category === 'string' && formData.project_type_category) {
      return formData.project_type_category
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [formData.project_type_categories, formData.project_type_category]);

  const selectedSubTypes: string[] = React.useMemo(() => {
    if (Array.isArray(formData.project_sub_types)) return formData.project_sub_types;
    if (typeof formData.project_sub_types === 'string' && formData.project_sub_types) {
      return formData.project_sub_types.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }, [formData.project_sub_types]);

  const otherCustomText = React.useMemo(() => {
    if (formData.project_type_other) return String(formData.project_type_other);
    const match = selectedSubTypes.find((s) => s.startsWith('อื่นๆ: '));
    if (match) return match.replace('อื่นๆ: ', '');
    return '';
  }, [formData.project_type_other, selectedSubTypes]);

  const isOtherChecked = React.useMemo(() => {
    return selectedSubTypes.some((s) => s === 'อื่นๆ' || s.startsWith('อื่นๆ:'));
  }, [selectedSubTypes]);

  const handleToggleCategory = (cat: string) => {
    let nextCats: string[];
    let nextSubTypes = [...selectedSubTypes];
    const catDef = ACADEMIC_PROJECT_CATEGORIES.find((c) => c.category === cat);

    if (selectedCategories.includes(cat)) {
      nextCats = selectedCategories.filter((c) => c !== cat);
      if (catDef) {
        nextSubTypes = nextSubTypes.filter((s) => !catDef.subTypes.includes(s));
      }
    } else {
      nextCats = [...selectedCategories, cat];
    }

    onChange('project_type_categories', nextCats);
    onChange('project_type_category', nextCats.join(', '));
    onChange('project_sub_types', nextSubTypes);
  };

  const handleToggleSubType = (subType: string) => {
    let next: string[];
    if (selectedSubTypes.includes(subType)) {
      next = selectedSubTypes.filter((s) => s !== subType);
    } else {
      next = [...selectedSubTypes, subType];
    }
    onChange('project_sub_types', next);
  };

  const handleToggleOther = () => {
    if (isOtherChecked) {
      const filtered = selectedSubTypes.filter((s) => s !== 'อื่นๆ' && !s.startsWith('อื่นๆ:'));
      onChange('project_sub_types', filtered);
      onChange('project_type_other', '');
    } else {
      const custom = (otherCustomText || '').trim();
      const entry = custom ? `อื่นๆ: ${custom}` : 'อื่นๆ';
      onChange('project_sub_types', [...selectedSubTypes, entry]);
    }
  };

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onChange('project_type_other', text);
    const clean = text.trim();
    const entry = clean ? `อื่นๆ: ${clean}` : 'อื่นๆ';
    const filtered = selectedSubTypes.filter((s) => s !== 'อื่นๆ' && !s.startsWith('อื่นๆ:'));
    onChange('project_sub_types', [...filtered, entry]);
  };

  // Research projects array
  const researchProjects: ResearchProjectItem[] = Array.isArray(formData.research_projects)
    ? formData.research_projects
    : [];

  const handleAddResearchProject = () => {
    const cleanCode = inputResearchCode.trim();
    const cleanName = inputResearchName.trim();

    if (!cleanCode) {
      setResearchCodeError('กรุณาระบุรหัสโครงการวิจัย');
      return;
    }

    if (cleanCode.length > 8) {
      setResearchCodeError('รหัสโครงการวิจัยต้องไม่เกิน 8 ตัวอักษร');
      return;
    }

    if (!cleanName) {
      setResearchCodeError('กรุณาระบุชื่อโครงการวิจัย');
      return;
    }

    if (researchProjects.some((p) => p.code.toLowerCase() === cleanCode.toLowerCase())) {
      setResearchCodeError(`รหัส ${cleanCode} มีอยู่ในรายการแล้ว`);
      return;
    }

    const updated = [...researchProjects, { code: cleanCode, name: cleanName }];
    onChange('research_projects', updated);
    setInputResearchCode('');
    setInputResearchName('');
    setResearchCodeError('');
  };

  const handleRemoveResearchProject = (index: number) => {
    const updated = researchProjects.filter((_, i) => i !== index);
    onChange('research_projects', updated);
  };

  const handleQuickSelectResearch = (selectedId: string | null) => {
    if (!selectedId) return;
    const found = researchData.find((r: any) => String(r.id || r._id).trim() === selectedId.trim());
    if (found) {
      const rawCode = String(found.id || '').replace(/[\n\r\s]/g, '');
      const code8 = rawCode.length > 8 ? rawCode.substring(0, 8) : rawCode;
      setInputResearchCode(code8);
      setInputResearchName(String(found.name || '').replace(/[\n\r]/g, ' ').trim());
      setResearchCodeError('');
    }
  };

  const handleQuickSelectIp = (selectedVal: string | null) => {
    if (selectedVal) {
      onChange('patent_integration', selectedVal);
    }
  };

  // Project characteristics
  const characteristics: string[] = Array.isArray(formData.characteristics)
    ? formData.characteristics
    : typeof formData.characteristics === 'string' && formData.characteristics
    ? formData.characteristics.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const toggleCharacteristic = (char: string) => {
    const exists = characteristics.includes(char);
    const updated = exists
      ? characteristics.filter((c) => c !== char)
      : [...characteristics, char];
    onChange('characteristics', updated);
  };

  return (
    <div className="space-y-7 text-slate-800">
      {/* ========================================================================= */}
      {/* ส่วนที่ 1: ข้อมูลทั่วไปของโครงการพัฒนาวิชาการ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ข้อมูลทั่วไปของโครงการพัฒนาวิชาการ
          </h4>
        </div>

        <FormField label="ชื่อโครงการพัฒนาวิชาการ" required>
          <textarea
            rows={2}
            value={formData.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="ระบุชื่อโครงการพัฒนาวิชาการ..."
            required
            className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="สังกัดที่ดำเนินการ">
            <DepartmentSelect
              value={formData.department || ''}
              onChange={(val) => onChange('department', val)}
              placeholder="-- เลือกสังกัด --"
              className="w-full"
            />
          </FormField>

          <FormField label="ผู้ขอรับบริการ / ว่าจ้าง">
            <input
              type="text"
              value={formData.client || ''}
              onChange={(e) => onChange('client', e.target.value)}
              placeholder="เช่น บริษัท เกษตรพัฒนา จำกัด, กรมโรงงานอุตสาหกรรม"
              className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
            />
          </FormField>
        </div>

        <FormField label="ลักษณะโครงการ">
          <div className="flex flex-wrap gap-x-8 gap-y-2 pt-0.5">
            {[
              { id: 'สอดคล้องกับนโยบายชาติ', label: 'สอดคล้องกับนโยบายชาติ' },
              { id: 'เพิ่มมูลค่า', label: 'เพิ่มมูลค่า' },
            ].map((opt) => {
              const isSelected = characteristics.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className="inline-flex items-center gap-2.5 py-1 cursor-pointer select-none"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleCharacteristic(opt.id)}
                  />
                  <span className={cn('text-sm', isSelected ? 'text-slate-900 font-medium' : 'text-slate-700')}>
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        </FormField>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 2: บุคลากรและผู้ร่วมโครงการ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            บุคลากรและผู้ร่วมโครงการ
          </h4>
        </div>

        <FormField label="หัวหน้าโครงการ" required>
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
            placeholder="ค้นหาชื่ออาจารย์หรือหัวหน้าโครงการ..."
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="ผู้ร่วมโครงการ (ภายใน)">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="1"
                value={formData.co_members_internal !== undefined ? formData.co_members_internal : ''}
                onChange={(e) => onChange('co_members_internal', parseInt(e.target.value, 10) || 0)}
                placeholder="0"
                className="w-full h-10 px-3 text-sm font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
              />
              <span className="text-xs text-slate-500 shrink-0">คน</span>
            </div>
          </FormField>

          <FormField label="ผู้ร่วมโครงการ (ภายนอก)">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="1"
                value={formData.co_members_external !== undefined ? formData.co_members_external : ''}
                onChange={(e) => onChange('co_members_external', parseInt(e.target.value, 10) || 0)}
                placeholder="0"
                className="w-full h-10 px-3 text-sm font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
              />
              <span className="text-xs text-slate-500 shrink-0">คน</span>
            </div>
          </FormField>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 3: งบประมาณรวมและการจัดสรรอัตโนมัติ */}
      {/* ========================================================================= */}
      <section id="section-academic-budget" className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            งบประมาณรวมและการจัดสรรอัตโนมัติ
          </h4>
        </div>

        <FormField label="งบประมาณรวมทั้งหมด" required>
          <MoneyInput
            value={formData.budget !== undefined && formData.budget !== '' ? Number(formData.budget) : null}
            onChange={handleBudgetChange}
            placeholder="0.00"
          />
        </FormField>

        <FormField label="การจัดสรรงบประมาณอัตโนมัติ">
          <div
            className={cn(
              'rounded-lg border bg-white overflow-hidden transition-colors',
              isOverBudget ? 'border-rose-300' : 'border-slate-200'
            )}
          >
            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">
              <div className="flex-1 min-w-0" />
              <div className="w-[140px] text-right pr-7">สัดส่วน</div>
              <div className="w-[220px] text-right pr-9">จำนวนเงิน</div>
            </div>

            <div className="divide-y divide-slate-100 px-4">
              {/* 1. หักเข้าคณะ */}
              <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4 py-2.5">
                <div className="text-sm text-slate-700 md:flex-1 min-w-0">
                  หักเข้าคณะ
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 flex-1 md:w-[140px]">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.percent_faculty !== undefined ? formData.percent_faculty : percentFaculty}
                      onChange={(e) => handlePercentChange('percent_faculty', e.target.value)}
                      onBlur={() => handlePercentBlur('percent_faculty')}
                      placeholder="0.00"
                      className={cn(
                        'flex-1 h-10 px-3 text-sm text-right tabular-nums rounded-lg border bg-white transition-colors',
                        'focus:outline-none focus:ring-2',
                        isOverBudget
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                          : 'border-slate-300 focus:border-[#00A651] focus:ring-[#00A651]/20 text-slate-900'
                      )}
                    />
                    <span className="shrink-0 text-sm text-slate-600 select-none w-5 text-left">%</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-[1.5] md:w-[220px]">
                    <MoneyInput
                      value={allocFaculty}
                      onChange={(val) => handleAmountChange('alloc_faculty', val)}
                      placeholder="0.00"
                      className="w-full"
                      inputClassName={isOverBudget ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : undefined}
                    />
                  </div>
                </div>
              </div>

              {/* 2. หักเข้าภาควิชา */}
              <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4 py-2.5">
                <div className="text-sm text-slate-700 md:flex-1 min-w-0">
                  หักเข้าภาควิชา
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 flex-1 md:w-[140px]">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.percent_dept !== undefined ? formData.percent_dept : percentDept}
                      onChange={(e) => handlePercentChange('percent_dept', e.target.value)}
                      onBlur={() => handlePercentBlur('percent_dept')}
                      placeholder="0.00"
                      className={cn(
                        'flex-1 h-10 px-3 text-sm text-right tabular-nums rounded-lg border bg-white transition-colors',
                        'focus:outline-none focus:ring-2',
                        isOverBudget
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                          : 'border-slate-300 focus:border-[#00A651] focus:ring-[#00A651]/20 text-slate-900'
                      )}
                    />
                    <span className="shrink-0 text-sm text-slate-600 select-none w-5 text-left">%</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-[1.5] md:w-[220px]">
                    <MoneyInput
                      value={allocDept}
                      onChange={(val) => handleAmountChange('alloc_dept', val)}
                      placeholder="0.00"
                      className="w-full"
                      inputClassName={isOverBudget ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : undefined}
                    />
                  </div>
                </div>
              </div>

              {/* 3. หักเข้ามหาวิทยาลัย (มก.) */}
              <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4 py-2.5">
                <div className="text-sm text-slate-700 md:flex-1 min-w-0">
                  หักเข้ามหาวิทยาลัย (มก.)
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 flex-1 md:w-[140px]">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.percent_ku !== undefined ? formData.percent_ku : percentKu}
                      onChange={(e) => handlePercentChange('percent_ku', e.target.value)}
                      onBlur={() => handlePercentBlur('percent_ku')}
                      placeholder="0.00"
                      className={cn(
                        'flex-1 h-10 px-3 text-sm text-right tabular-nums rounded-lg border bg-white transition-colors',
                        'focus:outline-none focus:ring-2',
                        isOverBudget
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                          : 'border-slate-300 focus:border-[#00A651] focus:ring-[#00A651]/20 text-slate-900'
                      )}
                    />
                    <span className="shrink-0 text-sm text-slate-600 select-none w-5 text-left">%</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-[1.5] md:w-[220px]">
                    <MoneyInput
                      value={allocKu}
                      onChange={(val) => handleAmountChange('alloc_ku', val)}
                      placeholder="0.00"
                      className="w-full"
                      inputClassName={isOverBudget ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : undefined}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* หักรวม */}
            <div className="border-t border-slate-200 bg-slate-50/50 px-4">
              <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4 py-2">
                <div className="text-sm font-medium text-slate-700 md:flex-1 min-w-0">
                  หักรวม
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center justify-end gap-2 flex-1 md:w-[140px]">
                    <span className="flex-1 text-sm text-right tabular-nums font-medium text-slate-700">
                      {totalDeductPercent.toFixed(2)}
                    </span>
                    <span className="shrink-0 text-sm text-slate-600 select-none w-5 text-left">%</span>
                  </div>
                  <div className="flex items-center justify-end gap-2.5 flex-[1.5] md:w-[220px]">
                    <span className="flex-1 text-sm text-right tabular-nums font-medium text-slate-700">
                      {formatCurrency(totalAllocDeductions)}
                    </span>
                    <span className="shrink-0 text-sm text-slate-600 select-none w-7 text-left">บาท</span>
                  </div>
                </div>
              </div>
            </div>

            {/* งบดำเนินงานคงเหลือ */}
            <div className="border-t border-emerald-200 bg-[#f0fdf4] px-4">
              <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4 py-2">
                <div className="text-sm font-medium text-emerald-900 md:flex-1 min-w-0">
                  งบดำเนินงานคงเหลือ
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center justify-end gap-2 flex-1 md:w-[140px]">
                    <span
                      className={cn(
                        'flex-1 text-sm text-right tabular-nums font-medium',
                        allocRemaining < 0 || remainingPercent < 0 ? 'text-rose-600' : 'text-emerald-800'
                      )}
                    >
                      {remainingPercent.toFixed(2)}
                    </span>
                    <span className="shrink-0 text-sm text-emerald-700 select-none w-5 text-left">%</span>
                  </div>
                  <div className="flex items-center justify-end gap-2.5 flex-[1.5] md:w-[220px]">
                    <span
                      className={cn(
                        'flex-1 text-sm text-right tabular-nums font-medium',
                        allocRemaining < 0 || remainingPercent < 0 ? 'text-rose-600' : 'text-emerald-800'
                      )}
                    >
                      {formatCurrency(allocRemaining)}
                    </span>
                    <span className="shrink-0 text-sm text-emerald-700 select-none w-7 text-left">บาท</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isOverBudget && (
            <div className="text-xs text-rose-500 font-medium mt-1.5">
              {totalBudget > 0 && totalAllocDeductions > totalBudget
                ? 'ยอดหักรวมเกินกว่างบประมาณรวมทั้งหมด'
                : 'ยอดหักรวมเกินกว่า 100%'}
            </div>
          )}
        </FormField>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 4: ระยะเวลาดำเนินการ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ระยะเวลาดำเนินการ
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="วันที่เริ่มต้นดำเนินการ" required>
            <DatePicker
              value={formData.start_date || ''}
              onChange={(_, dateStr) => onChange('start_date', dateStr)}
              placeholder="วัน/เดือน/ปี (พ.ศ.)"
              className="w-full"
            />
          </FormField>

          <FormField label="วันที่สิ้นสุดดำเนินการ" required>
            <DatePicker
              value={formData.end_date || ''}
              onChange={(_, dateStr) => onChange('end_date', dateStr)}
              placeholder="วัน/เดือน/ปี (พ.ศ.)"
              className="w-full"
            />
          </FormField>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 5: ประเภทโครงการพัฒนาวิชาการ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ประเภทโครงการพัฒนาวิชาการ
          </h4>
        </div>

        <div className="space-y-3">
          {ACADEMIC_PROJECT_CATEGORIES.map((catDef) => {
            const isSelected = selectedCategories.includes(catDef.category);
            return (
              <div key={catDef.category} className="space-y-2">
                <label className="inline-flex items-center gap-2.5 py-0.5 cursor-pointer select-none">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleCategory(catDef.category)}
                  />
                  <span className={cn('text-sm', isSelected ? 'text-slate-900 font-semibold' : 'text-slate-700')}>
                    {catDef.category}
                  </span>
                </label>

                {isSelected && (
                  <div className="pl-7 flex flex-wrap gap-x-6 gap-y-2 pb-1">
                    {catDef.subTypes.map((sub) => {
                      const isChecked = selectedSubTypes.includes(sub);
                      return (
                        <label
                          key={sub}
                          className="inline-flex items-center gap-2 py-0.5 cursor-pointer select-none"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => handleToggleSubType(sub)}
                          />
                          <span className={cn('text-sm', isChecked ? 'text-slate-900 font-medium' : 'text-slate-600')}>
                            {sub}
                          </span>
                        </label>
                      );
                    })}

                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="inline-flex items-center gap-2 py-0.5 cursor-pointer select-none">
                        <Checkbox
                          checked={isOtherChecked}
                          onCheckedChange={handleToggleOther}
                        />
                        <span className={cn('text-sm', isOtherChecked ? 'text-slate-900 font-medium' : 'text-slate-600')}>
                          อื่นๆ
                        </span>
                      </label>

                      {isOtherChecked && (
                        <input
                          type="text"
                          value={otherCustomText}
                          onChange={handleOtherTextChange}
                          placeholder="ระบุประเภทย่อยเพิ่มเติม..."
                          className="h-9 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <FormField label="เลขระเบียนโครงการ">
          <input
            type="text"
            value={formData.record_number || ''}
            onChange={(e) => onChange('record_number', e.target.value)}
            placeholder="เช่น ทบ. 68-xxx หรือเลขระเบียนโครงการ (ถ้ามี)"
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
          />
        </FormField>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 6: การบูรณาการการใช้ประโยชน์และหมายเหตุ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            การบูรณาการการใช้ประโยชน์และหมายเหตุ
          </h4>
        </div>

        <FormField label="บูรณาการกับโครงการวิจัย" error={researchCodeError || null}>
          <div className="space-y-2.5">
            <Select onValueChange={(val) => handleQuickSelectResearch(val as string | null)}>
              <SelectTrigger className="w-full bg-white text-slate-700 border-slate-300 text-sm h-10 rounded-lg">
                <SelectValue placeholder="-- เลือกเติมข้อมูลจากโครงการวิจัยในระบบ (หรือพิมพ์เองด้านล่าง) --" />
              </SelectTrigger>
              <SelectContent>
                {researchData.slice(0, 30).map((r: any, idx: number) => {
                  const rId = String(r.id || '').replace(/[\n\r]/g, ' ').trim();
                  const rName = String(r.name || '').replace(/[\n\r]/g, ' ').trim();
                  return (
                    <SelectItem key={idx} value={String(r.id || r._id)}>
                      [{rId}] {rName.substring(0, 65)}...
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                maxLength={8}
                value={inputResearchCode}
                onChange={(e) => {
                  setInputResearchCode(e.target.value.toUpperCase());
                  setResearchCodeError('');
                }}
                placeholder="รหัส 8 ตัว"
                className="w-full sm:w-36 h-10 px-3 text-sm font-mono text-center rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
              />
              <input
                type="text"
                value={inputResearchName}
                onChange={(e) => {
                  setInputResearchName(e.target.value);
                  setResearchCodeError('');
                }}
                placeholder="ชื่อของโครงการวิจัยรหัสนั้น..."
                className="flex-1 h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
              />
              <button
                type="button"
                onClick={handleAddResearchProject}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-[#00A651] text-white text-sm font-medium hover:bg-[#008f45] transition-colors cursor-pointer shrink-0"
              >
                <FaPlus className="text-xs" />
                <span>เพิ่มรหัส</span>
              </button>
            </div>

            {researchProjects.length > 0 && (
              <div className="divide-y divide-slate-100 border-t border-slate-100 pt-1">
                {researchProjects.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 text-sm gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs shrink-0">
                        {item.code}
                      </span>
                      <span className="text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveResearchProject(index)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition-colors cursor-pointer shrink-0"
                      title="ลบรายการนี้"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormField>

        <FormField label="บูรณาการทรัพย์สินทางปัญญา">
          <div className="space-y-2">
            <Select onValueChange={(val) => handleQuickSelectIp(val as string | null)}>
              <SelectTrigger className="w-full bg-white text-slate-700 border-slate-300 text-sm h-10 rounded-lg">
                <SelectValue placeholder="-- เลือกสิทธิบัตรจากระบบ (หรือพิมพ์เองในช่องด้านล่าง) --" />
              </SelectTrigger>
              <SelectContent>
                {ipData.map((item: any, idx: number) => {
                  const reqNo = String(item.req_no || '').trim();
                  const ipName = String(item.name || '').trim();
                  return (
                    <SelectItem key={idx} value={`${reqNo ? `[${reqNo}] ` : ''}${ipName}`}>
                      {reqNo ? `[${reqNo}] ` : ''}
                      {ipName} ({item.type || 'สิทธิบัตร'})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <input
              type="text"
              value={formData.patent_integration || ''}
              onChange={(e) => onChange('patent_integration', e.target.value)}
              placeholder="ระบุเลขที่คำขอ/ทะเบียน หรือชื่อสิทธิบัตรที่นำมาบูรณาการ..."
              className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
            />
          </div>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="วันที่เริ่มต้นนำไปบูรณาการ">
            <DatePicker
              value={formData.integration_start_date || ''}
              onChange={(_, dateStr) => onChange('integration_start_date', dateStr)}
              placeholder="วัน/เดือน/ปี (พ.ศ.)"
              className="w-full"
            />
          </FormField>

          <FormField label="วันที่สิ้นสุดนำไปบูรณาการ">
            <DatePicker
              value={formData.integration_end_date || ''}
              onChange={(_, dateStr) => onChange('integration_end_date', dateStr)}
              placeholder="วัน/เดือน/ปี (พ.ศ.)"
              className="w-full"
            />
          </FormField>
        </div>

        <FormField label="หมายเหตุ">
          <textarea
            rows={2}
            value={formData.remarks || ''}
            onChange={(e) => onChange('remarks', e.target.value)}
            placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)..."
            className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] resize-y"
          />
        </FormField>
      </section>
    </div>
  );
};

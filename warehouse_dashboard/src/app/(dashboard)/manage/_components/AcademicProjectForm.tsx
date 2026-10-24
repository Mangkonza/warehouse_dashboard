'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { DEPARTMENTS } from '@/config/dataManagementConfig';
import { SmartAutocomplete } from './SmartAutocomplete';
import { PersonPicker } from '@/components/form/PersonPicker';
import { PersonnelRecord } from '@/types/dataManagement';
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
import {
  FaGraduationCap,
  FaCalculator,
  FaCalendarAlt,
  FaPlus,
  FaTrashAlt,
  FaFlask,
  FaCertificate,
  FaUsers,
  FaTag,
  FaCheck,
  FaInfoCircle,
} from 'react-icons/fa';

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
  setFormData,
}) => {
  // Temporary state for adding research project items (8-character code + name)
  const [inputResearchCode, setInputResearchCode] = useState('');
  const [inputResearchName, setInputResearchName] = useState('');
  const [researchCodeError, setResearchCodeError] = useState('');

  // Handle personnel selection for head of project
  const handleHeadSelect = (person: PersonnelRecord) => {
    setFormData((prev) => ({
      ...prev,
      head: person.name,
      department: person.department || prev.department || '',
    }));
  };

  // Budget calculations
  const totalBudget = Number(formData.budget) || 0;

  const round2 = (val: number): number => {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  };

  const percentFaculty =
    formData.percent_faculty !== undefined && formData.percent_faculty !== null && formData.percent_faculty !== ''
      ? Number(formData.percent_faculty)
      : (formData.alloc_faculty !== undefined && totalBudget > 0
          ? round2((Number(formData.alloc_faculty) / totalBudget) * 100)
          : 5);

  const percentDept =
    formData.percent_dept !== undefined && formData.percent_dept !== null && formData.percent_dept !== ''
      ? Number(formData.percent_dept)
      : (formData.alloc_dept !== undefined && totalBudget > 0
          ? round2((Number(formData.alloc_dept) / totalBudget) * 100)
          : 5);

  const percentKu =
    formData.percent_ku !== undefined && formData.percent_ku !== null && formData.percent_ku !== ''
      ? Number(formData.percent_ku)
      : (formData.alloc_ku !== undefined && totalBudget > 0
          ? round2((Number(formData.alloc_ku) / totalBudget) * 100)
          : 5);

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

    // Check duplicate
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

  // Quick select research project from database
  const handleQuickSelectResearch = (selectedId: string | null) => {
    if (!selectedId) return;
    const found = researchData.find((r: any) => String(r.id || r._id).trim() === selectedId.trim());
    if (found) {
      // Clean code to 8 chars if needed or extract short code
      const rawCode = String(found.id || '').replace(/[\n\r\s]/g, '');
      const code8 = rawCode.length > 8 ? rawCode.substring(0, 8) : rawCode;
      setInputResearchCode(code8);
      setInputResearchName(String(found.name || '').replace(/[\n\r]/g, ' ').trim());
      setResearchCodeError('');
    }
  };

  // Quick select IP from database
  const handleQuickSelectIp = (selectedVal: string | null) => {
    if (selectedVal) {
      onChange('patent_integration', selectedVal);
    }
  };

  // Project characteristics (สอดคล้องกับนโยบายชาติ, เพิ่มมูลค่า)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ========================================================================= */}
      {/* หมวดที่ 1: ข้อมูลทั่วไปของโครงการพัฒนาวิชาการ */}
      {/* ========================================================================= */}
      <div
        className="scroll-mt-24"
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          scrollMarginTop: '96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1.5px solid #f1f5f9',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#e8f5e9',
              color: '#00A651',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            1
          </div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
            ข้อมูลทั่วไปของโครงการพัฒนาวิชาการ
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* ชื่อโครงการ */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              ชื่อโครงการพัฒนาวิชาการ <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              rows={2}
              value={formData.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="ระบุชื่อโครงการพัฒนาวิชาการ..."
              required
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: '1.45',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {/* ภาควิชา / หน่วยงานดำเนินการ */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                ภาควิชา / หน่วยงานดำเนินการ
              </label>
              <DepartmentSelect
                value={formData.department || ''}
                onChange={(val) => onChange('department', val)}
                placeholder="-- เลือกภาควิชา / หน่วยงาน --"
                className="w-full"
              />
            </div>

            {/* ผู้ขอรับบริการ / ว่าจ้าง */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                ผู้ขอรับบริการ / ว่าจ้าง
              </label>
              <input
                type="text"
                value={formData.client || ''}
                onChange={(e) => onChange('client', e.target.value)}
                placeholder="เช่น บริษัท เกษตรพัฒนา จำกัด, กรมโรงงานอุตสาหกรรม"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* ลักษณะโครงการ (สอดคล้องกับนโยบายชาติ, เพิ่มมูลค่า - เว้นว่างได้) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                ลักษณะโครงการ
              </label>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                (สามารถเว้นว่างได้ ไม่บังคับ)
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'สอดคล้องกับนโยบายชาติ', label: 'สอดคล้องกับนโยบายชาติ' },
                { id: 'เพิ่มมูลค่า', label: 'เพิ่มมูลค่า' },
              ].map((opt) => {
                const isSelected = characteristics.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleCharacteristic(opt.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid #00A651' : '1px solid #cbd5e1',
                      backgroundColor: isSelected ? '#f0fbf5' : '#ffffff',
                      color: isSelected ? '#00A651' : '#475569',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        border: isSelected ? '1.5px solid #00A651' : '1.5px solid #94a3b8',
                        backgroundColor: isSelected ? '#00A651' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && <FaCheck style={{ color: '#ffffff', fontSize: '9px' }} />}
                    </div>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* หมวดที่ 2: บุคลากรและผู้ร่วมโครงการ */}
      {/* ========================================================================= */}
      <div
        className="scroll-mt-24"
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          scrollMarginTop: '96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1.5px solid #f1f5f9',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#e8f5e9',
              color: '#00A651',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            2
          </div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
            บุคลากรและผู้ร่วมโครงการ
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* หัวหน้าโครงการ (PersonPicker) */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              หัวหน้าโครงการ <span style={{ color: '#ef4444' }}>*</span>
            </label>
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
              placeholder="ค้นหาชื่ออาจารย์หรือหัวหน้าโครงการ..."
            />
          </div>

          {/* ผู้ร่วมโครงการแบ่งเป็นภายในและภายนอก โดยระบุจำนวน */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                จำนวนผู้ร่วมโครงการ (คน)
              </label>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                (ระบุเป็นจำนวนคน เนื่องจากไม่ทราบรายชื่อ ทราบเฉพาะหัวหน้าโครงการ)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* ผู้ร่วมโครงการภายใน */}
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#0369a1', marginBottom: '6px' }}>
                  ผู้ร่วมโครงการ (ภายในคณะฯ)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.co_members_internal !== undefined ? formData.co_members_internal : ''}
                    onChange={(e) => onChange('co_members_internal', parseInt(e.target.value, 10) || 0)}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>คน</span>
                </div>
              </div>

              {/* ผู้ร่วมโครงการภายนอก */}
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#b45309', marginBottom: '6px' }}>
                  ผู้ร่วมโครงการ (ภายนอก)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.co_members_external !== undefined ? formData.co_members_external : ''}
                    onChange={(e) => onChange('co_members_external', parseInt(e.target.value, 10) || 0)}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>คน</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
              รวมผู้ร่วมโครงการทั้งหมด:{' '}
              <strong style={{ color: '#1e293b' }}>
                {(Number(formData.co_members_internal) || 0) + (Number(formData.co_members_external) || 0)} คน
              </strong>{' '}
              (ภายใน: {Number(formData.co_members_internal) || 0} คน, ภายนอก: {Number(formData.co_members_external) || 0} คน)
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* หมวดที่ 3: งบประมาณรวมและการจัดสรรอัตโนมัติ */}
      {/* ========================================================================= */}
      <div
        id="section-academic-budget"
        className="scroll-mt-24"
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          scrollMarginTop: '96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1.5px solid #f1f5f9',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#e8f5e9',
              color: '#00A651',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            3
          </div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
            งบประมาณรวมและการจัดสรรอัตโนมัติ
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              งบประมาณรวมทั้งหมด <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <MoneyInput
              value={formData.budget !== undefined && formData.budget !== '' ? Number(formData.budget) : null}
              onChange={handleBudgetChange}
              placeholder="0.00"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              การจัดสรรงบประมาณอัตโนมัติ
            </label>

            {/* ONE bordered block with a single level of border and no nested cards */}
            <div
              className={cn(
                'rounded-lg border bg-white overflow-hidden transition-colors',
                isOverBudget ? 'border-rose-300' : 'border-slate-200'
              )}
            >
              {/* Header row: desktop only */}
              <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">
                <div className="flex-1 min-w-0" />
                <div className="w-[140px] text-right pr-7">สัดส่วน</div>
                <div className="w-[220px] text-right pr-9">จำนวนเงิน</div>
              </div>

              {/* Rows: หักเข้าคณะ, หักเข้าภาควิชา, หักเข้ามหาวิทยาลัย (มก.) */}
              <div className="divide-y divide-slate-100 px-4">
                {/* 1. หักเข้าคณะ */}
                <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4 py-2.5">
                  <div className="text-sm font-medium text-slate-700 md:flex-1 min-w-0">
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
                          'flex-1 h-10 px-3 text-sm text-right tabular-nums font-medium rounded-lg border bg-white shadow-2xs transition-colors',
                          'focus:outline-none focus:ring-2',
                          isOverBudget
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                            : 'border-slate-300 focus:border-[#00A651] focus:ring-[#00A651]/20 text-slate-900'
                        )}
                      />
                      <span className="shrink-0 text-sm font-semibold text-slate-600 select-none w-5 text-left">
                        %
                      </span>
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
                  <div className="text-sm font-medium text-slate-700 md:flex-1 min-w-0">
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
                          'flex-1 h-10 px-3 text-sm text-right tabular-nums font-medium rounded-lg border bg-white shadow-2xs transition-colors',
                          'focus:outline-none focus:ring-2',
                          isOverBudget
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                            : 'border-slate-300 focus:border-[#00A651] focus:ring-[#00A651]/20 text-slate-900'
                        )}
                      />
                      <span className="shrink-0 text-sm font-semibold text-slate-600 select-none w-5 text-left">
                        %
                      </span>
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
                  <div className="text-sm font-medium text-slate-700 md:flex-1 min-w-0">
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
                          'flex-1 h-10 px-3 text-sm text-right tabular-nums font-medium rounded-lg border bg-white shadow-2xs transition-colors',
                          'focus:outline-none focus:ring-2',
                          isOverBudget
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                            : 'border-slate-300 focus:border-[#00A651] focus:ring-[#00A651]/20 text-slate-900'
                        )}
                      />
                      <span className="shrink-0 text-sm font-semibold text-slate-600 select-none w-5 text-left">
                        %
                      </span>
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

              {/* Divider, then row หักรวม: plain text (not inputs) */}
              <div className="border-t border-slate-200 bg-slate-50/50 px-4">
                <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4 py-2.5">
                  <div className="text-sm font-semibold text-slate-700 md:flex-1 min-w-0">
                    หักรวม
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center justify-end gap-2 flex-1 md:w-[140px]">
                      <span className="flex-1 text-sm text-right tabular-nums font-semibold text-slate-700">
                        {totalDeductPercent.toFixed(2)}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-600 select-none w-5 text-left">
                        %
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2.5 flex-[1.5] md:w-[220px]">
                      <span className="flex-1 text-sm text-right tabular-nums font-semibold text-slate-700">
                        {formatCurrency(totalAllocDeductions)}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-600 select-none w-7 text-left">
                        บาท
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final row งบดำเนินงานคงเหลือ: read-only, same columns, light theme-green background band, semibold text */}
              <div className="border-t border-emerald-200 bg-[#f0fdf4] px-4">
                <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4 py-2.5">
                  <div className="text-sm font-semibold text-emerald-900 md:flex-1 min-w-0">
                    งบดำเนินงานคงเหลือ
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center justify-end gap-2 flex-1 md:w-[140px]">
                      <span
                        className={cn(
                          'flex-1 text-sm text-right tabular-nums font-semibold',
                          allocRemaining < 0 || remainingPercent < 0 ? 'text-rose-600' : 'text-emerald-800'
                        )}
                      >
                        {remainingPercent.toFixed(2)}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-emerald-700 select-none w-5 text-left">
                        %
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2.5 flex-[1.5] md:w-[220px]">
                      <span
                        className={cn(
                          'flex-1 text-sm text-right tabular-nums font-semibold',
                          allocRemaining < 0 || remainingPercent < 0 ? 'text-rose-600' : 'text-emerald-800'
                        )}
                      >
                        {formatCurrency(allocRemaining)}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-emerald-700 select-none w-7 text-left">
                        บาท
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inline validation error under the block if deductions exceed 100% or total */}
            {isOverBudget && (
              <div className="text-xs text-rose-500 font-medium mt-1.5">
                {totalBudget > 0 && totalAllocDeductions > totalBudget
                  ? 'ยอดหักรวมเกินกว่างบประมาณรวมทั้งหมด'
                  : 'ยอดหักรวมเกินกว่า 100%'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* หมวดที่ 4: ระยะเวลาดำเนินการ (บังคับใส่ เริ่มต้น - สิ้นสุด) */}
      {/* ========================================================================= */}
      <div
        className="scroll-mt-24"
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          scrollMarginTop: '96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1.5px solid #f1f5f9',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#e8f5e9',
              color: '#00A651',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            4
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
              ระยะเวลาดำเนินการ <span style={{ color: '#ef4444' }}>*</span>
            </h4>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              วันที่เริ่มต้นดำเนินการ <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <DatePicker
              value={formData.start_date || ''}
              onChange={(_, dateStr) => onChange('start_date', dateStr)}
              placeholder="วว/ดด/ปปปป (พ.ศ.)"
              className="w-full"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              วันที่สิ้นสุดดำเนินการ <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <DatePicker
              value={formData.end_date || ''}
              onChange={(_, dateStr) => onChange('end_date', dateStr)}
              placeholder="วว/ดด/ปปปป (พ.ศ.)"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* หมวดที่ 5: ประเภทโครงการพัฒนาวิชาการ */}
      {/* ========================================================================= */}
      <div
        className="scroll-mt-24"
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          scrollMarginTop: '96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1.5px solid #f1f5f9',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#e8f5e9',
              color: '#00A651',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            5
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
              ประเภทโครงการพัฒนาวิชาการ
            </h4>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              (สามารถเลือกได้มากกว่า 1 ประเภท และเลือกประเภทย่อยได้หลายรายการ)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ACADEMIC_PROJECT_CATEGORIES.map((catDef) => {
            const isSelected = selectedCategories.includes(catDef.category);
            const selectedCount = catDef.subTypes.filter((s) => selectedSubTypes.includes(s)).length;
            return (
              <div
                key={catDef.category}
                style={{
                  border: isSelected ? '1.5px solid #00A651' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                  boxShadow: isSelected ? '0 2px 4px rgba(0, 166, 81, 0.08)' : '0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease-in-out',
                  overflow: 'hidden',
                }}
              >
                {/* Header row as checkbox option */}
                <div
                  onClick={() => handleToggleCategory(catDef.category)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: isSelected ? '1.5px solid #00A651' : '1.5px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? '#00A651' : '#ffffff',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isSelected && <FaCheck style={{ color: '#ffffff', fontSize: '10px' }} />}
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: isSelected ? 700 : 600,
                      color: isSelected ? '#006838' : '#334155',
                    }}
                  >
                    {catDef.category}
                  </span>
                  {isSelected && selectedCount > 0 && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#006838',
                        backgroundColor: '#dcfce7',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      เลือก {selectedCount} รายการ
                    </span>
                  )}
                </div>

                {/* Sub-types checkboxes (only visible and active when this main category is selected) */}
                {isSelected && (
                  <div
                    style={{
                      padding: '12px 16px 16px 46px',
                      borderTop: '1px solid #dcfce7',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                      ประเภทย่อย (เลือกได้หลายรายการ):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {catDef.subTypes.map((sub) => {
                        const isChecked = selectedSubTypes.includes(sub);
                        return (
                          <label
                            key={sub}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '7px',
                              padding: '6px 12px',
                              borderRadius: '7px',
                              border: isChecked ? '1.5px solid #00A651' : '1px solid #cbd5e1',
                              backgroundColor: isChecked ? '#e8f5e9' : '#f8fafc',
                              color: isChecked ? '#006838' : '#334155',
                              fontSize: '13px',
                              fontWeight: isChecked ? 600 : 500,
                              cursor: 'pointer',
                              userSelect: 'none',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSubType(sub)}
                              style={{
                                accentColor: '#00A651',
                                width: '15px',
                                height: '15px',
                                cursor: 'pointer',
                              }}
                            />
                            <span>{sub}</span>
                          </label>
                        );
                      })}

                      {/* "อื่นๆ" Checkbox at the end */}
                      <label
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          padding: '6px 12px',
                          borderRadius: '7px',
                          border: isOtherChecked ? '1.5px solid #00A651' : '1px solid #cbd5e1',
                          backgroundColor: isOtherChecked ? '#e8f5e9' : '#f8fafc',
                          color: isOtherChecked ? '#006838' : '#334155',
                          fontSize: '13px',
                          fontWeight: isOtherChecked ? 600 : 500,
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isOtherChecked}
                          onChange={handleToggleOther}
                          style={{
                            accentColor: '#00A651',
                            width: '15px',
                            height: '15px',
                            cursor: 'pointer',
                          }}
                        />
                        <span>อื่นๆ</span>
                      </label>
                    </div>

                    {/* Inline custom typing for อื่นๆ */}
                    {isOtherChecked && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '520px' }}
                      >
                        <input
                          type="text"
                          value={otherCustomText}
                          onChange={handleOtherTextChange}
                          placeholder="พิมพ์ระบุประเภทย่อยเพิ่มเติม..."
                          autoFocus
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1.5px solid #00A651',
                            fontSize: '13px',
                            outline: 'none',
                            backgroundColor: '#ffffff',
                            color: '#0f172a',
                            boxShadow: '0 0 0 3px rgba(0, 166, 81, 0.1)',
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* เลขระเบียนโครงการ (ไม่บังคับใส่) */}
        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            เลขระเบียนโครงการ <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>(ไม่บังคับใส่)</span>
          </label>
          <input
            type="text"
            value={formData.record_number || ''}
            onChange={(e) => onChange('record_number', e.target.value)}
            placeholder="เช่น ทบ. 68-xxx หรือเลขระเบียนโครงการ (ถ้ามี)"
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              backgroundColor: '#ffffff',
            }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* หมวดที่ 6: การบูรณาการการใช้ประโยชน์ (โครงการวิจัย และ สิทธิบัตร) */}
      {/* ========================================================================= */}
      <div
        className="scroll-mt-24"
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          scrollMarginTop: '96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1.5px solid #f1f5f9',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#e8f5e9',
              color: '#00A651',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            6
          </div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
            การบูรณาการการใช้ประโยชน์ (โครงการวิจัย และ สิทธิบัตร)
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* ส่วนที่ 6.1: บูรณาการกับโครงการวิจัย (รหัส 8 ตัว + ชื่อโครงการ, มีได้หลายรหัส) */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
                <FaFlask style={{ color: '#00A651', fontSize: '13px' }} />
                <span>บูรณาการกับโครงการวิจัย</span>
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                (กรอกรหัส 8 ตัว และระบุชื่อโครงการวิจัย สามารถมีได้หลายรหัสใน 1 โครงการ)
              </span>
            </div>

            {/* Quick Helper Dropdown จากฐานข้อมูลวิจัยที่มีอยู่ */}
            <div style={{ marginBottom: '10px' }}>
              <Select onValueChange={(val) => handleQuickSelectResearch(val as string | null)}>
                <SelectTrigger className="w-full bg-white text-slate-700 border-dashed text-xs h-9">
                  <SelectValue placeholder="-- เลือกเติมข้อมูลด่วนจากโครงการวิจัยในระบบ (หรือพิมพ์เองด้านล่าง) --" />
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
            </div>

            {/* Form Input เพิ่มรหัสโครงการวิจัย */}
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: '8px', alignItems: 'flex-start' }}>
              <div>
                <input
                  type="text"
                  maxLength={8}
                  value={inputResearchCode}
                  onChange={(e) => {
                    setInputResearchCode(e.target.value.toUpperCase());
                    setResearchCodeError('');
                  }}
                  placeholder="รหัส 8 ตัว"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: researchCodeError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    textAlign: 'center',
                  }}
                />
              </div>

              <div>
                <input
                  type="text"
                  value={inputResearchName}
                  onChange={(e) => {
                    setInputResearchName(e.target.value);
                    setResearchCodeError('');
                  }}
                  placeholder="ชื่อของโครงการวิจัยรหัสนั้น..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleAddResearchProject}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 14px',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 1px 3px rgba(0, 166, 81, 0.25)',
                  }}
                >
                  <FaPlus style={{ fontSize: '11px' }} />
                  <span>เพิ่มรหัส</span>
                </button>
              </div>
            </div>

            {researchCodeError && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#dc2626' }}>
                {researchCodeError}
              </div>
            )}

            {/* รายการโครงการวิจัยที่เพิ่มแล้ว (สามารถมีได้หลายรายการ) */}
            <div style={{ marginTop: '12px' }}>
              {researchProjects.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', padding: '6px 0' }}>
                  ยังไม่มีรายการโครงการวิจัยที่เชื่อมโยง (สามารถเพิ่มได้มากกว่า 1 รหัส)
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {researchProjects.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        fontSize: '13px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '12px',
                            border: '1px solid #bfdbfe',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.code}
                        </span>
                        <span
                          style={{
                            color: '#1e293b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={item.name}
                        >
                          {item.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveResearchProject(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                        title="ลบรายการนี้"
                      >
                        <FaTrashAlt style={{ fontSize: '12px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ส่วนที่ 6.2: บูรณาการกับสิทธิบัตร */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
              <FaCertificate style={{ color: '#00A651', fontSize: '13px' }} />
              <span>บูรณาการทรัพย์สินทางปัญญา</span>
            </div>

            {/* Quick helper dropdown จากฐานข้อมูลสิทธิบัตร */}
            <div style={{ marginBottom: '8px' }}>
              <Select onValueChange={(val) => handleQuickSelectIp(val as string | null)}>
                <SelectTrigger className="w-full bg-white text-slate-700 border-dashed text-xs h-9">
                  <SelectValue placeholder="-- เลือกสิทธิบัตรจากระบบ (หรือพิมพ์เองในช่องด้านล่าง) --" />
                </SelectTrigger>
                <SelectContent>
                  {ipData.map((item: any, idx: number) => {
                    const reqNo = String(item.req_no || '').trim();
                    const ipName = String(item.name || '').trim();
                    return (
                      <SelectItem key={idx} value={`${reqNo ? `[${reqNo}] ` : ''}${ipName}`}>
                        {reqNo ? `[${reqNo}] ` : ''}{ipName} ({item.type || 'สิทธิบัตร'})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <input
              type="text"
              value={formData.patent_integration || ''}
              onChange={(e) => onChange('patent_integration', e.target.value)}
              placeholder="ระบุเลขที่คำขอ/ทะเบียน หรือชื่อสิทธิบัตรที่นำมาบูรณาการ..."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
              }}
            />
          </div>

          {/* ส่วนที่ 6.3: วันที่นำไปบูรณาการ (เริ่มต้น - สิ้นสุด ไม่บังคับใส่) */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
                ช่วงเวลาที่นำไปบูรณาการ
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                (ไม่บังคับใส่)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#475569', marginBottom: '4px' }}>
                  วันที่เริ่มต้นนำไปบูรณาการ
                </label>
                <DatePicker
                  value={formData.integration_start_date || ''}
                  onChange={(_, dateStr) => onChange('integration_start_date', dateStr)}
                  placeholder="วว/ดด/ปปปป (พ.ศ.)"
                  className="w-full"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#475569', marginBottom: '4px' }}>
                  วันที่สิ้นสุดนำไปบูรณาการ
                </label>
                <DatePicker
                  value={formData.integration_end_date || ''}
                  onChange={(_, dateStr) => onChange('integration_end_date', dateStr)}
                  placeholder="วว/ดด/ปปปป (พ.ศ.)"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* หมายเหตุ (ไม่บังคับใส่) - ช่องสุดท้ายของแบบฟอร์ม */}
      {/* ========================================================================= */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <FaInfoCircle style={{ color: '#64748b', fontSize: '14px' }} />
          <label style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
            หมายเหตุ <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>(ไม่บังคับใส่)</span>
          </label>
        </div>
        <textarea
          rows={3}
          value={formData.remarks || ''}
          onChange={(e) => onChange('remarks', e.target.value)}
          placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)..."
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            lineHeight: 1.5,
            outline: 'none',
            fontFamily: 'inherit',
            backgroundColor: '#ffffff',
            resize: 'vertical',
          }}
        />
      </div>
    </div>
  );
};

'use client';
import { getCachedCategoryData } from '@/lib/dataService';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FormField } from '@/components/form/FormField';
import { PersonPicker } from '@/components/form/PersonPicker';
import { DepartmentSelect } from '@/components/ui';
import { DatePicker } from '@/components/ui/date-picker';
import { MoneyInput } from '@/components/form/MoneyInput';
import { Checkbox } from '@/components/ui/checkbox';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { Search, X, Check, FileText, ChevronDown } from 'lucide-react';
import { IntellectualPropertyForm } from '@/components/form/IntellectualPropertyForm';
import { fetchCategoryData, saveCategoryRecord } from '@/lib/dataService';

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
      'ตรวจวัด',
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
  setFormData?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  errors?: Record<string, string>;
}

export const AcademicProjectForm: React.FC<AcademicProjectFormProps> = ({
  formData,
  onChange,
  setFormData,
  errors = {},
}) => {
  const [inputResearchCode, setInputResearchCode] = useState('');
  const [inputResearchName, setInputResearchName] = useState('');
  const [researchCodeError, setResearchCodeError] = useState('');

  // IP Integration states
  const [ipFilterType, setIpFilterType] = useState<string>('all');
  const [ipSearchQuery, setIpSearchQuery] = useState<string>(() => formData.patent_integration || '');
  const [isIpDropdownOpen, setIsIpDropdownOpen] = useState(false);
  const [ipDatabase, setIpDatabase] = useState<any[]>(() => getCachedCategoryData('ip') || []);
  const [showAddIpSidePane, setShowAddIpSidePane] = useState(false);
  const [newIpFormData, setNewIpFormData] = useState<Record<string, any>>({
    type: 'patent',
    name: '',
    req_no: '',
    department: formData.department || '',
  });
  const [isSubmittingNewIp, setIsSubmittingNewIp] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const ipComboboxRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch live IP database from dataService
  useEffect(() => {
    let active = true;
    fetchCategoryData('ip')
      .then((items) => {
        if (active && Array.isArray(items) && items.length > 0) {
          setIpDatabase(items);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Sync external patent_integration
  useEffect(() => {
    if (formData.patent_integration !== undefined && formData.patent_integration !== ipSearchQuery) {
      setIpSearchQuery(formData.patent_integration || '');
    }
  }, [formData.patent_integration]);

  // Close IP dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ipComboboxRef.current && !ipComboboxRef.current.contains(e.target as Node)) {
        setIsIpDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validation helper for required fields
  const isRequiredFilled = (val: any) =>
    val !== undefined && val !== null && String(val).trim() !== '';

  const getRequiredClass = (val: any) =>
    isRequiredFilled(val)
      ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-500/20 bg-emerald-50/10'
      : 'border-rose-400 focus:border-rose-500 focus:ring-rose-400/20 bg-rose-50/10';

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

  const handleBudgetChange = (val: number | null) => {
    const nextBudget = val !== null && !isNaN(val) ? val : 0;
    onChange('budget', nextBudget);

    const fAmt = round2((nextBudget * percentFaculty) / 100);
    const dAmt = round2((nextBudget * percentDept) / 100);
    const kAmt = round2((nextBudget * percentKu) / 100);
    const remAmt = Math.max(0, round2(nextBudget - (fAmt + dAmt + kAmt)));

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

  // Section 5: Categories & Sub-types
  const selectedCategories: string[] = useMemo(() => {
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

  const selectedSubTypes: string[] = useMemo(() => {
    if (Array.isArray(formData.project_sub_types)) return formData.project_sub_types;
    if (typeof formData.project_sub_types === 'string' && formData.project_sub_types) {
      return formData.project_sub_types.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }, [formData.project_sub_types]);

  const otherCustomText = useMemo(() => {
    if (formData.project_type_other) return String(formData.project_type_other);
    const match = selectedSubTypes.find((s) => s.startsWith('อื่นๆ: '));
    if (match) return match.replace('อื่นๆ: ', '');
    return '';
  }, [formData.project_type_other, selectedSubTypes]);

  const isOtherChecked = useMemo(() => {
    return selectedSubTypes.some((s) => s === 'อื่นๆ' || s.startsWith('อื่นๆ:'));
  }, [selectedSubTypes]);

  const handleToggleCategory = (cat: string) => {
    const isCurrentSingleSelected =
      selectedCategories.length === 1 && selectedCategories[0] === cat;

    if (isCurrentSingleSelected) {
      // User clicked the already selected category -> uncheck it and clear all sub-types
      onChange('project_type_category', '');
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          project_type_categories: [],
          project_type_category: '',
          project_sub_types: [],
          project_type_other: '',
        }));
      } else {
        onChange('project_type_categories', []);
        onChange('project_sub_types', []);
        onChange('project_type_other', '');
      }
    } else {
      // Switching to a new category -> uncheck previous category and clear old sub-types completely
      onChange('project_type_category', cat);
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          project_type_categories: [cat],
          project_type_category: cat,
          project_sub_types: [],
          project_type_other: '',
        }));
      } else {
        onChange('project_type_categories', [cat]);
        onChange('project_sub_types', []);
        onChange('project_type_other', '');
      }
    }
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

  // Filtered IP items for combobox
  const filteredIpItems = useMemo(() => {
    const q = ipSearchQuery.trim().toLowerCase();
    return ipDatabase.filter((item: any) => {
      // Filter by type
      if (ipFilterType !== 'all') {
        const itemType = String(item.type || '').toLowerCase();
        if (ipFilterType === 'petty_patent' && !itemType.includes('อนุสิทธิ')) return false;
        if (ipFilterType === 'patent' && (itemType.includes('อนุสิทธิ') || !itemType.includes('สิทธิ'))) return false;
        if (ipFilterType === 'copyright' && !itemType.includes('ลิขสิทธิ์')) return false;
      }
      if (!q) return true;
      const reqNo = String(item.req_no || '').toLowerCase();
      const name = String(item.name || item.title || '').toLowerCase();
      return reqNo.includes(q) || name.includes(q);
    });
  }, [ipDatabase, ipSearchQuery, ipFilterType]);

  // Handle saving new IP through sliding sub-panel
  const handleSaveNewIp = async () => {
    if (!newIpFormData.name || !String(newIpFormData.name).trim()) {
      showToast('กรุณาระบุชื่อผลงานทรัพย์สินทางปัญญา', 'error');
      return;
    }

    setIsSubmittingNewIp(true);
    try {
      const typeLabel =
        newIpFormData.type === 'petty_patent'
          ? 'อนุสิทธิบัตร'
          : newIpFormData.type === 'copyright'
          ? 'ลิขสิทธิ์'
          : 'สิทธิบัตร';

      const payload = {
        ...newIpFormData,
        type: typeLabel,
      };

      const res = await saveCategoryRecord('ip', payload, true);
      if (!res.success) {
        showToast(res.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลทรัพย์สินทางปัญญา', 'error');
        return;
      }

      const savedItem = res.data || payload;
      setIpDatabase((prev) => [savedItem, ...prev]);

      const reqNoStr = savedItem.req_no ? `[${savedItem.req_no}] ` : '';
      const formattedVal = `${reqNoStr}${savedItem.name || savedItem.title || ''}`.trim();

      setIpSearchQuery(formattedVal);
      onChange('patent_integration', formattedVal);
      setShowAddIpSidePane(false);
      showToast('บันทึกข้อมูลทรัพย์สินทางปัญญาใหม่เข้าสู่ระบบสำเร็จ', 'success');
    } catch (err: any) {
      showToast(err?.message || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
    } finally {
      setIsSubmittingNewIp(false);
    }
  };

  // Characteristics
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

  // Check if any integration field is filled
  const hasIntegration = Boolean(
    researchProjects.length > 0 ||
    (ipSearchQuery && ipSearchQuery.trim()) ||
    (formData.patent_integration && String(formData.patent_integration).trim()) ||
    formData.has_integration
  );

  return (
    <div className="relative space-y-7 text-slate-800">
      {/* Toast alert notification */}
      {toast && (
        <div
          className={cn(
            'fixed top-5 right-5 z-[10070] px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200',
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-rose-50 text-rose-800 border-rose-300'
          )}
        >
          {toast.type === 'success' ? <Check className="size-4 text-emerald-600" /> : <X className="size-4 text-rose-600" />}
          <span>{toast.message}</span>
        </div>
      )}

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

        {/* ย้ายระบุเลขที่คำขอมาไว้ด้านบนสุด คู่กับชื่อโครงการพัฒนาวิชาการ */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-4">
            <FormField label="ระบุเลขที่คำขอ / เลขระเบียน" required fieldKey="record_number" error={errors?.record_number || errors?.req_no}>
              <input
                id="field-academic-record_number"
                name="record_number"
                type="text"
                value={formData.record_number || formData.req_no || ''}
                onChange={(e) => {
                  onChange('record_number', e.target.value);
                  onChange('req_no', e.target.value);
                }}
                placeholder="เช่น ทบ. 68-xxx หรือเลขที่คำขอ"
                className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
              />
            </FormField>
          </div>

          <div className="sm:col-span-8">
            <FormField label="ชื่อโครงการพัฒนาวิชาการ" required error={errors?.name}>
              <textarea
                id="field-academic-name"
                name="name"
                rows={1}
                value={formData.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="ระบุชื่อโครงการพัฒนาวิชาการ..."
                className={cn(
                  'w-full min-h-[40px] h-10 py-2 px-3 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 transition-colors resize-none',
                  getRequiredClass(formData.name)
                )}
              />
            </FormField>
          </div>
        </div>

        <FormField label="ผู้ขอรับบริการ / ว่าจ้าง" required fieldKey="client" error={errors?.client}>
          <input
            id="field-academic-client"
            name="client"
            type="text"
            value={formData.client || ''}
            onChange={(e) => onChange('client', e.target.value)}
            placeholder="เช่น บริษัท เกษตรพัฒนา จำกัด, กรมโรงงานอุตสาหกรรม"
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
          />
        </FormField>

        <FormField label="ลักษณะโครงการ" required fieldKey="characteristics" error={errors?.characteristics}>
          <div id="field-academic-characteristics" className="flex flex-wrap gap-x-8 gap-y-2 pt-0.5">
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

        <FormField label="หัวหน้าโครงการ" required error={errors?.head}>
          <div id="field-academic-head">
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
            required={true}
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
        </FormField>

        <FormField label="สังกัดที่ดำเนินการ" required fieldKey="department" error={errors?.department}>
          <div id="field-academic-department">
            <DepartmentSelect
              value={formData.department || ''}
              onChange={(val) => onChange('department', val)}
              placeholder="-- เลือกสังกัด --"
              className="w-full"
            />
          </div>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="ผู้ร่วมโครงการ (ภายใน)" required fieldKey="co_members_internal" error={errors?.co_members_internal}>
            <div className="flex items-center gap-2" id="field-academic-co_members_internal">
              <input
                id="input-academic-co_members_internal"
                name="co_members_internal"
                type="number"
                min="0"
                step="1"
                value={formData.co_members_internal !== undefined ? formData.co_members_internal : ''}
                onChange={(e) => onChange('co_members_internal', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="0"
                className="w-full h-10 px-3 text-sm font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
              />
              <span className="text-xs text-slate-500 shrink-0">คน</span>
            </div>
          </FormField>

          <FormField label="ผู้ร่วมโครงการ (ภายนอก)" required fieldKey="co_members_external" error={errors?.co_members_external}>
            <div className="flex items-center gap-2" id="field-academic-co_members_external">
              <input
                id="input-academic-co_members_external"
                name="co_members_external"
                type="number"
                min="0"
                step="1"
                value={formData.co_members_external !== undefined ? formData.co_members_external : ''}
                onChange={(e) => onChange('co_members_external', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
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

        <FormField label="งบประมาณรวมทั้งหมด" required error={errors?.budget}>
          <MoneyInput
            value={formData.budget !== undefined && formData.budget !== '' ? Number(formData.budget) : null}
            onChange={handleBudgetChange}
            required={true}
            placeholder="0.00"
          />
        </FormField>

        <FormField label="การจัดสรรงบประมาณอัตโนมัติ">
          <div
            className={cn(
              'rounded-xl border bg-white overflow-hidden shadow-2xs transition-colors',
              isOverBudget ? 'border-rose-300' : 'border-slate-200'
            )}
          >
            {/* Header: Exact pixel alignment with input columns */}
            <div className="hidden md:flex items-center gap-4 px-5 md:px-6 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">
              <div className="flex-1 min-w-0" />
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 w-28 shrink-0">
                  <span className="flex-1 min-w-0 text-right px-3">สัดส่วน</span>
                  <span className="w-5 shrink-0" />
                </div>
                <div className="w-52 shrink-0">
                  <div className="flex items-center gap-2.5 w-full">
                    <span className="flex-1 min-w-0 text-right px-3">จำนวนเงิน</span>
                    <span className="w-7 shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100 px-5 md:px-6">
              {/* 1. หักเข้าคณะ */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-2.5">
                <div className="text-sm font-medium text-slate-700 md:flex-1 min-w-0">
                  หักเข้าคณะ
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <div className="flex items-center gap-1.5 flex-1 md:flex-none md:w-28 shrink-0">
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
                        'flex-1 min-w-0 h-10 px-3 text-sm text-right tabular-nums font-normal rounded-lg border bg-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                        'focus:outline-none focus:ring-2',
                        isOverBudget
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                          : 'border-slate-300 focus:border-[#00A651] focus:ring-[#00A651]/20 text-slate-900'
                      )}
                    />
                    <span className="shrink-0 text-sm font-normal text-slate-600 select-none w-5 text-left">%</span>
                  </div>
                  <div className="flex-[1.5] md:flex-none md:w-52 shrink-0">
                    <MoneyInput
                      value={allocFaculty}
                      onChange={(val) => handleAmountChange('alloc_faculty', val)}
                      placeholder="0.00"
                      className="w-full"
                      inputClassName={cn('min-w-0', isOverBudget ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : undefined)}
                    />
                  </div>
                </div>
              </div>

              {/* 2. หักเข้าสังกัด */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-2.5">
                <div className="text-sm font-medium text-slate-700 md:flex-1 min-w-0">
                  หักเข้าสังกัด
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <div className="flex items-center gap-1.5 flex-1 md:flex-none md:w-28 shrink-0">
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
                        'flex-1 min-w-0 h-10 px-3 text-sm text-right tabular-nums font-normal rounded-lg border bg-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                        'focus:outline-none focus:ring-2',
                        isOverBudget
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                          : 'border-slate-300 focus:border-[#00A651] focus:ring-[#00A651]/20 text-slate-900'
                      )}
                    />
                    <span className="shrink-0 text-sm font-normal text-slate-600 select-none w-5 text-left">%</span>
                  </div>
                  <div className="flex-[1.5] md:flex-none md:w-52 shrink-0">
                    <MoneyInput
                      value={allocDept}
                      onChange={(val) => handleAmountChange('alloc_dept', val)}
                      placeholder="0.00"
                      className="w-full"
                      inputClassName={cn('min-w-0', isOverBudget ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : undefined)}
                    />
                  </div>
                </div>
              </div>

              {/* 3. หักเข้ามหาวิทยาลัย (มก.) */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-2.5">
                <div className="text-sm font-medium text-slate-700 md:flex-1 min-w-0">
                  หักเข้ามหาวิทยาลัย (มก.)
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <div className="flex items-center gap-1.5 flex-1 md:flex-none md:w-28 shrink-0">
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
                        'flex-1 min-w-0 h-10 px-3 text-sm text-right tabular-nums font-normal rounded-lg border bg-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                        'focus:outline-none focus:ring-2',
                        isOverBudget
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                          : 'border-slate-300 focus:border-[#00A651] focus:ring-[#00A651]/20 text-slate-900'
                      )}
                    />
                    <span className="shrink-0 text-sm font-normal text-slate-600 select-none w-5 text-left">%</span>
                  </div>
                  <div className="flex-[1.5] md:flex-none md:w-52 shrink-0">
                    <MoneyInput
                      value={allocKu}
                      onChange={(val) => handleAmountChange('alloc_ku', val)}
                      placeholder="0.00"
                      className="w-full"
                      inputClassName={cn('min-w-0', isOverBudget ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : undefined)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* หักรวม */}
            <div className="border-t border-slate-200 bg-slate-50/50 px-5 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-2.5">
                <div className="text-sm font-medium text-slate-700 md:flex-1 min-w-0">
                  หักรวม
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <div className="flex items-center gap-1.5 flex-1 md:flex-none md:w-28 shrink-0">
                    <div className="flex-1 min-w-0 h-10 px-3 flex items-center justify-end text-sm text-right tabular-nums font-normal text-slate-700">
                      {totalDeductPercent.toFixed(2)}
                    </div>
                    <span className="shrink-0 text-sm font-normal text-slate-600 select-none w-5 text-left">%</span>
                  </div>
                  <div className="flex-[1.5] md:flex-none md:w-52 shrink-0">
                    <div className="flex items-center gap-2.5 w-full">
                      <div className="flex-1 min-w-0 h-10 px-3 flex items-center justify-end text-sm text-right tabular-nums font-normal text-slate-700">
                        {formatCurrency(totalAllocDeductions)}
                      </div>
                      <span className="shrink-0 text-sm font-normal text-slate-600 select-none w-7 text-left">บาท</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* งบดำเนินงานคงเหลือ */}
            <div className="border-t border-emerald-200 bg-[#f0fdf4] px-5 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-2.5">
                <div className="text-sm font-medium text-emerald-900 md:flex-1 min-w-0">
                  งบดำเนินงานคงเหลือ
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <div className="flex items-center gap-1.5 flex-1 md:flex-none md:w-28 shrink-0">
                    <div
                      className={cn(
                        'flex-1 min-w-0 h-10 px-3 flex items-center justify-end text-sm text-right tabular-nums font-normal',
                        allocRemaining < 0 || remainingPercent < 0 ? 'text-rose-600' : 'text-emerald-800'
                      )}
                    >
                      {remainingPercent.toFixed(2)}
                    </div>
                    <span className="shrink-0 text-sm font-normal text-emerald-700 select-none w-5 text-left">%</span>
                  </div>
                  <div className="flex-[1.5] md:flex-none md:w-52 shrink-0">
                    <div className="flex items-center gap-2.5 w-full">
                      <div
                        className={cn(
                          'flex-1 min-w-0 h-10 px-3 flex items-center justify-end text-sm text-right tabular-nums font-normal',
                          allocRemaining < 0 || remainingPercent < 0 ? 'text-rose-600' : 'text-emerald-800'
                        )}
                      >
                        {formatCurrency(allocRemaining)}
                      </div>
                      <span className="shrink-0 text-sm font-normal text-emerald-700 select-none w-7 text-left">บาท</span>
                    </div>
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
          <FormField label="วันที่เริ่มต้นดำเนินการ" required error={errors?.start_date}>
            <div id="field-academic-start-date">
            <DatePicker
              value={formData.start_date || ''}
              maxDate={formData.end_date || undefined}
              required={true}
              onChange={(_, dateStr) => {
                onChange('start_date', dateStr);
                if (dateStr && formData.end_date && dateStr > formData.end_date) {
                  onChange('end_date', '');
                }
              }}
              placeholder="วัน/เดือน/ปี (พ.ศ.)"
                className="w-full"
              />
            </div>
          </FormField>

          <FormField label="วันที่สิ้นสุดดำเนินการ" required error={errors?.end_date}>
            <div id="field-academic-end-date">
            <DatePicker
              value={formData.end_date || ''}
              minDate={formData.start_date || undefined}
              required={true}
              onChange={(_, dateStr) => {
                onChange('end_date', dateStr);
                if (dateStr && formData.start_date && dateStr < formData.start_date) {
                  onChange('start_date', '');
                }
              }}
              placeholder="วัน/เดือน/ปี (พ.ศ.)"
                className="w-full"
              />
            </div>
          </FormField>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 5: ประเภทโครงการพัฒนาวิชาการ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide flex items-center gap-1">
            <span>ประเภทโครงการพัฒนาวิชาการ</span>
            <span className="text-rose-500 font-bold text-sm leading-none ml-0.5" title="จำเป็นต้องระบุ">*</span>
          </h4>
        </div>

        <div className="space-y-3" id="field-academic-project-types">
          {errors?.project_type_category && (
            <p className="text-xs text-rose-500 font-medium">{errors.project_type_category}</p>
          )}
          {ACADEMIC_PROJECT_CATEGORIES.map((catDef) => {
            const isCatSelected = selectedCategories.includes(catDef.category);
            return (
              <div
                key={catDef.category}
                className={cn(
                  'rounded-xl border p-3.5 transition-colors',
                  isCatSelected ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 bg-white'
                )}
              >
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <Checkbox
                    checked={isCatSelected}
                    onCheckedChange={() => handleToggleCategory(catDef.category)}
                  />
                  <span className={cn('text-sm font-semibold', isCatSelected ? 'text-emerald-900' : 'text-slate-800')}>
                    {catDef.category}
                  </span>
                </label>

                {isCatSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-100 pl-6 space-y-2">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {catDef.subTypes.map((sub) => {
                        const isSubSelected = selectedSubTypes.includes(sub);
                        return (
                          <label
                            key={sub}
                            className="inline-flex items-center gap-2 py-1 cursor-pointer select-none"
                          >
                            <Checkbox
                              checked={isSubSelected}
                              onCheckedChange={() => handleToggleSubType(sub)}
                            />
                            <span className={cn('text-xs', isSubSelected ? 'text-slate-900 font-medium' : 'text-slate-600')}>
                              {sub}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isCatSelected && catDef.category === 'งานบริการอื่นๆ' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 pl-6 space-y-2">
                    <label className="inline-flex items-center gap-2 py-1 cursor-pointer select-none">
                      <Checkbox
                        checked={isOtherChecked}
                        onCheckedChange={handleToggleOther}
                      />
                      <span className="text-xs font-medium text-slate-700">อื่นๆ ระบุ</span>
                    </label>
                    {isOtherChecked && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={otherCustomText}
                          onChange={handleOtherTextChange}
                          placeholder="ระบุประเภทย่อยเพิ่มเติม..."
                          className="h-9 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 6: การบูรณาการการใช้ประโยชน์ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            การบูรณาการการใช้ประโยชน์
          </h4>
        </div>

        {/* 1. บูรณาการกับโครงการวิจัย: เอา dropdown ออก เหลือ 2 ช่อง + เพิ่มรหัส + การ์ดรายการใหม่ */}
        <FormField label="บูรณาการกับโครงการวิจัย" error={researchCodeError || null}>
          <div className="space-y-3">
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
                className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-[#00A651] text-white text-sm font-medium hover:bg-[#008f45] transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <FaPlus className="text-xs" />
                <span>เพิ่มรหัส</span>
              </button>
            </div>

            {/* การ์ดแสดงรายการหลังเพิ่ม: ดีไซน์สวย ชัดเจน ไม่กลืนกับพื้นหลัง */}
            {researchProjects.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-semibold text-slate-500">
                  รายการโครงการวิจัยที่บูรณาการ ({researchProjects.length} รายการ)
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {researchProjects.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-emerald-50 text-[#00A651] border border-emerald-200/80 font-mono text-xs font-semibold shrink-0">
                          {item.code}
                        </span>
                        <span className="text-slate-800 text-sm font-medium truncate" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveResearchProject(index)}
                        className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="ลบรายการนี้"
                      >
                        <FaTrashAlt className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FormField>

        {/* 2. บูรณาการทรัพย์สินทางปัญญา: ติ๊กเลือกประเภท + ช่องค้นหาเดียว + เชื่อมโยง/เพิ่มใหม่ */}
        <FormField label="บูรณาการทรัพย์สินทางปัญญา">
          <div className="space-y-2.5">
            {/* กรองประเภททรัพย์สินทางปัญญา (ตามภาพที่ 4) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'petty_patent', label: 'อนุสิทธิบัตร' },
                { id: 'patent', label: 'สิทธิบัตร' },
                { id: 'copyright', label: 'ลิขสิทธิ์' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIpFilterType(t.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all select-none cursor-pointer',
                    ipFilterType === t.id
                      ? 'bg-[#00A651] text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Searchable Combobox: ช่องเดียว พิมพ์และค้นหา หรือระบุใหม่ */}
            <div ref={ipComboboxRef} className="relative w-full">
              <div className="relative flex items-center">
                <Search className="absolute left-3 size-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={ipSearchQuery}
                  onChange={(e) => {
                    const q = e.target.value;
                    setIpSearchQuery(q);
                    onChange('patent_integration', q);
                    setIsIpDropdownOpen(true);
                  }}
                  onFocus={() => setIsIpDropdownOpen(true)}
                  placeholder="พิมพ์เลขที่คำขอ หรือชื่อผลงานทรัพย์สินทางปัญญาเพื่อค้นหา..."
                  className="w-full h-10 pl-9 pr-9 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
                />
                {ipSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setIpSearchQuery('');
                      onChange('patent_integration', '');
                    }}
                    className="absolute right-3 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="ล้างค่า"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {isIpDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-[10050] bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {filteredIpItems.length > 0 ? (
                      filteredIpItems.slice(0, 15).map((item: any, idx: number) => {
                        const reqNo = String(item.req_no || '').trim();
                        const ipName = String(item.name || item.title || '').trim();
                        const formatted = `${reqNo ? `[${reqNo}] ` : ''}${ipName}`.trim();

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setIpSearchQuery(formatted);
                              onChange('patent_integration', formatted);
                              setIsIpDropdownOpen(false);
                            }}
                            className="p-2.5 hover:bg-emerald-50/70 cursor-pointer flex items-center justify-between gap-3 text-sm transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {reqNo && (
                                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold shrink-0">
                                  {reqNo}
                                </span>
                              )}
                              <span className="text-slate-800 truncate font-normal">
                                {ipName}
                              </span>
                            </div>
                            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                              {item.type || 'สิทธิบัตร'}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-500">
                        {ipSearchQuery
                          ? `ไม่พบข้อมูลทรัพย์สินทางปัญญาที่ตรงกับ "${ipSearchQuery}"`
                          : 'ไม่มีรายการทรัพย์สินทางปัญญา'}
                      </div>
                    )}
                  </div>

                  {/* Option to create a new IP record in DB */}
                  <div className="p-2.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 truncate">
                      {ipSearchQuery ? (
                        <>เพิ่มเป็นรายการใหม่ลงในระบบ?</>
                      ) : (
                        <>ต้องการเพิ่มรายการใหม่ที่ไม่มีในระบบ?</>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewIpFormData({
                          type: ipFilterType !== 'all' ? ipFilterType : 'patent',
                          name: ipSearchQuery,
                          req_no: '',
                          department: formData.department || '',
                        });
                        setShowAddIpSidePane(true);
                        setIsIpDropdownOpen(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00A651] text-white text-xs font-medium hover:bg-[#008f45] transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      <FaPlus className="text-xs" />
                      <span>เพิ่มทรัพย์สินทางปัญญาใหม่</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="วันที่เริ่มต้นนำไปบูรณาการ"
            required={hasIntegration}
            fieldKey="integration_start_date"
            error={errors?.integration_start_date}
          >
            <div id="field-academic-integration_start_date">
              <DatePicker
                value={formData.integration_start_date || ''}
                maxDate={formData.integration_end_date || undefined}
                required={hasIntegration}
                onChange={(_, dateStr) => {
                  onChange('integration_start_date', dateStr);
                  if (dateStr && formData.integration_end_date && dateStr > formData.integration_end_date) {
                    onChange('end_date', '');
                  }
                }}
                placeholder="วัน/เดือน/ปี (พ.ศ.)"
                className="w-full"
              />
            </div>
          </FormField>

          <FormField
            label="วันที่สิ้นสุดนำไปบูรณาการ"
            required={hasIntegration}
            fieldKey="integration_end_date"
            error={errors?.integration_end_date}
          >
            <div id="field-academic-integration_end_date">
              <DatePicker
                value={formData.integration_end_date || ''}
                minDate={formData.integration_start_date || undefined}
                required={hasIntegration}
                onChange={(_, dateStr) => {
                  onChange('integration_end_date', dateStr);
                  if (dateStr && formData.integration_start_date && dateStr < formData.integration_start_date) {
                    onChange('integration_start_date', '');
                  }
                }}
                placeholder="วัน/เดือน/ปี (พ.ศ.)"
                className="w-full"
              />
            </div>
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

      {/* ========================================================================= */}
      {/* หน้าต่างใหม่ต่อด้านขวาเมื่อต้องการเพิ่มทรัพย์สินทางปัญญาใหม่ */}
      {/* ========================================================================= */}
      {showAddIpSidePane && (
        <div className="fixed inset-y-0 right-0 z-[10060] w-full max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
              <h3 className="text-sm font-bold text-slate-800">
                เพิ่มข้อมูลทรัพย์สินทางปัญญาใหม่
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddIpSidePane(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors"
            >
              <X className="size-[18px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <IntellectualPropertyForm
              formData={newIpFormData}
              onChange={(k, v) => setNewIpFormData((prev) => ({ ...prev, [k]: v }))}
              setFormData={setNewIpFormData}
              isEdit={false}
            />
          </div>

          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setShowAddIpSidePane(false)}
              disabled={isSubmittingNewIp}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSaveNewIp}
              disabled={isSubmittingNewIp}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#00A651] hover:bg-[#008f45] rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmittingNewIp ? 'กำลังบันทึก...' : 'บันทึกข้อมูลทรัพย์สินทางปัญญา'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

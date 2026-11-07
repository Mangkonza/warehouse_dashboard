'use client';

import React, { useMemo } from 'react';
import { FormField } from '../FormField';
import { DepartmentSelect } from '@/components/ui/department-select';
import { getStoredStrategies, getStoredPlans } from '@/lib/kpiEngine';
import { cn } from '@/lib/utils';

export interface KpiFormFieldsProps {
  formData: Record<string, any>;
  onChange: (key: string, val: any) => void;
  setFormData?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  errors?: Record<string, string>;
  readOnly?: boolean;
  className?: string;
}

const KPI_UNIT_OPTIONS = [
  'ผลงาน',
  'โครงการ',
  'เรื่อง',
  'ชิ้น',
  'คน',
  'ร้อยละ',
  'บาท',
  'รายการ',
  'แห่ง',
];

const KPI_DATASET_OPTIONS = [
  { value: 'research', label: 'โครงการวิจัย' },
  { value: 'academic', label: 'โครงการพัฒนาวิชาการ' },
  { value: 'service', label: 'งานบริการวิชาการ' },
  { value: 'publications', label: 'ผลงานตีพิมพ์ทางวิชาการ' },
  { value: 'ip', label: 'งานทรัพย์สินทางปัญญา' },
  { value: 'personnel', label: 'ข้อมูลคณาจารย์และบุคลากร' },
  { value: 'manual', label: 'กำหนดเอง (Manual)' },
];

export const KpiFormFields: React.FC<KpiFormFieldsProps> = ({
  formData,
  onChange,
  errors = {},
  readOnly = false,
  className,
}) => {
  const strategies = useMemo(() => {
    try {
      return getStoredStrategies();
    } catch {
      return [];
    }
  }, []);

  const allPlans = useMemo(() => {
    try {
      return getStoredPlans();
    } catch {
      return [];
    }
  }, []);

  // Filter plans based on selected strategy
  const availablePlans = useMemo(() => {
    if (!formData.strategyId) return allPlans;
    return allPlans.filter((p) => p.strategyId === formData.strategyId);
  }, [allPlans, formData.strategyId]);

  const handleNameChange = (val: string) => {
    onChange('name', val);
    onChange('title', val);
  };

  const handleTargetChange = (val: string) => {
    const num = parseFloat(val);
    const validNum = isNaN(num) ? 0 : num;
    onChange('targetValue', validNum);
    onChange('budget', validNum);
  };

  return (
    <fieldset
      disabled={readOnly}
      className={cn('space-y-6 text-slate-800 border-0 p-0 m-0 min-w-0', className)}
    >
      {/* ========================================================================= */}
      {/* ส่วนที่ 1: ข้อมูลตัวชี้วัดตามแผนยุทธศาสตร์ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ข้อมูลตัวชี้วัดตามแผนยุทธศาสตร์
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-4">
            <FormField
              label="รหัสตัวชี้วัด"
              error={errors.code}
            >
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => onChange('code', e.target.value)}
                placeholder="เช่น KPI-1.1"
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
              />
            </FormField>
          </div>

          <div className="sm:col-span-8">
            <FormField
              label="ชื่อตัวชี้วัดตามแผนยุทธศาสตร์"
              required
              error={errors.name || errors.title}
            >
              <input
                type="text"
                data-field="name"
                value={formData.name || formData.title || ''}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="ระบุชื่อตัวชี้วัดตามแผนยุทธศาสตร์ (จำเป็น)"
                className={cn(
                  'w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]',
                  (errors.name || errors.title || (!formData.name && !formData.title)) &&
                    'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200 bg-rose-50/10'
                )}
              />
            </FormField>
          </div>
        </div>

        <FormField label="คำอธิบาย / นิยามตัวชี้วัด" error={errors.description}>
          <textarea
            rows={2}
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="ระบุคำอธิบาย หรือเกณฑ์การประเมินโดยสังเขป..."
            className="w-full p-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] resize-none"
          />
        </FormField>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 2: ความเชื่อมโยงยุทธศาสตร์และแผนงาน */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ความเชื่อมโยงยุทธศาสตร์และแผนงาน
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="ยุทธศาสตร์คณะ" error={errors.strategyId}>
            <select
              value={formData.strategyId || ''}
              onChange={(e) => {
                onChange('strategyId', e.target.value);
                onChange('planId', '');
              }}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
            >
              <option value="">-- เลือกยุทธศาสตร์ --</option>
              {strategies.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.code ? `${st.code}: ` : ''}{st.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="แผนงาน" error={errors.planId}>
            <select
              value={formData.planId || ''}
              onChange={(e) => onChange('planId', e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
            >
              <option value="">-- เลือกแผนงาน --</option>
              {availablePlans.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.code ? `${pl.code}: ` : ''}{pl.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="ชุดข้อมูลที่เกี่ยวข้อง (Dataset)" error={errors.datasetKey}>
            <select
              value={formData.datasetKey || formData.category || 'research'}
              onChange={(e) => {
                onChange('datasetKey', e.target.value);
                onChange('category', e.target.value);
              }}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
            >
              {KPI_DATASET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="ปีงบประมาณ" error={errors.fiscalYear}>
            <input
              type="text"
              value={formData.fiscalYear || formData.fiscal_year || '2569'}
              onChange={(e) => {
                onChange('fiscalYear', e.target.value);
                onChange('fiscal_year', e.target.value);
              }}
              placeholder="เช่น 2569"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
            />
          </FormField>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 3: เป้าหมายและหน่วยนับ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            เป้าหมายและหน่วยนับ
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="หน่วยนับ" required error={errors.unit}>
            <div className="relative">
              <input
                type="text"
                list="kpi-units-list"
                value={formData.unit || ''}
                onChange={(e) => onChange('unit', e.target.value)}
                placeholder="ระบุหน่วยนับ เช่น ผลงาน"
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
              />
              <datalist id="kpi-units-list">
                {KPI_UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>
          </FormField>

          <FormField label="ค่าเป้าหมายคณะ (ตัวเลข)" error={errors.targetValue}>
            <input
              type="number"
              step="any"
              value={formData.targetValue ?? formData.budget ?? ''}
              onChange={(e) => handleTargetChange(e.target.value)}
              placeholder="เช่น 10"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
            />
          </FormField>

          <FormField label="ข้อความเป้าหมายที่แสดง" error={errors.targetLabel}>
            <input
              type="text"
              value={formData.targetLabel || ''}
              onChange={(e) => onChange('targetLabel', e.target.value)}
              placeholder="เช่น ≥ 10 โครงการ"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
            />
          </FormField>
        </div>

        <FormField label="เป้าหมายระดับภาควิชา (ถ้ามี)" error={errors.departmentTarget}>
          <input
            type="text"
            value={formData.departmentTarget || ''}
            onChange={(e) => onChange('departmentTarget', e.target.value)}
            placeholder="เช่น ภาควิชาละ 2 โครงการ"
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
          />
        </FormField>
      </section>

      {/* ========================================================================= */}
      {/* ส่วนที่ 4: ส่วนงานและผู้รับผิดชอบ */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
          <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
            ส่วนงานและผู้รับผิดชอบ
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="หน่วยงาน / ภาควิชาที่รับผิดชอบ" error={errors.responsibleUnit || errors.department_code}>
            <DepartmentSelect
              value={formData.responsibleUnit || formData.department_code || ''}
              onChange={(val) => {
                onChange('responsibleUnit', val);
                onChange('department_code', val);
              }}
              placeholder="เลือกหน่วยงานที่รับผิดชอบ"
            />
          </FormField>

          <FormField label="ผู้รับผิดชอบรายงานผล" error={errors.head_name}>
            <input
              type="text"
              value={formData.head_name || (Array.isArray(formData.reporters) ? formData.reporters.join(', ') : formData.reporters) || ''}
              onChange={(e) => {
                onChange('head_name', e.target.value);
                onChange('reporters', e.target.value ? [e.target.value] : []);
              }}
              placeholder="ระบุชื่อผู้รับผิดชอบรายงานผล"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
            />
          </FormField>
        </div>

        <FormField label="หมายเหตุเพิ่มเติม" error={errors.remarks}>
          <input
            type="text"
            value={formData.remarks || ''}
            onChange={(e) => onChange('remarks', e.target.value)}
            placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)..."
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
          />
        </FormField>
      </section>
    </fieldset>
  );
};

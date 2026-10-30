'use client';

import React, { useState, useEffect } from 'react';
import { CategoryKey, CategoryConfig } from '@/types/dataManagement';
import { SDGS_DATA } from '@/config/sdgConfig';
import { FaFilter, FaTimes, FaUndo, FaCheck } from 'react-icons/fa';
import { DepartmentSelect } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ImageStatus = 'all' | 'has_image' | 'no_image';
type Completeness = 'all' | 'complete' | 'incomplete';
export type EvalFramework = 'all' | 'i_am' | 'i_see';

export interface FilterValues {
  selectedDept: string;
  selectedRole: string;
  selectedImageStatus: ImageStatus;
  selectedSubFilter: string;
  selectedCompleteness?: Completeness;
  selectedSdgs?: string[]; // เลขเป้าหมาย '1'..'17' (หลายค่า)
  selectedFramework?: EvalFramework; // กรอบประเมิน (1 ค่า)
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: CategoryKey;
  config: CategoryConfig;
  selectedDept: string;
  selectedRole: string;
  selectedImageStatus: ImageStatus;
  selectedSubFilter: string;
  selectedCompleteness?: Completeness;
  selectedSdgs?: string[];
  selectedFramework?: EvalFramework;
  onApply: (filters: FilterValues) => void;
  onReset: () => void;
}

// ---------------------------------------------------------------------------
// สี (ให้ตรงกับหน้าฟอร์มประเมิน)
// ---------------------------------------------------------------------------
const COLORS = {
  brand: '#00A651',
  teal: '#0f766e', // SDGs / ตัวเลือกทั่วไปที่เลือก
  red: '#991b1b', // กรอบประเมิน (I AM / I SEE)
  brown: '#7c2d12', // ระดับคุณภาพ / ตัวเลือกย่อย (Q1-Q4)
  pillBg: '#f1f5f9',
  pillText: '#334155',
  border: '#e2e8f0',
};

// ---------------------------------------------------------------------------
// ตัวเลือกคงที่ (แก้ค่าที่นี่ที่เดียว)
// ---------------------------------------------------------------------------
const EMPTY_SDGS: string[] = [];
const SDG_NUMBERS = Array.from({ length: 17 }, (_, i) => String(i + 1));

/** แท็บที่มีการประเมิน (SDG + กรอบประเมิน) บุคลากรไม่มี */
const EVALUATED_CATEGORIES: string[] = ['research', 'academic', 'publications', 'services', 'service', 'ip'];

const FRAMEWORK_OPTIONS: { key: EvalFramework; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'i_am', label: 'I AM' },
  { key: 'i_see', label: 'I SEE' },
];

const IMAGE_OPTIONS: { key: ImageStatus; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'has_image', label: 'มีรูปภาพแล้ว' },
  { key: 'no_image', label: 'ยังไม่มีรูปภาพ' },
];

const COMPLETENESS_OPTIONS: { key: Completeness; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'incomplete', label: 'ข้อมูลไม่ครบ' },
  { key: 'complete', label: 'ข้อมูลครบถ้วน' },
];

const ROLE_OPTIONS = [
  { value: 'professor', label: 'ศาสตราจารย์ (ศ.)' },
  { value: 'assoc_prof', label: 'รองศาสตราจารย์ (รศ.)' },
  { value: 'asst_prof', label: 'ผู้ช่วยศาสตราจารย์ (ผศ.)' },
  { value: 'lecturer', label: 'อาจารย์ / ดร.' },
  { value: 'executive', label: 'หัวหน้าภาควิชา / คณะผู้บริหาร' },
  { value: 'staff', label: 'สายสนับสนุน / พนักงานและเจ้าหน้าที่' },
];

interface SubFilterDef {
  title: string;
  options: { value: string; label: string }[];
}

const SUB_FILTERS: Partial<Record<string, SubFilterDef>> = {
  research: {
    title: 'ประเภทงบประมาณและแหล่งทุน',
    options: [
      { value: '', label: 'ทั้งหมด' },
      { value: 'external', label: 'มีงบภายนอก' },
      { value: 'internal', label: 'มีงบภายใน' },
      { value: 'high_budget', label: 'งบรวม > 1 ล้านบาท' },
    ],
  },
  academic: {
    title: 'ลักษณะโครงการและการบูรณาการ',
    options: [
      { value: '', label: 'ทั้งหมด' },
      { value: 'policy', label: 'สอดคล้องนโยบายชาติ' },
      { value: 'value_add', label: 'เพิ่มมูลค่า' },
      { value: 'has_research', label: 'บูรณาการกับวิจัย' },
      { value: 'has_patent', label: 'บูรณาการกับสิทธิบัตร' },
      { value: 'has_external_members', label: 'มีผู้ร่วมภายนอก' },
    ],
  },
  publications: {
    title: 'ระดับคุณภาพวารสาร',
    options: [
      { value: '', label: 'ทั้งหมด' },
      { value: 'q1', label: 'นานาชาติ Q1' },
      { value: 'q2', label: 'นานาชาติ Q2' },
      { value: 'inter', label: 'นานาชาติทั้งหมด' },
      { value: 'tci', label: 'ระดับชาติ / TCI' },
    ],
  },
  ip: {
    title: 'สถานะและประเภทงานทรัพย์สินทางปัญญา',
    options: [
      { value: '', label: 'ทั้งหมด' },
      { value: 'granted', label: 'ได้รับความคุ้มครองแล้ว' },
      { value: 'patent', label: 'สิทธิบัตรการประดิษฐ์' },
      { value: 'petty', label: 'อนุสิทธิบัตร' },
      { value: 'copyright', label: 'ลิขสิทธิ์' },
    ],
  },
};

// ---------------------------------------------------------------------------
// ส่วนประกอบย่อย
// ---------------------------------------------------------------------------
const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: '#0f172a',
};

const Field: React.FC<{ label: string; hint?: React.ReactNode; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
      <label style={labelStyle}>{label}</label>
      {hint && <span style={{ fontSize: '11.5px', color: '#64748b' }}>{hint}</span>}
    </div>
    {children}
  </div>
);

/** หัวข้อ section: แถบเขียวด้านซ้าย + ชื่อ + เส้นคั่น */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          width: '4px',
          height: '14px',
          borderRadius: '2px',
          backgroundColor: COLORS.brand,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155', whiteSpace: 'nowrap' }}>
        {title}
      </span>
      <span style={{ flex: 1, height: '1px', backgroundColor: COLORS.border }} />
    </div>
    {children}
  </section>
);

/** ปุ่มทรงแคปซูลพื้นเทาอ่อน เมื่อเลือกจะเป็นสีเข้มตาม activeColor */
const Pill: React.FC<{
  selected: boolean;
  onClick: () => void;
  activeColor: string;
  children: React.ReactNode;
  flex?: boolean;
}> = ({ selected, onClick, activeColor, children, flex }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      flex: flex ? 1 : undefined,
      minWidth: flex ? 0 : '64px',
      height: '36px',
      padding: '0 18px',
      borderRadius: '10px',
      border: `1px solid ${selected ? activeColor : COLORS.border}`,
      backgroundColor: selected ? activeColor : COLORS.pillBg,
      color: selected ? '#ffffff' : COLORS.pillText,
      fontWeight: 700,
      fontSize: '13px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      boxShadow: selected ? '0 2px 6px rgba(0, 0, 0, 0.18)' : 'none',
      transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
    }}
  >
    {children}
  </button>
);

/** ปุ่มแบ่งเท่า ๆ กัน (เลือกได้ 1 ค่า) */
function Segmented<T extends string>({
  options,
  value,
  onChange,
  activeColor = COLORS.teal,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  activeColor?: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {options.map((opt) => (
        <Pill
          key={opt.key}
          flex
          selected={value === opt.key}
          activeColor={activeColor}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </Pill>
      ))}
    </div>
  );
}

const sdgName = (n: string): string => {
  const info = (SDGS_DATA as any)?.[Number(n)];
  return info?.nameTh || `SDG ${n}`;
};
const sdgTitle = (n: string): string => {
  const info = (SDGS_DATA as any)?.[Number(n)];
  return info ? `${info.code}: ${info.nameTh}` : `SDG ${n}`;
};

// ---------------------------------------------------------------------------
// Modal หลัก
// ---------------------------------------------------------------------------
export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  activeCategory,
  config,
  selectedDept,
  selectedRole,
  selectedImageStatus,
  selectedSubFilter,
  selectedCompleteness = 'all',
  selectedSdgs = EMPTY_SDGS,
  selectedFramework = 'all',
  onApply,
  onReset,
}) => {
  const [draftDept, setDraftDept] = useState(selectedDept);
  const [draftRole, setDraftRole] = useState(selectedRole);
  const [draftImageStatus, setDraftImageStatus] = useState<ImageStatus>(selectedImageStatus);
  const [draftSubFilter, setDraftSubFilter] = useState(selectedSubFilter);
  const [draftCompleteness, setDraftCompleteness] = useState<Completeness>(selectedCompleteness);
  const [draftSdgs, setDraftSdgs] = useState<string[]>(selectedSdgs);
  const [draftFramework, setDraftFramework] = useState<EvalFramework>(selectedFramework);

  useEffect(() => {
    if (isOpen) {
      setDraftDept(selectedDept);
      setDraftRole(selectedRole);
      setDraftImageStatus(selectedImageStatus);
      setDraftSubFilter(selectedSubFilter);
      setDraftCompleteness(selectedCompleteness);
      setDraftSdgs(selectedSdgs);
      setDraftFramework(selectedFramework);
    }
  }, [
    isOpen,
    selectedDept,
    selectedRole,
    selectedImageStatus,
    selectedSubFilter,
    selectedCompleteness,
    selectedSdgs,
    selectedFramework,
  ]);

  if (!isOpen) return null;

  const isPersonnel = activeCategory === 'personnel';
  const hasEvaluation = EVALUATED_CATEGORIES.includes(activeCategory as string);
  const subFilterDef = SUB_FILTERS[activeCategory as string];

  const toggleSdg = (n: string) => {
    setDraftSdgs((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  };

  const handleApply = () => {
    onApply({
      selectedDept: draftDept,
      selectedRole: isPersonnel ? draftRole : '',
      selectedImageStatus: isPersonnel ? draftImageStatus : 'all',
      selectedSubFilter: subFilterDef ? draftSubFilter : '',
      selectedCompleteness: isPersonnel ? draftCompleteness : 'all',
      selectedSdgs: hasEvaluation ? draftSdgs : [],
      selectedFramework: hasEvaluation ? draftFramework : 'all',
    });
    onClose();
  };

  const handleResetDraft = () => {
    setDraftDept('');
    setDraftRole('');
    setDraftImageStatus('all');
    setDraftSubFilter('');
    setDraftCompleteness('all');
    setDraftSdgs([]);
    setDraftFramework('all');
    onReset();
    onClose();
  };

  const activeDraftCount =
    (draftDept ? 1 : 0) +
    (isPersonnel && draftRole ? 1 : 0) +
    (isPersonnel && draftImageStatus !== 'all' ? 1 : 0) +
    (isPersonnel && draftCompleteness !== 'all' ? 1 : 0) +
    (subFilterDef && draftSubFilter ? 1 : 0) +
    (hasEvaluation && draftSdgs.length > 0 ? 1 : 0) +
    (hasEvaluation && draftFramework !== 'all' ? 1 : 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`@keyframes filterModalIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'filterModalIn 0.15s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: COLORS.brand,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <FaFilter style={{ fontSize: '15px', color: '#ffffff' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
              ตัวกรองข้อมูล: {config.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              opacity: 0.85,
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body (เลื่อนได้) */}
        <div
          style={{
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {/* ---------- ข้อมูลทั่วไป ---------- */}
          <Section title="ข้อมูลทั่วไป">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isPersonnel ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)',
                gap: '16px',
              }}
            >
              <Field label="สังกัด">
                <DepartmentSelect
                  value={draftDept}
                  onChange={(val) => setDraftDept(val === '__all__' ? '' : val)}
                  allowAll
                  allLabel="ทุกสังกัด"
                  allValue=""
                  className="w-full"
                />
              </Field>

              {isPersonnel && (
                <Field label="ตำแหน่งทางวิชาการ / สายงาน">
                  <Select
                    value={draftRole || ''}
                    onValueChange={(val) => setDraftRole(val === '__all__' ? '' : (val ?? ''))}
                  >
                    <SelectTrigger className="w-full bg-white text-slate-800">
                      <SelectValue placeholder="ทุกตำแหน่ง / ทุกสายงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">ทุกตำแหน่ง / ทุกสายงาน</SelectItem>
                      {ROLE_OPTIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </div>

            {isPersonnel && (
              <>
                <Field label="สถานะรูปภาพประจำตัว">
                  <Segmented options={IMAGE_OPTIONS} value={draftImageStatus} onChange={setDraftImageStatus} />
                </Field>
                <Field label="สถานะความครบถ้วนของข้อมูล">
                  <Segmented options={COMPLETENESS_OPTIONS} value={draftCompleteness} onChange={setDraftCompleteness} />
                </Field>
              </>
            )}

            {subFilterDef && (
              <Field label={subFilterDef.title}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {subFilterDef.options.map((opt) => (
                    <Pill
                      key={opt.value || '__all__'}
                      selected={draftSubFilter === opt.value}
                      activeColor={COLORS.brown}
                      onClick={() => setDraftSubFilter(opt.value)}
                    >
                      {opt.label}
                    </Pill>
                  ))}
                </div>
              </Field>
            )}
          </Section>

          {/* ---------- การประเมิน ---------- */}
          {hasEvaluation && (
            <Section title="การประเมิน">
              <Field
                label="สอดคล้องตามเป้าหมายการพัฒนาที่ยั่งยืน (SDGs)"
                hint={
                  <span style={{ display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
                    <span>
                      {draftSdgs.length > 0 ? `เลือกแล้ว ${draftSdgs.length} เป้าหมาย` : 'เลือกได้หลายเป้าหมาย'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDraftSdgs(draftSdgs.length === 17 ? [] : SDG_NUMBERS)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: COLORS.brand,
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {draftSdgs.length === 17 ? 'ล้างทั้งหมด' : 'เลือกทั้งหมด'}
                    </button>
                  </span>
                }
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                  {SDG_NUMBERS.map((n) => {
                    const selected = draftSdgs.includes(n);
                    return (
                      <button
                        key={n}
                        type="button"
                        title={sdgTitle(n)}
                        onClick={() => toggleSdg(n)}
                        style={{
                          minHeight: '40px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          border: `1px solid ${selected ? COLORS.teal : COLORS.border}`,
                          backgroundColor: selected ? COLORS.teal : '#ffffff',
                          color: selected ? '#ffffff' : '#1e293b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          textAlign: 'left',
                          boxShadow: selected ? '0 2px 6px rgba(15, 118, 110, 0.25)' : 'none',
                          transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '18px' }}>{n}</span>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: selected ? 600 : 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            minWidth: 0,
                          }}
                        >
                          {sdgName(n)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="กรอบประเมิน" hint="เลือกได้ 1 รายการ">
                <Segmented
                  options={FRAMEWORK_OPTIONS}
                  value={draftFramework}
                  onChange={setDraftFramework}
                  activeColor={COLORS.red}
                />
              </Field>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
            borderTop: `1px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={handleResetDraft}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#64748b',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <FaUndo style={{ fontSize: '11px' }} />
            <span>ล้างค่าตัวกรอง</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleApply}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: COLORS.brand,
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
              }}
            >
              <FaCheck style={{ fontSize: '11px' }} />
              <span>ใช้งานตัวกรอง</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
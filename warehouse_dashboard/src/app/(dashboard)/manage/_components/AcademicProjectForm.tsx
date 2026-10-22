'use client';

import React, { useState } from 'react';
import { DEPARTMENTS } from '@/config/dataManagementConfig';
import { SmartAutocomplete } from './SmartAutocomplete';
import { PersonnelRecord } from '@/types/dataManagement';
import researchData from '@/data/research.json';
import ipData from '@/data/ip.json';
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
  const allocManagement = Math.round(totalBudget * 0.15); // 15%
  const allocFaculty = Math.round(totalBudget * 0.05);    // 5%
  const allocDept = Math.round(totalBudget * 0.05);       // 5%
  const allocKu = Math.round(totalBudget * 0.05);         // 5%
  const allocDeductions = allocManagement + allocFaculty + allocDept + allocKu; // 30%
  const allocRemaining = totalBudget - allocDeductions;    // 70%

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
  const handleQuickSelectResearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
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
  const handleQuickSelectIp = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVal = e.target.value;
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
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
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
              <select
                value={formData.department || ''}
                onChange={(e) => onChange('department', e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">-- เลือกภาควิชา / หน่วยงาน --</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
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
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
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
          {/* หัวหน้าโครงการ (SmartAutocomplete) */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              หัวหน้าโครงการ <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <SmartAutocomplete
              value={formData.head || ''}
              onChange={(newVal) => onChange('head', newVal)}
              onSelectPerson={handleHeadSelect}
              placeholder="พิมพ์ค้นหาชื่ออาจารย์หรือหัวหน้าโครงการ..."
              required
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
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px 20px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
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
              งบประมาณรวมทั้งหมด (บาท) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.budget !== undefined ? formData.budget : ''}
                onChange={(e) => {
                  const b = parseFloat(e.target.value) || 0;
                  onChange('budget', b);
                  // Auto save precalculated allocations
                  onChange('alloc_management_fee', Math.round(b * 0.15));
                  onChange('alloc_faculty', Math.round(b * 0.05));
                  onChange('alloc_dept', Math.round(b * 0.05));
                  onChange('alloc_ku', Math.round(b * 0.05));
                  onChange('alloc_remaining', Math.round(b * 0.70));
                }}
                placeholder="0"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #00A651',
                  fontSize: '16px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: '#006838',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
            <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              กรอกเฉพาะยอดงบประมาณรวม ระบบจะคำนวณการจัดสรรเงินเข้ากองทุนและส่วนต่างๆ ให้อัตโนมัติ
            </span>
          </div>

          {/* การ์ดแสดงผลการจัดสรรงบประมาณอัตโนมัติ (หัก 15% ค่าอำนวยการ, 5% คณะ, 5% ภาควิชา, 5% มก.) */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: '#f0fbf5',
              border: '1px solid #bbf7d0',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#006838' }}>
                <FaCalculator style={{ fontSize: '13px' }} />
                <span>การจัดสรรงบประมาณอัตโนมัติ (หักแน่นอน 30%)</span>
              </div>
              <span style={{ fontSize: '11.5px', color: '#007a3e', fontWeight: 600 }}>
                คำนวณอัตโนมัติจากยอดรวม {totalBudget.toLocaleString()} บาท
              </span>
            </div>

            {/* Grid แสดงสัดส่วน 5 รายการ */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '8px',
              }}
            >
              <div style={{ backgroundColor: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>ค่าอำนวยการ (15%)</div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>
                  {allocManagement.toLocaleString()} ฿
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>คณะ (5%)</div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>
                  {allocFaculty.toLocaleString()} ฿
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>ภาควิชา (5%)</div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>
                  {allocDept.toLocaleString()} ฿
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>มก. (5%)</div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>
                  {allocKu.toLocaleString()} ฿
                </div>
              </div>

              <div style={{ backgroundColor: '#ecfdf5', padding: '8px 10px', borderRadius: '6px', border: '1px solid #86efac' }}>
                <div style={{ fontSize: '11.5px', color: '#047857', fontWeight: 600 }}>งบดำเนินงานคงเหลือ (70%)</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#006838', fontFamily: 'monospace' }}>
                  {allocRemaining.toLocaleString()} ฿
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* หมวดที่ 4: ระยะเวลาดำเนินการ (บังคับใส่ เริ่มต้น - สิ้นสุด) */}
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
              ระยะเวลาดำเนินการ <span style={{ color: '#ef4444' }}>* (บังคับใส่ปฏิทิน เริ่มต้น - สิ้นสุด)</span>
            </h4>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              วันที่เริ่มต้นดำเนินการ <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => onChange('start_date', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              วันที่สิ้นสุดดำเนินการ <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => onChange('end_date', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* หมวดที่ 5: บูรณาการการใช้ประโยชน์ (โครงการวิจัย & สิทธิบัตร) */}
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
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
            การบูรณาการการใช้ประโยชน์ (โครงการวิจัย และ สิทธิบัตร)
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* ส่วนที่ 5.1: บูรณาการกับโครงการวิจัย (รหัส 8 ตัว + ชื่อโครงการ, มีได้หลายรหัส) */}
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
              <select
                onChange={handleQuickSelectResearch}
                defaultValue=""
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px dashed #94a3b8',
                  backgroundColor: '#ffffff',
                  fontSize: '12.5px',
                  color: '#475569',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">-- เลือกเติมข้อมูลด่วนจากโครงการวิจัยในระบบ (หรือพิมพ์เองด้านล่าง) --</option>
                {researchData.slice(0, 30).map((r: any, idx: number) => {
                  const rId = String(r.id || '').replace(/[\n\r]/g, ' ').trim();
                  const rName = String(r.name || '').replace(/[\n\r]/g, ' ').trim();
                  return (
                    <option key={idx} value={String(r.id || r._id)}>
                      [{rId}] {rName.substring(0, 65)}...
                    </option>
                  );
                })}
              </select>
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

          {/* ส่วนที่ 5.2: บูรณาการกับสิทธิบัตร */}
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
              <span>บูรณาการกับสิทธิบัตร / งานทรัพย์สินทางปัญญา</span>
            </div>

            {/* Quick helper dropdown จากฐานข้อมูลสิทธิบัตร */}
            <div style={{ marginBottom: '8px' }}>
              <select
                onChange={handleQuickSelectIp}
                defaultValue=""
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px dashed #94a3b8',
                  backgroundColor: '#ffffff',
                  fontSize: '12.5px',
                  color: '#475569',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">-- เลือกสิทธิบัตรจากระบบ (หรือพิมพ์เองในช่องด้านล่าง) --</option>
                {ipData.map((item: any, idx: number) => {
                  const reqNo = String(item.req_no || '').trim();
                  const ipName = String(item.name || '').trim();
                  return (
                    <option key={idx} value={`${reqNo ? `[${reqNo}] ` : ''}${ipName}`}>
                      {reqNo ? `[${reqNo}] ` : ''}{ipName} ({item.type || 'สิทธิบัตร'})
                    </option>
                  );
                })}
              </select>
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

          {/* ส่วนที่ 5.3: วันที่นำไปบูรณาการ (เริ่มต้น - สิ้นสุด ไม่บังคับใส่) */}
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
                <input
                  type="date"
                  value={formData.integration_start_date || ''}
                  onChange={(e) => onChange('integration_start_date', e.target.value)}
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
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#475569', marginBottom: '4px' }}>
                  วันที่สิ้นสุดนำไปบูรณาการ
                </label>
                <input
                  type="date"
                  value={formData.integration_end_date || ''}
                  onChange={(e) => onChange('integration_end_date', e.target.value)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

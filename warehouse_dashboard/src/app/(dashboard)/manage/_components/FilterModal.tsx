'use client';

import React, { useState, useEffect } from 'react';
import { CategoryKey, CategoryConfig } from '@/types/dataManagement';
import { DEPARTMENTS, getDepartmentAbbr } from '@/config/dataManagementConfig';
import { FaFilter, FaTimes, FaUndo, FaCheck } from 'react-icons/fa';
import { DepartmentSelect } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: CategoryKey;
  config: CategoryConfig;
  selectedDept: string;
  selectedRole: string;
  selectedImageStatus: 'all' | 'has_image' | 'no_image';
  selectedSubFilter: string;
  selectedCompleteness?: 'all' | 'complete' | 'incomplete';
  onApply: (filters: {
    selectedDept: string;
    selectedRole: string;
    selectedImageStatus: 'all' | 'has_image' | 'no_image';
    selectedSubFilter: string;
    selectedCompleteness?: 'all' | 'complete' | 'incomplete';
  }) => void;
  onReset: () => void;
}

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
  onApply,
  onReset,
}) => {
  // Local draft state for filters inside the modal
  const [draftDept, setDraftDept] = useState(selectedDept);
  const [draftRole, setDraftRole] = useState(selectedRole);
  const [draftImageStatus, setDraftImageStatus] = useState(selectedImageStatus);
  const [draftSubFilter, setDraftSubFilter] = useState(selectedSubFilter);
  const [draftCompleteness, setDraftCompleteness] = useState<'all' | 'complete' | 'incomplete'>(selectedCompleteness);

  useEffect(() => {
    if (isOpen) {
      setDraftDept(selectedDept);
      setDraftRole(selectedRole);
      setDraftImageStatus(selectedImageStatus);
      setDraftSubFilter(selectedSubFilter);
      setDraftCompleteness(selectedCompleteness);
    }
  }, [isOpen, selectedDept, selectedRole, selectedImageStatus, selectedSubFilter, selectedCompleteness]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      selectedDept: draftDept,
      selectedRole: draftRole,
      selectedImageStatus: draftImageStatus,
      selectedSubFilter: draftSubFilter,
      selectedCompleteness: draftCompleteness,
    });
    onClose();
  };

  const handleResetDraft = () => {
    setDraftDept('');
    setDraftRole('');
    setDraftImageStatus('all');
    setDraftSubFilter('');
    setDraftCompleteness('all');
    onReset();
    onClose();
  };

  const activeDraftCount =
    (draftDept ? 1 : 0) +
    (draftRole ? 1 : 0) +
    (draftImageStatus !== 'all' ? 1 : 0) +
    (draftSubFilter ? 1 : 0) +
    (draftCompleteness !== 'all' ? 1 : 0);

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
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.15s ease-out',
        }}
      >
        {/* Header: ยุบเหลือบรรทัดเดียวตามที่ผู้ใช้ต้องการ */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#00A651',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <FaFilter style={{ fontSize: '15px', color: '#ffffff' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
              ตัวกรองข้อมูล: {config.title}
            </h3>
          </div>
          <button
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

        {/* Body Content */}
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* 1. Department Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
              ภาควิชา / ศูนย์สังกัด
            </label>
            <DepartmentSelect
              value={draftDept}
              onChange={(val) => setDraftDept(val === '__all__' ? '' : val)}
              allowAll
              allLabel="ทุกภาควิชา / ศูนย์สังกัด"
              allValue=""
              className="w-full"
            />
          </div>

          {/* 2. Personnel Category Filters */}
          {activeCategory === 'personnel' && (
            <>
              {/* Role / Rank */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                  ตำแหน่งทางวิชาการ / สายงาน
                </label>
                <Select value={draftRole || '__all__'} onValueChange={(val) => setDraftRole(val === '__all__' ? '' : (val ?? ''))}>
                  <SelectTrigger className="w-full bg-white text-slate-800">
                    <SelectValue placeholder="ทุกตำแหน่ง / ทุกสายงาน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">ทุกตำแหน่ง / ทุกสายงาน</SelectItem>
                    <SelectItem value="professor">ศาสตราจารย์ (ศ.)</SelectItem>
                    <SelectItem value="assoc_prof">รองศาสตราจารย์ (รศ.)</SelectItem>
                    <SelectItem value="asst_prof">ผู้ช่วยศาสตราจารย์ (ผศ.)</SelectItem>
                    <SelectItem value="lecturer">อาจารย์ / ดร.</SelectItem>
                    <SelectItem value="executive">หัวหน้าภาควิชา / คณะผู้บริหาร</SelectItem>
                    <SelectItem value="staff">สายสนับสนุน / พนักงานและเจ้าหน้าที่</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Profile Image Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                  สถานะรูปภาพประจำตัว
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { key: 'all', label: 'ทั้งหมด' },
                    { key: 'has_image', label: 'มีรูปภาพแล้ว' },
                    { key: 'no_image', label: 'ยังไม่มีรูปภาพ' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setDraftImageStatus(opt.key as any)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border:
                          draftImageStatus === opt.key
                            ? '1.5px solid #00A651'
                            : '1px solid #cbd5e1',
                        backgroundColor:
                          draftImageStatus === opt.key ? '#f0fbf5' : '#ffffff',
                        color: draftImageStatus === opt.key ? '#00A651' : '#475569',
                        fontWeight: draftImageStatus === opt.key ? 600 : 400,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Completeness Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                  สถานะความครบถ้วนของข้อมูล
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { key: 'all', label: 'ทั้งหมด' },
                    { key: 'incomplete', label: 'ข้อมูลไม่ครบ' },
                    { key: 'complete', label: 'ข้อมูลครบถ้วน' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setDraftCompleteness(opt.key as any)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border:
                          draftCompleteness === opt.key
                            ? '1.5px solid #00A651'
                            : '1px solid #cbd5e1',
                        backgroundColor:
                          draftCompleteness === opt.key ? '#f0fbf5' : '#ffffff',
                        color: draftCompleteness === opt.key ? '#00A651' : '#475569',
                        fontWeight: draftCompleteness === opt.key ? 600 : 400,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 3. Research Category Filter */}
          {activeCategory === 'research' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                ประเภทงบประมาณและแหล่งทุน
              </label>
              <Select value={draftSubFilter || '__all__'} onValueChange={(val) => setDraftSubFilter(val === '__all__' ? '' : (val ?? ''))}>
                <SelectTrigger className="w-full bg-white text-slate-800">
                  <SelectValue placeholder="ทุกแหล่งทุนและงบประมาณ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">ทุกแหล่งทุนและงบประมาณ</SelectItem>
                  <SelectItem value="external">โครงการที่มีงบประมาณภายนอก</SelectItem>
                  <SelectItem value="internal">โครงการที่มีงบประมาณภายใน</SelectItem>
                  <SelectItem value="high_budget">โครงการงบประมาณรวม &gt; 1 ล้านบาท</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Academic Development Projects Category Filter */}
          {activeCategory === 'academic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                ลักษณะโครงการและการบูรณาการ
              </label>
              <Select value={draftSubFilter || '__all__'} onValueChange={(val) => setDraftSubFilter(val === '__all__' ? '' : (val ?? ''))}>
                <SelectTrigger className="w-full bg-white text-slate-800">
                  <SelectValue placeholder="ทุกลักษณะและการบูรณาการ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">ทุกลักษณะและการบูรณาการ</SelectItem>
                  <SelectItem value="policy">สอดคล้องกับนโยบายชาติ</SelectItem>
                  <SelectItem value="value_add">เพิ่มมูลค่า</SelectItem>
                  <SelectItem value="has_research">มีการบูรณาการกับโครงการวิจัย</SelectItem>
                  <SelectItem value="has_patent">มีการบูรณาการกับสิทธิบัตร</SelectItem>
                  <SelectItem value="has_external_members">มีผู้ร่วมโครงการภายนอก</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 4. Publications Category Filter */}
          {activeCategory === 'publications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                ระดับและฐานข้อมูลวารสาร
              </label>
              <Select value={draftSubFilter || '__all__'} onValueChange={(val) => setDraftSubFilter(val === '__all__' ? '' : (val ?? ''))}>
                <SelectTrigger className="w-full bg-white text-slate-800">
                  <SelectValue placeholder="ทุกระดับ / ฐานข้อมูล" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">ทุกระดับ / ฐานข้อมูล</SelectItem>
                  <SelectItem value="q1">เฉพาะนานาชาติ Q1</SelectItem>
                  <SelectItem value="q2">เฉพาะนานาชาติ Q2</SelectItem>
                  <SelectItem value="inter">วารสารนานาชาติทั้งหมด</SelectItem>
                  <SelectItem value="tci">วารสารระดับชาติ / TCI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 5. IP Category Filter */}
          {activeCategory === 'ip' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                สถานะและประเภทงานทรัพย์สินทางปัญญา
              </label>
              <Select value={draftSubFilter || '__all__'} onValueChange={(val) => setDraftSubFilter(val === '__all__' ? '' : (val ?? ''))}>
                <SelectTrigger className="w-full bg-white text-slate-800">
                  <SelectValue placeholder="ทุกสถานะและประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">ทุกสถานะและประเภท</SelectItem>
                  <SelectItem value="granted">ออกสิทธิบัตร / รับจดทะเบียนแล้ว</SelectItem>
                  <SelectItem value="patent">สิทธิบัตรการประดิษฐ์</SelectItem>
                  <SelectItem value="petty">อนุสิทธิบัตร</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
                backgroundColor: '#00A651',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
              }}
            >
              <FaCheck style={{ fontSize: '11px' }} />
              <span>ใช้งานตัวกรอง {activeDraftCount > 0 ? `(${activeDraftCount})` : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

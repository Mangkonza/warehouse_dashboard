'use client';

import React, { useState } from 'react';
import { ProjectMember, MemberRole, AffiliationType } from '@/types/projectMonitoring';
import { SmartAutocomplete } from './SmartAutocomplete';
import { PersonnelRecord } from '@/types/dataManagement';
import {
  FaUserPlus,
  FaTrash,
  FaUserTie,
  FaGraduationCap,
  FaUniversity,
  FaBuilding,
  FaBriefcase,
} from 'react-icons/fa';

interface MultiMemberSelectorProps {
  members: ProjectMember[];
  onChange: (members: ProjectMember[]) => void;
}

const ROLE_OPTIONS: { role: MemberRole; label: string }[] = [
  { role: 'PI', label: 'หัวหน้าโครงการ (PI)' },
  { role: 'Co-PI', label: 'ผู้ร่วมวิจัย (Co-PI)' },
  { role: 'RA', label: 'ผู้ช่วยวิจัย (RA)' },
  { role: 'Advisor', label: 'ที่ปรึกษาโครงการ (Advisor)' },
];

const AFFILIATION_OPTIONS: { type: AffiliationType; label: string; icon: any }[] = [
  { type: 'eng_kps', label: 'คณะวิศวกรรมศาสตร์ กำแพงแสน (304 ท่าน)', icon: <FaUserTie /> },
  { type: 'ku_kps_faculty', label: 'คณะอื่นใน มก. กำแพงแสน', icon: <FaGraduationCap /> },
  { type: 'ku_other_campus', label: 'วิทยาเขตอื่นของ มก. (บางเขน, ศรีราชา, สกลนคร)', icon: <FaUniversity /> },
  { type: 'external_academic', label: 'สถาบันการศึกษา / มหาวิทยาลัยอื่น', icon: <FaBuilding /> },
  { type: 'external_govt', label: 'หน่วยงานรัฐ / สถาบันวิจัย (วช., สวทช.)', icon: <FaBuilding /> },
  { type: 'external_private', label: 'ภาคเอกชน / ภาคอุตสาหกรรม', icon: <FaBriefcase /> },
];

const KU_KPS_FACULTIES = [
  'คณะเกษตร กำแพงแสน',
  'คณะศิลปศาสตร์และวิทยาศาสตร์',
  'คณะวิทยาศาสตร์การกีฬา',
  'คณะศึกษาศาสตร์และพัฒนศาสตร์',
  'คณะสัตวแพทยศาสตร์ กำแพงแสน',
  'สถาบันสุวรรณวาจกกสิกิจฯ',
];

export const MultiMemberSelector: React.FC<MultiMemberSelectorProps> = ({
  members,
  onChange,
}) => {
  const [newRole, setNewRole] = useState<MemberRole>('Co-PI');
  const [newAffiliation, setNewAffiliation] = useState<AffiliationType>('eng_kps');
  const [newName, setNewName] = useState<string>('');
  const [newOrg, setNewOrg] = useState<string>('');
  const [newContribution, setNewContribution] = useState<number>(20);

  // Add Member
  const handleAddMember = () => {
    if (!newName.trim()) return;

    let orgName = newOrg.trim();
    if (newAffiliation === 'eng_kps' && !orgName) {
      orgName = 'คณะวิศวกรรมศาสตร์ กำแพงแสน';
    }

    const member: ProjectMember = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: newName.trim(),
      role: newRole,
      affiliation_type: newAffiliation,
      organization: orgName,
      contribution_percent: newContribution,
    };

    onChange([...members, member]);
    setNewName('');
    setNewOrg('');
  };

  // Remove Member
  const handleRemoveMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
        ทีมงานผู้ดำเนินโครงการ & ความร่วมมือข้ามสังกัด (Project Members & Collaboration)
      </label>

      {/* Existing Members Roster */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {members.map((mem, idx) => (
          <div
            key={mem.id || idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              background: mem.role === 'PI' ? 'rgba(0, 168, 89, 0.08)' : '#f8fafc',
              border: mem.role === 'PI' ? '1.5px solid rgba(0, 168, 89, 0.3)' : '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: mem.role === 'PI' ? '#00A651' : '#e2e8f0',
                  color: mem.role === 'PI' ? '#fff' : '#475569',
                }}
              >
                {mem.role}
              </span>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{mem.name}</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  {mem.organization} {mem.contribution_percent ? `• สัดส่วน ${mem.contribution_percent}%` : ''}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveMember(idx)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              title="ลบสมาชิกท่านนี้"
            >
              <FaTrash style={{ fontSize: '12px' }} />
              <span>ลบ</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add New Member Input Area */}
      <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(241, 245, 249, 0.7)', border: '1px dashed #cbd5e1' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaUserPlus style={{ color: '#00A651' }} /> เพิ่มผู้ร่วมดำเนินงาน / สมาชิกโครงการใหม่
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '10px' }}>
          {/* Role */}
          <div>
            <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '4px' }}>บทบาท</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as MemberRole)}
              className="glass-input"
              style={{ width: '100%', fontSize: '12.5px', padding: '6px 10px' }}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Affiliation Type */}
          <div>
            <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '4px' }}>ประเภทสังกัด</label>
            <select
              value={newAffiliation}
              onChange={(e) => setNewAffiliation(e.target.value as AffiliationType)}
              className="glass-input"
              style={{ width: '100%', fontSize: '12.5px', padding: '6px 10px' }}
            >
              {AFFILIATION_OPTIONS.map((a) => (
                <option key={a.type} value={a.type}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {/* Contribution % */}
          <div>
            <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '4px' }}>สัดส่วน (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={newContribution}
              onChange={(e) => setNewContribution(Number(e.target.value))}
              className="glass-input"
              style={{ width: '100%', fontSize: '12.5px', padding: '6px 10px' }}
            />
          </div>
        </div>

        {/* Name and Organization Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
              ชื่อ-นามสกุล {newAffiliation === 'eng_kps' ? '(ค้นหาอาจารย์ 304 ท่าน)' : ''}
            </label>
            {newAffiliation === 'eng_kps' ? (
              <SmartAutocomplete
                value={newName}
                onChange={setNewName}
                onSelectPerson={(p) => {
                  setNewName(p.name);
                  setNewOrg(`คณะวิศวกรรมศาสตร์ กำแพงแสน (${p.department})`);
                }}
                placeholder="พิมพ์ค้นหาชื่ออาจารย์..."
              />
            ) : (
              <input
                type="text"
                placeholder="เช่น ดร.สมชาย ใจดี"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="glass-input"
                style={{ width: '100%', fontSize: '12.5px', padding: '8px 12px' }}
              />
            )}
          </div>

          <div>
            <label style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '4px' }}>หน่วยงาน / คณะ / บริษัท</label>
            {newAffiliation === 'ku_kps_faculty' ? (
              <select
                value={newOrg}
                onChange={(e) => setNewOrg(e.target.value)}
                className="glass-input"
                style={{ width: '100%', fontSize: '12.5px', padding: '8px 12px' }}
              >
                <option value="">เลือกคณะในกำแพงแสน...</option>
                {KU_KPS_FACULTIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="เช่น วช., สวทช., บ. ปตท."
                value={newOrg}
                onChange={(e) => setNewOrg(e.target.value)}
                className="glass-input"
                style={{ width: '100%', fontSize: '12.5px', padding: '8px 12px' }}
              />
            )}
          </div>

          <button
            type="button"
            onClick={handleAddMember}
            className="glass-btn-primary"
            style={{ padding: '8px 16px', fontSize: '12.5px', whiteSpace: 'nowrap', height: '38px' }}
          >
            + เพิ่มสมาชิก
          </button>
        </div>
      </div>
    </div>
  );
};

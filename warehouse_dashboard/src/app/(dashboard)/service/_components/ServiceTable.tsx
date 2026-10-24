'use client';

import React, { useState } from 'react';
import { FaTable, FaTimes } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, DepartmentSelect, RecordDetailDrawer, formatDateBE } from '@/components/ui';
import { ServiceItem } from '../_hooks/useServiceData';

interface ServiceTableProps {
  filteredData: ServiceItem[];
  totalCount?: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDept?: string;
  onDeptChange?: (value: string) => void;
  selectedType?: string;
  onTypeChange?: (value: string) => void;
}

function getServiceTypeBadgeStyle(rawVal?: string) {
  if (rawVal === 'วิทยากร/อาจารย์พิเศษ') {
    return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' };
  }
  if (rawVal === 'วิชาการ') {
    return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' };
  }
  if (rawVal === 'วิชาชีพ') {
    return { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' };
  }
  if (rawVal === 'ผู้ทรงคุณวุฒิ') {
    return { bg: '#fffbeb', text: '#b45309', border: '#fde68a' };
  }
  if (rawVal === 'วิทยานิพนธ์ภายนอก') {
    return { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' };
  }
  if (rawVal === 'ศึกษาดูงาน วศ.กพส.') {
    return { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' };
  }
  return { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
}

export function ServiceTable({
  filteredData,
  totalCount,
  searchTerm,
  onSearchChange,
  selectedDept = 'all',
  onDeptChange,
  selectedType = 'all',
  onTypeChange,
}: ServiceTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<ServiceItem | null>(null);

  const hasActiveFilter = selectedDept !== 'all' || selectedType !== 'all' || searchTerm.trim() !== '';

  return (
    <div className="table-card">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <h3 style={{ margin: 0 }}>
          <FaTable style={{ color: '#e65100', marginRight: '8px' }} /> งานบริการวิชาการ ({filteredData.length}
          {totalCount && totalCount !== filteredData.length ? ` / ${totalCount}` : ''})
        </h3>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {selectedType !== 'all' && onTypeChange && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: '#fffbeb',
                border: '1px solid #d97706',
                color: '#b45309',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>ประเภท: {selectedType}</span>
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => onTypeChange('all')} />
            </span>
          )}
          <SearchInput
            placeholder="ค้นหาเรื่อง, ชื่อ-นามสกุล, กลุ่มเป้าหมาย..."
            value={searchTerm}
            onChange={onSearchChange}
            width="230px"
          />
          {onDeptChange && (
            <DepartmentSelect
              value={selectedDept}
              onChange={onDeptChange}
              allowAll
              allLabel="ทุกภาควิชา"
              allValue="all"
              size="sm"
              className="w-[175px]"
            />
          )}
          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                if (onDeptChange) onDeptChange('all');
                if (onTypeChange) onTypeChange('all');
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #fca5a5',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      <div className="table-scroll" style={{ maxHeight: '460px' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '44px', textAlign: 'center' }}>#</th>
              <th style={{ width: '105px', textAlign: 'center' }}>วัน/เดือน/ปี</th>
              <th>เรื่อง</th>
              <th style={{ width: '140px', textAlign: 'center' }}>ประเภท</th>
              <th>ชื่อ - นามสกุล</th>
              <th style={{ width: '105px', textAlign: 'left' }}>ภาควิชา/ศูนย์ฯ</th>
              <th>กลุ่มเป้าหมาย</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => {
              const typeVal = item._resolvedType || item.service_type || item.service_category || 'วิชาการ';
              const badgeStyle = getServiceTypeBadgeStyle(typeVal);
              return (
                <tr
                  key={item.id || item._id || index}
                  onClick={() => setSelectedRecord(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap', color: '#475569' }}>
                    {formatDateBE(item.date)}
                  </td>
                  <td style={{ whiteSpace: 'normal', minWidth: '250px', fontWeight: 400, color: '#0f172a' }}>
                    {item.name || item.topic_title}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.text,
                        border: `1px solid ${badgeStyle.border}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {typeVal}
                    </span>
                  </td>
                  <td style={{ fontWeight: 400, color: '#334155' }}>
                    {item.person && item.person !== 'nan' ? item.person : '-'}
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <DepartmentBadge value={item.department} />
                  </td>
                  <td style={{ color: '#475569', fontWeight: 400 }}>
                    {item.target_group && item.target_group !== 'nan' ? item.target_group : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <RecordDetailDrawer
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        categoryKey="service"
        record={selectedRecord}
        readOnly={true}
      />
    </div>
  );
}

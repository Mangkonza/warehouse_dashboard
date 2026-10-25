'use client';

import React, { useState } from 'react';
import { FaTable, FaTimes } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, DepartmentSelect, RecordDetailDrawer, ServiceTypeBadge, formatDateBE } from '@/components/ui';
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
                    <ServiceTypeBadge value={typeVal} />
                  </td>
                  <td style={{ fontWeight: 400, color: '#334155' }}>
                    {item.person && item.person !== 'nan' ? (
                      item.person_id ? (
                        <a
                          href={`/personnel/${item.person_id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: '#d97706', fontWeight: 600, textDecoration: 'none' }}
                          title="คลิกเพื่อดูแฟ้มผลงานอาจารย์"
                        >
                          {item.person}
                        </a>
                      ) : (
                        item.person
                      )
                    ) : (
                      '-'
                    )}
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

'use client';

import React, { useState } from 'react';
import { FaTable, FaFilter, FaTimes } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, DepartmentSelect, RecordDetailDrawer, IPTypeBadge } from '@/components/ui';
import { IPItem } from '../_hooks/useIPData';

interface IPTableProps {
  filteredIpData: IPItem[];
  totalCount?: number;
  availableDepts: string[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  deptFilter: string;
  onDeptChange: (value: string) => void;
  typeFilter?: string;
  onTypeChange?: (value: string) => void;
}

export function IPTable({
  filteredIpData,
  totalCount,
  availableDepts,
  searchTerm,
  onSearchChange,
  deptFilter,
  onDeptChange,
  typeFilter = 'all',
  onTypeChange,
}: IPTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<IPItem | null>(null);

  const hasActiveFilter = deptFilter !== 'all' || typeFilter !== 'all' || searchTerm.trim() !== '';

  return (
    <div className="table-card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaTable style={{ color: '#6a1b9a' }} /> ตารางงานทรัพย์สินทางปัญญา
            <span
              style={{
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#faf5ff',
                color: '#6a1b9a',
                border: '1px solid #e9d5ff',
                fontWeight: 600,
              }}
            >
              {filteredIpData.length}
              {totalCount && totalCount !== filteredIpData.length ? ` / ${totalCount}` : ''} รายการ
            </span>
          </h3>
        </div>

        {/* Search, Dept Filter, and Add Button */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {typeFilter !== 'all' && onTypeChange && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: '#faf5ff',
                border: '1px solid #6a1b9a',
                color: '#6a1b9a',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>ประเภท: {typeFilter}</span>
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => onTypeChange('all')} />
            </span>
          )}
          <SearchInput
            placeholder="ค้นหาชื่อเรื่อง / ผู้ประดิษฐ์ / เลขทะเบียน / เลขที่คำขอ..."
            value={searchTerm}
            onChange={onSearchChange}
            width="230px"
          />

          {availableDepts.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FaFilter style={{ color: '#64748b', fontSize: '12px' }} />
              <DepartmentSelect
                value={deptFilter}
                onChange={onDeptChange}
                allowAll
                allLabel="ทุกภาควิชา"
                allValue="all"
                size="sm"
                className="w-[175px]"
              />
            </div>
          )}

          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onDeptChange('all');
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

      <div className="table-scroll">
        <table className="glass-table">
          <thead>
            <tr>
              <th style={{ width: '45px', textAlign: 'center' }}>#</th>
              <th style={{ minWidth: '220px' }}>ชื่อเรื่อง</th>
              <th>ผู้ประดิษฐ์ / ผู้สร้างสรรค์</th>
              <th style={{ width: '120px', textAlign: 'left' }}>ภาควิชา</th>
              <th style={{ textAlign: 'center' }}>ประเภท</th>
              <th>เลขที่คำขอ / เลขทะเบียน</th>
              <th style={{ textAlign: 'center' }}>สถานะ</th>
              <th style={{ textAlign: 'right' }}>คณะฯ สนับสนุน</th>
            </tr>
          </thead>
          <tbody>
            {filteredIpData.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                </td>
              </tr>
            ) : (
              filteredIpData.map((item, index) => {
                const supportVal = item.support_amount !== undefined && item.support_amount !== null ? Number(item.support_amount) : 0;
                const depts = Array.from(
                  new Set(
                    String(item.department || '')
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                );
                const isProtected =
                  String(item.status || '').includes('คุ้มครอง') ||
                  Boolean(item.registration_number && String(item.registration_number).trim());

                return (
                  <tr
                    key={item.id || item._id || index}
                    onClick={() => setSelectedRecord(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                    <td style={{ whiteSpace: 'normal', minWidth: '220px', fontWeight: 400, color: '#0f172a' }}>
                      {item.title || item.name}
                    </td>
                    <td style={{ fontWeight: 400, color: '#334155' }}>
                      {item.creator && item.creator !== 'nan' ? (
                        item.person_id ? (
                          <a
                            href={`/personnel/${item.person_id}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}
                            title="คลิกเพื่อดูแฟ้มผลงานอาจารย์"
                          >
                            {item.creator}
                          </a>
                        ) : (
                          item.creator
                        )
                      ) : (
                        '-'
                      )}
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {depts.length > 0 ? (
                          depts.map((d, i) => <DepartmentBadge key={i} value={d} />)
                        ) : (
                          <DepartmentBadge value={item.department} />
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <IPTypeBadge value={item.type} />
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#334155' }}>
                      {item.req_no && item.req_no !== 'nan'
                        ? item.req_no
                        : item.application_number
                        ? item.registration_number
                          ? `${item.application_number} / ${item.registration_number}`
                          : item.application_number
                        : item.registration_number || '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: isProtected ? '#ecfdf5' : '#f0f9ff',
                          color: isProtected ? '#059669' : '#0284c7',
                          border: `1px solid ${isProtected ? '#a7f3d0' : '#bae6fd'}`,
                        }}
                      >
                        {isProtected ? 'ได้รับความคุ้มครองแล้ว' : 'ยื่นคำขอ'}
                      </span>
                    </td>
                    <td className="budget-cell">
                      {supportVal > 0 ? `${supportVal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท` : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <RecordDetailDrawer
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        categoryKey="ip"
        record={selectedRecord}
        readOnly={true}
      />
    </div>
  );
}

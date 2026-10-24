'use client';

import React, { useState } from 'react';
import { FaListUl, FaTimes } from 'react-icons/fa';
import { SearchInput, RecordDetailDrawer } from '@/components/ui';
import { AcademicItem } from '../_hooks/useAcademicData';

interface AcademicTableProps {
  displayData: AcademicItem[];
  totalCount?: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedClient?: string;
  onClientChange?: (value: string) => void;
}

export function AcademicTable({
  displayData,
  totalCount,
  searchTerm,
  onSearchChange,
  selectedClient = 'all',
  onClientChange,
}: AcademicTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<AcademicItem | null>(null);

  const hasActiveFilter = selectedClient !== 'all' || searchTerm.trim() !== '';

  return (
    <div className="table-card" style={{ marginTop: 0 }}>
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
        <div>
          <h3 style={{ margin: 0 }}>
            <FaListUl style={{ color: '#1565c0' }} />
            ตารางโครงการพัฒนาวิชาการ ({displayData.length}
            {totalCount && totalCount !== displayData.length ? ` จาก ${totalCount}` : ''} โครงการ)
          </h3>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
            คลิกที่แถวโครงการเพื่อดูรายละเอียดการจัดสรรงบประมาณ 5% : 5% : 5% ฉบับเต็ม
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {selectedClient !== 'all' && onClientChange && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                border: '1px solid #1565c0',
                color: '#1565c0',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>ผู้ขอรับบริการ: {selectedClient}</span>
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => onClientChange('all')} />
            </span>
          )}
          <SearchInput
            placeholder="ค้นหาชื่อโครงการ, หัวหน้าโครงการ, ผู้ขอรับบริการ..."
            value={searchTerm}
            onChange={onSearchChange}
            width="240px"
          />
          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                if (onClientChange) onClientChange('all');
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>#</th>
              <th style={{ width: '80px', textAlign: 'center' }}>เดือน</th>
              <th>ชื่อโครงการพัฒนาวิชาการ</th>
              <th>หัวหน้าโครงการ</th>
              <th style={{ textAlign: 'right' }}>งบประมาณรวม (บาท)</th>
              <th>ผู้ขอรับบริการ</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((item, index) => (
              <tr
                key={item.id || index}
                onClick={() => setSelectedRecord(item)}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                <td style={{ textAlign: 'center', padding: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#e3f2fd',
                      color: '#1565c0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      fontWeight: 600,
                      fontSize: '12.5px',
                    }}
                  >
                    {item.month && item.month !== 'nan' ? item.month : '-'}
                  </div>
                </td>
                <td style={{ whiteSpace: 'normal', minWidth: '250px', color: '#0f172a', lineHeight: '1.5', fontWeight: 400 }}>
                  {item.name}
                </td>
                <td style={{ color: '#334155', fontWeight: 400 }}>
                  {item.head && item.head !== 'nan' ? item.head.replace('\n', ' ') : '-'}
                </td>
                <td className="budget-cell">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span>{(Number(item.budget) || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
                    {Number(item.budget) > 0 && (() => {
                      const b = Number(item.budget) || 0;
                      const facP = item.percent_faculty !== undefined && item.percent_faculty !== null ? Number(item.percent_faculty) : 5;
                      const depP = item.percent_dept !== undefined && item.percent_dept !== null ? Number(item.percent_dept) : 5;
                      const kuP = item.percent_ku !== undefined && item.percent_ku !== null ? Number(item.percent_ku) : 5;
                      const totalP = facP + depP + kuP;
                      const fac =
                        item.alloc_faculty !== undefined && item.alloc_faculty !== null && item.alloc_faculty !== ''
                          ? Number(item.alloc_faculty)
                          : (b * facP) / 100;
                      const dep =
                        item.alloc_dept !== undefined && item.alloc_dept !== null && item.alloc_dept !== ''
                          ? Number(item.alloc_dept)
                          : (b * depP) / 100;
                      const ku =
                        item.alloc_ku !== undefined && item.alloc_ku !== null && item.alloc_ku !== ''
                          ? Number(item.alloc_ku)
                          : (b * kuP) / 100;
                      const totalDeduct = fac + dep + ku;
                      return (
                        <span style={{ fontSize: '10.5px', color: '#64748b', fontFamily: "'Kanit', sans-serif", fontWeight: 500 }}>
                          จัดสรร {totalP}% ({totalDeduct.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท)
                        </span>
                      );
                    })()}
                  </div>
                </td>
                <td style={{ color: '#334155', fontWeight: 400 }}>
                  {item.client && item.client !== 'nan' ? item.client.replace('\n', ' ') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RecordDetailDrawer
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        categoryKey="academic"
        record={selectedRecord}
        readOnly={true}
      />
    </div>
  );
}

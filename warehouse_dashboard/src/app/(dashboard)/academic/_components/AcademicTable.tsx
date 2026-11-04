'use client';

import React, { useState } from 'react';
import { FaListUl, FaTimes, FaDownload } from 'react-icons/fa';
import { SearchInput, RecordDetailDrawer, StrategyBadges, DepartmentBadge } from '@/components/ui';
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

  const handleExportCSV = () => {
    const headers = ['ลำดับ', 'เดือน', 'ชื่อโครงการพัฒนาวิชาการ', 'หัวหน้าโครงการ', 'ภาควิชา', 'มูลค่าสัญญารวม (บาท)', 'หักเข้าคณะ/มก. 15% (บาท)', 'ผู้ว่าจ้าง/ลูกค้า'];
    const rows = displayData.map((item, idx) => {
      const b = Number(item.budget) || 0;
      const alloc15 = (b * 15) / 100;
      return [
        idx + 1,
        `"${item.normalizedMonth || item.month || ''}"`,
        `"${String(item.name || '').replace(/"/g, '""')}"`,
        `"${String(item.head || '').replace(/"/g, '""')}"`,
        `"${item.department || ''}"`,
        b,
        alloc15,
        `"${String(item.client || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `academic_development_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-card" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
            <FaListUl style={{ color: '#0ea5e9', marginRight: '8px' }} /> โครงการพัฒนาวิชาการ ({displayData.length}
            {totalCount && totalCount !== displayData.length ? ` / ${totalCount}` : ''})
          </h3>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '8px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              color: '#0369a1',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '8px',
            }}
            title="ส่งออกไฟล์สรุปข้อมูล CSV"
          >
            <FaDownload style={{ fontSize: '11px' }} /> Export CSV
          </button>
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
                border: '1px solid #0284c7',
                color: '#0284c7',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>ลูกค้า: {selectedClient}</span>
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => onClientChange('all')} />
            </span>
          )}
          <SearchInput
            placeholder="ค้นหาชื่อโครงการ, หัวหน้า, ลูกค้า..."
            value={searchTerm}
            onChange={onSearchChange}
            width="240px"
            style={{ padding: '6px 10px' }}
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
                cursor: 'pointer',
              }}
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table className="data-table table-sky" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f9ff', color: '#0369a1', textAlign: 'left' }}>
              <th style={{ width: '44px', textAlign: 'center', padding: '10px 8px', backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>#</th>
              <th style={{ width: '70px', textAlign: 'center', padding: '10px 8px', backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>เดือน</th>
              <th style={{ padding: '10px 8px', backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>ชื่อโครงการพัฒนาวิชาการ</th>
              <th style={{ padding: '10px 8px', backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>หัวหน้าโครงการ</th>
              <th style={{ width: '100px', textAlign: 'left', padding: '10px 8px', backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>ภาควิชา</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>มูลค่าสัญญา (บาท)</th>
              <th style={{ padding: '10px 8px', backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>ผู้ว่าจ้าง / ลูกค้า</th>
              <th style={{ width: '120px', padding: '10px 8px', backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>ยุทธศาสตร์</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((item, index) => {
              const b = Number(item.budget) || 0;
              const alloc15 = (b * 15) / 100;
              const displayMonth = item.normalizedMonth || item.month || '-';

              return (
                <tr
                  key={`academic-row-${index}-${item.dbId ?? item._id ?? item.id ?? "item"}`}
                  onClick={() => setSelectedRecord(item)}
                  style={{ cursor: 'pointer', borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.1s ease' }}
                  className="hover:bg-slate-50/70"
                >
                  <td style={{ textAlign: 'center', color: '#64748b', padding: '10px 8px' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#f0f9ff',
                        color: '#0284c7',
                        fontWeight: 600,
                        fontSize: '11.5px',
                        border: '1px solid #bae6fd',
                      }}
                    >
                      {displayMonth}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'normal', minWidth: '240px', color: '#0f172a', fontWeight: 500, padding: '10px 8px' }}>
                    {item.name}
                  </td>
                  <td style={{ color: '#334155', fontWeight: 400, padding: '10px 8px' }}>
                    {item.head && item.head !== 'nan' ? (
                      item.head_id ? (
                        <a
                          href={`/personnel/${item.head_id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}
                          title="คลิกเพื่อดูแฟ้มผลงานอาจารย์"
                        >
                          {String(item.head).replace('\n', ' ')}
                        </a>
                      ) : (
                        String(item.head).replace('\n', ' ')
                      )
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={{ width: '100px', textAlign: 'left', padding: '10px 8px' }}>
                    <DepartmentBadge value={item.department} />
                  </td>
                  <td className="budget-cell" style={{ textAlign: 'right', padding: '10px 8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{b.toLocaleString('th-TH')} ฿</span>
                      {b > 0 && (
                        <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: 500 }}>
                          จัดสรร 15%: {alloc15.toLocaleString('th-TH', { maximumFractionDigits: 0 })} ฿
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: '#334155', fontSize: '12.5px', padding: '10px 8px' }}>
                    {item.client && item.client !== 'nan' ? (
                      String(item.client).replace('\n', ' ')
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>ไม่ระบุ</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <StrategyBadges
                      item={item}
                      category="academic"
                      sdgs={item.sdg_code ? [Number(item.sdg_code)] : []}
                      isee={item.isee}
                      iam={item.iam}
                    />
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
        categoryKey="academic"
        record={selectedRecord}
        readOnly={true}
      />
    </div>
  );
}

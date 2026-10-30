'use client';

import React, { useState } from 'react';
import { FaTable, FaTimes } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, DepartmentSelect, RecordDetailDrawer } from '@/components/ui';
import { calculateProjectTimeline } from '@/lib/projectMonitoringEngine';
import { ResearchItem } from '../_hooks/useResearchData';

interface ResearchTableProps {
  filteredData: ResearchItem[];
  uniqueDepts: Set<string>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDept: string;
  onDeptChange: (value: string) => void;
  selectedFund?: string;
  onFundChange?: (value: string) => void;
}

export function ResearchTable({
  filteredData,
  uniqueDepts: _uniqueDepts,
  searchTerm,
  onSearchChange,
  selectedDept,
  onDeptChange,
  selectedFund = 'all',
  onFundChange,
}: ResearchTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<ResearchItem | null>(null);

  const hasActiveFilter = selectedDept !== 'all' || selectedFund !== 'all' || searchTerm.trim() !== '';

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
          <FaTable style={{ color: '#00A651', marginRight: '8px' }} /> โครงการวิจัย ({filteredData.length})
        </h3>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {selectedFund !== 'all' && onFundChange && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: '#f0fbf5',
                border: '1px solid #00A651',
                color: '#006838',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>แหล่งทุน: {selectedFund}</span>
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => onFundChange('all')} />
            </span>
          )}
          <SearchInput
            placeholder="ค้นหาชื่อโครงการ, หัวหน้าโครงการ..."
            value={searchTerm}
            onChange={onSearchChange}
            width="220px"
            style={{ padding: '6px 10px' }}
          />
          <DepartmentSelect
            value={selectedDept}
            onChange={onDeptChange}
            allowAll
            allLabel="ทุกภาควิชา"
            allValue="all"
            size="sm"
            className="w-[180px]"
          />
          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onDeptChange('all');
                if (onFundChange) onFundChange('all');
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
              <th style={{ width: '90px' }}>รหัสโครงการ</th>
              <th>ชื่อโครงการวิจัย</th>
              <th>หัวหน้าโครงการ</th>
              <th style={{ width: '100px', textAlign: 'left' }}>ภาควิชา</th>
              <th style={{ width: '120px', textAlign: 'center' }}>สถานะโครงการ</th>
              <th style={{ textAlign: 'right' }}>งบภายใน / ภายนอก</th>
              <th style={{ textAlign: 'right' }}>งบประมาณรวม</th>
              <th>แหล่งทุน</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => {
              const internal = typeof item.budget_internal === 'number' ? item.budget_internal : Number(item.budget_internal) || 0;
              const external = typeof item.budget_external === 'number' ? item.budget_external : Number(item.budget_external) || 0;
              const totalBudget = internal + external;
              const tl = calculateProjectTimeline(item);
              const statusBadge = (() => {
                if (tl.status === 'delayed') {
                  return { label: 'เกินกำหนดสัญญา', bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' };
                }
                if (tl.status === 'extended') {
                  return { label: 'ขยายเวลาสัญญา', bg: '#fefce8', text: '#ca8a04', border: '#fde047' };
                }
                if (tl.status === 'evaluated' || tl.status === 'completed') {
                  return { label: 'เสร็จสิ้น/ส่งมอบ', bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
                }
                return { label: 'กำลังดำเนินการ', bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' };
              })();

              return (
                <tr
                  key={`research-row-${index}-${item.dbId ?? item._id ?? item.id ?? "item"}`}
                  onClick={() => setSelectedRecord(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontSize: '11.5px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {item.id && item.id !== 'nan' ? item.id : '-'}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'normal', minWidth: '260px', fontWeight: 400, color: '#0f172a' }}>
                    {item.name}
                  </td>
                  <td style={{ fontWeight: 400, color: '#334155' }}>
                    {item.head && item.head !== 'nan' ? (
                      item.head_id ? (
                        <a
                          href={`/personnel/${item.head_id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: '#00A651', fontWeight: 600, textDecoration: 'none' }}
                          title="คลิกเพื่อดูแฟ้มผลงานอาจารย์"
                        >
                          {item.head}
                        </a>
                      ) : (
                        item.head
                      )
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={{ width: '100px', textAlign: 'left', padding: '8px 10px' }}>
                    <DepartmentBadge value={item.department} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: statusBadge.bg,
                        color: statusBadge.text,
                        border: `1px solid ${statusBadge.border}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {statusBadge.label}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontSize: '11.5px', color: '#475569', whiteSpace: 'nowrap' }}>
                    {internal > 0 ? `ภายใน: ${internal.toLocaleString('th-TH')}` : ''}
                    {internal > 0 && external > 0 ? ' / ' : ''}
                    {external > 0 ? `ภายนอก: ${external.toLocaleString('th-TH')}` : ''}
                    {internal === 0 && external === 0 ? '-' : ''}
                  </td>
                  <td className="budget-cell">
                    {totalBudget > 0 ? `${totalBudget.toLocaleString('th-TH')} บาท` : '-'}
                  </td>
                  <td style={{ color: '#475569' }}>
                    {item.fund_source && item.fund_source !== 'nan' ? item.fund_source : '-'}
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
        categoryKey="research"
        record={selectedRecord}
        readOnly={true}
      />
    </div>
  );
}

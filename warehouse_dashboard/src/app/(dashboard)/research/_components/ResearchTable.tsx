'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { resolvePersonnelHref } from '@/lib/personnelService';
import { FaTable, FaTimes, FaDownload } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, RecordDetailDrawer, StrategyBadges } from '@/components/ui';
import { dashboardCardStyle } from '@/lib/dashboardTheme';
import { calculateProjectTimeline } from '@/lib/projectMonitoringEngine';
import { ResearchItem, normalizeFundSource } from '../_hooks/useResearchData';

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

  const handleExportCSV = () => {
    const headers = ['รหัสโครงการ', 'ชื่อโครงการวิจัย', 'หัวหน้าโครงการ', 'สังกัด', 'สถานะ', 'งบภายใน', 'งบภายนอก', 'งบรวม', 'แหล่งทุน'];
    const rows = filteredData.map((item) => {
      const internal = Number(item.budget_internal) || 0;
      const external = Number(item.budget_external) || 0;
      const tl = calculateProjectTimeline(item);
      return [
        `"${item.id || ''}"`,
        `"${String(item.name || '').replace(/"/g, '""')}"`,
        `"${String(item.head || '').replace(/"/g, '""')}"`,
        `"${item.department || ''}"`,
        `"${tl.status}"`,
        internal,
        external,
        internal + external,
        `"${String(item.fund_source || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `research_projects_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-card" style={{ ...dashboardCardStyle, padding: '20px' }}>
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
            <FaTable style={{ color: '#00A651', marginRight: '8px' }} /> โครงการวิจัย ({filteredData.length})
          </h3>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '8px',
            }}
            title="ส่งออกไฟล์สรุปข้อมูล CSV"
          >
            <FaDownload style={{ fontSize: '11px' }} /> ส่งออก CSV
          </button>
        </div>

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
                border: '1px solid #10b981',
                color: '#047857',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>แหล่งทุน: {selectedFund}</span>
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => onFundChange('all')} />
            </span>
          )}
          <SearchInput
            placeholder="ค้นหาชื่อโครงการ, หัวหน้า..."
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
                if (onFundChange) onFundChange('all');
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
        <table className="data-table table-manage" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#00A651', color: '#ffffff', textAlign: 'left' }}>
              <th style={{ width: '44px', textAlign: 'center', padding: '10px 8px', backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>#</th>
              <th style={{ padding: '10px 8px', backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>ชื่อโครงการวิจัย</th>
              <th style={{ padding: '10px 8px', backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>หัวหน้าโครงการ</th>
              <th style={{ width: '100px', textAlign: 'left', padding: '10px 8px', backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>สังกัด</th>
              <th style={{ width: '110px', textAlign: 'center', padding: '10px 8px', backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>สถานะ</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>งบภายใน / ภายนอก</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>งบประมาณรวม</th>
              <th style={{ padding: '10px 8px', backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>แหล่งทุน</th>
              <th style={{ width: '120px', padding: '10px 8px', backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>ยุทธศาสตร์</th>
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
                  style={{ cursor: 'pointer', borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.1s ease' }}
                  className="hover:bg-slate-50/70"
                >
                  <td style={{ textAlign: 'center', color: '#64748b', padding: '10px 8px' }}>{index + 1}</td>
                  <td style={{ whiteSpace: 'normal', minWidth: '260px', fontWeight: 500, color: '#0f172a', padding: '10px 8px' }}>
                    {item.name}
                  </td>
                  <td style={{ fontWeight: 400, color: '#334155', padding: '10px 8px' }}>
                    {item.head && item.head !== 'nan' ? (() => {
                      const personHref = resolvePersonnelHref(item.head_id, item.head);
                      return personHref ? (
                        <Link
                          href={personHref}
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none' }}
                          title="คลิกเพื่อดูแฟ้มผลงานอาจารย์"
                        >
                          {item.head}
                        </Link>
                      ) : (
                        item.head
                      );
                    })() : (
                      '-'
                    )}
                  </td>
                  <td style={{ width: '100px', textAlign: 'left', padding: '10px 8px' }}>
                    <DepartmentBadge value={item.department} />
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 8px' }}>
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
                  <td style={{ textAlign: 'right', fontSize: '11.5px', color: '#475569', whiteSpace: 'nowrap', padding: '10px 8px' }}>
                    {internal > 0 ? `ใน: ${internal.toLocaleString('th-TH')}` : ''}
                    {internal > 0 && external > 0 ? ' / ' : ''}
                    {external > 0 ? `นอก: ${external.toLocaleString('th-TH')}` : ''}
                    {internal === 0 && external === 0 ? '-' : ''}
                  </td>
                  <td className="budget-cell" style={{ textAlign: 'right', fontWeight: 600, color: '#0f172a', padding: '10px 8px' }}>
                    {totalBudget > 0 ? `${totalBudget.toLocaleString('th-TH')} ฿` : '-'}
                  </td>
                  <td style={{ color: '#475569', fontSize: '12px', padding: '10px 8px' }}>
                    {normalizeFundSource(item.fund_source)}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <StrategyBadges
                      item={item}
                      category="research"
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
        categoryKey="research"
        record={selectedRecord}
        readOnly={true}
      />
    </div>
  );
}

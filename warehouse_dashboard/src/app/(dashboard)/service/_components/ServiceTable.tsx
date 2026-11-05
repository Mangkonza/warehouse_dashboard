'use client';

import React, { useState } from 'react';
import { FaTable, FaTimes, FaFileExcel } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, RecordDetailDrawer, StrategyBadges } from '@/components/ui';
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

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = [
      'ลำดับ',
      'วัน/เดือน/ปี',
      'ปีงบประมาณ',
      'ชื่องานบริการวิชาการ',
      'ลักษณะบทบาทงาน',
      'ผู้ให้บริการ',
      'สังกัด',
      'กลุ่มเป้าหมายผู้รับบริการ',
      'ชั่วโมงสะสม',
      'SDGs',
      'ISEE',
      'IAM',
    ];

    const rows = filteredData.map((d, i) => [
      i + 1,
      d.date || 'ไม่ระบุวันที่',
      d._fiscalYear || '2568',
      `"${String(d.name || d.topic_title || '').replace(/"/g, '""')}"`,
      `"${String(d._smartRole || d.service_type || '').replace(/"/g, '""')}"`,
      `"${String(d.person || '').replace(/"/g, '""')}"`,
      `"${String(d.department || '').replace(/"/g, '""')}"`,
      `"${String(d.target_group || '').replace(/"/g, '""')}"`,
      d.hours_spent || 0,
      `"${(d.sdg_ids || d.evaluation?.sdg_ids || []).join(', ')}"`,
      `"${d.isee_pillar || d.evaluation?.isee_pillar || 'S'}"`,
      `"${d.iam_value || d.i_type || d.evaluation?.i_type || 'M'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `KU_Academic_Services_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDisplayDate = (d?: string) => {
    if (!d || d === '-' || d === 'nan') return <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '11px' }}>ไม่ระบุวันที่ (ปีงบ 2568)</span>;
    // Format if yyyy-mm-dd
    if (d.includes('-') && d.length >= 10) {
      const parts = d.slice(0, 10).split('-');
      let year = parseInt(parts[0], 10);
      if (year < 2000) year += 543; // Correct 1968 -> 2511? Or if 1968, it's 2568 BE
      if (year === 1968) year = 2568;
      if (year === 1969) year = 2569;
      if (year < 2400) year += 543;
      return `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}/${year}`;
    }
    return d;
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
            <FaTable style={{ color: '#f59e0b', marginRight: '8px' }} /> ทะเบียนคุมงานบริการวิชาการ ({filteredData.length}
            {totalCount && totalCount !== filteredData.length ? ` / ${totalCount}` : ''})
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="ส่งออกรายงานในรูปแบบ CSV / Excel"
          >
            <FaFileExcel style={{ color: '#059669' }} />
            <span>ส่งออก Excel</span>
          </button>

          {selectedType !== 'all' && onTypeChange && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fed7aa',
                color: '#b45309',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>บทบาท: {selectedType}</span>
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => onTypeChange('all')} />
            </span>
          )}

          <SearchInput
            placeholder="ค้นหาเรื่อง, ชื่อบุคลากร, ผู้รับบริการ..."
            value={searchTerm}
            onChange={onSearchChange}
            width="240px"
          />


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
                border: '1px solid #fed7aa',
                backgroundColor: '#fffbeb',
                color: '#b45309',
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

      <div className="table-scroll" style={{ maxHeight: '480px' }}>
        <table className="table-manage">
          <thead>
            <tr>
              <th style={{ width: '44px', textAlign: 'center' }}>#</th>
              <th style={{ width: '115px', textAlign: 'center' }}>วัน/เดือน/ปี</th>
              <th>เรื่อง / กิจกรรม</th>
              <th style={{ width: '160px', textAlign: 'center' }}>ลักษณะบทบาทงาน</th>
              <th>ชื่อ - นามสกุล ผู้ให้บริการ</th>
              <th style={{ width: '110px', textAlign: 'left' }}>สังกัด</th>
              <th>กลุ่มเป้าหมายผู้รับบริการ</th>
              <th style={{ width: '160px', textAlign: 'center' }}>ยุทธศาสตร์ (ISEE / IAM / SDGs)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => {
              const roleVal = item._smartRole || item.service_type || 'งานบริการวิชาการอื่นๆ';
              const rawSdgs = item.sdg_ids || item.evaluation?.sdg_ids;
              const iseeVal = item.isee_pillar || item.evaluation?.isee_pillar || 'S';
              const iamVal = item.iam_value || item.i_type || item.evaluation?.i_type || 'M';

              return (
                <tr
                  key={`service-row-${index}-${item.dbId ?? item._id ?? item.id ?? 'item'}`}
                  onClick={() => setSelectedRecord(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap', color: '#475569' }}>
                    {formatDisplayDate(item.date)}
                  </td>
                  <td style={{ whiteSpace: 'normal', minWidth: '240px', fontWeight: 500, color: '#0f172a' }}>
                    {item.name || item.topic_title}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fed7aa',
                        color: '#b45309',
                        fontSize: '11.5px',
                        fontWeight: 600,
                      }}
                    >
                      {roleVal}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500, color: '#334155' }}>
                    {item.person && item.person !== 'nan' ? (
                      item.person_id ? (
                        <a
                          href={`/personnel/${item.person_id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: '#d97706', fontWeight: 600, textDecoration: 'none' }}
                          title="คลิกเพื่อดูแฟ้มผลงานบุคลากร"
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
                  <td style={{ textAlign: 'center' }}>
                    <StrategyBadges
                      item={item}
                      category="service"
                      sdgs={rawSdgs}
                      isee={iseeVal}
                      iam={iamVal}
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
        categoryKey="service"
        record={selectedRecord}
        readOnly={true}
      />
    </div>
  );
}

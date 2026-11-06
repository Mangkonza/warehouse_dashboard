'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaTable, FaFileExcel, FaTimes, FaHourglassHalf } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, RecordDetailDrawer, IPTypeBadge, StrategyBadges } from '@/components/ui';
import { IPItem } from '../_hooks/useIPData';

interface IPTableProps {
  filteredIpData: IPItem[];
  totalCount?: number;
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
  searchTerm,
  onSearchChange,
  deptFilter,
  onDeptChange,
  typeFilter = 'all',
  onTypeChange,
}: IPTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<IPItem | null>(null);

  const hasActiveFilter = deptFilter !== 'all' || typeFilter !== 'all' || searchTerm.trim() !== '';

  const handleExportCSV = () => {
    if (filteredIpData.length === 0) return;
    const headers = [
      'ลำดับ',
      'ชื่อผลงานการประดิษฐ์',
      'ผู้ประดิษฐ์หลัก',
      'สังกัด',
      'ประเภท',
      'เลขที่คำขอ',
      'เลขทะเบียน',
      'สถานะ',
      'เงินสนับสนุนจากคณะ (บาท)',
      'กลุ่มเทคโนโลยี',
      'SDGs',
      'ISEE',
      'IAM',
    ];

    const rows = filteredIpData.map((d, i) => [
      i + 1,
      `"${String(d.title || d.name || '').replace(/"/g, '""')}"`,
      `"${String(d.creator || '').replace(/"/g, '""')}"`,
      `"${String(d.department || '').replace(/"/g, '""')}"`,
      `"${String(d.type || 'อนุสิทธิบัตร').replace(/"/g, '""')}"`,
      `"${String(d.application_number || '-').replace(/"/g, '""')}"`,
      `"${String(d.registration_number || '-').replace(/"/g, '""')}"`,
      `"${d._pipelineStage === 'granted' ? 'ได้รับความคุ้มครองแล้ว' : d._pipelineStage === 'pending' ? 'ยื่นคำขอแล้ว' : 'เตรียมความพร้อมยื่นจด'}"`,
      Number(d.support_amount) || 0,
      `"${String(d._techCluster || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(d.sdg_ids) ? d.sdg_ids : Array.isArray(d.evaluation?.sdg_ids) ? d.evaluation.sdg_ids : [9]).join(', ')}"`,
      '"I"',
      '"A"',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `KU_Intellectual_Property_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
            <FaTable style={{ color: '#8b5cf6' }} /> ทะเบียนคุมงานทรัพย์สินทางปัญญา
            <span
              style={{
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#f5f3ff',
                color: '#6d28d9',
                border: '1px solid #ddd6fe',
                fontWeight: 600,
              }}
            >
              {filteredIpData.length}
              {totalCount && totalCount !== filteredIpData.length ? ` / ${totalCount}` : ''} รายการ
            </span>
          </h3>
        </div>

        {/* Search, Dept Filter, and Action Buttons */}
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

          {typeFilter !== 'all' && onTypeChange && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: '#f5f3ff',
                border: '1px solid #8b5cf6',
                color: '#6d28d9',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>ประเภท: {typeFilter}</span>
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => onTypeChange('all')} />
            </span>
          )}

          <SearchInput
            placeholder="ค้นหาชื่อเรื่อง / ผู้ประดิษฐ์ / เลขคำขอ..."
            value={searchTerm}
            onChange={onSearchChange}
            width="230px"
          />


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
                border: '1px solid #ddd6fe',
                backgroundColor: '#f5f3ff',
                color: '#6d28d9',
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
              <th style={{ width: '45px', textAlign: 'center' }}>#</th>
              <th style={{ minWidth: '220px' }}>ชื่อผลงานการประดิษฐ์</th>
              <th>ผู้ประดิษฐ์หลัก</th>
              <th style={{ width: '130px', textAlign: 'left' }}>สังกัด</th>
              <th style={{ textAlign: 'center', width: '110px' }}>ประเภท</th>
              <th style={{ minWidth: '150px' }}>เลขที่คำขอ / เลขทะเบียน</th>
              <th style={{ textAlign: 'center', width: '150px' }}>สถานะการคุ้มครอง</th>
              <th style={{ textAlign: 'right', width: '130px' }}>เงินสนับสนุน (บาท)</th>
              <th style={{ textAlign: 'center', width: '150px' }}>ยุทธศาสตร์ (ISEE / IAM / SDGs)</th>
            </tr>
          </thead>
          <tbody>
            {filteredIpData.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
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

                const stage = item._pipelineStage || 'in_prep';
                const isProtected = stage === 'granted';
                const isPending = stage === 'pending';

                const badgeBg = isProtected ? '#ecfdf5' : isPending ? '#f0f9ff' : '#fffbeb';
                const badgeColor = isProtected ? '#047857' : isPending ? '#0369a1' : '#b45309';
                const badgeBorder = isProtected ? '#a7f3d0' : isPending ? '#bae6fd' : '#fed7aa';
                const statusLabel = isProtected
                  ? 'ได้รับความคุ้มครองแล้ว'
                  : isPending
                  ? 'ยื่นคำขอแล้ว'
                  : 'เตรียมความพร้อมยื่นจด';

                const rawSdgs = item.sdg_ids || item.evaluation?.sdg_ids || [9];
                const hasAppNo = Boolean(
                  (item.application_number && item.application_number !== '-' && item.application_number !== 'nan') ||
                  (item.registration_number && item.registration_number !== '-' && item.registration_number !== 'nan') ||
                  (item.req_no && item.req_no !== '-' && item.req_no !== 'nan')
                );

                return (
                  <tr
                    key={`ip-row-${index}-${item.dbId ?? item._id ?? item.id ?? 'item'}`}
                    onClick={() => setSelectedRecord(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                    <td style={{ whiteSpace: 'normal', minWidth: '220px', fontWeight: 500, color: '#0f172a' }}>
                      {item.title || item.name}
                    </td>
                    <td style={{ fontWeight: 500, color: '#334155' }}>
                      {item.creator && item.creator !== 'nan' ? (
                        item.person_id ? (
                          <Link
                            href={`/personnel/${item.person_id}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}
                            title="คลิกเพื่อดูแฟ้มผลงานอาจารย์"
                          >
                            {item.creator}
                          </Link>
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
                    <td>
                      {hasAppNo ? (
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#334155' }}>
                          {item.req_no && item.req_no !== 'nan'
                            ? item.req_no
                            : item.application_number
                            ? item.registration_number
                              ? `${item.application_number} / ${item.registration_number}`
                              : item.application_number
                            : item.registration_number}
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#64748b',
                            fontSize: '11px',
                            fontWeight: 500,
                          }}
                        >
                          <FaHourglassHalf style={{ fontSize: '9px', color: '#94a3b8' }} />
                          <span>รอหมายเลขคำขอ</span>
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          backgroundColor: badgeBg,
                          color: badgeColor,
                          border: `1px solid ${badgeBorder}`,
                        }}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: supportVal > 0 ? '#047857' : '#94a3b8' }}>
                      {supportVal > 0 ? `${supportVal.toLocaleString('th-TH')} ฿` : '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <StrategyBadges
                      item={item}
                      category="ip"
                        sdgs={rawSdgs}
                        isee="I"
                        iam="A"
                      />
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

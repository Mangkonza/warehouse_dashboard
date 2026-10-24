'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaTable, FaFilter, FaPlus, FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, DepartmentSelect, ConfirmActionModal, RecordDetailDrawer } from '@/components/ui';
import { deleteCategoryRecord } from '@/lib/dataService';
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
  const [deleteTarget, setDeleteTarget] = useState<IPItem | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<IPItem | null>(null);
  const [, setIsDeleting] = useState(false);

  const hasActiveFilter = deptFilter !== 'all' || typeFilter !== 'all' || searchTerm.trim() !== '';

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const targetId = deleteTarget._id || deleteTarget.id || deleteTarget.name;
      if (targetId) {
        await deleteCategoryRecord('ip', String(targetId));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('ku_data_updated'));
        }
      }
    } catch (err) {
      console.error('Failed to delete IP:', err);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
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
              {totalCount && totalCount !== filteredIpData.length ? ` จาก ${totalCount}` : ''} รายการ
            </span>
          </h3>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
            คลิกที่แถวรายการเพื่อดูรายละเอียดผู้ประดิษฐ์และเลขทะเบียนฉบับเต็ม
          </span>
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
            placeholder="ค้นหาชื่อเรื่อง / ผู้ประดิษฐ์ / เลขที่คำขอ..."
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

          <Link
            href="/ip/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: '#00A651',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
              transition: 'background-color 0.2s ease',
            }}
          >
            <FaPlus style={{ fontSize: '11px' }} />
            <span>เพิ่มงานทรัพย์สินทางปัญญา</span>
          </Link>
        </div>
      </div>

      <div className="table-scroll">
        <table className="glass-table">
          <thead>
            <tr>
              <th style={{ width: '45px', textAlign: 'center' }}>#</th>
              <th style={{ minWidth: '220px' }}>ชื่อเรื่อง</th>
              <th>ผู้ประดิษฐ์</th>
              <th style={{ width: '120px', textAlign: 'left' }}>ภาควิชา</th>
              <th style={{ textAlign: 'center' }}>ประเภท</th>
              <th>เลขที่คำขอ / เลขที่</th>
              <th style={{ textAlign: 'center' }}>สถานะ</th>
              <th style={{ textAlign: 'right' }}>คณะฯ สนับสนุน</th>
              <th style={{ width: '85px', textAlign: 'center' }}>จัดการ</th>
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
                const itemId = encodeURIComponent(String(item._id || item.id || item.name || index));
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
                      {item.creator && item.creator !== 'nan' ? item.creator : '-'}
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
                      {item.type && item.type !== 'nan' && item.type !== '-' ? (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            backgroundColor: '#faf5ff',
                            color: '#6a1b9a',
                            border: '1px solid #e9d5ff',
                          }}
                        >
                          {item.type === 'P' ? 'สิทธิบัตร' : item.type}
                        </span>
                      ) : (
                        '-'
                      )}
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
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        <Link
                          href={`/ip/${itemId}/edit`}
                          style={{
                            color: '#00A651',
                            padding: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          title="แก้ไขข้อมูล"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          title="ลบข้อมูล"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmActionModal
        isOpen={Boolean(deleteTarget)}
        type="danger"
        title="ยืนยันการลบรายการ?"
        message={`คุณต้องการลบข้อมูลทรัพย์สินทางปัญญา "${deleteTarget?.title || deleteTarget?.name || ''}" ใช่หรือไม่?`}
        detail="การดำเนินการนี้จะไม่สามารถย้อนกลับได้"
        confirmText="ยืนยันการลบ"
        cancelText="ยกเลิก"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

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

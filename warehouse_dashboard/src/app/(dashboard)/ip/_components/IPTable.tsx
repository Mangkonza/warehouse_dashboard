'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaTable, FaFilter, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, DepartmentSelect, ConfirmActionModal } from '@/components/ui';
import { deleteCategoryRecord } from '@/lib/dataService';
import { IPItem } from '../_hooks/useIPData';

interface IPTableProps {
  filteredIpData: IPItem[];
  availableDepts: string[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  deptFilter: string;
  onDeptChange: (value: string) => void;
}

export function IPTable({
  filteredIpData,
  availableDepts,
  searchTerm,
  onSearchChange,
  deptFilter,
  onDeptChange,
}: IPTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<IPItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaTable style={{ color: '#006838' }} /> รายการงานทรัพย์สินทางปัญญา
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0,104,56,0.1)',
              color: '#006838',
              fontWeight: 600,
            }}
          >
            {filteredIpData.length} รายการ
          </span>
        </h3>

        {/* Search, Dept Filter, and Add Button */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchInput
            placeholder="ค้นหาชื่อเรื่อง / ผู้ประดิษฐ์..."
            value={searchTerm}
            onChange={onSearchChange}
            width="100%"
            style={{
              minWidth: '220px',
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.12)',
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(6px)',
            }}
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
                className="w-[180px]"
              />
            </div>
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
              <th style={{ width: '100px', minWidth: '100px', maxWidth: '100px', textAlign: 'left', verticalAlign: 'middle' }}>สังกัด</th>
              <th style={{ textAlign: 'center' }}>ประเภท</th>
              <th>เลขที่คำขอ / เลขที่</th>
              <th style={{ textAlign: 'right' }}>คณะฯ สนับสนุน</th>
              <th style={{ width: '85px', textAlign: 'center' }}>จัดการ</th>
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
                const itemId = encodeURIComponent(String(item._id || item.id || item.name || index));
                const supportVal = item.support_amount !== undefined && item.support_amount !== null ? Number(item.support_amount) : 0;

                return (
                  <tr key={item.id || item._id || index}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ whiteSpace: 'normal', minWidth: '220px', fontWeight: 500 }}>
                      {item.title || item.name}
                    </td>
                    <td>{item.creator && item.creator !== 'nan' ? item.creator : '-'}</td>
                    <td style={{ width: '100px', minWidth: '100px', maxWidth: '100px', textAlign: 'left', verticalAlign: 'middle', padding: '8px 10px' }}>
                      <DepartmentBadge value={item.department} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {item.type && item.type !== 'nan' && item.type !== '-' ? (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: 'rgba(216, 27, 96, 0.1)',
                            color: '#d81b60',
                          }}
                        >
                          {item.type === 'P' ? 'สิทธิบัตร' : item.type}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {item.req_no && item.req_no !== 'nan'
                        ? item.req_no
                        : item.application_number
                        ? (item.registration_number ? `${item.application_number} / ${item.registration_number}` : item.application_number)
                        : (item.registration_number || '-')}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: '#059669', fontSize: '13px' }}>
                      {supportVal > 0 ? `${supportVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท` : '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
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
    </div>
  );
}

'use client';

import React from 'react';
import { FaTable, FaSearch, FaFilter } from 'react-icons/fa';
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

        {/* Search and Dept Filter Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <FaSearch
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '12px',
              }}
            />
            <input
              type="text"
              placeholder="ค้นหาชื่อเรื่อง / ผู้ประดิษฐ์..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                padding: '7px 12px 7px 30px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.12)',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(6px)',
                width: '100%',
              }}
            />
          </div>

          {availableDepts.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FaFilter style={{ color: '#64748b', fontSize: '12px' }} />
              <select
                value={deptFilter}
                onChange={(e) => onDeptChange(e.target.value)}
                style={{
                  padding: '7px 12px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <option value="all">ทุกภาควิชา</option>
                {availableDepts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="table-scroll">
        <table className="glass-table">
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>#</th>
              <th style={{ minWidth: '220px' }}>เรื่อง</th>
              <th>ผู้ประดิษฐ์</th>
              <th>ภาควิชา</th>
              <th style={{ textAlign: 'center' }}>ประเภท</th>
              <th>เลขที่คำขอ/วันที่ยื่น</th>
              <th>สถานะ/วันหมดอายุ</th>
            </tr>
          </thead>
          <tbody>
            {filteredIpData.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                </td>
              </tr>
            ) : (
              filteredIpData.map((item, index) => (
                <tr key={item.id || index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ whiteSpace: 'normal', minWidth: '200px', fontWeight: 500 }}>{item.name}</td>
                  <td>{item.creator && item.creator !== 'nan' ? item.creator : '-'}</td>
                  <td>{item.department && item.department !== 'nan' ? item.department : '-'}</td>
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
                  <td>{item.req_no && item.req_no !== 'nan' ? item.req_no.substring(0, 10) : '-'}</td>
                  <td>{item.status && item.status !== 'nan' ? item.status : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

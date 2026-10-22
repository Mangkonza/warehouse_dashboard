'use client';

import React from 'react';
import { FaTable, FaSearch } from 'react-icons/fa';
import { PublicationItem } from '../_hooks/usePublicationsData';

interface PublicationsTableProps {
  filteredData: PublicationItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  levelFilter: string;
  onLevelChange: (value: string) => void;
}

export function PublicationsTable({
  filteredData,
  searchTerm,
  onSearchChange,
  levelFilter,
  onLevelChange,
}: PublicationsTableProps) {
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
          <FaTable style={{ color: '#00914d', marginRight: '8px' }} /> รายละเอียดผลงานตีพิมพ์ทางวิชาการ ({filteredData.length} เรื่อง)
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '13px',
            }}
          >
            <FaSearch style={{ color: '#94a3b8', marginRight: '6px' }} />
            <input
              type="text"
              placeholder="ค้นหาชื่อเรื่อง, ผู้ประพันธ์..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '12.5px', width: '160px', fontFamily: 'inherit' }}
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => onLevelChange(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '12.5px',
              fontFamily: 'inherit',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="all">ทุกระดับวารสาร</option>
            <option value="Q1">Scopus Q1</option>
            <option value="Q2">Scopus Q2</option>
            <option value="TCI">ระดับ TCI</option>
          </select>
        </div>
      </div>

      <div className="table-scroll" style={{ maxHeight: '380px' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              <th>ชื่อผลงาน</th>
              <th>เจ้าของผลงาน</th>
              <th>ภาควิชา</th>
              <th>ประเภท</th>
              <th>ระดับ</th>
              <th style={{ textAlign: 'right' }}>เงินสนับสนุน</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id || index}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td style={{ whiteSpace: 'normal', minWidth: '300px' }}>{item.name}</td>
                <td>{item.owner && item.owner !== 'nan' ? item.owner : '-'}</td>
                <td>{item.department && item.department !== 'nan' ? item.department : '-'}</td>
                <td>{item.type && item.type !== 'nan' ? item.type : '-'}</td>
                <td>
                  <span className={`badge ${String(item.level).includes('Q1') ? 'badge-q1' : 'badge-q2'}`}>
                    {item.level && item.level !== 'nan' ? item.level : '-'}
                  </span>
                </td>
                <td className="budget-cell">{(item.budget || 0).toLocaleString()} ฿</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

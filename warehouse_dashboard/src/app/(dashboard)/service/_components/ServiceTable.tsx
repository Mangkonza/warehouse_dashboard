'use client';

import React from 'react';
import { FaTable, FaSearch } from 'react-icons/fa';
import { ServiceItem } from '../_hooks/useServiceData';

interface ServiceTableProps {
  filteredData: ServiceItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ServiceTable({ filteredData, searchTerm, onSearchChange }: ServiceTableProps) {
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
          <FaTable style={{ color: '#00914d', marginRight: '8px' }} /> รายละเอียดงานบริการวิชาการ ({filteredData.length} กิจกรรม)
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '13px',
          }}
        >
          <FaSearch style={{ color: '#94a3b8', marginRight: '6px' }} />
          <input
            type="text"
            placeholder="ค้นหาชื่อกิจกรรม, ผู้จัด..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '12.5px', width: '200px', fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <div className="table-scroll" style={{ maxHeight: '400px' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              <th style={{ width: '100px' }}>วันที่</th>
              <th>ชื่อกิจกรรม / เรื่อง</th>
              <th>อาจารย์/ผู้รับผิดชอบ</th>
              <th>กลุ่มเป้าหมาย</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id || index}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td>{item.date && item.date !== 'nan' ? String(item.date).substring(0, 10) : '-'}</td>
                <td style={{ whiteSpace: 'normal', minWidth: '250px' }}>{item.name}</td>
                <td>{item.person && item.person !== 'nan' ? item.person : '-'}</td>
                <td>{item.target_group && item.target_group !== 'nan' ? item.target_group : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

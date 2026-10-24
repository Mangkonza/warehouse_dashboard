'use client';

import React from 'react';
import { FaTable } from 'react-icons/fa';
import { SearchInput } from '@/components/ui';
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
        <SearchInput
          placeholder="ค้นหาชื่อกิจกรรม, ผู้จัด..."
          value={searchTerm}
          onChange={onSearchChange}
          width="200px"
        />
      </div>

      <div className="table-scroll" style={{ maxHeight: '400px' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              <th style={{ width: '100px' }}>วันที่</th>
              <th>ชื่อกิจกรรม / เรื่อง</th>
              <th style={{ width: '140px' }}>ประเภท</th>
              <th>อาจารย์/ผู้รับผิดชอบ</th>
              <th>กลุ่มเป้าหมาย</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id || index}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td>{item.date && item.date !== 'nan' ? String(item.date).substring(0, 10) : '-'}</td>
                <td style={{ whiteSpace: 'normal', minWidth: '250px' }}>{item.name || (item as any).topic_title}</td>
                <td>
                  {(item as any).service_type || (item as any).service_category ? (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {(item as any).service_type || (item as any).service_category}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
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

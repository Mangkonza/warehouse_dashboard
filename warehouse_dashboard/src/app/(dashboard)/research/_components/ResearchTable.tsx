'use client';

import React from 'react';
import { FaTable, FaSearch } from 'react-icons/fa';
import { ResearchItem } from '../_hooks/useResearchData';

interface ResearchTableProps {
  filteredData: ResearchItem[];
  uniqueDepts: Set<string>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDept: string;
  onDeptChange: (value: string) => void;
}

export function ResearchTable({
  filteredData,
  uniqueDepts,
  searchTerm,
  onSearchChange,
  selectedDept,
  onDeptChange,
}: ResearchTableProps) {
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
          <FaTable style={{ color: '#00914d', marginRight: '8px' }} /> รายละเอียดโครงการวิจัย ({filteredData.length} โครงการ)
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
              placeholder="ค้นหาชื่อ, หัวหน้า..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '12.5px', width: '160px', fontFamily: 'inherit' }}
            />
          </div>
          <select
            value={selectedDept}
            onChange={(e) => onDeptChange(e.target.value)}
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
            <option value="all">ทุกภาควิชา</option>
            {Array.from(uniqueDepts).map((d) => (
              <option key={d} value={d}>
                {String(d).replace('ภาควิชา\n', '').replace('ภาควิชา', '')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-scroll" style={{ maxHeight: '380px' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              <th>รหัสโครงการ</th>
              <th>ชื่อโครงการ</th>
              <th>หัวหน้าโครงการ</th>
              <th>ภาควิชา</th>
              <th style={{ textAlign: 'right' }}>งบประมาณรวม</th>
              <th>แหล่งทุน</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => {
              const internal = typeof item.budget_internal === 'number' ? item.budget_internal : Number(item.budget_internal) || 0;
              const external = typeof item.budget_external === 'number' ? item.budget_external : Number(item.budget_external) || 0;
              const totalBudget = internal + external;

              return (
                <tr key={item.id || index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td>{item.id && item.id !== 'nan' ? item.id : '-'}</td>
                  <td style={{ whiteSpace: 'normal', minWidth: '250px' }}>{item.name}</td>
                  <td>{item.head && item.head !== 'nan' ? item.head : '-'}</td>
                  <td>{item.department && item.department !== 'nan' ? item.department.replace('ภาควิชา\n', '') : '-'}</td>
                  <td className="budget-cell">{totalBudget > 0 ? totalBudget.toLocaleString() + ' ฿' : '-'}</td>
                  <td>{item.fund_source && item.fund_source !== 'nan' ? item.fund_source : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

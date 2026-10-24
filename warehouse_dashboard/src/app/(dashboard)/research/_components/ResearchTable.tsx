'use client';

import React from 'react';
import { FaTable } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, DepartmentSelect } from '@/components/ui';
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
  uniqueDepts: _uniqueDepts,
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
          <SearchInput
            placeholder="ค้นหาชื่อ, หัวหน้า..."
            value={searchTerm}
            onChange={onSearchChange}
            width="160px"
            style={{ padding: '6px 10px' }}
          />
          <DepartmentSelect
            value={selectedDept}
            onChange={onDeptChange}
            allowAll
            allLabel="ทุกภาควิชา"
            allValue="all"
            size="sm"
            className="w-[180px]"
          />
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
              <th style={{ width: '90px', minWidth: '90px', maxWidth: '90px', textAlign: 'left', verticalAlign: 'middle' }}>ภาควิชา</th>
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
                  <td style={{ width: '90px', minWidth: '90px', maxWidth: '90px', textAlign: 'left', verticalAlign: 'middle', padding: '8px 10px' }}>
                    <DepartmentBadge value={item.department} />
                  </td>
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

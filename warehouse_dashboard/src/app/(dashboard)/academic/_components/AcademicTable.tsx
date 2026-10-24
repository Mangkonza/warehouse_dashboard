'use client';

import React from 'react';
import { FaListUl } from 'react-icons/fa';
import { SearchInput } from '@/components/ui';
import { AcademicItem } from '../_hooks/useAcademicData';

interface AcademicTableProps {
  displayData: AcademicItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function AcademicTable({ displayData, searchTerm, onSearchChange }: AcademicTableProps) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '24px 0 12px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <h3
          style={{
            margin: 0,
            color: '#0f172a',
            fontSize: '16px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FaListUl style={{ color: '#1565c0' }} />
          รายละเอียดโครงการพัฒนาวิชาการ ({displayData.length} รายการ)
        </h3>
        <SearchInput
          placeholder="ค้นหาชื่อโครงการ, ผู้ว่าจ้าง..."
          value={searchTerm}
          onChange={onSearchChange}
          width="200px"
        />
      </div>

      <div
        className="table-card"
        style={{ marginTop: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}
      >
        <div className="table-scroll" style={{ maxHeight: '420px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th
                  style={{
                    width: '80px',
                    textAlign: 'center',
                    padding: '12px',
                    color: '#ffffff',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  เดือน
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#ffffff',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ชื่อโครงการพัฒนาวิชาการ
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#ffffff',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  หัวหน้าโครงการ
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: '#ffffff',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  งบประมาณรวม (บาท)
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#ffffff',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ผู้ขอรับบริการ
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item, index) => (
                <tr
                  key={item.id || index}
                  style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc' }}
                >
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#e3f2fd',
                        color: '#1565c0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        fontWeight: 600,
                        fontSize: '13px',
                      }}
                    >
                      {item.month && item.month !== 'nan' ? item.month : '-'}
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'normal', padding: '12px', color: '#0f172a', lineHeight: '1.5', fontWeight: 400 }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '12px', color: '#0f172a', fontWeight: 400 }}>
                    {item.head && item.head !== 'nan' ? item.head.replace('\n', ' ') : '-'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#006838' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span>{(Number(item.budget) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
                      {Number(item.budget) > 0 && (() => {
                        const b = Number(item.budget) || 0;
                        const facP = item.percent_faculty !== undefined && item.percent_faculty !== null ? Number(item.percent_faculty) : 5;
                        const depP = item.percent_dept !== undefined && item.percent_dept !== null ? Number(item.percent_dept) : 5;
                        const kuP = item.percent_ku !== undefined && item.percent_ku !== null ? Number(item.percent_ku) : 5;
                        const totalP = facP + depP + kuP;
                        const fac =
                          item.alloc_faculty !== undefined && item.alloc_faculty !== null && item.alloc_faculty !== ''
                            ? Number(item.alloc_faculty)
                            : (b * facP) / 100;
                        const dep =
                          item.alloc_dept !== undefined && item.alloc_dept !== null && item.alloc_dept !== ''
                            ? Number(item.alloc_dept)
                            : (b * depP) / 100;
                        const ku =
                          item.alloc_ku !== undefined && item.alloc_ku !== null && item.alloc_ku !== ''
                            ? Number(item.alloc_ku)
                            : (b * kuP) / 100;
                        const totalDeduct = fac + dep + ku;
                        const rem =
                          item.alloc_remaining !== undefined && item.alloc_remaining !== null && item.alloc_remaining !== ''
                            ? Number(item.alloc_remaining)
                            : Math.max(0, b - totalDeduct);
                        return (
                          <span
                            style={{ fontSize: '10.5px', color: '#64748b', cursor: 'help' }}
                            title={`การจัดสรรงบประมาณอัตโนมัติ:\n- คณะ (${facP}%): ${fac.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท\n- ภาควิชา (${depP}%): ${dep.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท\n- มก. (${kuP}%): ${ku.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท\n- คงเหลือดำเนินงาน (${(100 - totalP).toFixed(2)}%): ${rem.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`}
                          >
                            หัก {totalP}% ({totalDeduct.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท)
                          </span>
                        );
                      })()}
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#0f172a', fontWeight: 400 }}>
                    {item.client && item.client !== 'nan' ? item.client.replace('\n', ' ') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

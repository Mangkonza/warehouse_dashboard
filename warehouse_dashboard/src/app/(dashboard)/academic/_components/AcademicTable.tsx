'use client';

import React from 'react';
import { FaListUl, FaSearch } from 'react-icons/fa';
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
            placeholder="ค้นหาชื่อโครงการ, ผู้ว่าจ้าง..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '12.5px', width: '200px', fontFamily: 'inherit' }}
          />
        </div>
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
                      <span>{(item.budget || 0).toLocaleString()} ฿</span>
                      {Number(item.budget) > 0 && (
                        <span
                          style={{ fontSize: '10.5px', color: '#64748b', cursor: 'help' }}
                          title={`การจัดสรรงบประมาณ (หักอัตโนมัติ 30%):\n- ค่าอำนวยการ (15%): ${Math.round(
                            Number(item.budget) * 0.15
                          ).toLocaleString()} ฿\n- คณะ (5%): ${Math.round(
                            Number(item.budget) * 0.05
                          ).toLocaleString()} ฿\n- ภาควิชา (5%): ${Math.round(
                            Number(item.budget) * 0.05
                          ).toLocaleString()} ฿\n- มก. (5%): ${Math.round(
                            Number(item.budget) * 0.05
                          ).toLocaleString()} ฿\n- คงเหลือดำเนินงาน (70%): ${Math.round(
                            Number(item.budget) * 0.7
                          ).toLocaleString()} ฿`}
                        >
                          หัก 30% ({Math.round(Number(item.budget) * 0.3).toLocaleString()} ฿)
                        </span>
                      )}
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

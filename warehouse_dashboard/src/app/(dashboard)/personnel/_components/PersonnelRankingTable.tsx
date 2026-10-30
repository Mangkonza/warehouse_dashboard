'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/navigation';
import { useRouter } from 'next/navigation';
import { PersonnelWorkMetric } from '../_hooks/usePersonnelData';
import { DepartmentBadge, SearchInput } from '@/components/ui';
import { getDepartment } from '@/lib/departments';
import {
  FaSortAmountDown,
  FaFilter,
  FaExternalLinkAlt,
  FaFlask,
  FaGraduationCap,
  FaBook,
  FaHandsHelping,
  FaCertificate,
  FaChevronRight,
} from 'react-icons/fa';

interface PersonnelRankingTableProps {
  metrics: PersonnelWorkMetric[];
  departments: string[];
}

type SortField =
  | 'total'
  | 'budget'
  | 'research'
  | 'academic'
  | 'publications'
  | 'service'
  | 'ip';

export function PersonnelRankingTable({ metrics, departments }: PersonnelRankingTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [activeMissionFilter, setActiveMissionFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('total');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const filteredMetrics = useMemo(() => {
    let result = metrics.filter((m) => {
      // 1. Active filter
      if (showActiveOnly && m.counts.total === 0) return false;

      // 2. Department filter
      if (selectedDept !== 'all' && m.department !== selectedDept) return false;

      // 3. Mission specific filter
      if (activeMissionFilter === 'research' && m.counts.research === 0) return false;
      if (activeMissionFilter === 'academic' && m.counts.academic === 0) return false;
      if (activeMissionFilter === 'publications' && m.counts.publications === 0) return false;
      if (activeMissionFilter === 'service' && m.counts.service === 0) return false;
      if (activeMissionFilter === 'ip' && m.counts.ip === 0) return false;

      // 4. Search query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const nMatch = m.name.toLowerCase().includes(q) || m.cleanName.toLowerCase().includes(q);
        const dMatch = m.department.toLowerCase().includes(q);
        const pMatch = m.position.toLowerCase().includes(q);
        const eMatch = m.email.toLowerCase().includes(q);
        return nMatch || dMatch || pMatch || eMatch;
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortField === 'total') return b.counts.total - a.counts.total || b.budgets.total - a.budgets.total;
      if (sortField === 'budget') return b.budgets.total - a.budgets.total || b.counts.total - a.counts.total;
      if (sortField === 'research') {
        return (
          b.counts.research - a.counts.research ||
          b.budgets.research - a.budgets.research ||
          b.counts.total - a.counts.total
        );
      }
      if (sortField === 'academic') {
        return (
          b.counts.academic - a.counts.academic ||
          b.budgets.academic - a.budgets.academic ||
          b.counts.total - a.counts.total
        );
      }
      if (sortField === 'publications') {
        return (
          b.counts.publications - a.counts.publications ||
          b.pubQuartiles.q1 + b.pubQuartiles.q2 - (a.pubQuartiles.q1 + a.pubQuartiles.q2) ||
          b.counts.total - a.counts.total
        );
      }
      if (sortField === 'service') {
        return (
          b.counts.service - a.counts.service ||
          b.serviceHours - a.serviceHours ||
          b.counts.total - a.counts.total
        );
      }
      if (sortField === 'ip') {
        return b.counts.ip - a.counts.ip || b.counts.total - a.counts.total;
      }
      return 0;
    });

    return result;
  }, [metrics, searchTerm, selectedDept, activeMissionFilter, sortField, showActiveOnly]);

  const totalPages = Math.ceil(filteredMetrics.length / pageSize) || 1;
  const paginatedMetrics = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMetrics.slice(start, start + pageSize);
  }, [filteredMetrics, currentPage, pageSize]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Header Toolbar */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.01em',
              }}
            >
              ตารางจัดอันดับผลงานอาจารย์และบุคลากร
            </h3>
            
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                color: '#334155',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
              }}
            >
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => {
                  setShowActiveOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                style={{ accentColor: '#00A651', cursor: 'pointer' }}
              />
              <span>เฉพาะผู้มีผลงาน ({metrics.filter((m) => m.counts.total > 0).length} คน)</span>
            </label>
          </div>
        </div>

        {/* Filters Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
            <SearchInput
              value={searchTerm}
              onChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาชื่ออาจารย์, ตำแหน่ง, ภาควิชา, หรืออีเมล..."
            />
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: '190px' }}>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                color: '#1e293b',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="all">ทุกภาควิชา / หน่วยงาน ({metrics.length})</option>
              {departments.map((dept) => {
                const info = getDepartment(dept);
                const prefix = info.code && info.code !== '-' && info.code !== 'OTH' ? `${info.code} - ` : '';
                return (
                  <option key={dept} value={dept}>
                    {prefix}{dept}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ minWidth: '180px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
              <FaSortAmountDown style={{ marginRight: '4px' }} />
              เรียงตาม:
            </span>
            <select
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value as SortField);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                color: '#1e293b',
                backgroundColor: '#ffffff',
                outline: 'none',
                fontWeight: 600,
              }}
            >
              <option value="total">ผลงานรวม 5 ด้าน</option>
              <option value="budget">งบประมาณโครงการรวม</option>
              <option value="research">โครงการวิจัย</option>
              <option value="publications">ผลงานตีพิมพ์</option>
              <option value="ip">ทรัพย์สินทางปัญญา</option>
              <option value="academic">โครงการพัฒนาวิชาการ</option>
              <option value="service">งานบริการวิชาการ</option>
            </select>
          </div>
        </div>

        {/* Mission Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'ผลงานทั้งหมด', color: '#00A651' },
            { id: 'research', label: 'โครงการวิจัย', icon: <FaFlask />, color: '#00A651' },
            { id: 'publications', label: 'ผลงานตีพิมพ์', icon: <FaBook />, color: '#e11d48' },
            { id: 'ip', label: 'ทรัพย์สินทางปัญญา', icon: <FaCertificate />, color: '#7c3aed' },
            { id: 'academic', label: 'พัฒนาวิชาการ', icon: <FaGraduationCap />, color: '#0284c7' },
            { id: 'service', label: 'บริการวิชาการ', icon: <FaHandsHelping />, color: '#d97706' },
          ].map((tab) => {
            const isSel = activeMissionFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMissionFilter(tab.id);
                  setSortField(tab.id === 'all' ? 'total' : (tab.id as SortField));
                  setCurrentPage(1);
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: isSel ? `1px solid ${tab.color}` : '1px solid #e2e8f0',
                  backgroundColor: isSel ? tab.color : '#ffffff',
                  color: isSel ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSel ? `0 2px 5px ${tab.color}35` : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.icon && <span style={{ fontSize: '11px' }}>{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Table Data */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                borderBottom: '2px solid #e2e8f0',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              <th style={{ padding: '12px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
              <th style={{ padding: '12px 14px' }}>อาจารย์ / บุคลากร</th>
              <th style={{ padding: '12px 12px' }}>ภาควิชา / หน่วยงาน</th>
              <th
                onClick={() => {
                  setSortField('research');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'research' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'research' ? '#00A651' : undefined,
                  userSelect: 'none',
                }}
                title="คลิกเพื่อจัดอันดับตามโครงการวิจัย"
              >
                วิจัย {sortField === 'research' && '▼'}
              </th>
              <th
                onClick={() => {
                  setSortField('publications');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'publications' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'publications' ? '#e11d48' : undefined,
                  userSelect: 'none',
                }}
                title="คลิกเพื่อจัดอันดับตามผลงานตีพิมพ์"
              >
                ตีพิมพ์ {sortField === 'publications' && '▼'}
              </th>
              <th
                onClick={() => {
                  setSortField('ip');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'ip' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'ip' ? '#7c3aed' : undefined,
                  userSelect: 'none',
                }}
                title="คลิกเพื่อจัดอันดับตามทรัพย์สินทางปัญญา"
              >
                ทรัพย์สินฯ {sortField === 'ip' && '▼'}
              </th>
              <th
                onClick={() => {
                  setSortField('academic');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'academic' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'academic' ? '#0284c7' : undefined,
                  userSelect: 'none',
                }}
                title="คลิกเพื่อจัดอันดับตามโครงการพัฒนาวิชาการ"
              >
                พัฒนาวิชาการ {sortField === 'academic' && '▼'}
              </th>
              <th
                onClick={() => {
                  setSortField('service');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'service' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'service' ? '#d97706' : undefined,
                  userSelect: 'none',
                }}
                title="คลิกเพื่อจัดอันดับตามงานบริการวิชาการ"
              >
                บริการวิชาการ {sortField === 'service' && '▼'}
              </th>
              <th
                onClick={() => {
                  setSortField('total');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '12px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'total' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'total' ? '#0f172a' : undefined,
                  userSelect: 'none',
                }}
                title="คลิกเพื่อจัดอันดับตามผลงานรวม 5 ด้าน"
              >
                ผลงานรวม {sortField === 'total' && '▼'}
              </th>
              <th
                onClick={() => {
                  setSortField('budget');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '12px 14px',
                  textAlign: 'right',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'budget' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'budget' ? '#047857' : undefined,
                  userSelect: 'none',
                }}
                title="คลิกเพื่อจัดอันดับตามงบประมาณรวม"
              >
                งบประมาณรวม {sortField === 'budget' && '▼'}
              </th>
              <th style={{ padding: '12px 14px', textAlign: 'center', width: '110px' }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMetrics.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '14px',
                  }}
                >
                  ไม่พบข้อมูลอาจารย์หรือบุคลากรตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              paginatedMetrics.map((item, idx) => {
                const rank = (currentPage - 1) * pageSize + idx + 1;
                const budgetM = (item.budgets.total / 1000000).toFixed(2);
                const hasWorks = item.counts.total > 0;

                return (
                  <tr
                    key={item.id}
                    onClick={() => router.push(`/personnel/${item.id}`)}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: rank <= 3 ? '#faf5ff15' : idx % 2 === 0 ? '#ffffff' : '#fafafa',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0fdf4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        rank <= 3 ? '#faf5ff15' : idx % 2 === 0 ? '#ffffff' : '#fafafa';
                    }}
                  >
                    {/* Rank */}
                    <td style={{ textAlign: 'center', padding: '12px 10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor:
                            rank === 1
                              ? '#fef08a'
                              : rank === 2
                              ? '#e2e8f0'
                              : rank === 3
                              ? '#fed7aa'
                              : 'transparent',
                          color:
                            rank === 1
                              ? '#854d0e'
                              : rank === 2
                              ? '#334155'
                              : rank === 3
                              ? '#9a3412'
                              : '#64748b',
                          border: rank <= 3 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                        }}
                      >
                        {rank}
                      </span>
                    </td>

                    {/* Personnel Info */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.imageUrl ? encodeURI(item.imageUrl) : '/default-avatar.png'}
                          alt={item.name}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== '/default-avatar.png' && !target.src.endsWith('/default-avatar.png')) {
                              target.src = '/default-avatar.png';
                            }
                          }}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                            border: '1px solid #e2e8f0',
                            flexShrink: 0,
                            backgroundColor: '#99b8db',
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>
                            {item.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            {item.position && (
                              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                                {item.position}
                              </span>
                            )}
                            {item.email && (
                              <span style={{ fontSize: '11.5px', color: '#0284c7' }}>
                                {item.email}
                              </span>
                            )}
                          </div>

                          {/* Visual 5-mission distribution bar */}
                          {hasWorks && (
                            <div
                              style={{
                                display: 'flex',
                                height: '5px',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                backgroundColor: '#e2e8f0',
                                marginTop: '6px',
                                maxWidth: '180px',
                              }}
                              title={`สัดส่วน: วิจัย ${item.counts.research}, ตีพิมพ์ ${item.counts.publications}, ทรัพย์สินฯ ${item.counts.ip}, พัฒนาวิชาการ ${item.counts.academic}, บริการ ${item.counts.service}`}
                            >
                              {item.counts.research > 0 && (
                                <div
                                  style={{
                                    width: `${(item.counts.research / item.counts.total) * 100}%`,
                                    backgroundColor: '#00A651',
                                  }}
                                />
                              )}
                              {item.counts.publications > 0 && (
                                <div
                                  style={{
                                    width: `${(item.counts.publications / item.counts.total) * 100}%`,
                                    backgroundColor: '#e11d48',
                                  }}
                                />
                              )}
                              {item.counts.ip > 0 && (
                                <div
                                  style={{
                                    width: `${(item.counts.ip / item.counts.total) * 100}%`,
                                    backgroundColor: '#7c3aed',
                                  }}
                                />
                              )}
                              {item.counts.academic > 0 && (
                                <div
                                  style={{
                                    width: `${(item.counts.academic / item.counts.total) * 100}%`,
                                    backgroundColor: '#0284c7',
                                  }}
                                />
                              )}
                              {item.counts.service > 0 && (
                                <div
                                  style={{
                                    width: `${(item.counts.service / item.counts.total) * 100}%`,
                                    backgroundColor: '#d97706',
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td style={{ padding: '12px 12px' }}>
                      <DepartmentBadge value={item.department} />
                    </td>

                    {/* Research Count */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        backgroundColor: sortField === 'research' ? '#f0fdf4' : undefined,
                      }}
                    >
                      {item.counts.research > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#00A651',
                            backgroundColor: '#ecfdf5',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}
                        >
                          {item.counts.research}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* Publications Count */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        backgroundColor: sortField === 'publications' ? '#fff1f2' : undefined,
                      }}
                    >
                      {item.counts.publications > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#e11d48',
                            backgroundColor: '#fff1f2',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}
                          title={`Q1/Q2: ${item.pubQuartiles.q1 + item.pubQuartiles.q2} เรื่อง`}
                        >
                          {item.counts.publications}
                          {item.pubQuartiles.q1 > 0 && (
                            <span style={{ fontSize: '10px', color: '#be123c', marginLeft: '3px' }}>
                              (Q1)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* IP Count */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        backgroundColor: sortField === 'ip' ? '#f5f3ff' : undefined,
                      }}
                    >
                      {item.counts.ip > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#7c3aed',
                            backgroundColor: '#f5f3ff',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}
                        >
                          {item.counts.ip}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* Academic Development Count */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        backgroundColor: sortField === 'academic' ? '#f0f9ff' : undefined,
                      }}
                    >
                      {item.counts.academic > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#0284c7',
                            backgroundColor: '#f0f9ff',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}
                        >
                          {item.counts.academic}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* Service Count */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        backgroundColor: sortField === 'service' ? '#fffbeb' : undefined,
                      }}
                    >
                      {item.counts.service > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#d97706',
                            backgroundColor: '#fffbeb',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}
                          title={`จำนวน ${item.serviceHours} ชั่วโมง`}
                        >
                          {item.counts.service}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* Total Combined Works */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 12px',
                        backgroundColor: sortField === 'total' ? '#f8fafc' : undefined,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 800,
                          color: hasWorks ? '#0f172a' : '#94a3b8',
                        }}
                      >
                        {item.counts.total}
                      </span>
                    </td>

                    {/* Total Budget */}
                    <td
                      style={{
                        textAlign: 'right',
                        padding: '12px 14px',
                        backgroundColor: sortField === 'budget' ? '#f0fdf4' : undefined,
                      }}
                    >
                      {item.budgets.total > 0 ? (
                        <div>
                          <span style={{ fontWeight: 700, color: '#047857', fontSize: '13px' }}>
                            {budgetM} ลบ.
                          </span>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {item.budgets.total.toLocaleString('th-TH')} 
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* Action: Link to individual portfolio */}
                    <td style={{ textAlign: 'center', padding: '12px 14px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/personnel/${item.id}`);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#00A651',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#00A651';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.color = '#00A651';
                        }}
                      >
                        <span>ดูผลงาน</span>
                        <FaChevronRight style={{ fontSize: '10px' }} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Pagination Footer */}
      <div
        style={{
          padding: '14px 20px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '13px',
          color: '#64748b',
        }}
      >
        <div>
          แสดง <strong>{Math.min(filteredMetrics.length, (currentPage - 1) * pageSize + 1)}</strong> -{' '}
          <strong>{Math.min(filteredMetrics.length, currentPage * pageSize)}</strong> จากทั้งหมด{' '}
          <strong>{filteredMetrics.length}</strong> ท่าน
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: currentPage === 1 ? '#cbd5e1' : '#334155',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '12.5px',
              fontWeight: 500,
            }}
          >
            ก่อนหน้า
          </button>

          <span style={{ padding: '0 8px', fontWeight: 600, color: '#1e293b' }}>
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              fontSize: '12.5px',
              fontWeight: 500,
            }}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}

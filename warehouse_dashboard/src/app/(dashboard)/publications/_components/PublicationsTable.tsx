'use client';

import React, { useState, useMemo } from 'react';
import { FaTable, FaCalendarAlt } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, DepartmentSelect, RecordDetailDrawer, LevelBadge, PublicationTypeBadge } from '@/components/ui';
import { JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PublicationItem } from '../_hooks/usePublicationsData';

interface PublicationsTableProps {
  filteredData: PublicationItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  levelFilter: string;
  onLevelChange: (value: string) => void;
  selectedDept?: string;
  onDeptChange?: (value: string) => void;
  fiscalYearFilter?: string;
  onFiscalYearChange?: (value: string) => void;
  availableFiscalYears?: string[];
}

const THAI_MONTH_ORDER: Record<string, number> = {
  'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
  'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12,
};

export function PublicationsTable({
  filteredData,
  searchTerm,
  onSearchChange,
  levelFilter,
  onLevelChange,
  selectedDept = 'all',
  onDeptChange,
  fiscalYearFilter = 'all',
  onFiscalYearChange,
  availableFiscalYears = [],
}: PublicationsTableProps) {
  const [selectedDetailItem, setSelectedDetailItem] = useState<PublicationItem | null>(null);

  // Group filtered data by month
  const groupedData = useMemo(() => {
    const groups: Record<string, PublicationItem[]> = {};

    filteredData.forEach((item) => {
      const monthKey = item.month || 'ไม่ระบุเดือน';
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(item);
    });

    // Sort month keys logically
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const orderA = THAI_MONTH_ORDER[a] || 99;
      const orderB = THAI_MONTH_ORDER[b] || 99;
      return orderA - orderB;
    });

    return sortedKeys.map((key) => ({
      month: key,
      items: groups[key],
    }));
  }, [filteredData]);

  // Running sequence counter across groups
  let globalIndex = 0;

  return (
    <div className="table-card relative">
      {/* Header & Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h3 style={{ margin: 0 }} className="text-base font-bold text-slate-800 flex items-center">
          <FaTable style={{ color: '#00A651', marginRight: '8px' }} />
          ผลงานตีพิมพ์ทางวิชาการ
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#00A651] border border-emerald-200">
            {filteredData.length} เรื่อง
          </span>
        </h3>

        {/* Filter & Action Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search by title */}
          <SearchInput
            placeholder="ค้นหาชื่อผลงาน, ผู้แต่ง, วารสาร..."
            value={searchTerm}
            onChange={onSearchChange}
            width="190px"
            style={{ padding: '6px 10px' }}
          />

          {/* Department Filter */}
          {onDeptChange && (
            <DepartmentSelect
              value={selectedDept}
              onChange={onDeptChange}
              allowAll
              allLabel="ทุกภาควิชา"
              allValue="all"
              size="sm"
              className="w-[155px]"
            />
          )}

          {/* Level / Tier Filter */}
          <Select value={levelFilter} onValueChange={(val) => onLevelChange(val ?? 'all')}>
            <SelectTrigger className="h-8 text-xs min-w-[130px] bg-white border-slate-300">
              <SelectValue placeholder="ทุกระดับ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกระดับ / ทุกฐานข้อมูล</SelectItem>
              <SelectItem value="Q1">Q1</SelectItem>
              <SelectItem value="Q2">Q2-Q4</SelectItem>
              <SelectItem value="TCI">TCI (ระดับชาติ)</SelectItem>
              <SelectItem value="นานาชาติ">ระดับนานาชาติ</SelectItem>
              <SelectItem value="ชาติ">ระดับชาติ</SelectItem>
              <SelectItem value="ตีพิมพ์">ตีพิมพ์แล้ว</SelectItem>
              <SelectItem value="เตรียมความพร้อม">เตรียมความพร้อมตีพิมพ์</SelectItem>
            </SelectContent>
          </Select>

          {/* Fiscal Year Filter */}
          {onFiscalYearChange && availableFiscalYears.length > 0 && (
            <Select value={fiscalYearFilter} onValueChange={(val) => onFiscalYearChange(val ?? 'all')}>
              <SelectTrigger className="h-8 text-xs min-w-[125px] bg-white border-slate-300">
                <SelectValue placeholder="ทุกปีงบประมาณ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกปีงบประมาณ</SelectItem>
                {availableFiscalYears.map((fy) => (
                  <SelectItem key={fy} value={fy}>
                    ปีงบประมาณ {fy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {(searchTerm.trim() !== '' || levelFilter !== 'all' || selectedDept !== 'all' || fiscalYearFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onLevelChange('all');
                if (onDeptChange) onDeptChange('all');
                if (onFiscalYearChange) onFiscalYearChange('all');
              }}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #fca5a5',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {/* Grouped Table */}
      <div className="table-scroll" style={{ maxHeight: '560px' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th style={{ width: '45px', textAlign: 'center' }}>ลำดับที่</th>
              <th style={{ minWidth: '240px' }}>ชื่อผลงานทางวิชาการ</th>
              <th style={{ width: '130px' }}>ชนิดของผลงาน</th>
              <th style={{ width: '85px', textAlign: 'center' }}>ระดับ</th>
              <th style={{ width: '115px', textAlign: 'right' }}>จำนวนเงินสนับสนุน</th>
              <th style={{ width: '140px' }}>เจ้าของผลงาน</th>
              <th style={{ width: '130px' }}>ผู้ร่วม</th>
              <th style={{ width: '100px', textAlign: 'left' }}>สังกัด</th>
              <th style={{ width: '160px' }}>รายละเอียดวารสาร/การประชุม</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-slate-400 text-xs italic">
                  ไม่พบข้อมูลผลงานตีพิมพ์ทางวิชาการตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              groupedData.map((group) => (
                <React.Fragment key={group.month}>
                  {/* Month Group Header */}
                  <tr className="bg-slate-100/80 border-y border-slate-200">
                    <td colSpan={9} className="py-2 px-3 font-bold text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#00A651]" />
                        <span>เดือน {group.month}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          ({group.items.length} เรื่อง)
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Group Items */}
                  {group.items.map((item) => {
                    globalIndex += 1;
                    const fAuthors = Array.isArray(item.co_authors_foreign) ? item.co_authors_foreign.filter(Boolean) : [];
                    const dAuthors = Array.isArray(item.co_authors_domestic) ? item.co_authors_domestic.filter(Boolean) : [];
                    const hasCoAuthors = fAuthors.length > 0 || dAuthors.length > 0;

                    return (
                      <tr
                        key={`pub-row-${globalIndex}-${item.dbId ?? item._id ?? item.id ?? "item"}`}
                        onClick={() => setSelectedDetailItem(item)}
                        style={{ cursor: 'pointer' }}
                        className="hover:bg-[#f0fbf5] transition-colors"
                      >
                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748b' }}>
                          {globalIndex}
                        </td>
                        <td style={{ whiteSpace: 'normal', minWidth: '240px', fontWeight: 400, color: '#0f172a' }}>
                          {item.name}
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                            <PublicationTypeBadge value={item.type || item.status} />
                            {item.prep_budget ? (
                              <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                                (มีงบเตรียมฯ {Number(item.prep_budget).toLocaleString()} )
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                            <LevelBadge value={item.level} />
                            {item._detectedTier && JOURNAL_TIER_STYLES[item._detectedTier] && (
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  borderRadius: '6px',
                                  backgroundColor: JOURNAL_TIER_STYLES[item._detectedTier].bg,
                                  color: JOURNAL_TIER_STYLES[item._detectedTier].text,
                                  border: `1px solid ${JOURNAL_TIER_STYLES[item._detectedTier].border}`,
                                }}
                              >
                                {item._detectedTier}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: '#059669' }}>
                          {Number(item.budget || 0).toLocaleString('th-TH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          บาท
                        </td>
                        <td style={{ fontWeight: 400, color: '#334155' }}>
                          {item.owner && item.owner !== 'nan' ? (
                            item.person_id || item.owner_id ? (
                              <a
                                href={`/personnel/${item.person_id || item.owner_id}`}
                                onClick={(e) => e.stopPropagation()}
                                style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}
                                title="คลิกเพื่อดูแฟ้มผลงานอาจารย์"
                              >
                                {item.owner}
                              </a>
                            ) : (
                              item.owner
                            )
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          {hasCoAuthors ? (
                            <div className="text-[11px] leading-tight space-y-0.5">
                              {fAuthors.length > 0 && (
                                <div className="text-blue-700">
                                  ต่างชาติ: {fAuthors.join(', ')}
                                </div>
                              )}
                              {dAuthors.length > 0 && (
                                <div className="text-slate-600">
                                  ในประเทศ: {dAuthors.join(', ')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <DepartmentBadge value={item.department} />
                        </td>
                        <td style={{ fontSize: '12px', color: '#475569' }}>
                          <div>{item.journal || '-'}</div>
                          {item.type !== 'เตรียมความพร้อมจดอนุสิทธิบัตร' && (item.volume || item.issue || item.page_start) && (
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {item.volume ? `Vol. ${item.volume}` : ''}
                              {item.issue ? ` No. ${item.issue}` : ''}
                              {item.page_start ? ` pp. ${item.page_start}-${item.page_end || ''}` : ''}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Record Detail Drawer */}
      <RecordDetailDrawer
        isOpen={Boolean(selectedDetailItem)}
        onClose={() => setSelectedDetailItem(null)}
        categoryKey="publications"
        record={selectedDetailItem}
        readOnly={true}
      />
    </div>
  );
}

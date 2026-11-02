'use client';

import React, { useState, useMemo } from 'react';
import { FaTable, FaCalendarAlt, FaDownload, FaQuoteRight } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, DepartmentSelect, RecordDetailDrawer, LevelBadge, PublicationTypeBadge, StrategyBadges } from '@/components/ui';
import { JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';
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

    const THAI_MONTH_ORDER: Record<string, number> = {
      'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
      'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12,
    };

    return Object.entries(groups)
      .sort(([a], [b]) => (THAI_MONTH_ORDER[a] || 99) - (THAI_MONTH_ORDER[b] || 99))
      .map(([month, items]) => ({ month, items }));
  }, [filteredData]);

  // Export BibTeX
  const handleExportBibTeX = () => {
    const bibtexEntries = filteredData.map((item, idx) => {
      const citeKey = `pub_${item.fiscal_year_be || 2568}_${idx + 1}`;
      const author = String(item.owner || 'KU Faculty of Engineering').replace(/\n/g, ' ');
      const title = String(item.name || '').replace(/"/g, "'");
      const journal = String(item.journal || 'Academic Journal').replace(/"/g, "'");
      const year = item.fiscal_year_be ? item.fiscal_year_be - 543 : 2025;

      return `@article{${citeKey},\n  author = {${author}},\n  title = {${title}},\n  journal = {${journal}},\n  year = {${year}}\n}`;
    });

    const content = bibtexEntries.join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `publications_${new Date().toISOString().slice(0, 10)}.bib`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ลำดับ', 'ชื่อบทความวิชาการ', 'ประเภท', 'ระดับวารสาร', 'งบสนับสนุน (บาท)', 'เจ้าของผลงาน', 'ภาควิชา', 'วารสาร'];
    const rows = filteredData.map((item, idx) => [
      idx + 1,
      `"${String(item.name || '').replace(/"/g, '""')}"`,
      `"${item.type || item.status || ''}"`,
      `"${item._detectedTier || item.level || ''}"`,
      Number(item.budget) || 0,
      `"${String(item.owner || '').replace(/"/g, '""')}"`,
      `"${item.department || ''}"`,
      `"${String(item.journal || '').replace(/"/g, '""')}"`,
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `publications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let globalIndex = 0;

  return (
    <div className="table-card" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
            <FaTable style={{ color: '#f43f5e', marginRight: '8px' }} /> ผลงานตีพิมพ์ทางวิชาการ ({filteredData.length})
          </h3>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '8px',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#be123c',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '8px',
            }}
            title="ส่งออก CSV"
          >
            <FaDownload style={{ fontSize: '11px' }} /> CSV
          </button>
          <button
            onClick={handleExportBibTeX}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="ส่งออก BibTeX สำหรับใช้อ้างอิงทางวิชาการ"
          >
            <FaQuoteRight style={{ fontSize: '11px' }} /> BibTeX
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchInput
            placeholder="ค้นหาชื่อบทความ, ผู้แต่ง, วารสาร..."
            value={searchTerm}
            onChange={onSearchChange}
            width="240px"
            style={{ padding: '6px 10px' }}
          />
          {onDeptChange && (
            <DepartmentSelect
              value={selectedDept}
              onChange={onDeptChange}
              allowAll
              allLabel="ทุกภาควิชา"
              allValue="all"
              size="sm"
              className="w-[170px]"
            />
          )}
        </div>
      </div>

      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', color: '#475569', textAlign: 'left' }}>
              <th style={{ width: '44px', textAlign: 'center', padding: '10px 8px' }}>#</th>
              <th style={{ padding: '10px 8px' }}>ชื่อบทความวิชาการ</th>
              <th style={{ width: '120px', padding: '10px 8px' }}>ประเภท</th>
              <th style={{ width: '100px', textAlign: 'center', padding: '10px 8px' }}>ระดับ/ควอร์ไทล์</th>
              <th style={{ textAlign: 'right', padding: '10px 8px' }}>เงินสนับสนุน</th>
              <th style={{ padding: '10px 8px' }}>เจ้าของผลงาน</th>
              <th style={{ width: '100px', padding: '10px 8px' }}>ภาควิชา</th>
              <th style={{ padding: '10px 8px' }}>วารสาร</th>
              <th style={{ width: '120px', padding: '10px 8px' }}>ยุทธศาสตร์</th>
            </tr>
          </thead>
          <tbody>
            {groupedData.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontStyle: 'italic' }}>
                  ไม่พบข้อมูลผลงานตีพิมพ์ตามเงื่อนไข
                </td>
              </tr>
            ) : (
              groupedData.map((group) => (
                <React.Fragment key={group.month}>
                  <tr style={{ backgroundColor: '#f1f5f9' }}>
                    <td colSpan={9} style={{ padding: '6px 12px', fontWeight: 700, fontSize: '12px', color: '#334155' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaCalendarAlt style={{ color: '#f43f5e' }} />
                        <span>เดือน {group.month}</span>
                        <span style={{ fontSize: '11px', fontWeight: 400, color: '#64748b' }}>({group.items.length} เรื่อง)</span>
                      </div>
                    </td>
                  </tr>

                  {group.items.map((item) => {
                    globalIndex += 1;
                    const tier = item._detectedTier || 'TCI';
                    const tierStyle = JOURNAL_TIER_STYLES[tier] || { bg: '#fffbeb', text: '#b45309', border: '#fde68a' };

                    return (
                      <tr
                        key={`pub-row-${globalIndex}-${item.dbId ?? item._id ?? item.id ?? "item"}`}
                        onClick={() => setSelectedDetailItem(item)}
                        style={{ cursor: 'pointer', borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.1s ease' }}
                        className="hover:bg-rose-50/40"
                      >
                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748b', padding: '10px 8px' }}>
                          {globalIndex}
                        </td>
                        <td style={{ whiteSpace: 'normal', minWidth: '240px', fontWeight: 500, color: '#0f172a', padding: '10px 8px' }}>
                          {item.name}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <PublicationTypeBadge value={item.type || item.status} />
                        </td>
                        <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: tierStyle.bg,
                              color: tierStyle.text,
                              border: `1px solid ${tierStyle.border}`,
                            }}
                          >
                            {tier}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: '#0f172a', padding: '10px 8px' }}>
                          {Number(item.budget || 0) > 0 ? `${Number(item.budget).toLocaleString('th-TH')} ฿` : '-'}
                        </td>
                        <td style={{ color: '#334155', padding: '10px 8px' }}>
                          {item.owner && item.owner !== 'nan' ? (
                            item.person_id || item.owner_id ? (
                              <a
                                href={`/personnel/${item.person_id || item.owner_id}`}
                                onClick={(e) => e.stopPropagation()}
                                style={{ color: '#be123c', fontWeight: 600, textDecoration: 'none' }}
                                title="คลิกดูแฟ้มผลงาน"
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
                        <td style={{ width: '100px', padding: '10px 8px' }}>
                          <DepartmentBadge value={item.department} />
                        </td>
                        <td style={{ fontSize: '12px', color: '#475569', padding: '10px 8px' }}>
                          {item.journal || '-'}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <StrategyBadges
                      item={item}
                      category="publications"
                            sdgs={item.sdg_code ? [Number(item.sdg_code)] : []}
                            isee={item.isee}
                            iam={item.iam}
                          />
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

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { FaTimes, FaSearch, FaFolderOpen } from 'react-icons/fa';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { formatMoney, formatDateBE } from '@/components/ui/RecordDetailDrawer';
import { CATEGORIES_CONFIG } from '@/config/dataManagementConfig';
import { CategoryKey } from '@/types/dataManagement';
import { extractItemBudget } from '@/lib/sdgEngine';
import { autoDetectJournalRanking, JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';

export interface DrillDownProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  accentColor?: string;
  categoryKey?: CategoryKey;
  items: any[];
}

export const DrillDownProjectDrawer: React.FC<DrillDownProjectDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  accentColor = '#00A651',
  categoryKey = 'research',
  items,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = useMemo(() => {
    const list = items || [];
    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase().trim();
    return list.filter((it) => {
      const name = String(it.name || it.title || it.topic_title || '').toLowerCase();
      const person = String(it.head || it.owner || it.person || it.creator || '').toLowerCase();
      const dept = String(it.department || '').toLowerCase();
      const id = String(it.id || it.record_number || it.req_no || '').toLowerCase();
      const extra = String(it.fund_source || it.client || it.journal || it.location || '').toLowerCase();
      return name.includes(q) || person.includes(q) || dept.includes(q) || id.includes(q) || extra.includes(q);
    });
  }, [items, searchTerm]);

  const totalBudget = useMemo(() => {
    return filteredItems.reduce((sum, it) => sum + extractItemBudget(it), 0);
  }, [filteredItems]);

  if (!isOpen) return null;

  const resolveItemCategory = (item: any): CategoryKey => {
    if (item?._category && CATEGORIES_CONFIG[item._category as CategoryKey]) {
      return item._category as CategoryKey;
    }
    if (item?.journal !== undefined || item?.owner !== undefined) return 'publications';
    if (item?.creator !== undefined || item?.req_no !== undefined || item?.application_number !== undefined) return 'ip';
    if (item?.service_type !== undefined || item?.hours_spent !== undefined || item?.person !== undefined) return 'service';
    if (item?.record_number !== undefined || item?.alloc_faculty !== undefined || item?.client !== undefined) return 'academic';
    return categoryKey;
  };

  const cleanText = (val: any): string => {
    if (val === undefined || val === null) return '';
    const str = String(val).replace(/[\r\n]+/g, ' ').trim();
    if (!str || str === 'nan' || str === 'NaT' || str === '-') return '';
    return str;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.48)',
          backdropFilter: 'blur(3px)',
          zIndex: 9990,
          transition: 'opacity 0.2s ease',
        }}
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#ffffff',
          boxShadow: '-12px 0 32px rgba(15, 23, 42, 0.16)',
          zIndex: 9991,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #e2e8f0',
        }}
      >
        {/* Header (อ้างอิงโทนสีและโครงสร้างจากหน้า /manage) */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0 }}>
            <span
              style={{
                width: '5px',
                height: '36px',
                borderRadius: '999px',
                backgroundColor: accentColor,
                flexShrink: 0,
                marginTop: '2px',
              }}
            />
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  lineHeight: 1.35,
                }}
              >
                {title}
              </h3>
              <div
                style={{
                  marginTop: '4px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  color: '#64748b',
                }}
              >
                <span>
                  ทั้งหมด <strong style={{ color: '#0f172a' }}>{filteredItems.length.toLocaleString()}</strong> รายการ
                </span>
                {totalBudget > 0 && (
                  <>
                    <span>•</span>
                    <span>
                      งบประมาณรวม{' '}
                      <strong style={{ color: '#059669', fontFamily: 'monospace' }}>
                        {formatMoney(totalBudget)} บาท
                      </strong>
                    </span>
                  </>
                )}
                {subtitle && (
                  <>
                    <span>•</span>
                    <span>{subtitle}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            title="ปิดหน้าต่าง"
          >
            <FaTimes />
          </button>
        </div>

        {/* Search Bar */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 12px',
              flex: 1,
            }}
          >
            <FaSearch style={{ color: '#94a3b8', fontSize: '12px', marginRight: '8px', flexShrink: 0 }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อโครงการ, หัวหน้าโครงการ, แหล่งทุน, วารสาร, หน่วยงาน..."
              style={{
                border: 'none',
                outline: 'none',
                background: 'none',
                width: '100%',
                fontSize: '13px',
                color: '#1e293b',
                fontFamily: 'inherit',
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '0 4px',
                }}
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Self-Contained Project Cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px', backgroundColor: '#ffffff' }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8' }}>
              <FaFolderOpen style={{ fontSize: '32px', color: '#cbd5e1', margin: '0 auto 8px auto', display: 'block' }} />
              <div style={{ fontSize: '13.5px' }}>ไม่พบรายการข้อมูลในหมวดนี้</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredItems.map((item, idx) => {
                const itemName = cleanText(item.name || item.title || item.topic_title) || '-';
                const personName = cleanText(item.head || item.owner || item.person || item.creator);
                const personLabel =
                  item.owner !== undefined
                    ? 'เจ้าของผลงาน'
                    : item.creator !== undefined
                    ? 'ผู้ประดิษฐ์'
                    : item.person !== undefined
                    ? 'ผู้ดำเนินการ'
                    : 'หัวหน้าโครงการ';
                const deptVal = cleanText(
                  item.department || (Array.isArray(item.departments) ? item.departments.join(', ') : '')
                );
                const budgetVal = extractItemBudget(item);
                const cat = resolveItemCategory(item);
                const catConfig = CATEGORIES_CONFIG[cat];

                // สร้างรายการข้อมูลสำคัญตามหมวดหมู่ (ครบในการ์ดเดียว ไม่ต้องกดเปิดลิ้นชักซ้อน)
                const detailChips: { label: string; value: string }[] = [];

                if (cat === 'research') {
                  const idVal = cleanText(item.id);
                  const fundVal = cleanText(item.fund_source);
                  const startVal = cleanText(item.start_date) ? formatDateBE(item.start_date) : '';
                  const endVal = cleanText(item.end_date) ? formatDateBE(item.end_date) : '';
                  const periodVal = startVal && endVal ? `${startVal} – ${endVal}` : startVal || endVal;
                  const teamVal = cleanText(item.team);

                  if (idVal) detailChips.push({ label: 'รหัส', value: idVal });
                  if (fundVal) detailChips.push({ label: 'แหล่งทุน', value: fundVal });
                  if (periodVal && periodVal !== '-') detailChips.push({ label: 'ระยะเวลาสัญญา', value: periodVal });
                  if (teamVal) detailChips.push({ label: 'ผู้ร่วมวิจัย', value: teamVal });
                } else if (cat === 'academic') {
                  const recNo = cleanText(item.record_number || item.id);
                  const clientVal = cleanText(item.client);
                  const startVal = cleanText(item.start_date) ? formatDateBE(item.start_date) : '';
                  const endVal = cleanText(item.end_date) ? formatDateBE(item.end_date) : '';
                  const periodVal = startVal && endVal ? `${startVal} – ${endVal}` : startVal || endVal;

                  if (recNo) detailChips.push({ label: 'เลขระเบียน', value: recNo });
                  if (clientVal) detailChips.push({ label: 'ผู้ว่าจ้าง', value: clientVal });
                  if (periodVal && periodVal !== '-') detailChips.push({ label: 'ระยะเวลาสัญญา', value: periodVal });
                } else if (cat === 'publications') {
                  const typeVal = cleanText(item.type);
                  const levelVal = cleanText(item.level);
                  const journalVal = cleanText(item.journal);
                  const monthVal = cleanText(item.month);
                  const fyVal = cleanText(item.fiscal_year_be);

                  if (typeVal) detailChips.push({ label: 'ชนิดผลงาน', value: typeVal });
                  if (levelVal) detailChips.push({ label: 'ระดับ', value: levelVal });
                  if (journalVal) detailChips.push({ label: 'วารสาร/แหล่งตีพิมพ์', value: journalVal });
                  if (monthVal || fyVal) {
                    detailChips.push({
                      label: 'ช่วงเวลา',
                      value: `${monthVal ? `เดือน${monthVal} ` : ''}${fyVal ? `ปีงบ ${fyVal}` : ''}`.trim(),
                    });
                  }
                } else if (cat === 'service') {
                  const srvType = cleanText(item._resolvedType || item.service_type);
                  const locVal = cleanText(item.location);
                  const dateVal = cleanText(item.date) ? formatDateBE(item.date) : '';

                  if (srvType) detailChips.push({ label: 'ประเภทบริการ', value: srvType });
                  if (locVal) detailChips.push({ label: 'สถานที่/หน่วยงาน', value: locVal });
                  if (dateVal && dateVal !== '-') detailChips.push({ label: 'วันที่ดำเนินการ', value: dateVal });
                } else if (cat === 'ip') {
                  const ipType = cleanText(item.type);
                  const reqNo = cleanText(item.req_no || item.application_number || item.registration_number);
                  const fileDate = cleanText(item.filing_date || item.date)
                    ? formatDateBE(item.filing_date || item.date)
                    : '';

                  if (ipType) detailChips.push({ label: 'ประเภท', value: ipType });
                  if (reqNo) detailChips.push({ label: 'เลขที่คำขอ/ทะเบียน', value: reqNo });
                  if (fileDate && fileDate !== '-') detailChips.push({ label: 'วันที่ยื่นขอ', value: fileDate });
                }

                // ตรวจสอบ Tier วารสารสำหรับหมวดผลงานตีพิมพ์
                const detectedTier =
                  cat === 'publications'
                    ? item._detectedTier || autoDetectJournalRanking(item.journal || '', item.level || '')
                    : null;
                const tierStyle =
                  detectedTier && JOURNAL_TIER_STYLES[detectedTier as keyof typeof JOURNAL_TIER_STYLES]
                    ? JOURNAL_TIER_STYLES[detectedTier as keyof typeof JOURNAL_TIER_STYLES]
                    : null;

                return (
                  <div
                    key={`${item._category || cat}_${item._id || item.id || itemName || 'item'}_${idx}`}
                    style={{
                      padding: '13px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: idx % 2 === 1 ? '#fafcfb' : '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {/* แถวบน: ลำดับ + ชื่อโครงการ/ผลงาน + งบประมาณ */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0, flex: 1 }}>
                        <span
                          style={{
                            minWidth: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: '#f1f5f9',
                            color: '#64748b',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '1px',
                          }}
                        >
                          {idx + 1}
                        </span>

                        <div
                          style={{
                            fontSize: '13.5px',
                            fontWeight: 400,
                            color: '#0f172a',
                            lineHeight: 1.45,
                            wordBreak: 'break-word',
                            flex: 1,
                          }}
                        >
                          {itemName}
                        </div>
                      </div>

                      {budgetVal > 0 && (
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#059669',
                            fontFamily: 'monospace',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {formatMoney(budgetVal)} บาท
                        </span>
                      )}
                    </div>

                    {/* แถวกลาง: ป้ายกำกับพันธกิจ + ภาควิชา + เจ้าของโครงการ */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '6px',
                        paddingLeft: '34px',
                        fontSize: '12px',
                        color: '#64748b',
                      }}
                    >
                      {catConfig && (
                        <span
                          style={{
                            padding: '1px 7px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: `${catConfig.color}14`,
                            color: catConfig.color,
                            border: `1px solid ${catConfig.color}35`,
                          }}
                        >
                          {catConfig.title}
                        </span>
                      )}
                      {tierStyle && detectedTier && (
                        <span
                          style={{
                            padding: '1px 7px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: tierStyle.bg,
                            color: tierStyle.text,
                            border: `1px solid ${tierStyle.border}`,
                          }}
                        >
                          {detectedTier}
                        </span>
                      )}
                      {deptVal && <DepartmentBadge value={deptVal} />}
                      {personName && (
                        <span style={{ color: '#334155' }}>
                          {personLabel}: <strong style={{ fontWeight: 500, color: '#0f172a' }}>{personName}</strong>
                        </span>
                      )}
                    </div>

                    {/* แถวล่าง: ข้อมูลสำคัญเฉพาะหมวดหมู่ (แหล่งทุน / ผู้ว่าจ้าง / วารสาร / ระยะเวลาสัญญา) */}
                    {detailChips.length > 0 && (
                      <div
                        style={{
                          marginLeft: '34px',
                          paddingTop: '7px',
                          borderTop: '1px dashed #e2e8f0',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px 14px',
                          fontSize: '12px',
                          color: '#475569',
                        }}
                      >
                        {detailChips.map((chip, cIdx) => (
                          <div key={cIdx} style={{ display: 'inline-flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ color: '#64748b', fontWeight: 500 }}>{chip.label}:</span>
                            <span style={{ color: '#1e293b' }}>{chip.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12.5px',
            color: '#64748b',
          }}
        >
          <span>
            แสดง {filteredItems.length > 0 ? 1 : 0} ถึง {filteredItems.length} จากทั้งหมด{' '}
            <strong style={{ color: '#1e293b' }}>{items.length}</strong> รายการ
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#00A651',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ปิด
          </button>
        </div>
      </div>
    </>
  );
};

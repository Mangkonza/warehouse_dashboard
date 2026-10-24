'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { FaTimes, FaSearch, FaFolderOpen, FaChevronRight } from 'react-icons/fa';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { RecordDetailDrawer, formatMoney, formatDateBE } from '@/components/ui/RecordDetailDrawer';
import { CATEGORIES_CONFIG } from '@/config/dataManagementConfig';
import { CategoryKey } from '@/types/dataManagement';
import { extractItemBudget } from '@/lib/sdgEngine';

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
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedRecordIndex(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedRecordIndex === null) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, selectedRecordIndex]);

  const filteredItems = useMemo(() => {
    const list = items || [];
    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase().trim();
    return list.filter((it) => {
      const name = String(it.name || it.title || it.topic_title || '').toLowerCase();
      const person = String(it.head || it.owner || it.person || it.creator || '').toLowerCase();
      const dept = String(it.department || '').toLowerCase();
      const id = String(it.id || it.record_number || it.req_no || '').toLowerCase();
      return name.includes(q) || person.includes(q) || dept.includes(q) || id.includes(q);
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

  const activeDetailItem =
    selectedRecordIndex !== null && selectedRecordIndex < filteredItems.length
      ? filteredItems[selectedRecordIndex]
      : null;

  const activeDetailCategory = activeDetailItem ? resolveItemCategory(activeDetailItem) : categoryKey;

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
          maxWidth: '640px',
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
            justifyContent: 'space-between',
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
              placeholder="ค้นหาชื่อโครงการ, หัวหน้าโครงการ, หน่วยงาน..."
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
          <span style={{ fontSize: '11.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
            คลิกที่รายการเพื่อดูข้อมูลครบทุกฟิลด์
          </span>
        </div>

        {/* Scrollable Project List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px', backgroundColor: '#ffffff' }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8' }}>
              <FaFolderOpen style={{ fontSize: '32px', color: '#cbd5e1', margin: '0 auto 8px auto', display: 'block' }} />
              <div style={{ fontSize: '13.5px' }}>ไม่พบรายการข้อมูลในหมวดนี้</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredItems.map((item, idx) => {
                const itemName = String(item.name || item.title || item.topic_title || '-').replace(/[\r\n]+/g, ' ').trim();
                const personName = item.head || item.owner || item.person || item.creator || '-';
                const personLabel =
                  item.owner !== undefined
                    ? 'เจ้าของผลงาน'
                    : item.creator !== undefined
                    ? 'ผู้ประดิษฐ์'
                    : item.person !== undefined
                    ? 'ชื่อ - นามสกุล'
                    : 'หัวหน้าโครงการ';
                const deptVal = item.department || (Array.isArray(item.departments) ? item.departments.join(', ') : '');
                const budgetVal = extractItemBudget(item);
                const cat = resolveItemCategory(item);
                const catConfig = CATEGORIES_CONFIG[cat];
                const codeOrDate =
                  item.id && item.id !== 'nan'
                    ? `รหัส: ${item.id}`
                    : item.record_number && item.record_number !== 'nan'
                    ? `เลขระเบียน: ${item.record_number}`
                    : item.date
                    ? formatDateBE(item.date)
                    : '';

                return (
                  <div
                    key={item._id || `${itemName}_${idx}`}
                    onClick={() => setSelectedRecordIndex(idx)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: idx % 2 === 1 ? '#fafcfb' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0fbf5';
                      e.currentTarget.style.borderColor = '#00A651';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = idx % 2 === 1 ? '#fafcfb' : '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
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

                      <div style={{ minWidth: 0, flex: 1 }}>
                        {/* ชื่อรายการ: fontWeight 400 ไม่ตัวหนา ตามมาตรฐานหน้า /manage */}
                        <div
                          style={{
                            fontSize: '13.5px',
                            fontWeight: 400,
                            color: '#0f172a',
                            lineHeight: 1.45,
                            marginBottom: '6px',
                            wordBreak: 'break-word',
                          }}
                        >
                          {itemName}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '6px',
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
                          {deptVal && <DepartmentBadge value={String(deptVal)} />}
                          {personName && personName !== '-' && (
                            <span style={{ color: '#334155' }}>
                              {personLabel}: {personName}
                            </span>
                          )}
                          {codeOrDate && <span style={{ color: '#94a3b8' }}>({codeOrDate})</span>}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '4px',
                        flexShrink: 0,
                      }}
                    >
                      {budgetVal > 0 ? (
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#059669',
                            fontFamily: 'monospace',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatMoney(budgetVal)} บาท
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>-</span>
                      )}
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#0284c7',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        ดูรายละเอียด <FaChevronRight style={{ fontSize: '9px' }} />
                      </span>
                    </div>
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

      {/* RecordDetailDrawer จากหน้า /manage สำหรับเจาะลึกรายโครงการ */}
      <RecordDetailDrawer
        isOpen={selectedRecordIndex !== null && Boolean(activeDetailItem)}
        onClose={() => setSelectedRecordIndex(null)}
        item={activeDetailItem}
        config={CATEGORIES_CONFIG[activeDetailCategory]}
        onPrev={() => {
          if (selectedRecordIndex !== null && selectedRecordIndex > 0) {
            setSelectedRecordIndex(selectedRecordIndex - 1);
          }
        }}
        onNext={() => {
          if (selectedRecordIndex !== null && selectedRecordIndex < filteredItems.length - 1) {
            setSelectedRecordIndex(selectedRecordIndex + 1);
          }
        }}
        hasPrev={selectedRecordIndex !== null && selectedRecordIndex > 0}
        hasNext={selectedRecordIndex !== null && selectedRecordIndex < filteredItems.length - 1}
        currentIndex={selectedRecordIndex ?? 0}
        totalInPage={filteredItems.length}
        readOnly={true}
      />
    </>
  );
};

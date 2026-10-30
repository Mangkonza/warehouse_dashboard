'use client';

import React, { useState, useEffect } from 'react';
import { TimeFilterState, AcademicSemester } from '@/types/timeFilter';
import { FaCalendarAlt, FaTimes, FaUndo } from 'react-icons/fa';
import { AVAILABLE_YEARS, CURRENT_FISCAL_YEAR, CURRENT_ACADEMIC_YEAR } from '../constants/timeFilterPresets';

import { DatePicker, parseDate } from '@/components/ui/date-picker';

interface TimeFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filter: TimeFilterState;
  onApply: (newFilter: TimeFilterState) => void;
}

const MONTH_NAMES = [
  { num: 1, name: 'ม.ค.' },
  { num: 2, name: 'ก.พ.' },
  { num: 3, name: 'มี.ค.' },
  { num: 4, name: 'เม.ย.' },
  { num: 5, name: 'พ.ค.' },
  { num: 6, name: 'มิ.ย.' },
  { num: 7, name: 'ก.ค.' },
  { num: 8, name: 'ส.ค.' },
  { num: 9, name: 'ก.ย.' },
  { num: 10, name: 'ต.ค.' },
  { num: 11, name: 'พ.ย.' },
  { num: 12, name: 'ธ.ค.' },
];

const SEMESTERS: { key: AcademicSemester; label: string }[] = [
  { key: 'first', label: 'ภาคต้น (มิ.ย. – ต.ค.)' },
  { key: 'second', label: 'ภาคปลาย (พ.ย. – มี.ค.)' },
  { key: 'summer', label: 'ภาคฤดูร้อน (เม.ย. – พ.ค.)' },
  { key: 'all' as AcademicSemester, label: 'ทุกภาคการศึกษา' },
];

const QUARTERS = [
  { key: 'q1', label: 'ไตรมาส 1 (ต.ค. – ธ.ค.)' },
  { key: 'q2', label: 'ไตรมาส 2 (ม.ค. – มี.ค.)' },
  { key: 'q3', label: 'ไตรมาส 3 (เม.ย. – มิ.ย.)' },
  { key: 'q4', label: 'ไตรมาส 4 (ก.ค. – ก.ย.)' },
];

// ---- ขนาดคงที่ เพื่อไม่ให้ modal ยืดหดเวลาสลับโหมด ----
const BODY_HEIGHT = 400;
const GRID_3 = 'repeat(3, minmax(0, 1fr))';
const GRID_2 = 'repeat(2, minmax(0, 1fr))';
const GRID_4 = 'repeat(4, minmax(0, 1fr))';

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#1e293b',
  margin: '0 0 10px 0',
  lineHeight: '24px',
  height: '24px',
};
const divider: React.CSSProperties = { borderBottom: '1px solid #f1f3f5', margin: '14px 0' };

const buttonStyle = (isSelected: boolean): React.CSSProperties => ({
  width: '100%',
  minWidth: 0,
  height: '42px',
  padding: '0 10px',
  borderRadius: '8px',
  border: isSelected ? '1.5px solid #00A651' : '1px solid #e2e8f0',
  backgroundColor: isSelected ? '#f0fbf5' : '#f8fafc',
  color: isSelected ? '#00A651' : '#334155',
  fontWeight: isSelected ? 600 : 400,
  fontSize: '13.5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  boxShadow: isSelected ? '0 1px 2px rgba(0, 166, 81, 0.12)' : 'none',
  transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
});

const segmentStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  height: '36px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: active ? 700 : 500,
  border: 'none',
  backgroundColor: active ? '#ffffff' : 'transparent',
  color: active ? '#00A651' : '#64748b',
  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, color 0.15s ease',
});

const SegmentBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: 'flex',
      gap: '6px',
      backgroundColor: '#f1f5f9',
      padding: '4px',
      borderRadius: '10px',
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

/** กริดเลือกปี (ปีใน AVAILABLE_YEARS + ทุกปี) = 6 ช่อง 2 แถวเสมอ */
const YearGrid: React.FC<{ title: string; value: string; onSelect: (yr: string) => void }> = ({
  title,
  value,
  onSelect,
}) => (
  <div>
    <h4 style={sectionTitle}>{title}</h4>
    <div style={{ display: 'grid', gridTemplateColumns: GRID_3, gap: '10px' }}>
      {AVAILABLE_YEARS.map((yr) => (
        <button key={yr} type="button" onClick={() => onSelect(yr)} style={buttonStyle(value === yr)}>
          {yr}
        </button>
      ))}
      <button type="button" onClick={() => onSelect('all')} style={buttonStyle(value === 'all')}>
        ทุกปี
      </button>
    </div>
  </div>
);

// ---- helper วันที่ (เก็บเป็น ISO ค.ศ. yyyy-mm-dd, แสดงเป็น พ.ศ.) ----
const formatThaiDate = (iso?: string): string => {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '-';
  return `${d} ${MONTH_NAMES[m - 1].name} ${y + 543}`;
};

const dateInputStyle: React.CSSProperties = {
  width: '100%',
  height: '42px',
  padding: '0 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  fontSize: '13.5px',
  boxSizing: 'border-box',
  outline: 'none',
};

export const TimeFilterModal: React.FC<TimeFilterModalProps> = ({ isOpen, onClose, filter, onApply }) => {
  const [draft, setDraft] = useState<TimeFilterState>(filter);
  const [activeTabMode, setActiveTabMode] = useState<'academic' | 'fiscal' | 'manual'>('academic');

  useEffect(() => {
    if (isOpen) {
      setDraft(filter);
      setActiveTabMode(filter.mode === 'fiscal' ? 'fiscal' : filter.mode === 'manual' ? 'manual' : 'academic');
    }
  }, [isOpen, filter]);

  if (!isOpen) return null;

  const manualType = draft.manualType ?? 'months';
  const start = draft.manualStartDate ?? '';
  const end = draft.manualEndDate ?? '';
  const rangeInvalid = activeTabMode === 'manual' && manualType === 'range' && (!start || !end || start > end);
  const rangeOrderError = !!start && !!end && start > end;

  const handleApply = () => {
    if (rangeInvalid) return;
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    onApply({
      mode: 'all',
      academicYear: CURRENT_ACADEMIC_YEAR,
      academicSemester: 'first',
      fiscalYear: CURRENT_FISCAL_YEAR,
      fiscalQuarter: 'all',
      manualType: 'months',
      manualYear: CURRENT_FISCAL_YEAR,
      manualMonths: [],
      manualStartDate: '',
      manualEndDate: '',
    });
    onClose();
  };

  const switchTab = (tab: 'academic' | 'fiscal' | 'manual') => {
    setActiveTabMode(tab);
    setDraft({ ...draft, mode: tab });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`@keyframes modalFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.28)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalFadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#f0fbf5',
                border: '1px solid #bbf7d0',
                color: '#00A651',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              <FaCalendarAlt />
            </div>
            <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              เลือกช่วงเวลาการแสดงผล
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body: ความสูงคงที่ ไม่ว่าจะอยู่โหมดไหน */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SegmentBar>
            <button type="button" onClick={() => switchTab('academic')} style={segmentStyle(activeTabMode === 'academic')}>
              ปีการศึกษา
            </button>
            <button type="button" onClick={() => switchTab('fiscal')} style={segmentStyle(activeTabMode === 'fiscal')}>
              ปีงบประมาณ
            </button>
            <button type="button" onClick={() => switchTab('manual')} style={segmentStyle(activeTabMode === 'manual')}>
              กำหนดเอง
            </button>
          </SegmentBar>

          <div style={{ height: `${BODY_HEIGHT}px`, overflowY: 'auto', overflowX: 'hidden' }}>
            {/* 1. ปีการศึกษา */}
            {activeTabMode === 'academic' && (
              <div>
                <YearGrid
                  title="ปีการศึกษา"
                  value={draft.academicYear}
                  onSelect={(yr) => setDraft({ ...draft, mode: 'academic', academicYear: yr })}
                />
                <div style={divider} />
                <h4 style={sectionTitle}>ภาคการศึกษา</h4>
                <div style={{ display: 'grid', gridTemplateColumns: GRID_2, gap: '10px' }}>
                  {SEMESTERS.map((sem) => (
                    <button
                      key={sem.key}
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'academic', academicSemester: sem.key })}
                      style={buttonStyle(draft.academicSemester === sem.key)}
                    >
                      {sem.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. ปีงบประมาณ */}
            {activeTabMode === 'fiscal' && (
              <div>
                <YearGrid
                  title="ปีงบประมาณ"
                  value={draft.fiscalYear}
                  onSelect={(yr) => setDraft({ ...draft, mode: 'fiscal', fiscalYear: yr })}
                />
                <div style={divider} />
                <h4 style={sectionTitle}>ไตรมาส</h4>
                <div style={{ display: 'grid', gridTemplateColumns: GRID_2, gap: '10px' }}>
                  {QUARTERS.map((q) => (
                    <button
                      key={q.key}
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'fiscal', fiscalQuarter: q.key as any })}
                      style={buttonStyle(draft.fiscalQuarter === q.key)}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, mode: 'fiscal', fiscalQuarter: 'all' })}
                    style={buttonStyle(draft.fiscalQuarter === 'all')}
                  >
                    ทั้งปีงบประมาณ
                  </button>
                </div>
              </div>
            )}

            {/* 3. กำหนดเอง: เลือกเดือน หรือ เลือกช่วงวันที่ */}
            {activeTabMode === 'manual' && (
              <div>
                <div style={{ marginBottom: '14px' }}>
                  <SegmentBar>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'manual', manualType: 'months' })}
                      style={segmentStyle(manualType === 'months')}
                    >
                      เลือกเดือน
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'manual', manualType: 'range' })}
                      style={segmentStyle(manualType === 'range')}
                    >
                      เลือกช่วงวันที่
                    </button>
                  </SegmentBar>
                </div>

                {manualType === 'months' && (
                  <div>
                    <YearGrid
                      title="เลือกปี พ.ศ."
                      value={draft.manualYear}
                      onSelect={(yr) => setDraft({ ...draft, mode: 'manual', manualYear: yr })}
                    />
                    <div style={divider} />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                        height: '24px',
                      }}
                    >
                      <h4 style={{ ...sectionTitle, margin: 0 }}>เลือกเดือน</h4>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            mode: 'manual',
                            manualMonths: draft.manualMonths.length === 12 ? [] : MONTH_NAMES.map((m) => m.num),
                          })
                        }
                        style={{
                          backgroundColor: draft.manualMonths.length === 12 ? '#00A651' : '#ffffff',
                          border: draft.manualMonths.length === 12 ? '1px solid #00A651' : '1px solid #cbd5e1',
                          color: draft.manualMonths.length === 12 ? '#ffffff' : '#00A651',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          height: '24px',
                          padding: '0 12px',
                          borderRadius: '6px',
                          transition: 'background-color 0.15s ease, color 0.15s ease',
                        }}
                      >
                        {draft.manualMonths.length === 12 ? 'เลือกครบทุกเดือนแล้ว' : 'เลือกทุกเดือน'}
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: GRID_4, gap: '8px' }}>
                      {MONTH_NAMES.map((m) => {
                        const isSelected = draft.manualMonths.includes(m.num);
                        return (
                          <button
                            key={m.num}
                            type="button"
                            onClick={() => {
                              const updated = isSelected
                                ? draft.manualMonths.filter((x) => x !== m.num)
                                : [...draft.manualMonths, m.num].sort((a, b) => a - b);
                              setDraft({ ...draft, mode: 'manual', manualMonths: updated });
                            }}
                            style={buttonStyle(isSelected)}
                          >
                            {m.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {manualType === 'range' && (
                  <div>
                    <h4 style={sectionTitle}>ช่วงวันที่</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: GRID_2, gap: '12px' }}>
                      <div>
                        <span style={{ display: 'block', marginBottom: '6px', fontSize: '12.5px', fontWeight: 500, color: '#475569' }}>
                          วันที่เริ่มต้น
                        </span>
                        <DatePicker
                          value={start}
                          onChange={(_d, dateStr) =>
                            setDraft({ ...draft, mode: 'manual', manualType: 'range', manualStartDate: dateStr })
                          }
                          maxDate={parseDate(end)}
                          placeholder="วัน/เดือน/ปี (พ.ศ.)"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <span style={{ display: 'block', marginBottom: '6px', fontSize: '12.5px', fontWeight: 500, color: '#475569' }}>
                          วันที่สิ้นสุด
                        </span>
                        <DatePicker
                          value={end}
                          onChange={(_d, dateStr) =>
                            setDraft({ ...draft, mode: 'manual', manualType: 'range', manualEndDate: dateStr })
                          }
                          minDate={parseDate(start)}
                          placeholder="วัน/เดือน/ปี (พ.ศ.)"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '14px',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        backgroundColor: rangeOrderError ? '#fef2f2' : '#f8fafc',
                        border: `1px solid ${rangeOrderError ? '#fca5a5' : '#e2e8f0'}`,
                        color: rangeOrderError ? '#b91c1c' : '#334155',
                        fontSize: '13px',
                        minHeight: '44px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {rangeOrderError
                        ? 'วันที่เริ่มต้นต้องไม่หลังวันที่สิ้นสุด'
                        : `ช่วงที่เลือก: ${formatThaiDate(start)} – ${formatThaiDate(end)}`}
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {[
                        { label: '30 วันล่าสุด', days: 30 },
                        { label: '90 วันล่าสุด', days: 90 },
                        { label: '365 วันล่าสุด', days: 365 },
                      ].map((p) => (
                        <button
                          key={p.days}
                          type="button"
                          onClick={() => {
                            const toIso = (d: Date) =>
                              `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
                                d.getDate()
                              ).padStart(2, '0')}`;
                            const e = new Date();
                            const s = new Date();
                            s.setDate(s.getDate() - p.days + 1);
                            setDraft({
                              ...draft,
                              mode: 'manual',
                              manualType: 'range',
                              manualStartDate: toIso(s),
                              manualEndDate: toIso(e),
                            });
                          }}
                          style={{
                            height: '32px',
                            padding: '0 12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            color: '#475569',
                            fontSize: '12.5px',
                            cursor: 'pointer',
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <FaUndo style={{ fontSize: '10px' }} />
            <span>แสดงทั้งหมด</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={rangeInvalid}
              style={{
                padding: '8px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: rangeInvalid ? '#94d3b0' : '#00A651',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: rangeInvalid ? 'not-allowed' : 'pointer',
                boxShadow: rangeInvalid ? 'none' : '0 2px 6px rgba(0, 166, 81, 0.25)',
              }}
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
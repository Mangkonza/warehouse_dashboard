'use client';

import React, { useState, useEffect } from 'react';
import {
  TimeFilterState,
  AcademicSemester,
  FiscalQuarter,
  getTimeFilterLabel,
} from '@/types/timeFilter';
import { FaCalendarAlt, FaTimes, FaUndo, FaCheckCircle } from 'react-icons/fa';
import { AVAILABLE_YEARS } from '../constants/timeFilterPresets';

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

export const TimeFilterModal: React.FC<TimeFilterModalProps> = ({
  isOpen,
  onClose,
  filter,
  onApply,
}) => {
  const [draft, setDraft] = useState<TimeFilterState>(filter);
  const [activeTabMode, setActiveTabMode] = useState<'academic' | 'fiscal' | 'manual'>('academic');

  useEffect(() => {
    if (isOpen) {
      setDraft(filter);
      if (filter.mode === 'fiscal') {
        setActiveTabMode('fiscal');
      } else if (filter.mode === 'manual') {
        setActiveTabMode('manual');
      } else {
        setActiveTabMode('academic');
      }
    }
  }, [isOpen, filter]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    const resetState: TimeFilterState = {
      mode: 'all',
      academicYear: '2568',
      academicSemester: 'first',
      fiscalYear: '2568',
      fiscalQuarter: 'all',
      manualYear: '2568',
      manualMonths: [],
    };
    onApply(resetState);
    onClose();
  };

  const buttonStyle = (isSelected: boolean): React.CSSProperties => ({
    width: '100%',
    maxWidth: '100%',
    minWidth: '0px',
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
    transition: 'all 0.15s ease',
  });

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
        zIndex: 99999,
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
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
        {/* Modal Header */}
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
            <div>
              <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                เลือกช่วงเวลาการแสดงผล
              </h3>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: 500, marginTop: '2px' }}>
                กำลังเลือก: {getTimeFilterLabel(draft)}
              </div>
            </div>
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

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* แถบเลือกโหมด 3 โหมด: ปีการศึกษา / ปีงบประมาณ / กำหนดเดือนเอง */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              backgroundColor: '#f1f5f9',
              padding: '4px',
              borderRadius: '10px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTabMode('academic');
                setDraft({ ...draft, mode: 'academic' });
              }}
              style={{
                flex: 1,
                padding: '9px 10px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: activeTabMode === 'academic' ? 700 : 500,
                border: 'none',
                backgroundColor: activeTabMode === 'academic' ? '#ffffff' : 'transparent',
                color: activeTabMode === 'academic' ? '#00A651' : '#64748b',
                boxShadow: activeTabMode === 'academic' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ปีการศึกษา
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTabMode('fiscal');
                setDraft({ ...draft, mode: 'fiscal' });
              }}
              style={{
                flex: 1,
                padding: '9px 10px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: activeTabMode === 'fiscal' ? 700 : 500,
                border: 'none',
                backgroundColor: activeTabMode === 'fiscal' ? '#ffffff' : 'transparent',
                color: activeTabMode === 'fiscal' ? '#00A651' : '#64748b',
                boxShadow: activeTabMode === 'fiscal' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ปีงบประมาณ
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTabMode('manual');
                setDraft({ ...draft, mode: 'manual' });
              }}
              style={{
                flex: 1,
                padding: '9px 10px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: activeTabMode === 'manual' ? 700 : 500,
                border: 'none',
                backgroundColor: activeTabMode === 'manual' ? '#ffffff' : 'transparent',
                color: activeTabMode === 'manual' ? '#00A651' : '#64748b',
                boxShadow: activeTabMode === 'manual' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              กำหนดเดือนเอง
            </button>
          </div>

          {/* กล่องแสดงเนื้อหาตัวเลือกที่มีความสูงคงที่ */}
          <div style={{ minHeight: '320px', width: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 1. โหมดปีการศึกษา */}
            {activeTabMode === 'academic' && (
              <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '14px', width: '100%' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 10px 0' }}>
                    ปีการศึกษา
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, calc((100% - 20px) / 3))',
                      gap: '10px',
                      width: '100%',
                    }}
                  >
                    {AVAILABLE_YEARS.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setDraft({ ...draft, mode: 'academic', academicYear: yr })}
                        style={buttonStyle(draft.academicYear === yr)}
                      >
                        {yr}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'academic', academicYear: 'all' })}
                      style={buttonStyle(draft.academicYear === 'all')}
                    >
                      ทุกปี
                    </button>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #f1f3f5', margin: '14px 0' }}></div>

                <div style={{ width: '100%' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 10px 0' }}>
                    ภาคการศึกษา
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'calc(50% - 5px) calc(50% - 5px)',
                      gap: '10px',
                      width: '100%',
                    }}
                  >
                    {[
                      { key: 'first', label: 'ภาคต้น (มิ.ย. – ต.ค.)' },
                      { key: 'second', label: 'ภาคปลาย (พ.ย. – มี.ค.)' },
                      { key: 'summer', label: 'ภาคฤดูร้อน (เม.ย. – พ.ค.)' },
                      { key: 'all', label: 'ทุกภาคการศึกษา' },
                    ].map((sem) => (
                      <button
                        key={sem.key}
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            mode: 'academic',
                            academicSemester: sem.key as AcademicSemester,
                          })
                        }
                        style={buttonStyle(draft.academicSemester === sem.key)}
                      >
                        {sem.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. โหมดปีงบประมาณ */}
            {activeTabMode === 'fiscal' && (
              <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '14px', width: '100%' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 10px 0' }}>
                    ปีงบประมาณ
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, calc((100% - 20px) / 3))',
                      gap: '10px',
                      width: '100%',
                    }}
                  >
                    {AVAILABLE_YEARS.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setDraft({ ...draft, mode: 'fiscal', fiscalYear: yr })}
                        style={buttonStyle(draft.fiscalYear === yr)}
                      >
                        {yr}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'fiscal', fiscalYear: 'all' })}
                      style={buttonStyle(draft.fiscalYear === 'all')}
                    >
                      ทุกปี
                    </button>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #f1f3f5', margin: '14px 0' }}></div>

                <div style={{ width: '100%' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 10px 0' }}>
                    ไตรมาส
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'calc(50% - 5px) calc(50% - 5px)',
                      gap: '10px',
                      width: '100%',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'fiscal', fiscalQuarter: 'q1' })}
                      style={buttonStyle(draft.fiscalQuarter === 'q1')}
                    >
                      ไตรมาส 1 (ต.ค. – ธ.ค.)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'fiscal', fiscalQuarter: 'q2' })}
                      style={buttonStyle(draft.fiscalQuarter === 'q2')}
                    >
                      ไตรมาส 2 (ม.ค. – มี.ค.)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'fiscal', fiscalQuarter: 'q3' })}
                      style={buttonStyle(draft.fiscalQuarter === 'q3')}
                    >
                      ไตรมาส 3 (เม.ย. – มิ.ย.)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'fiscal', fiscalQuarter: 'q4' })}
                      style={buttonStyle(draft.fiscalQuarter === 'q4')}
                    >
                      ไตรมาส 4 (ก.ค. – ก.ย.)
                    </button>
                  </div>
                  <div style={{ marginTop: '10px', width: '100%' }}>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'fiscal', fiscalQuarter: 'all' })}
                      style={buttonStyle(draft.fiscalQuarter === 'all')}
                    >
                      ทั้งปีงบประมาณ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. โหมดกำหนดเดือนเอง */}
            {activeTabMode === 'manual' && (
              <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '14px', width: '100%' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 10px 0' }}>
                    เลือกปี พ.ศ.
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, calc((100% - 20px) / 3))',
                      gap: '10px',
                      width: '100%',
                    }}
                  >
                    {AVAILABLE_YEARS.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setDraft({ ...draft, mode: 'manual', manualYear: yr })}
                        style={buttonStyle(draft.manualYear === yr)}
                      >
                        {yr}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, mode: 'manual', manualYear: 'all' })}
                      style={buttonStyle(draft.manualYear === 'all')}
                    >
                      ทุกปี
                    </button>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #f1f3f5', margin: '14px 0' }}></div>

                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                      เลือกเดือน
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        if (draft.manualMonths.length === 12) {
                          setDraft({ ...draft, mode: 'manual', manualMonths: [] });
                        } else {
                          setDraft({
                            ...draft,
                            mode: 'manual',
                            manualMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                          });
                        }
                      }}
                      style={{
                        backgroundColor: draft.manualMonths.length === 12 ? '#00A651' : '#ffffff',
                        border: draft.manualMonths.length === 12 ? '1px solid #008f44' : '1px solid #cbd5e1',
                        color: draft.manualMonths.length === 12 ? '#ffffff' : '#00A651',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        padding: '4px 12px',
                        borderRadius: '6px',
                        transition: 'all 0.15s ease',
                        boxShadow: draft.manualMonths.length === 12 ? '0 1px 3px rgba(0, 166, 81, 0.25)' : 'none',
                      }}
                    >
                      {draft.manualMonths.length === 12 ? 'เลือกครบทุกเดือนแล้ว' : 'เลือกทุกเดือน'}
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, calc((100% - 24px) / 4))',
                      gap: '8px',
                      width: '100%',
                    }}
                  >
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
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
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
              style={{
                padding: '8px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#00A651',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
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

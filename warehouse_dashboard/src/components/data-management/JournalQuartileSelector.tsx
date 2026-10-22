'use client';

import React, { useState, useEffect } from 'react';
import { JournalTier, JOURNAL_TIER_STYLES } from '../../config/journalRankingConfig';
import { autoDetectJournalRanking, fetchDOIMetadata } from '../../lib/journalRankingEngine';
import { FaBook, FaSearch, FaMagic, FaCheckCircle, FaSpinner } from 'react-icons/fa';

interface JournalQuartileSelectorProps {
  value: string; // e.g. 'Scopus Q1', 'TCI 1'
  onChange: (val: string) => void;
  journalName?: string;
  onJournalMetadataFetched?: (meta: {
    journal?: string;
    title?: string;
    year?: number;
    volume?: string;
    issue?: string;
  }) => void;
}

const TIER_OPTIONS: JournalTier[] = [
  'Scopus Q1',
  'Scopus Q2',
  'Scopus Q3',
  'Scopus Q4',
  'TCI 1',
  'TCI 2',
  'International Conference',
  'National Conference',
];

export const JournalQuartileSelector: React.FC<JournalQuartileSelectorProps> = ({
  value,
  onChange,
  journalName = '',
  onJournalMetadataFetched,
}) => {
  const [doiInput, setDoiInput] = useState('');
  const [isLoadingDoi, setIsLoadingDoi] = useState(false);
  const [doiFeedback, setDoiFeedback] = useState<string | null>(null);

  // Auto-detect when journalName changes
  useEffect(() => {
    if (journalName && !value) {
      const detected = autoDetectJournalRanking(journalName);
      if (detected) {
        onChange(detected.tier);
      }
    }
  }, [journalName, value, onChange]);

  const handleFetchDOI = async () => {
    if (!doiInput.trim()) return;
    setIsLoadingDoi(true);
    setDoiFeedback(null);

    try {
      const meta = await fetchDOIMetadata(doiInput);
      if (meta) {
        if (meta.suggestedTier) {
          onChange(meta.suggestedTier);
        }
        if (onJournalMetadataFetched) {
          onJournalMetadataFetched({
            journal: meta.journal,
            title: meta.title,
            year: meta.year,
            volume: meta.volume,
            issue: meta.issue,
          });
        }
        setDoiFeedback(`✅ ดึงข้อมูลสำเร็จ: วารสาร "${meta.journal || 'ไม่ระบุ'}"`);
      } else {
        setDoiFeedback('⚠️ ไม่พบข้อมูล DOI นี้ในฐานข้อมูล CrossRef หรือเครือข่ายอ้างอิง');
      }
    } catch {
      setDoiFeedback('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ DOI API');
    } finally {
      setIsLoadingDoi(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <FaBook style={{ color: '#8e24aa' }} />
        ระดับคุณภาพวารสาร (Scopus Quartile Q1-Q4 / TCI)
      </label>

      {/* Tier Selection Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {TIER_OPTIONS.map((tier) => {
          const isSelected = value === tier;
          const style = JOURNAL_TIER_STYLES[tier];
          return (
            <button
              key={tier}
              type="button"
              onClick={() => onChange(tier)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: isSelected ? 700 : 500,
                border: isSelected ? `2px solid ${style.text}` : `1px solid ${style.border}`,
                background: isSelected ? style.bg : '#fff',
                color: isSelected ? style.text : '#475569',
                boxShadow: isSelected ? `0 0 10px ${style.glow}` : undefined,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tier}
            </button>
          );
        })}
      </div>

      {/* DOI Auto Lookup Box */}
      <div style={{ marginTop: '4px', padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
          💡 ค้นหาข้อมูลอัตโนมัติจากหมายเลข DOI (Auto Fetch via CrossRef):
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="เช่น 10.1016/j.compag.2023.107890"
            value={doiInput}
            onChange={(e) => setDoiInput(e.target.value)}
            className="glass-input"
            style={{ flex: 1, fontSize: '12.5px', padding: '6px 12px' }}
          />
          <button
            type="button"
            onClick={handleFetchDOI}
            disabled={isLoadingDoi || !doiInput.trim()}
            className="glass-btn-primary"
            style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isLoadingDoi ? <FaSpinner className="spin" /> : <FaSearch />}
            ดึงข้อมูล
          </button>
        </div>

        {doiFeedback && (
          <div style={{ fontSize: '11.5px', marginTop: '6px', color: doiFeedback.startsWith('✅') ? '#059669' : '#b45309' }}>
            {doiFeedback}
          </div>
        )}
      </div>
    </div>
  );
};

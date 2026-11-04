'use client';

import React from 'react';
import { ISEE_PILLARS, IAM_VALUES } from '@/lib/pastelTheme';
import { FaCompass } from 'react-icons/fa';

export interface StrategicFilterSelectProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function StrategicFilterSelect({
  value,
  onChange,
  className = '',
  style,
}: StrategicFilterSelectProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '9px',
        padding: '0 8px',
        height: '32px',
        boxSizing: 'border-box',
        fontSize: '12px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        maxWidth: '220px',
        ...style,
      }}
      className={`transition-all hover:border-slate-300 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-400 ${className}`}
    >
      <FaCompass style={{ color: '#0ea5e9', fontSize: '12px', flexShrink: 0 }} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          fontSize: '12px',
          fontWeight: 500,
          color: '#334155',
          cursor: 'pointer',
          paddingRight: '4px',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        aria-label="ตัวกรองยุทธศาสตร์"
      >
        <option value="all">ยุทธศาสตร์ทั้งหมด</option>

        <optgroup label="ยุทธศาสตร์ มก. (ISEE)">
          {ISEE_PILLARS.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="ค่านิยมองค์กร (IAM)">
          {IAM_VALUES.map((v) => (
            <option key={v.code} value={v.code}>
              {v.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="เป้าหมายความยั่งยืน (UN SDGs)">
          <option value="sdg_9">SDG 9: อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน</option>
          <option value="sdg_6">SDG 6: น้ำสะอาดและการสุขาภิบาล</option>
          <option value="sdg_12">SDG 12: การบริโภคและการผลิตที่ยั่งยืน</option>
          <option value="sdg_2">SDG 2: ขจัดความหิวโหย เกษตรยั่งยืน</option>
          <option value="sdg_4">SDG 4: การศึกษาที่มีคุณภาพ</option>
          <option value="sdg_7">SDG 7: พลังงานสะอาดที่เข้าถึงได้</option>
          <option value="sdg_13">SDG 13: การรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ</option>
          <option value="sdg_3">SDG 3: สุขภาพและความเป็นอยู่ที่ดี</option>
          <option value="sdg_11">SDG 11: เมืองและชุมชนที่ยั่งยืน</option>
          <option value="sdg_17">SDG 17: ความร่วมมือเพื่อเป้าหมาย</option>
        </optgroup>
      </select>
    </div>
  );
}

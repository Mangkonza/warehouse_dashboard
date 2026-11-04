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
        borderRadius: '10px',
        padding: '0 10px',
        height: '36px',
        boxSizing: 'border-box',
        fontSize: '12.5px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        minWidth: '185px',
        maxWidth: '220px',
        flexShrink: 0,
        ...style,
      }}
      className={`transition-all hover:border-slate-300 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-400 ${className}`}
    >
      <FaCompass style={{ color: '#38bdf8', fontSize: '13px', flexShrink: 0 }} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          fontSize: '12.5px',
          fontWeight: 600,
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

        <optgroup label="ยุทธศาสตร์มหาวิทยาลัย (4 เสาหลัก)">
          {ISEE_PILLARS.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="ค่านิยมหลักขององค์กร">
          {IAM_VALUES.map((v) => (
            <option key={v.code} value={v.code}>
              {v.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="เป้าหมายการพัฒนาที่ยั่งยืน">
          <option value="sdg_9">เป้าหมายที่ 9: อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน</option>
          <option value="sdg_6">เป้าหมายที่ 6: น้ำสะอาดและการสุขาภิบาล</option>
          <option value="sdg_12">เป้าหมายที่ 12: การบริโภคและการผลิตที่ยั่งยืน</option>
          <option value="sdg_2">เป้าหมายที่ 2: ขจัดความหิวโหย เกษตรยั่งยืน</option>
          <option value="sdg_4">เป้าหมายที่ 4: การศึกษาที่มีคุณภาพ</option>
          <option value="sdg_7">เป้าหมายที่ 7: พลังงานสะอาดที่เข้าถึงได้</option>
          <option value="sdg_13">เป้าหมายที่ 13: การรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ</option>
          <option value="sdg_3">เป้าหมายที่ 3: สุขภาพและความเป็นอยู่ที่ดี</option>
          <option value="sdg_11">เป้าหมายที่ 11: เมืองและชุมชนที่ยั่งยืน</option>
          <option value="sdg_17">เป้าหมายที่ 17: ความร่วมมือเพื่อการพัฒนาที่ยั่งยืน</option>
        </optgroup>
      </select>
    </div>
  );
}

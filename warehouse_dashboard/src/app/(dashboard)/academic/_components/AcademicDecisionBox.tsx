'use client';

import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

export function AcademicDecisionBox() {
  return (
    <div className="decision-box">
      <div className="decision-header">
        <FaLightbulb style={{ color: '#f59e0b', fontSize: '18px' }} /> ข้อมูลสนับสนุนการตัดสินใจ — โครงการพัฒนาวิชาการ
      </div>
      <ul>
        <li>
          <strong>งบประมาณรวม</strong> ของโครงการพัฒนาวิชาการสะท้อนมูลค่าการให้บริการแก่หน่วยงานภายนอกในระดับสูง
        </li>
        <li>
          <strong>หน่วยงานภาครัฐ</strong> เป็นผู้รับบริการหลักในการขับเคลื่อนโครงการ
        </li>
      </ul>
    </div>
  );
}

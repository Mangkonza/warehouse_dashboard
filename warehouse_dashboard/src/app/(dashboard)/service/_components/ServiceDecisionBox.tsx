'use client';

import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

export function ServiceDecisionBox() {
  return (
    <div className="decision-box">
      <div className="decision-header">
        <FaLightbulb style={{ color: '#f59e0b', fontSize: '18px' }} /> ข้อมูลสนับสนุนการตัดสินใจ — งานบริการวิชาการ
      </div>
      <ul>
        <li>
          <strong>งานผู้ทรงคุณวุฒิ</strong>สัดส่วนสูงสุด อาจารย์เป็นที่ยอมรับในวงวิชาการ
        </li>
        <li>
          กิจกรรมดำเนินอย่างต่อเนื่อง สะท้อน<strong>ความเข้มแข็งในการบริการสังคม</strong>ของคณะวิศวกรรมศาสตร์
        </li>
      </ul>
    </div>
  );
}

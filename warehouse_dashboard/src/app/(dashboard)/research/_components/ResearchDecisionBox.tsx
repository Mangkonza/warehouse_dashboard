'use client';

import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

export function ResearchDecisionBox() {
  return (
    <div className="decision-box">
      <div className="decision-header">
        <FaLightbulb style={{ color: '#f59e0b', fontSize: '18px' }} /> ข้อมูลสนับสนุนการตัดสินใจ — โครงการวิจัย
      </div>
      <ul>
        <li>
          <strong>งบประมาณส่วนใหญ่</strong> มาจากแหล่งทุนภายนอก โดยเฉพาะจาก วช. และ สวก.
        </li>
        <li>
          <strong>ภาควิชาที่มีงบวิจัยสูงสุด</strong> คือ วิศวกรรมชลประทานและวิศวกรรมการอาหาร
        </li>
      </ul>
    </div>
  );
}

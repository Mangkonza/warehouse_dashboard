'use client';

import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

export function PublicationsDecisionBox() {
  return (
    <div className="decision-box">
      <div className="decision-header">
        <FaLightbulb style={{ color: '#f59e0b', fontSize: '18px' }} /> ข้อมูลสนับสนุนการตัดสินใจ — ผลงานตีพิมพ์ทางวิชาการ
      </div>
      <ul>
        <li>
          <strong>SDG 9 (นวัตกรรม)</strong> มีผลงานตีพิมพ์มากที่สุด โดยเฉพาะด้านวัสดุก่อสร้างและ Machine Learning
        </li>
        <li>
          <strong>SDG 2 (อาหาร/เกษตร)</strong> มีผลงาน Q1 สูง จากงานวิจัยด้าน Postharvest และ NIR spectroscopy
        </li>
        <li>
          <strong>SDG 6 (น้ำ)</strong> มีผลงานตีพิมพ์อย่างต่อเนื่อง เป็นจุดแข็งของคณะ
        </li>
        <li>
          ควรเพิ่มผลงานด้าน <strong>SDG 7 (พลังงาน)</strong> และ <strong>SDG 3 (สุขภาพ)</strong> เพื่อความหลากหลาย
        </li>
      </ul>
    </div>
  );
}

'use client';

import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

interface IPDecisionBoxProps {
  totalIpCount: number;
  patentCount: number;
  uniqueDeptCount: number;
}

export function IPDecisionBox({ totalIpCount, patentCount, uniqueDeptCount }: IPDecisionBoxProps) {
  return (
    <div className="decision-box">
      <div className="decision-header">
        <FaLightbulb style={{ marginRight: 8, color: '#f59e0b' }} /> ข้อมูลสนับสนุนการตัดสินใจ — งานทรัพย์สินทางปัญญา
      </div>
      <ul>
        <li>
          มีทรัพย์สินทางปัญญารวม <strong>{totalIpCount} รายการ</strong> และสิทธิบัตร <strong>{patentCount} รายการ</strong>
        </li>
        <li>
          ปัจจุบันมาจาก <strong>{uniqueDeptCount} ภาควิชา</strong> ควรส่งเสริมและขยายการจดทะเบียนไปยังภาควิชาอื่นเพิ่มเติม
        </li>
        <li>
          ควรสร้าง <strong>กลไกสนับสนุนการยื่นจดสิทธิบัตร</strong> ต่อเนื่องจากโครงการวิจัยและผลงานตีพิมพ์ทางวิชาการ
        </li>
        <li>
          โครงการด้านเทคโนโลยีขั้นสูง เช่น IoT, AI ทางการเกษตร และวัสดุก่อสร้างคาร์บอนต่ำ ควรมีเป้าหมาย <strong>จดสิทธิบัตรเชิงพาณิชย์</strong>
        </li>
      </ul>
    </div>
  );
}

import React from 'react';
import { SdgsDashboardView } from './_components/SdgsDashboardView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDGs Dashboard – โครงการแยกตามเป้าหมาย SDGs | ระบบวิเคราะห์และบริหารจัดการข้อมูล',
  description: 'ภาพรวมโครงการแยกตามเป้าหมายการพัฒนาที่ยั่งยืน SDGs ทั้ง 17 ข้อ คณะวิศวกรรมศาสตร์ กำแพงแสน',
};

export default function SdgsPage() {
  return <SdgsDashboardView />;
}

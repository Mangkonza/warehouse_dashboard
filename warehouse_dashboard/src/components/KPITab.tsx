'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { KPIItem, KPIComputedResult, KPICategory } from '../types/kpi';
import { getStoredKPIs, evaluateAllKPIs, ENGINEERING_DEPARTMENTS } from '../lib/kpiEngine';
import { apiFetch } from '../lib/api';
import {
  FaBullseye,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaCog,
  FaFilter,
  FaBuilding,
  FaChartLine,
  FaInfoCircle,
  FaSyncAlt,
  FaExternalLinkAlt,
} from 'react-icons/fa';

// Fallback JSON data
import rawResearch from '../data/research.json';
import rawAcademic from '../data/academic.json';
import rawPublications from '../data/publications.json';
import rawServices from '../data/services.json';
import rawIP from '../data/ip.json';
import rawPersonnel from '../data/personnel.json';

import { TimeFilterState, itemMatchesTimeFilter, getTimeFilterLabel } from '../types/timeFilter';

interface KPITabProps {
  onNavigateToManage?: () => void;
  timeFilter?: TimeFilterState;
}

const CATEGORY_NAMES: Record<KPICategory | 'all', string> = {
  all: 'ทุกหมวดยุทธศาสตร์',
  research: 'โครงการวิจัย',
  academic: 'โครงการพัฒนาวิชาการ',
  publications: 'ผลงานตีพิมพ์ทางวิชาการ',
  service: 'งานบริการวิชาการ',
  ip: 'งานทรัพย์สินทางปัญญา',
  personnel: 'บุคลากร/อาจารย์',
  strategy: 'ยุทธศาสตร์คณะฯ',
};

export default function KPITab({ onNavigateToManage, timeFilter }: KPITabProps) {
  const [kpiList, setKpiList] = useState<KPIItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Live datasets from API or fallback
  const [datasets, setDatasets] = useState<Record<string, any[]>>({
    research: rawResearch,
    academic: rawAcademic,
    publications: rawPublications,
    service: rawServices,
    ip: rawIP,
    personnel: rawPersonnel,
  });

  // Load datasets from DB / backend API
  const loadLiveData = async () => {
    setIsRefreshing(true);
    try {
      const [resRes, acaRes, pubRes, srvRes, ipRes] = await Promise.allSettled([
        apiFetch<any[]>('/dashboard/research'),
        apiFetch<any[]>('/dashboard/academic'),
        apiFetch<any[]>('/dashboard/publications'),
        apiFetch<any[]>('/dashboard/services'),
        apiFetch<any[]>('/dashboard/ip'),
      ]);

      const newDatasets = { ...datasets };
      if (resRes.status === 'fulfilled' && resRes.value.data) newDatasets.research = resRes.value.data;
      if (acaRes.status === 'fulfilled' && acaRes.value.data) newDatasets.academic = acaRes.value.data;
      if (pubRes.status === 'fulfilled' && pubRes.value.data) newDatasets.publications = pubRes.value.data;
      if (srvRes.status === 'fulfilled' && srvRes.value.data) newDatasets.service = srvRes.value.data;
      if (ipRes.status === 'fulfilled' && ipRes.value.data) newDatasets.ip = ipRes.value.data;

      setDatasets(newDatasets);
    } catch (err) {
      console.warn('Backend API offline or failed, falling back to local datasets:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Sync KPIs
  useEffect(() => {
    setKpiList(getStoredKPIs());
    loadLiveData();

    const handleKpiUpdate = () => {
      setKpiList(getStoredKPIs());
    };

    window.addEventListener('kpi_updated', handleKpiUpdate);
    window.addEventListener('storage', handleKpiUpdate);
    return () => {
      window.removeEventListener('kpi_updated', handleKpiUpdate);
      window.removeEventListener('storage', handleKpiUpdate);
    };
  }, []);

  // Filter datasets according to timeFilter
  const filteredDatasets = useMemo(() => {
    if (!timeFilter || timeFilter.mode === 'all') return datasets;
    const res: Record<string, any[]> = {};
    for (const [key, list] of Object.entries(datasets)) {
      if (key === 'personnel') {
        res[key] = list;
      } else {
        res[key] = (list || []).filter((item) => itemMatchesTimeFilter(item, timeFilter));
      }
    }
    return res;
  }, [datasets, timeFilter]);

  // Compute live evaluation for all KPIs
  const computedKPIs: KPIComputedResult[] = useMemo(() => {
    return evaluateAllKPIs(kpiList, filteredDatasets);
  }, [kpiList, filteredDatasets]);

  // Overall Statistics
  const overallStats = useMemo(() => {
    const total = computedKPIs.length;
    const achieved = computedKPIs.filter((k) => k.status === 'achieved').length;
    const onTrack = computedKPIs.filter((k) => k.status === 'on_track').length;
    const atRisk = computedKPIs.filter((k) => k.status === 'at_risk').length;
    const behind = computedKPIs.filter((k) => k.status === 'behind').length;
    const avgScore =
      total > 0
        ? Math.round(
            computedKPIs.reduce((sum, cur) => sum + Math.min(cur.percentage, 100), 0) / total
          )
        : 0;

    return { total, achieved, onTrack, atRisk, behind, avgScore };
  }, [computedKPIs]);

  // Filtered KPIs
  const filteredKPIs = useMemo(() => {
    return computedKPIs.filter((item) => {
      if (selectedCategory !== 'all' && item.kpi.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      return true;
    });
  }, [computedKPIs, selectedCategory, selectedStatus]);

  // Helper format currency
  const formatValue = (val: number, unit: string) => {
    if (unit === 'บาท') {
      if (val >= 1000000) {
        return `${(val / 1000000).toLocaleString('th-TH', { maximumFractionDigits: 2 })} ล้านบาท`;
      }
      return `${val.toLocaleString()} บาท`;
    }
    return `${val.toLocaleString()} ${unit}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Header & Executive Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          backgroundColor: '#ffffff',
          padding: '20px 24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                backgroundColor: '#e8f5e9',
                color: '#007a3e',
                padding: '3px 10px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {timeFilter && timeFilter.mode !== 'all' ? getTimeFilterLabel(timeFilter) : 'ทุกช่วงเวลา'}
            </span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            ระบบติดตามตัวชี้วัดตามแผนยุทธศาสตร์
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
            ประมวลผลสถานะความสำเร็จและเปรียบเทียบกับเป้าหมายแบบเรียลไทม์จากคลังข้อมูลวิจัย
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={loadLiveData}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 500,
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="ดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์ฐานข้อมูล"
          >
            <FaSyncAlt style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', fontSize: '12px' }} />
            <span>{isRefreshing ? 'กำลังอัปเดต...' : 'รีเฟรชข้อมูล DB'}</span>
          </button>

          {onNavigateToManage && (
            <button
              onClick={onNavigateToManage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 18px',
                backgroundColor: '#00A651',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              <FaCog style={{ fontSize: '13px' }} />
              <span>จัดการตัวชี้วัดตามแผนยุทธศาสตร์ (เพิ่ม/แก้ไข/ลบ)</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Executive Summary Cards (สถานะรวม) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: ความสำเร็จรวม */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '18px 20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            <FaChartLine />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              คะแนนความสำเร็จเฉลี่ย
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              {overallStats.avgScore}%
            </div>
            <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>
              รวม {overallStats.total} ตัวชี้วัดยุทธศาสตร์
            </div>
          </div>
        </div>

        {/* Card 2: บรรลุเป้าหมาย (Achieved) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '18px 20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            <FaCheckCircle />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              บรรลุเป้าหมาย (≥ 100%)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669' }}>
              {overallStats.achieved} ข้อ
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b' }}>
              คิดเป็น {overallStats.total ? Math.round((overallStats.achieved / overallStats.total) * 100) : 0}% ของตัวชี้วัดทั้งหมด
            </div>
          </div>
        </div>

        {/* Card 3: เป็นไปตามเป้า (On Track) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '18px 20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            <FaClock />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              เป็นไปตามเป้า (70 - 99%)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7' }}>
              {overallStats.onTrack} ข้อ
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b' }}>
              กำลังดำเนินงานต่อเนื่อง
            </div>
          </div>
        </div>

        {/* Card 4: ต้องเร่งรัด / เฝ้าระวัง */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '18px 20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            <FaExclamationCircle />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              เฝ้าระวัง & ต้องเร่งรัด (&lt; 70%)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626' }}>
              {overallStats.atRisk + overallStats.behind} ข้อ
            </div>
            <div style={{ fontSize: '11.5px', color: '#b91c1c', fontWeight: 600 }}>
              จำเป็นต้องจัดสรรทรัพยากรหนุนเสริม
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Navigation Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#ffffff',
          padding: '12px 18px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', marginRight: '4px' }}>
            หมวดยุทธศาสตร์:
          </span>
          {Object.entries(CATEGORY_NAMES).map(([k, lbl]) => {
            const isSel = selectedCategory === k;
            return (
              <button
                key={k}
                onClick={() => setSelectedCategory(k)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: isSel ? 600 : 400,
                  border: isSel ? '1px solid #00A651' : '1px solid #e2e8f0',
                  backgroundColor: isSel ? '#00A651' : '#ffffff',
                  color: isSel ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {lbl}
              </button>
            );
          })}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 500 }}>
            สถานะ:
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              backgroundColor: '#ffffff',
              color: '#334155',
            }}
          >
            <option value="all">ทุกสถานะ</option>
            <option value="achieved">บรรลุเป้าหมาย (≥ 100%)</option>
            <option value="on_track">เป็นไปตามเป้า (70-99%)</option>
            <option value="at_risk">เฝ้าระวัง (40-69%)</option>
            <option value="behind">ต้องเร่งรัด (&lt; 40%)</option>
          </select>
        </div>
      </div>

      {/* 4. Strategic KPI Grid Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '18px',
        }}
      >
        {filteredKPIs.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px dashed #cbd5e1',
              color: '#94a3b8',
            }}
          >
            <FaBullseye style={{ fontSize: '32px', marginBottom: '8px' }} />
            <div style={{ fontSize: '15px', fontWeight: 600 }}>ไม่พบตัวชี้วัดในหมวดหมู่นี้</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>ลองเปลี่ยนตัวกรอง หรือเพิ่มตัวชี้วัดใหม่ในหน้าจัดการข้อมูล</div>
          </div>
        ) : (
          filteredKPIs.map((item) => {
            const { kpi, currentValue, targetValue, percentage, status, statusLabel, statusColor, details } = item;
            const isExpanded = expandedId === kpi.id;

            return (
              <div
                key={kpi.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                {/* Card Header */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: '#fafbfc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 700,
                          color: '#00A651',
                          backgroundColor: '#e8f5e9',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {kpi.code}
                      </span>
                      <span
                        style={{
                          fontSize: '11.5px',
                          color: '#64748b',
                          fontWeight: 500,
                        }}
                      >
                        {CATEGORY_NAMES[kpi.category] || kpi.category}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 700,
                        color: '#1e293b',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {kpi.title}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      backgroundColor: status === 'achieved' ? '#ecfdf5' : status === 'on_track' ? '#f0f9ff' : status === 'at_risk' ? '#fffbeb' : '#fef2f2',
                      color: statusColor,
                      border: `1px solid ${statusColor}33`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {statusLabel}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {/* Big Number Comparison */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <div>
                        <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                          ผลงานปัจจุบัน
                        </span>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: statusColor }}>
                          {formatValue(currentValue, kpi.unit)}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                          เป้าหมายยุทธศาสตร์
                        </span>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#475569' }}>
                          {formatValue(targetValue, kpi.unit)}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: '9px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        position: 'relative',
                        marginTop: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          height: '100%',
                          backgroundColor: statusColor,
                          borderRadius: '6px',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 700, color: statusColor }}>
                        {percentage}% สำเร็จ
                      </span>
                      <span style={{ color: '#64748b', fontSize: '11.5px' }}>
                        {currentValue >= targetValue
                          ? `เกินเป้าหมาย +${formatValue(currentValue - targetValue, kpi.unit)}`
                          : `ยังขาดอีก ${formatValue(targetValue - currentValue, kpi.unit)}`}
                      </span>
                    </div>
                  </div>

                  {/* Completeness breakdown (สำหรับ 7 ภาควิชา) */}
                  {kpi.calcType === 'auto_completeness' && details && (
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        สถานะการมีส่วนร่วม 7 ภาควิชา: ({details.completedDepartments?.length || 0}/7)
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {ENGINEERING_DEPARTMENTS.map((dept) => {
                          const isDone = details.completedDepartments?.includes(dept);
                          const deptAbbrMap: Record<string, string> = {
                            'วิศวกรรมเกษตร': 'ABE',
                            'วิศวกรรมคอมพิวเตอร์': 'CPE',
                            'วิศวกรรมชลประทาน': 'IRE',
                            'วิศวกรรมอาหาร': 'FE',
                            'วิศวกรรมอุตสาหการ': 'IE',
                            'วิศวกรรมเครื่องกล': 'ME',
                            'วิศวกรรมโยธา': 'CE',
                          };
                          const abbr = deptAbbrMap[dept] || dept;

                          return (
                            <span
                              key={dept}
                              title={dept}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '46px',
                                padding: '3px 9px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                backgroundColor: isDone ? '#00A651' : '#f1f5f9',
                                color: isDone ? '#ffffff' : '#64748b',
                                border: isDone ? '1px solid #008f44' : '1px solid #cbd5e1',
                                boxShadow: isDone ? '0 1px 3px rgba(0, 166, 81, 0.25)' : 'none',
                              }}
                            >
                              {abbr}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Responsible Unit */}
                  {kpi.responsibleUnit && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                      <FaBuilding style={{ color: '#94a3b8' }} />
                      <span>ผู้รับผิดชอบ: <strong>{kpi.responsibleUnit}</strong></span>
                    </div>
                  )}

                  {/* Expand details button */}
                  {kpi.description && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : kpi.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#00A651',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FaInfoCircle />
                        <span>{isExpanded ? 'ย่อคำอธิบาย' : 'ดูคำอธิบายและเกณฑ์ประเมิน'}</span>
                      </button>
                      {isExpanded && (
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px', lineHeight: 1.4, backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                          {kpi.description}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
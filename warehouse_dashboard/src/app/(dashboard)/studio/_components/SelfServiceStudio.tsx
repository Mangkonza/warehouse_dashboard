'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FACT_DOMAINS_CONFIG } from '@/config/analyticsMetadata';
import { AnalyticsQuery, ChartType, FactDomainId, AggregationType } from '@/types/analyticsBuilder';
import { executeAnalyticsQuery } from '@/lib/analyticsEngine';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaTable,
  FaMagic,
  FaDownload,
  FaLayerGroup,
  FaCalculator,
  FaThList,
  FaLightbulb,
  FaFlask,
  FaGraduationCap,
  FaBook,
  FaHandsHelping,
  FaCertificate,
  FaClock,
  FaFilter,
  FaStar,
  FaSlidersH,
  FaWaveSquare,
  FaChartArea,
} from 'react-icons/fa';

// Raw datasets
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';
import { getCachedCategoryData } from '@/lib/dataService';

const getDomainIcon = (id: FactDomainId) => {
  switch (id) {
    case 'research':
      return <FaFlask />;
    case 'academic':
      return <FaGraduationCap />;
    case 'publications':
      return <FaBook />;
    case 'service':
      return <FaHandsHelping />;
    case 'ip':
      return <FaCertificate />;
    case 'monitoring':
      return <FaClock />;
  }
};

interface ChartCategoryGroup {
  groupName: string;
  items: { type: ChartType; label: string; icon: any; desc: string }[];
}

const CHART_TYPES_CATALOG: ChartCategoryGroup[] = [
  {
    groupName: 'แผนภูมิแท่ง (Bar & Columns)',
    items: [
      { type: 'bar', label: 'คอลัมน์แนวตั้ง', icon: <FaChartBar />, desc: 'เปรียบเทียบค่าระหว่างหมวดหมู่ชัดเจน' },
      { type: 'horizontal_bar', label: 'แถบแนวนอน', icon: <FaSlidersH />, desc: 'เหมาะกับชื่อหมวดยาวหรือข้อมูลหลายกลุ่ม' },
      { type: 'stacked_bar', label: 'แท่งซ้อนรวม', icon: <FaLayerGroup />, desc: 'แสดงผลรวมพร้อมสัดส่วนองค์ประกอบ' },
      { type: 'grouped_bar', label: 'กลุ่มเคียงข้าง', icon: <FaChartBar />, desc: 'เปรียบเทียบ 2 มิติเคียงข้างกัน' },
    ],
  },
  {
    groupName: 'แผนภูมิเส้นและพื้นที่ (Line & Area)',
    items: [
      { type: 'smooth_line', label: 'เส้นโค้งสมูท', icon: <FaWaveSquare />, desc: 'วิเคราะห์แนวโน้มตามลำดับเวลาอย่างนุ่มนวล' },
      { type: 'line', label: 'เส้นตรงมาตรฐาน', icon: <FaChartLine />, desc: 'ดูอัตราการเติบโตและการเปลี่ยนแปลง' },
      { type: 'area', label: 'พื้นที่ไล่เฉด', icon: <FaChartArea />, desc: 'เน้นปริมาณสะสมตามช่วงเวลา' },
      { type: 'stacked_area', label: 'พื้นที่ซ้อนชั้น', icon: <FaLayerGroup />, desc: 'แนวโน้มรวมและสัดส่วนย่อยตามเวลา' },
    ],
  },
  {
    groupName: 'แผนภูมิสัดส่วนและรัศมี (Radial & Composition)',
    items: [
      { type: 'donut', label: 'โดนัทโมเดิร์น', icon: <FaChartPie />, desc: 'เปรียบเทียบสัดส่วนเปอร์เซ็นต์สะดุดตา' },
      { type: 'pie', label: 'วงกลมคลาสสิก', icon: <FaChartPie />, desc: 'แสดงส่วนแบ่งตลาดหรือสัดส่วนรวม' },
      { type: 'polar', label: 'พื้นที่เชิงขั้ว', icon: <FaWaveSquare />, desc: 'ดูความแตกต่างของสัดส่วนในเชิงรัศมี' },
      { type: 'radar', label: 'ใยแมงมุม Spider', icon: <FaLayerGroup />, desc: 'เปรียบเทียบสมรรถนะรอบด้านหลายมิติ' },
    ],
  },
  {
    groupName: 'สถิติและตารางสรุป (Matrix & Pivot)',
    items: [
      { type: 'pivot', label: 'ตารางสรุป Pivot', icon: <FaTable />, desc: 'ตารางวิเคราะห์สถิติจริงพร้อมยอดรวม' },
    ],
  },
];

export default function SelfServiceStudio() {
  const [query, setQuery] = useState<AnalyticsQuery>({
    factDomain: 'research',
    measureId: 'total_budget',
    primaryDimensionId: 'department',
    secondaryDimensionId: '',
    aggregationFn: undefined,
    chartType: undefined,
    selectedDept: 'all',
  });

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Map fact domain to raw dataset
  const currentDataset = useMemo(() => {
    switch (query.factDomain) {
      case 'research':
      case 'monitoring':
        return getCachedCategoryData('research') || rawResearch;
      case 'academic':
        return getCachedCategoryData('academic') || rawAcademic;
      case 'publications':
        return getCachedCategoryData('publications') || rawPublications;
      case 'service':
        return getCachedCategoryData('service') || rawServices;
      case 'ip':
        return getCachedCategoryData('ip') || rawIP;
      default:
        return getCachedCategoryData('research') || rawResearch;
    }
  }, [query.factDomain]);

  const currentDomainDef = FACT_DOMAINS_CONFIG[query.factDomain];

  // Execute Real Analytics Query
  const aggregatedData = useMemo(() => {
    return executeAnalyticsQuery(query, currentDataset);
  }, [query, currentDataset]);

  const activeChartType: ChartType = query.chartType || aggregatedData.recommendedChartType;

  // Render or Update Chart.js Instance
  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    if (activeChartType === 'pivot') return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    Chart.register(ChartDataLabels);

    let chartJsType: any = 'bar';
    let options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display:
            aggregatedData.datasets.length > 1 ||
            activeChartType === 'donut' ||
            activeChartType === 'pie' ||
            activeChartType === 'polar' ||
            activeChartType === 'radar',
          position: 'bottom',
          labels: {
            font: { family: "'Kanit', sans-serif", size: 12 },
            padding: 14,
            usePointStyle: true,
          },
        },
        datalabels: {
          display:
            activeChartType !== 'line' &&
            activeChartType !== 'smooth_line' &&
            activeChartType !== 'area' &&
            activeChartType !== 'radar',
          color:
            activeChartType === 'donut' || activeChartType === 'pie' || activeChartType === 'polar'
              ? '#ffffff'
              : '#0f172a',
          font: { family: "'Kanit', sans-serif", weight: 'bold', size: 11 },
          formatter: (value: any) => {
            if (!value || value === 0) return '';
            if (aggregatedData.format === 'currency') {
              return value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : value.toLocaleString();
            }
            return value.toLocaleString();
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { family: "'Kanit', sans-serif", size: 13, weight: 'bold' },
          bodyFont: { family: "'Kanit', sans-serif", size: 12 },
          padding: 12,
          cornerRadius: 12,
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const val = context.raw || 0;
              const formatted =
                aggregatedData.format === 'currency'
                  ? `${Number(val).toLocaleString()} บาท`
                  : Number(val).toLocaleString();
              return ` ${label}: ${formatted}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "'Kanit', sans-serif", size: 11.5 }, color: '#334155' },
        },
        y: {
          grid: { color: 'rgba(226, 232, 240, 0.7)' },
          ticks: {
            font: { family: "'Kanit', sans-serif", size: 11.5 },
            color: '#334155',
            callback: (v: any) => {
              if (aggregatedData.format === 'currency' && v >= 1000000) {
                return (v / 1000000).toFixed(1) + 'M ฿';
              }
              return v.toLocaleString();
            },
          },
        },
      },
    };

    // Chart type specific mapping
    if (activeChartType === 'horizontal_bar') {
      chartJsType = 'bar';
      options.indexAxis = 'y';
      // X-axis becomes the Value Axis (Numbers & Currency)
      options.scales.x = {
        grid: { color: 'rgba(226, 232, 240, 0.7)' },
        ticks: {
          font: { family: "'Kanit', sans-serif", size: 11.5 },
          color: '#334155',
          callback: (v: any) => {
            if (aggregatedData.format === 'currency' && v >= 1000000) {
              return (v / 1000000).toFixed(1) + 'M ฿';
            }
            return Number(v).toLocaleString();
          },
        },
      };
      // Y-axis becomes the Category Axis (Department & Dimension Names)
      options.scales.y = {
        grid: { display: false },
        ticks: {
          font: { family: "'Kanit', sans-serif", size: 11.5 },
          color: '#334155',
          // Do not override with number formatting so real category labels display
        },
      };
    } else if (activeChartType === 'stacked_bar') {
      chartJsType = 'bar';
      options.scales.x.stacked = true;
      options.scales.y.stacked = true;
    } else if (activeChartType === 'grouped_bar') {
      chartJsType = 'bar';
      options.scales.x.stacked = false;
      options.scales.y.stacked = false;
    } else if (activeChartType === 'smooth_line') {
      chartJsType = 'line';
      options.elements = {
        line: { tension: 0.45, borderWidth: 3.5 },
        point: { radius: 5, hoverRadius: 8 },
      };
    } else if (activeChartType === 'line') {
      chartJsType = 'line';
      options.elements = {
        line: { tension: 0.1, borderWidth: 3 },
        point: { radius: 5, hoverRadius: 7 },
      };
    } else if (activeChartType === 'area') {
      chartJsType = 'line';
      options.elements = {
        line: { tension: 0.4, borderWidth: 3, fill: true },
        point: { radius: 4 },
      };
    } else if (activeChartType === 'stacked_area') {
      chartJsType = 'line';
      options.scales.y.stacked = true;
      options.elements = {
        line: { tension: 0.35, borderWidth: 2.5, fill: true },
      };
    } else if (activeChartType === 'donut') {
      chartJsType = 'doughnut';
      delete options.scales;
      options.cutout = '65%';
    } else if (activeChartType === 'pie') {
      chartJsType = 'pie';
      delete options.scales;
    } else if (activeChartType === 'polar') {
      chartJsType = 'polarArea';
      delete options.scales;
    } else if (activeChartType === 'radar') {
      chartJsType = 'radar';
      delete options.scales;
    }

    // Prepare datasets with fill property if area
    const formattedDatasets = aggregatedData.datasets.map((d) => ({
      ...d,
      fill: activeChartType === 'area' || activeChartType === 'stacked_area',
    }));

    chartInstance.current = new Chart(ctx, {
      type: chartJsType,
      data: {
        labels: aggregatedData.labels,
        datasets: formattedDatasets,
      },
      options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [aggregatedData, activeChartType]);

  // Handle Domain Change
  const handleDomainChange = (domainId: FactDomainId) => {
    const domain = FACT_DOMAINS_CONFIG[domainId];
    setQuery({
      factDomain: domainId,
      measureId: domain.measures[0].id,
      primaryDimensionId: domain.dimensions[0].id,
      secondaryDimensionId: '',
      aggregationFn: undefined,
      chartType: undefined,
      selectedDept: 'all',
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['กลุ่มข้อมูล (Category)'];
    if (query.secondaryDimensionId) headers.push('มิติย่อย (Sub-Category)');
    headers.push('ค่าที่วัดได้ (Value)', 'สัดส่วน (% Share)');

    const rows = aggregatedData.tableRows.map((r) => {
      const line = [`"${r.category}"`];
      if (query.secondaryDimensionId) line.push(`"${r.subCategory || '-'}"`);
      line.push(r.value.toString(), `"${r.sharePercent}"`);
      return line.join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BI_Studio_${query.factDomain}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="liquid-glass-bg" style={{ padding: '24px 32px 60px' }}>
      {/* 1. Header & Domain Capsule */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'rgba(0, 168, 89, 0.12)',
                border: '1px solid rgba(0, 168, 89, 0.28)',
                color: '#006838',
                fontSize: '12.5px',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              <FaMagic /> สตูดิโอวิเคราะห์ข้อมูลแบบบริการตนเอง (Self-Service BI Studio)
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              ศูนย์วิเคราะห์และออกแบบมิติมุมมองข้อมูล คณะวิศวกรรมศาสตร์
            </h1>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
              กำหนดแกน X, แกน Y, มิติย่อยจัดกลุ่ม และเลือกรูปแบบกราฟที่เหมาะสมจากคลัง 16 รูปแบบได้อย่างอิสระ
            </p>
          </div>

          {/* Quick Domain Selector Pills */}
          <div className="liquid-glass-dock" style={{ display: 'flex', padding: '6px', gap: '6px', flexWrap: 'wrap' }}>
            {(Object.keys(FACT_DOMAINS_CONFIG) as FactDomainId[]).map((dId) => {
              const def = FACT_DOMAINS_CONFIG[dId];
              const isActive = query.factDomain === dId;
              return (
                <button
                  key={dId}
                  onClick={() => handleDomainChange(dId)}
                  type="button"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    fontSize: '12.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? '#00a859' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    fontWeight: isActive ? 700 : 500,
                    boxShadow: isActive ? '0 4px 12px rgba(0, 168, 89, 0.35)' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span>{getDomainIcon(dId)}</span>
                  <span>{def.nameTh}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Visual Query Builder Panel (Apple iOS Liquid Glass Surface - No Bounce) */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(226, 232, 240, 0.7)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaSlidersH style={{ color: '#00a859', fontSize: '18px' }} />
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#0f172a' }}>
              กำหนดแกนและตัวแปรในการวิเคราะห์ (Axis & Query Configuration)
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            ฐานข้อมูล: <strong>{currentDomainDef.nameTh}</strong> ({aggregatedData.count} รายการ)
          </span>
        </div>

        {/* 4 Core Control Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          {/* A. X-Axis (Primary Dimension) */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              <FaThList style={{ marginRight: '6px', color: '#7c3aed' }} />
              1. แกน X (มิติหลัก / จัดกลุ่ม)
            </label>
            <Select
              value={query.primaryDimensionId}
              onValueChange={(val) => {
                if (val) setQuery((prev) => ({ ...prev, primaryDimensionId: val }));
              }}
            >
              <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                <SelectValue placeholder="เลือกมิติหลัก" />
              </SelectTrigger>
              <SelectContent>
                {currentDomainDef.dimensions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* B. Y-Axis (Measure Field) */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              <FaCalculator style={{ marginRight: '6px', color: '#0284c7' }} />
              2. แกน Y (ตัววัดเชิงปริมาณ)
            </label>
            <Select
              value={query.measureId}
              onValueChange={(val) => {
                if (val) setQuery((prev) => ({ ...prev, measureId: val }));
              }}
            >
              <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                <SelectValue placeholder="เลือกตัววัด" />
              </SelectTrigger>
              <SelectContent>
                {currentDomainDef.measures.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* C. Aggregation Function */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              <FaMagic style={{ marginRight: '6px', color: '#00a859' }} />
              3. ฟังก์ชันรวมค่า (Aggregation)
            </label>
            <Select
              value={query.aggregationFn || currentDomainDef.measures.find((m) => m.id === query.measureId)?.aggregation || 'SUM'}
              onValueChange={(val) => {
                if (val) setQuery((prev) => ({ ...prev, aggregationFn: val as AggregationType }));
              }}
            >
              <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9">
                <SelectValue placeholder="เลือกฟังก์ชันรวมค่า" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUM">ผลรวมทั้งหมด (SUM)</SelectItem>
                <SelectItem value="COUNT">จำนวนรายการ (COUNT)</SelectItem>
                <SelectItem value="AVG">ค่าเฉลี่ย (AVERAGE)</SelectItem>
                <SelectItem value="MAX">ค่าสูงสุด (MAX)</SelectItem>
                <SelectItem value="MIN">ค่าต่ำสุด (MIN)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* D. Secondary Dimension (Breakdown / Z-Axis) */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              <FaLayerGroup style={{ marginRight: '6px', color: '#f59e0b' }} />
              4. มิติย่อยซ้อน (Series / Z-Axis)
            </label>
            <Select
              value={query.secondaryDimensionId || '__none__'}
              onValueChange={(val) => {
                setQuery((prev) => ({
                  ...prev,
                  secondaryDimensionId: val === '__none__' ? undefined : (val ?? undefined),
                }));
              }}
            >
              <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9">
                <SelectValue placeholder="(ไม่มี - ดูมิติเดียว)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">(ไม่มี - ดูมิติเดียว)</SelectItem>
                {currentDomainDef.dimensions
                  .filter((d) => d.id !== query.primaryDimensionId)
                  .map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 16 Chart Types Palette */}
        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(226, 232, 240, 0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
              เลือกรูปแบบกราฟที่ต้องการ (คลังแผนภาพวิเคราะห์ 16 รูปแบบ):
            </span>
            <button
              type="button"
              onClick={() => setQuery((prev) => ({ ...prev, chartType: aggregatedData.recommendedChartType }))}
              className="glass-btn"
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#006838',
                borderColor: 'rgba(0, 168, 89, 0.4)',
                background: 'rgba(240, 253, 244, 0.9)',
              }}
            >
              <FaStar style={{ color: '#eab308' }} /> ใช้กราฟที่ระบบแนะนำ
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {CHART_TYPES_CATALOG.map((group) => (
              <div key={group.groupName} style={{ background: 'rgba(248, 250, 252, 0.7)', borderRadius: '14px', padding: '10px 12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {group.groupName}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {group.items.map((btn) => {
                    const isSelected = activeChartType === btn.type;
                    const isRecommended = aggregatedData.recommendedChartType === btn.type;
                    return (
                      <button
                        key={btn.type}
                        type="button"
                        onClick={() => setQuery((prev) => ({ ...prev, chartType: btn.type }))}
                        className="glass-btn"
                        title={btn.desc}
                        style={{
                          padding: '7px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11.5px',
                          borderRadius: '8px',
                          border: isSelected
                            ? '2px solid #00a859'
                            : isRecommended
                            ? '1px dashed #00a859'
                            : '1px solid rgba(226, 232, 240, 0.9)',
                          background: isSelected ? 'rgba(0, 168, 89, 0.15)' : '#ffffff',
                          color: isSelected ? '#006838' : '#334155',
                          fontWeight: isSelected ? 700 : 500,
                          position: 'relative',
                        }}
                      >
                        <span style={{ fontSize: '13px', color: isSelected ? '#00a859' : '#64748b' }}>{btn.icon}</span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{btn.label}</span>
                        {isRecommended && (
                          <FaStar
                            style={{
                              marginLeft: 'auto',
                              fontSize: '10px',
                              color: '#eab308',
                              flexShrink: 0,
                            }}
                            title="ระบบแนะนำแผนภาพนี้"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation Alert */}
        <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '12px', background: 'rgba(240, 253, 244, 0.85)', border: '1px solid rgba(167, 243, 208, 0.7)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaLightbulb style={{ color: '#059669', fontSize: '16px', flexShrink: 0 }} />
          <span style={{ fontSize: '12.5px', color: '#065f46' }}>
            <strong>คำแนะนำอัจฉริยะ (Smart Chart Advisor):</strong> {aggregatedData.recommendationReason}
          </span>
        </div>
      </div>

      {/* 3. Summary Metric Cards (Apple iOS Style Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ยอดรวมทั้งหมด (Total Value)</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#006838', marginTop: '4px' }}>
            {aggregatedData.totalValue.toLocaleString()}{' '}
            {aggregatedData.format === 'currency' ? <span style={{ fontSize: '14px', fontWeight: 600 }}>บาท</span> : ''}
          </div>
          <div style={{ fontSize: '11px', color: '#059669', marginTop: '3px' }}>จากข้อมูลทั้งหมด {aggregatedData.count} แถว</div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ค่าเฉลี่ยต่อกลุ่ม (Average)</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            {Math.round(aggregatedData.averageValue).toLocaleString()}{' '}
            {aggregatedData.format === 'currency' ? <span style={{ fontSize: '14px', fontWeight: 600 }}>บาท</span> : ''}
          </div>
          <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '3px' }}>เฉลี่ยใน {aggregatedData.labels.length} กลุ่มมิติ</div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ค่าสูงสุดในกลุ่ม (Peak Group)</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>
            {aggregatedData.maxValue.toLocaleString()}{' '}
            {aggregatedData.format === 'currency' ? <span style={{ fontSize: '14px', fontWeight: 600 }}>บาท</span> : ''}
          </div>
          <div style={{ fontSize: '11px', color: '#7c3aed', marginTop: '3px' }}>กลุ่มที่มีสัดส่วนมากที่สุด</div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>จำนวนกลุ่มข้อมูล (Categories)</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {aggregatedData.labels.length} <span style={{ fontSize: '14px', fontWeight: 600 }}>กลุ่ม</span>
          </div>
          <div style={{ fontSize: '11px', color: '#b45309', marginTop: '3px' }}>ตามมิติ {currentDomainDef.dimensions.find((d) => d.id === query.primaryDimensionId)?.label}</div>
        </div>
      </div>

      {/* 4. Chart Visualization & Table Matrix (Dual View) */}
      <div style={{ display: 'grid', gridTemplateColumns: activeChartType === 'pivot' ? '1fr' : '1.7fr 1fr', gap: '20px' }}>
        {/* Main Chart Area */}
        {activeChartType !== 'pivot' && (
          <div className="glass-card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#0f172a' }}>
                  แผนภาพวิเคราะห์: {currentDomainDef.measures.find((m) => m.id === query.measureId)?.label} จำแนกตาม{' '}
                  {currentDomainDef.dimensions.find((d) => d.id === query.primaryDimensionId)?.label}
                </h3>
                {query.secondaryDimensionId && (
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    และจำแนกมิติย่อยตาม: {currentDomainDef.dimensions.find((d) => d.id === query.secondaryDimensionId)?.label}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="glow-badge-active">สดจาก Data Warehouse</span>
              </div>
            </div>

            <div style={{ position: 'relative', height: '390px', width: '100%', flex: 1 }}>
              <canvas ref={chartRef} />
            </div>
          </div>
        )}

        {/* Detailed Pivot Matrix Table */}
        <div className="glass-card" style={{ padding: '20px 22px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaTable style={{ color: '#00a859', fontSize: '15px' }} />
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
                ตารางสรุปสถิติ (Detailed Pivot Table)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="glass-btn"
              style={{
                padding: '4px 10px',
                fontSize: '11.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#006838',
              }}
            >
              <FaDownload /> ส่งออก CSV
            </button>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: activeChartType === 'pivot' ? '540px' : '390px', overflowY: 'auto' }}>
            <table className="glass-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>กลุ่มข้อมูล (แกน X)</th>
                  {query.secondaryDimensionId && (
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>มิติย่อย (Series)</th>
                  )}
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>ค่าที่วัดได้ (แกน Y)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>สัดส่วน (%)</th>
                </tr>
              </thead>
              <tbody>
                {aggregatedData.tableRows.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '9px 12px', fontWeight: 600, color: '#0f172a' }}>{row.category}</td>
                    {query.secondaryDimensionId && (
                      <td style={{ padding: '9px 12px', color: '#475569' }}>{row.subCategory || '-'}</td>
                    )}
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: '#006838' }}>
                      {row.formattedValue}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', color: '#64748b' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: 'rgba(0, 168, 89, 0.1)',
                          color: '#006838',
                          fontWeight: 600,
                          fontSize: '11px',
                        }}
                      >
                        {row.sharePercent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

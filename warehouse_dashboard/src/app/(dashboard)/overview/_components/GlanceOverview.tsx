'use client';

import React, { useMemo } from 'react';
import { FaFlask, FaGraduationCap, FaBook, FaHandshake, FaCertificate } from 'react-icons/fa';
import { CANONICAL_DEPARTMENTS, matchDepartmentCode } from '@/config/departments';
import { getDepartment } from '@/lib/departments';
import { classifyPublicationTier, isInternationalTier, isNationalTier } from '../_services/kpiScorecard';
import { MISSION_THEMES, resolveItemStrategicAlignment } from '@/lib/pastelTheme';
import { resolveItemFiscalYear } from '@/types/timeFilter';
import type { OverviewKpiScore } from '../_hooks/useOverviewData';
import { KpiPulseRow } from './glance/KpiPulseRow';
import { MissionPulseTiles, type MissionPulse } from './glance/MissionPulseTiles';
import { BudgetDonut } from './glance/BudgetDonut';
import { DepartmentHeatmap, type HeatmapColumn, type HeatmapRow } from './glance/DepartmentHeatmap';
import { StrategicStrip } from './glance/StrategicStrip';
import { formatMoney, monthlyCounts, researchBudget } from './glance/glanceUtils';

interface GlanceOverviewProps {
  research: any[];
  academic: any[];
  publications: any[];
  service: any[];
  ip: any[];
  kpis: OverviewKpiScore[];
  fiscalYearProgress: number;
  /** Fiscal-year filter value ('all' or a BE year such as '2570'). */
  fiscalYear: string;
  selectedDept: string;
  onSelectDept: (dept: string) => void;
}

const COLUMNS: HeatmapColumn[] = [
  { key: 'research', label: 'วิจัย', icon: FaFlask, accent: MISSION_THEMES.research.card.icon },
  { key: 'academic', label: 'วิชาการ', icon: FaGraduationCap, accent: MISSION_THEMES.academic.card.icon },
  { key: 'publications', label: 'ตีพิมพ์', icon: FaBook, accent: MISSION_THEMES.publications.card.icon },
  { key: 'service', label: 'บริการ', icon: FaHandshake, accent: MISSION_THEMES.service.card.icon },
  { key: 'ip', label: 'IP', icon: FaCertificate, accent: MISSION_THEMES.ip.card.icon },
];

function currentFiscalYearBE(now: Date): number {
  return (now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear()) + 543;
}

export function GlanceOverview({
  research,
  academic,
  publications,
  service,
  ip,
  kpis,
  fiscalYearProgress,
  fiscalYear,
  selectedDept,
  onSelectDept,
}: GlanceOverviewProps) {
  const now = new Date();
  const showsCurrentYear = fiscalYear === 'all' || fiscalYear === String(currentFiscalYearBE(now));
  const currentFiscalMonth = showsCurrentYear ? (now.getMonth() + 3) % 12 : -1;
  const isFiltered = selectedDept !== 'all';

  const missions: MissionPulse[] = useMemo(() => {
    const resBudget = research.reduce((s, r) => s + researchBudget(r), 0);
    const acaBudget = academic.reduce((s, a) => s + (Number(a.budget) || 0), 0);

    // Publication quality breakdown: Q1–Q4 vs TCI 1–2
    let qCount = 0;
    let tciCount = 0;
    publications.forEach((p) => {
      const tier = classifyPublicationTier(p);
      if (isInternationalTier(tier)) qCount++;
      else if (isNationalTier(tier)) tciCount++;
    });

    const staff = new Set(service.map((s) => s.person).filter(Boolean)).size;
    const protectedIp = ip.filter((i) => String(i.status || '').includes('คุ้มครอง')).length;
    const money = (v: number) => {
      const m = formatMoney(v);
      return `${m.num} ${m.unit}`;
    };

    return [
      {
        key: 'research',
        label: 'วิจัย',
        icon: FaFlask,
        color: MISSION_THEMES.research.color,
        count: research.length,
        unit: 'โครงการ',
        route: '/research',
        monthly: monthlyCounts(research, (r) => [r.start_date || r.date]),
        highlight: { label: 'งบ', value: money(resBudget) },
      },
      {
        key: 'academic',
        label: 'พัฒนาวิชาการ',
        icon: FaGraduationCap,
        color: MISSION_THEMES.academic.color,
        count: academic.length,
        unit: 'โครงการ',
        route: '/academic',
        monthly: monthlyCounts(academic, (a) => [a.start_date || a.date, a.month]),
        highlight: { label: 'งบ', value: money(acaBudget) },
      },
      {
        key: 'publications',
        label: 'ตีพิมพ์',
        icon: FaBook,
        color: MISSION_THEMES.publications.color,
        count: publications.length,
        unit: 'เรื่อง',
        route: '/publications',
        monthly: monthlyCounts(publications, (p) => [p.month_year || p.pub_date || p.date, p.month]),
        highlight: { label: 'Q1–Q4', value: `${qCount} เรื่อง (TCI: ${tciCount})` },
      },
      {
        key: 'service',
        label: 'บริการวิชาการ',
        icon: FaHandshake,
        color: MISSION_THEMES.service.color,
        count: service.length,
        unit: 'ครั้ง',
        route: '/service',
        monthly: monthlyCounts(service, (s) => [s.date]),
        highlight: { label: 'ผู้ให้บริการ', value: `${staff} คน` },
      },
      {
        key: 'ip',
        label: 'ทรัพย์สินทางปัญญา',
        icon: FaCertificate,
        color: MISSION_THEMES.ip.color,
        count: ip.length,
        unit: 'รายการ',
        route: '/ip',
        monthly: monthlyCounts(ip, (i) => [i.filing_date || i.date]),
        highlight: { label: 'คุ้มครองแล้ว', value: `${protectedIp} รายตาราง` },
      },
    ];
  }, [research, academic, publications, service, ip]);

  const budgetSegments = useMemo(() => {
    const external = research.reduce((s, r) => s + (Number(r.budget_external) || 0), 0);
    const totalRes = research.reduce((s, r) => s + researchBudget(r), 0);
    const academicBudget = academic.reduce((s, a) => s + (Number(a.budget) || 0), 0);
    return [
      { key: 'res_ext', label: 'วิจัย · ทุนภายนอก', value: external, color: '#34D399' },
      { key: 'res_int', label: 'วิจัย · ทุนภายใน', value: Math.max(0, totalRes - external), color: '#6EE7B7' },
      { key: 'academic', label: 'พัฒนาวิชาการ', value: academicBudget, color: '#38BDF8' },
    ];
  }, [research, academic]);

  const heatmapRows: HeatmapRow[] = useMemo(() => {
    const rows: Record<string, HeatmapRow> = {};
    CANONICAL_DEPARTMENTS.forEach((d) => {
      rows[d.code] = {
        code: d.code,
        name: d.name,
        filterValue: getDepartment(d.code).name,
        values: { research: 0, academic: 0, publications: 0, service: 0, ip: 0 },
        budget: 0,
      };
    });
    const tally = (items: any[], key: string, budgetOf?: (it: any) => number) => {
      items.forEach((it) => {
        const code = matchDepartmentCode(it.department);
        if (!code || !rows[code]) return;
        rows[code].values[key] += 1;
        if (budgetOf) rows[code].budget += budgetOf(it);
      });
    };
    tally(research, 'research', researchBudget);
    tally(academic, 'academic', (a) => Number(a.budget) || 0);
    tally(publications, 'publications');
    tally(service, 'service');
    tally(ip, 'ip');

    const total = (r: HeatmapRow) => Object.values(r.values).reduce((a, b) => a + b, 0);
    return Object.values(rows).sort((a, b) => total(b) - total(a) || b.budget - a.budget);
  }, [research, academic, publications, service, ip]);

  const { topSdgs, isee, iam } = useMemo(() => {
    const sdgCounts: Record<number, number> = {};
    const iseeCounts: Record<string, number> = { I: 0, S: 0, E1: 0, E2: 0 };
    const iamCounts: Record<string, number> = { I: 0, A: 0, M: 0 };
    const groups: [any[], string][] = [
      [research, 'research'],
      [academic, 'academic'],
      [publications, 'publications'],
      [service, 'service'],
      [ip, 'ip'],
    ];
    groups.forEach(([items, category]) => {
      items.forEach((it) => {
        const res = resolveItemStrategicAlignment(it, category);
        iseeCounts[res.isee] += 1;
        iamCounts[res.iam] += 1;
        if (res.sdgNumber >= 1 && res.sdgNumber <= 17) {
          sdgCounts[res.sdgNumber] = (sdgCounts[res.sdgNumber] || 0) + 1;
        }
      });
    });
    const top = Object.entries(sdgCounts)
      .map(([num, count]) => ({ num: Number(num), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    return { topSdgs: top, isee: iseeCounts, iam: iamCounts };
  }, [research, academic, publications, service, ip]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. KPI Pulse Row (เป้าหมายปีงบประมาณ หรือสัดส่วนผลงานต่อเป้าคณะ) */}
      <KpiPulseRow kpis={kpis} fiscalYearProgress={fiscalYearProgress} isFiltered={isFiltered} />

      {/* 3. 5-Mission Pulse Tiles (พร้อม YoY Delta ▲▼ และคุณภาพตีพิมพ์) */}
      <MissionPulseTiles missions={missions} currentFiscalMonth={currentFiscalMonth} />

      {/* 4. Total Budget & Department Heatmap */}
      <div className="glance-split" style={{ display: 'grid', gap: '16px', alignItems: 'stretch' }}>
        <BudgetDonut segments={budgetSegments} />
        <DepartmentHeatmap columns={COLUMNS} rows={heatmapRows} selected={selectedDept} onSelect={onSelectDept} />
      </div>

      {/* 5. Strategic Alignment (SDGs & ISEE & IAM) */}
      <StrategicStrip topSdgs={topSdgs} isee={isee} iam={iam} />
    </div>
  );
}

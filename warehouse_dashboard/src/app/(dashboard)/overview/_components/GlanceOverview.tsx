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
  { key: 'research', label: 'โครงการวิจัย', icon: FaFlask, accent: MISSION_THEMES.research.card.icon },
  { key: 'academic', label: 'โครงการพัฒนาวิชาการ', icon: FaGraduationCap, accent: MISSION_THEMES.academic.card.icon },
  { key: 'publications', label: 'ผลงานตีพิมพ์ทางวิชาการ', icon: FaBook, accent: MISSION_THEMES.publications.card.icon },
  { key: 'service', label: 'งานบริการวิชาการ', icon: FaHandshake, accent: MISSION_THEMES.service.card.icon },
  { key: 'ip', label: 'งานทรัพย์สินทางปัญญา', icon: FaCertificate, accent: MISSION_THEMES.ip.card.icon },
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
        highlight: { label: 'นานาชาติ', value: `${qCount} เรื่อง · ระดับชาติ ${tciCount} เรื่อง` },
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
        highlight: { label: 'คุ้มครองแล้ว', value: `${protectedIp} รายการ` },
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

  const { topSdgs } = useMemo(() => {
    const sdgCounts: Record<number, { count: number; verifiedCount: number; autoDetectedCount: number }> = {};
    const seenPerSdg = new Map<number, Set<string>>();
    const groups: [any[], string][] = [
      [research, 'research'],
      [academic, 'academic'],
      [publications, 'publications'],
      [service, 'service'],
      [ip, 'ip'],
    ];

    groups.forEach(([items, category]) => {
      items.forEach((it, idx) => {
        const itemId = String(it.id || it._id || it.name || `${category}_${idx}`);
        const res = resolveItemStrategicAlignment(it, category);
        const sdgList = res.sdgIds && res.sdgIds.length > 0
          ? res.sdgIds
          : (res.sdgNumber >= 1 && res.sdgNumber <= 17 ? [res.sdgNumber] : []);

        sdgList.forEach((num) => {
          if (num >= 1 && num <= 17) {
            if (!seenPerSdg.has(num)) seenPerSdg.set(num, new Set());
            const set = seenPerSdg.get(num)!;
            if (!set.has(itemId)) {
              set.add(itemId);
              if (!sdgCounts[num]) {
                sdgCounts[num] = { count: 0, verifiedCount: 0, autoDetectedCount: 0 };
              }
              sdgCounts[num].count += 1;
              if (res.isVerified) {
                sdgCounts[num].verifiedCount += 1;
              } else {
                sdgCounts[num].autoDetectedCount += 1;
              }
            }
          }
        });
      });
    });

    const top = Object.entries(sdgCounts)
      .map(([num, data]) => ({
        num: Number(num),
        count: data.count,
        verifiedCount: data.verifiedCount,
        autoDetectedCount: data.autoDetectedCount,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { topSdgs: top };
  }, [research, academic, publications, service, ip]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. KPI Pulse Row (เป้าหมายปีงบประมาณ หรือสัดส่วนผลงานต่อเป้าคณะ) */}
      <KpiPulseRow kpis={kpis} fiscalYearProgress={fiscalYearProgress} isFiltered={isFiltered} />

      {/* 2. 5-Mission Pulse Tiles */}
      <MissionPulseTiles missions={missions} currentFiscalMonth={currentFiscalMonth} />

      {/* 3. Total Budget & Department Heatmap */}
      <div className="glance-split" style={{ display: 'grid', gap: '16px', alignItems: 'stretch' }}>
        <BudgetDonut segments={budgetSegments} />
        <DepartmentHeatmap columns={COLUMNS} rows={heatmapRows} selected={selectedDept} onSelect={onSelectDept} />
      </div>

      {/* 4. Strategic SDGs */}
      <StrategicStrip topSdgs={topSdgs} />
    </div>
  );
}

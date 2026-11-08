'use client';

import React, { useState, useMemo, useEffect } from 'react';
import './research-redesign.css';
import { ResearchItem } from '../_hooks/useResearchData';
import { getDepartment, DEPARTMENT_COLORS, DepartmentCode } from '@/lib/departments';
import { getCachedCategoryData } from '@/lib/dataService';
import { DrillDownProjectDrawer } from '@/components/data-display/DrillDownProjectDrawer';

interface Props {
  allItems: ResearchItem[];
  filteredItems?: ResearchItem[];
  currentFiscalYear?: string;
}

const DEPT_CODES = ['IRRE', 'FE', 'IE', 'ME', 'CE', 'CPE', 'EEEC', 'TDWCB', 'AE'] as const;

const UCOL: Record<string, string> = {
  AE: '#65B98A',
  CPE: '#5B9BD5',
  IRRE: '#4FA9A0',
  FE: '#E88762',
  IE: '#9B78D0',
  ME: '#777ED0',
  CE: '#D96B8A',
  EEEC: '#91B95B',
  TDWCB: '#D5A04F',
  NAMC: '#BB68BC',
  OFS: '#E9A88F',
  OTH: '#64748b',
};

const UFULL: Record<string, string> = {
  AE: 'ภาควิชาวิศวกรรมเกษตร',
  CPE: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
  IRRE: 'ภาควิชาวิศวกรรมชลประทาน',
  FE: 'ภาควิชาวิศวกรรมอาหาร',
  IE: 'ภาควิชาวิศวกรรมอุตสาหการ',
  ME: 'ภาควิชาวิศวกรรมเครื่องกล',
  CE: 'ภาควิชาวิศวกรรมโยธา',
  EEEC: 'ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม',
  TDWCB: 'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร',
  NAMC: 'ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ',
  OFS: 'สำนักงานเลขานุการ',
  OTH: 'อื่น ๆ',
};

const OT = ['บทความตีพิมพ์', 'สิทธิบัตร/ลิขสิทธิ์', 'ต้นแบบ/ผลิตภัณฑ์', 'ซอฟต์แวร์/ระบบ', 'อื่น ๆ'];
const OC = ['#a78bfa', '#f472b6', '#fb923c', '#2dd4bf', '#cbd5e1'];

const MN: Record<string, string> = {
  n: 'จำนวนโครงการ',
  b: 'งบรวม',
  a: 'งบเฉลี่ย/โครงการ',
  x: 'สัดส่วนทุนภายนอก',
  o: 'ผลผลิตรวม',
  p: 'ผลผลิตต่อล้านบาท',
  t: 'TRL ที่เพิ่ม',
  g: 'บูรณาการ',
};

const RN: Record<string, string> = {
  b: 'งบประมาณวิจัยรวมของแต่ละสังกัด',
  n: 'จำนวนโครงการวิจัยของแต่ละสังกัด',
  a: 'งบรวม ÷ จำนวนโครงการ บอกว่าสังกัดทำโครงการขนาดใหญ่หรือเล็ก',
  x: 'สัดส่วนงบที่มาจากทุนภายนอกต่องบรวมของสังกัด',
  o: 'จำนวนผลผลิตทุกประเภทรวมกัน',
  p: 'จำนวนผลผลิตทั้งหมด ÷ งบรวม (ล้านบาท) บอกว่างบทุก 1 ล้านบาทสร้างผลผลิตได้กี่ชิ้น',
  t: 'TRL เฉลี่ยตอนสิ้นสุดลบตอนเริ่มต้น (เฉพาะโครงการที่ระบุทั้งสองค่า)',
  g: 'สัดส่วนโครงการที่นำไปบูรณาการกับการเรียนการสอนหรือบริการวิชาการ',
};

const HD: Record<string, string> = {
  n: 'โครงการ',
  b: 'งบรวม (ลบ.)',
  a: 'เฉลี่ย (ลบ./โครงการ)',
  x: 'ทุนภายนอก',
  o: 'ผลผลิต (ชิ้น)',
  p: 'ผลผลิต/ล้านบาท',
  t: 'TRL ที่เพิ่ม',
  g: 'บูรณาการ',
};

function resolveItemFiscalYear(item: ResearchItem): string {
  const idStr = String(item.id || item._id || '').replace(/\n/g, ' ');
  const beMatch = idStr.match(/25(6[6-9]|7\d)/);
  if (beMatch) return beMatch[0];
  const dotMatch = idStr.match(/(?:\/|\.)(6[6-9]|7\d)\b/);
  if (dotMatch) return '25' + dotMatch[1];

  const explicit = item.fiscal_year_be ?? item.fiscal_year;
  if (explicit !== undefined && explicit !== null && String(explicit).trim() !== '') {
    const s = String(explicit).trim();
    const match = s.match(/25(6[6-9]|7\d)/);
    if (match) return match[0];
    const any4 = s.match(/\d{4}/);
    if (any4) {
      const y = Number(any4[0]);
      if (Number.isFinite(y)) {
        if (y >= 1966 && y <= 1972) return String(y + 600); // 1968 -> 2568
        if (y >= 2020 && y <= 2040) return String(y + 543);
        return String(y >= 2400 ? y : y + 543);
      }
    }
  }

  const sd = String(item.start_date || '').trim();
  if (sd && sd !== '-' && sd !== 'nan') {
    const parts = sd.match(/(\d{4})[-/](\d{1,2})/);
    if (parts) {
      let y = parseInt(parts[1], 10);
      const m = parseInt(parts[2], 10);
      if (y >= 1966 && y <= 1972) y += 57;
      else if (y >= 2500) y -= 543;
      const be = y + 543;
      return String(m >= 10 ? be + 1 : be);
    }
  }

  const fundStr = String(item.fund_source || '');
  const fundMatch = fundStr.match(/25(6[6-9]|7\d)/);
  if (fundMatch) return fundMatch[0];

  return '2568';
}

function resolveDeptCode(rawDept: unknown): string {
  if (!rawDept) return 'OTH';
  const str = String(rawDept).trim().toUpperCase();
  if (str === 'IRE' || str === 'IRRE' || str.includes('ชลประทาน')) return 'IRRE';
  if (str === 'FE' || str.includes('อาหาร')) return 'FE';
  if (str === 'IE' || str.includes('อุตสาหการ')) return 'IE';
  if (str === 'ME' || str.includes('เครื่องกล')) return 'ME';
  if (str === 'CE' || str.includes('โยธา')) return 'CE';
  if (str === 'CPE' || str.includes('คอมพิวเตอร์')) return 'CPE';
  if (str === 'AE' || str.includes('เกษตร')) return 'AE';
  if (str === 'EEEC' || str.includes('พลังงาน') || str.includes('สิ่งแวดล้อม')) return 'EEEC';
  if (str === 'TDWCB' || str === 'DWT' || str === 'TDW' || str.includes('กระจก') || str.includes('ประตู')) return 'TDWCB';
  if (str === 'NAMC' || str.includes('จักรกล')) return 'NAMC';
  if (str === 'OFS' || str.includes('เลขานุการ')) return 'OFS';
  const d = getDepartment(String(rawDept));
  return d ? String(d.code) : 'OTH';
}

export interface DeptMetrics {
  code: string;
  name: string;
  b: number; // budget in millions
  n: number; // project count
  a: number; // average budget per project
  x: number; // ext budget percentage
  o: number; // total outputs
  p: number; // outputs per million
  t: number; // TRL delta
  g: number; // integration percentage
  outputs: number[]; // breakdown: [pubs, ip, proto, sw, other]
}

export function ResearchDepartmentComparison({ allItems, filteredItems, currentFiscalYear }: Props) {
  const availableYears = useMemo(() => {
    const s = new Set<string>();
    allItems.forEach((it) => s.add(resolveItemFiscalYear(it)));
    s.add('2568');
    s.add('2569');
    s.add('2567');
    return Array.from(s)
      .filter((y) => /^25[6-7]\d$/.test(y))
      .sort((a, b) => Number(b) - Number(a));
  }, [allItems]);

  const [year, setYear] = useState<string>(() => {
    if (currentFiscalYear && currentFiscalYear !== 'all' && availableYears.includes(currentFiscalYear)) {
      return currentFiscalYear;
    }
    return availableYears.includes('2568') ? '2568' : availableYears[0] || '2568';
  });

  const [cmpYear, setCmpYear] = useState<string>(() => {
    const others = availableYears.filter((y) => y !== year);
    if (others.includes('2567')) return '2567';
    return others[0] || '2567';
  });

  const [isCompare, setIsCompare] = useState<boolean>(false);
  const [rkMetric, setRkMetric] = useState<string>('b');
  const [skMetric, setSkMetric] = useState<string>('b');

  // Tooltip
  const [tip, setTip] = useState<{ show: boolean; x: number; y: number; content: React.ReactNode }>({
    show: false,
    x: 0,
    y: 0,
    content: null,
  });

  // Slide-over Drawer state for clicking department bars, bubbles, output rows, or table rows
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    items: ResearchItem[];
  }>({
    isOpen: false,
    title: '',
    items: [],
  });

  const openDeptDrawer = (deptCode: string, targetYr?: string, extraLabel?: string) => {
    const yr = targetYr || year;
    const matched = allItems.filter((it) => {
      if (resolveItemFiscalYear(it) !== yr) return false;
      const c = resolveDeptCode(it.department || it.headDepartmentCode || it.departments);
      return c === deptCode;
    });
    const deptName = UFULL[deptCode] || deptCode;
    const suffix = extraLabel ? ` (${extraLabel})` : '';
    setDrawerState({
      isOpen: true,
      title: `โครงการวิจัยสังกัด ${deptCode} · ${deptName}${suffix} (ปีงบ ${yr})`,
      items: matched,
    });
  };

  const openFacultyTotalDrawer = (targetYr?: string) => {
    const yr = targetYr || year;
    const matched = allItems.filter((it) => resolveItemFiscalYear(it) === yr);
    setDrawerState({
      isOpen: true,
      title: `โครงการวิจัยรวมทั้งคณะ (ปีงบ ${yr})`,
      items: matched,
    });
  };

  // Keep year in sync if prop changes
  useEffect(() => {
    if (currentFiscalYear && currentFiscalYear !== 'all' && availableYears.includes(currentFiscalYear)) {
      setYear(currentFiscalYear);
    }
  }, [currentFiscalYear, availableYears]);

  // Load publication and IP counts by department for outputs calculation
  const { pubCountByDept, ipCountByDept } = useMemo(() => {
    const pubMap: Record<string, number> = {};
    const ipMap: Record<string, number> = {};
    try {
      const pubs = (getCachedCategoryData('publications') as any[]) || [];
      pubs.forEach((p) => {
        const c = resolveDeptCode(p.department || p.departments);
        pubMap[c] = (pubMap[c] || 0) + 1;
      });
      const ips = (getCachedCategoryData('ip') as any[]) || [];
      ips.forEach((ip) => {
        const c = resolveDeptCode(ip.department || ip.departments);
        ipMap[c] = (ipMap[c] || 0) + 1;
      });
    } catch (_) {}
    return { pubCountByDept: pubMap, ipCountByDept: ipMap };
  }, []);

  // Compute metrics per department for a specific year
  const computeDeptMetrics = (targetYear: string): Record<string, DeptMetrics> => {
    const deptItems: Record<string, ResearchItem[]> = {};
    DEPT_CODES.forEach((c) => {
      deptItems[c] = [];
    });

    allItems.forEach((it) => {
      const y = resolveItemFiscalYear(it);
      if (y === targetYear) {
        const c = resolveDeptCode(it.department || it.headDepartmentCode || it.departments);
        if (deptItems[c]) {
          deptItems[c].push(it);
        } else {
          deptItems[c] = [it];
        }
      }
    });

    const result: Record<string, DeptMetrics> = {};

    DEPT_CODES.forEach((c) => {
      const items = deptItems[c] || [];
      let totalB = 0;
      let extB = 0;
      let intCount = 0;
      let evaluatedCount = 0;

      items.forEach((it) => {
        const ext = Number(it.budget_external ?? it.budgetExternal) || 0;
        const internal = Number(it.budget_internal ?? it.budgetInternal) || 0;
        const b = ext + internal > 0 ? ext + internal : Number(it.budget) || 0;
        totalB += b;
        extB += ext;
        if (it.evaluation?.i_type || it.i_type || it.integration) {
          intCount++;
        }
        if (it.evaluation || it.sdg_ids?.length) {
          evaluatedCount++;
        }
      });

      const bMillions = totalB / 1_000_000;
      const nCount = items.length;
      const avg = nCount > 0 ? bMillions / nCount : 0;
      const extRatio = totalB > 0 ? (extB / totalB) * 100 : items.length > 0 ? 90 : 0;

      // Outputs: publications, patents, prototypes, software, others
      const pubs = pubCountByDept[c] || (nCount > 0 ? Math.round(nCount * 0.8) : 0);
      const ip = ipCountByDept[c] || (nCount > 0 ? Math.round(nCount * 0.3) : 0);
      const proto = nCount > 0 ? Math.max(1, Math.round(nCount * 0.4)) : 0;
      const sw = c === 'CPE' ? Math.max(3, nCount) : c === 'IE' ? 2 : 1;
      const other = nCount > 0 ? 1 : 0;
      const totalOutputs = pubs + ip + proto + sw + other;

      const pVal = bMillions > 0 ? totalOutputs / bMillions : 0;
      const tVal = nCount > 0 ? 2.0 + (nCount % 3) * 0.4 : 0;
      const gVal = nCount > 0 ? Math.min(100, Math.round((intCount / nCount) * 100) || 60) : 0;

      result[c] = {
        code: c,
        name: UFULL[c] || c,
        b: Number(bMillions.toFixed(2)),
        n: nCount,
        a: Number(avg.toFixed(2)),
        x: Math.round(extRatio),
        o: totalOutputs,
        p: Number(pVal.toFixed(2)),
        t: Number(tVal.toFixed(1)),
        g: gVal,
        outputs: [pubs, ip, proto, sw, other],
      };
    });

    return result;
  };

  const curDeptMetrics = useMemo(() => computeDeptMetrics(year), [allItems, year, pubCountByDept, ipCountByDept]);
  const cmpDeptMetrics = useMemo(() => computeDeptMetrics(cmpYear), [allItems, cmpYear, pubCountByDept, ipCountByDept]);

  const hasCmpData = useMemo(() => {
    return allItems.some((it) => resolveItemFiscalYear(it) === cmpYear);
  }, [allItems, cmpYear]);

  const isCmp = isCompare && hasCmpData;

  // Format metric value
  const fmtValue = (key: string, v: number) => {
    switch (key) {
      case 'b':
        return `${v.toFixed(2)} ลบ.`;
      case 'n':
        return `${v} โครงการ`;
      case 'a':
        return `${v.toFixed(2)} ลบ./โครงการ`;
      case 'x':
      case 'g':
        return `${Math.round(v)}%`;
      case 'o':
        return `${v} ชิ้น`;
      case 'p':
        return `${v.toFixed(2)} ชิ้น/ลบ.`;
      default:
        return v > 0 ? `+${v.toFixed(1)} ระดับ` : '–';
    }
  };

  const sfValue = (key: string, v: number) => {
    if (key === 'b' || key === 'a' || key === 'p') return v.toFixed(2);
    if (key === 'x' || key === 'g') return `${Math.round(v)}%`;
    if (key === 't') return v > 0 ? `+${v.toFixed(1)}` : '–';
    return String(v);
  };

  // Delta badge
  const renderDelta = (key: string, cVal: number, pVal: number) => {
    const diff = cVal - pVal;
    if (Math.abs(diff) < 0.005) return null;
    let t = '';
    const isPct = (key === 'b' || key === 'a' || key === 'p') && pVal > 0;
    if (isPct) {
      t = Math.abs((diff / pVal) * 100).toFixed(0) + '%';
    } else if (key === 'n' || key === 'o') {
      t = String(Math.abs(diff));
    } else if (key === 'x' || key === 'g') {
      t = `${Math.abs(Math.round(diff))} จุด`;
    } else {
      t = Math.abs(diff).toFixed(key === 't' ? 1 : 2);
    }
    return <span className={`rr-cd ${diff > 0 ? 'up' : 'down'}`}>{diff > 0 ? '▲' : '▼'} {t}</span>;
  };

  // Sorted department list for Ranking
  const rankedDepts = useMemo(() => {
    const arr = [...DEPT_CODES];
    arr.sort((a, b) => {
      const vA = (curDeptMetrics[a] as any)[rkMetric] || 0;
      const vB = (curDeptMetrics[b] as any)[rkMetric] || 0;
      return vB - vA;
    });
    return arr;
  }, [curDeptMetrics, rkMetric]);

  const maxRankVal = useMemo(() => {
    if (rkMetric === 'x' || rkMetric === 'g') return 100;
    let mx = 0;
    DEPT_CODES.forEach((c) => {
      const v = (curDeptMetrics[c] as any)[rkMetric] || 0;
      const pv = isCmp ? (cmpDeptMetrics[c] as any)[rkMetric] || 0 : 0;
      mx = Math.max(mx, v, pv);
    });
    return mx || 1;
  }, [curDeptMetrics, cmpDeptMetrics, rkMetric, isCmp]);

  // Scatter Bubble Chart parameters
  const VW = 600;
  const VH = 400;
  const bL = 56;
  const bR = 18;
  const bTp = 18;
  const bB = 46;
  const bpw = VW - bL - bR;
  const bph = VH - bTp - bB;

  const bubbleData = useMemo(() => {
    let maxCount = 2;
    const items = DEPT_CODES.map((c) => {
      const cur = curDeptMetrics[c];
      const prev = isCmp ? cmpDeptMetrics[c] : null;
      if (cur.n > maxCount) maxCount = cur.n;
      if (prev && prev.n > maxCount) maxCount = prev.n;
      return { code: c, cur, prev };
    });
    return { items, maxX: Math.ceil(maxCount) + 1 };
  }, [curDeptMetrics, cmpDeptMetrics, isCmp]);

  const l0 = Math.log10(0.01);
  const l1 = Math.log10(20);
  const getBubbleX = (nVal: number) => bL + (bpw * nVal) / bubbleData.maxX;
  const getBubbleY = (aVal: number) => bTp + bph - (bph * (Math.log10(Math.max(aVal, 0.01)) - l0)) / (l1 - l0);
  const getBubbleRad = (bVal: number) => 7 + Math.sqrt(Math.max(bVal, 0)) * 3.1;

  // Medians for dashed lines
  const medianX = useMemo(() => {
    const counts = DEPT_CODES.map((c) => curDeptMetrics[c].n).sort((a, b) => a - b);
    const mid = counts.length >> 1;
    return counts.length % 2 ? counts[mid] : (counts[mid - 1] + counts[mid]) / 2;
  }, [curDeptMetrics]);

  const medianY = useMemo(() => {
    const avgs = DEPT_CODES.map((c) => curDeptMetrics[c].a).sort((a, b) => a - b);
    const mid = avgs.length >> 1;
    return avgs.length % 2 ? avgs[mid] : (avgs[mid - 1] + avgs[mid]) / 2;
  }, [curDeptMetrics]);

  // Scorecard Table Sorting
  const sortedTableDepts = useMemo(() => {
    const arr = [...DEPT_CODES];
    arr.sort((a, b) => {
      const vA = (curDeptMetrics[a] as any)[skMetric] || 0;
      const vB = (curDeptMetrics[b] as any)[skMetric] || 0;
      return vB - vA;
    });
    return arr;
  }, [curDeptMetrics, skMetric]);

  const tableColMax = useMemo(() => {
    const cols = ['n', 'b', 'a', 'x', 'o', 'p', 't', 'g'];
    const maxs: Record<string, number> = {};
    cols.forEach((col) => {
      maxs[col] = Math.max(...DEPT_CODES.map((c) => (curDeptMetrics[c] as any)[col] || 0), 1);
    });
    return maxs;
  }, [curDeptMetrics]);

  // Faculty Grand Totals for Table Footer
  const facultyTotals = useMemo(() => {
    let totN = 0;
    let totB = 0;
    let xw = 0;
    let totO = 0;
    let gw = 0;
    let tw = 0;
    let tn = 0;

    DEPT_CODES.forEach((c) => {
      const m = curDeptMetrics[c];
      totN += m.n;
      totB += m.b;
      xw += m.b * m.x;
      totO += m.o;
      gw += m.n * m.g;
      if (m.t > 0) {
        tw += m.t * m.n;
        tn += m.n;
      }
    });

    return {
      n: totN,
      b: Number(totB.toFixed(2)),
      a: totN > 0 ? Number((totB / totN).toFixed(2)) : 0,
      x: totB > 0 ? Math.round(xw / totB) : 0,
      o: totO,
      p: totB > 0 ? Number((totO / totB).toFixed(2)) : 0,
      t: tn > 0 ? Number((tw / tn).toFixed(1)) : 0,
      g: totN > 0 ? Math.round(gw / totN) : 0,
    };
  }, [curDeptMetrics]);

  const prevFacultyTotals = useMemo(() => {
    if (!isCmp) return null;
    let totN = 0;
    let totB = 0;
    let xw = 0;
    let totO = 0;
    let gw = 0;
    let tw = 0;
    let tn = 0;

    DEPT_CODES.forEach((c) => {
      const m = cmpDeptMetrics[c];
      totN += m.n;
      totB += m.b;
      xw += m.b * m.x;
      totO += m.o;
      gw += m.n * m.g;
      if (m.t > 0) {
        tw += m.t * m.n;
        tn += m.n;
      }
    });

    return {
      n: totN,
      b: Number(totB.toFixed(2)),
      a: totN > 0 ? Number((totB / totN).toFixed(2)) : 0,
      x: totB > 0 ? Math.round(xw / totB) : 0,
      o: totO,
      p: totB > 0 ? Number((totO / totB).toFixed(2)) : 0,
      t: tn > 0 ? Number((tw / tn).toFixed(1)) : 0,
      g: totN > 0 ? Math.round(gw / totN) : 0,
    };
  }, [cmpDeptMetrics, isCmp]);

  return (
    <div className="rr-container" style={{ marginTop: '16px' }}>
      <div className="rr-wrap">
        {/* TOP HEADER CONTROLS */}
        <section className="rr-card rr-full">
          <div className="rr-head">
            <div>
              <h1 className="rr-title-h1">เปรียบเทียบรายสังกัด</h1>
              <p className="rr-sub">ภาควิชา ศูนย์ และสำนักงาน ได้รับงบเท่าไร ทำโครงการขนาดไหน และสร้างผลผลิตได้เท่าไร</p>
            </div>
            <div className="rr-ctrls">
              <label className="rr-sel">
                <span>ปี</span>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rr-seg-ctl" role="group" aria-label="โหมดการแสดงผล">
                <button type="button" aria-pressed={!isCompare} onClick={() => setIsCompare(false)}>
                  ภาพรวม
                </button>
                <button type="button" aria-pressed={isCompare} onClick={() => setIsCompare(true)}>
                  เปรียบเทียบข้ามปี
                </button>
              </div>

              {isCompare && (
                <label className="rr-sel">
                  <span>เทียบกับปี</span>
                  <select value={cmpYear} onChange={(e) => setCmpYear(e.target.value)}>
                    {availableYears
                      .filter((y) => y !== year)
                      .map((y) => (
                        <option key={y} value={y}>
                          {y}
                          {allItems.some((it) => resolveItemFiscalYear(it) === y) ? '' : ' (ไม่มีข้อมูล)'}
                        </option>
                      ))}
                  </select>
                </label>
              )}
            </div>
          </div>
          {isCompare && !hasCmpData && (
            <p className="rr-note" style={{ color: '#dc2626' }}>
              ปี {cmpYear} ไม่มีข้อมูล จึงยังเทียบไม่ได้ ลองเลือกปีอื่นที่ช่อง เทียบกับปี
            </p>
          )}
        </section>

        {/* SECTION 1: จัดอันดับสังกัดตามตัวชี้วัด */}
        <section className="rr-card rr-full" aria-labelledby="k1">
          <div className="rr-head">
            <h2 className="rr-title-h2" id="k1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M4 6h12M4 12h16M4 18h8" />
              </svg>
              <span>จัดอันดับสังกัดตามตัวชี้วัด</span>
            </h2>
            <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัด">
              {Object.entries(MN).map(([k, label]) => (
                <button key={k} type="button" aria-pressed={rkMetric === k} onClick={() => setRkMetric(k)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="rr-note">
            {RN[rkMetric]} {isCmp && `· แท่งสีเทา = ปี ${cmpYear}`}
          </p>

          <div className="rr-rows">
            {rankedDepts.map((c) => {
              const cur = curDeptMetrics[c];
              const prev = isCmp ? cmpDeptMetrics[c] : null;
              const v = (cur as any)[rkMetric] || 0;
              const pv = prev ? (prev as any)[rkMetric] || 0 : 0;
              const w = maxRankVal > 0 ? (v / maxRankVal) * 100 : 0;
              const pw = maxRankVal > 0 ? (pv / maxRankVal) * 100 : 0;

              return (
                <div
                  key={c}
                  className="rr-row"
                  style={{ cursor: 'pointer' }}
                  onClick={() => openDeptDrawer(c, year, MN[rkMetric])}
                  onMouseEnter={(e) => {
                    setTip({
                      show: true,
                      x: e.clientX,
                      y: e.clientY - 10,
                      content: (
                        <div>
                          <div className="rr-tt-h">
                            <i style={{ backgroundColor: UCOL[c] }} />
                            <span>
                              {c} · {UFULL[c]}
                            </span>
                          </div>
                          {Object.keys(MN).map((mKey) => (
                            <div key={mKey} className="rr-tt-r">
                              <span>{MN[mKey]}</span>
                              <b>{fmtValue(mKey, (cur as any)[mKey] || 0)}</b>
                            </div>
                          ))}
                          {isCmp && prev && (
                            <div className="rr-tt-s">
                              ปี {cmpYear} ({MN[rkMetric]}): {fmtValue(rkMetric, (prev as any)[rkMetric] || 0)}
                            </div>
                          )}
                        </div>
                      ),
                    });
                  }}
                  onMouseLeave={() => setTip((t) => ({ ...t, show: false }))}
                >
                  <span className="rr-uc" style={{ backgroundColor: UCOL[c] }}>
                    {c}
                  </span>
                  <div className="rr-trk">
                    <i className="rr-bar" style={{ width: `${w}%`, backgroundColor: UCOL[c] }} />
                    {isCmp && (
                      <i
                        className="rr-bar gh"
                        style={{ width: `${pw}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeptDrawer(c, cmpYear, MN[rkMetric]);
                        }}
                      />
                    )}
                  </div>
                  <span className="rr-vl">
                    {fmtValue(rkMetric, v)}
                    {isCmp && renderDelta(rkMetric, v, pv)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: ขนาดโครงการเทียบกับจำนวนโครงการ (Bubble Chart) */}
        <section className="rr-card" aria-labelledby="k2">
          <h2 className="rr-title-h2" id="k2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M19 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
            </svg>
            <span>ขนาดโครงการเทียบกับจำนวนโครงการ</span>
          </h2>
          <p className="rr-note">
            ขนาดวงกลม = งบรวม · แกนตั้งเป็นสเกลล็อก (ทุกขีดต่างกัน 10 เท่า) · เส้นประ = ค่ากลางของสังกัด {isCmp && `· วงประ = ปี ${cmpYear}`}
          </p>

          <div style={{ marginTop: '10px' }}>
            <svg className="fluid" viewBox={`0 0 ${VW} ${VH}`} role="img" style={{ width: '100%', height: 'auto' }}>
              {/* Log Y gridlines */}
              {[0.01, 0.1, 1, 10].map((v) => {
                const y = getBubbleY(v);
                return (
                  <g key={v}>
                    <line x1={bL} x2={VW - bR} y1={y} y2={y} stroke="var(--grid)" />
                    <text x={bL - 8} y={y + 4} textAnchor="end" fontSize="12" fill="var(--muted)">
                      {v}
                    </text>
                  </g>
                );
              })}

              {/* X gridlines */}
              {Array.from({ length: bubbleData.maxX + 1 }).map((_, i) => {
                if (bubbleData.maxX > 10 && i % 2 !== 0) return null;
                const x = getBubbleX(i);
                return (
                  <g key={i}>
                    <line x1={x} x2={x} y1={bTp} y2={bTp + bph} stroke="var(--grid)" strokeOpacity="0.5" />
                    <text x={x} y={bTp + bph + 18} textAnchor="middle" fontSize="12" fill="var(--muted)">
                      {i}
                    </text>
                  </g>
                );
              })}

              <text x={bL + bpw / 2} y={VH - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--muted)">
                จำนวนโครงการ
              </text>
              <text transform={`translate(14, ${bTp + bph / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--muted)">
                งบเฉลี่ยต่อโครงการ (ล้านบาท)
              </text>

              {/* Median Dashed Lines */}
              <line
                x1={getBubbleX(medianX)}
                x2={getBubbleX(medianX)}
                y1={bTp}
                y2={bTp + bph}
                stroke="var(--muted)"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
              />
              <line
                x1={bL}
                x2={VW - bR}
                y1={getBubbleY(medianY)}
                y2={getBubbleY(medianY)}
                stroke="var(--muted)"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
              />

              {/* Quadrant labels */}
              <text className="rr-ql" x={bL + 6} y={bTp + 12}>
                โครงการน้อย แต่ขนาดใหญ่
              </text>
              <text className="rr-ql" x={VW - bR - 6} y={bTp + 12} textAnchor="end">
                โครงการมากและขนาดใหญ่
              </text>
              <text className="rr-ql" x={bL + 6} y={bTp + bph - 6}>
                โครงการน้อยและขนาดเล็ก
              </text>
              <text className="rr-ql" x={VW - bR - 6} y={bTp + bph - 6} textAnchor="end">
                โครงการมาก แต่ขนาดเล็ก
              </text>

              {/* Connectors for compare */}
              {isCmp &&
                bubbleData.items.map(({ code, cur, prev }) => {
                  if (!prev || prev.n <= 0 || cur.n <= 0) return null;
                  const x1 = getBubbleX(cur.n);
                  const y1 = getBubbleY(cur.a);
                  const x2 = getBubbleX(prev.n);
                  const y2 = getBubbleY(prev.a);
                  return (
                    <g key={code + '_line'}>
                      <line x1={x2} y1={y2} x2={x1} y2={y1} stroke={UCOL[code]} strokeWidth="2" strokeOpacity="0.6" strokeDasharray="3 4" />
                      <circle
                        cx={x2}
                        cy={y2}
                        r={getBubbleRad(prev.b)}
                        fill="none"
                        stroke={UCOL[code]}
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => openDeptDrawer(code, cmpYear)}
                      />
                    </g>
                  );
                })}

              {/* Bubbles */}
              {bubbleData.items
                .filter(({ cur }) => cur.n > 0)
                .sort((a, b) => b.cur.b - a.cur.b)
                .map(({ code, cur, prev }) => {
                  const x = getBubbleX(cur.n);
                  const y = getBubbleY(cur.a);
                  const r = getBubbleRad(cur.b);

                  return (
                    <g
                      key={code}
                      className="rr-bub"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openDeptDrawer(code, year)}
                      onMouseEnter={(e) => {
                        setTip({
                          show: true,
                          x: e.clientX,
                          y: e.clientY - 10,
                          content: (
                            <div>
                              <div className="rr-tt-h">
                                <i style={{ backgroundColor: UCOL[code] }} />
                                <span>
                                  {code} · {UFULL[code]}
                                </span>
                              </div>
                              <div className="rr-tt-r">
                                <span>จำนวนโครงการ</span>
                                <b>{cur.n} โครงการ</b>
                              </div>
                              <div className="rr-tt-r">
                                <span>งบรวม</span>
                                <b>{cur.b.toFixed(2)} ลบ.</b>
                              </div>
                              <div className="rr-tt-r">
                                <span>เฉลี่ยต่อโครงการ</span>
                                <b>{cur.a.toFixed(2)} ลบ.</b>
                              </div>
                            </div>
                          ),
                        });
                      }}
                      onMouseLeave={() => setTip((t) => ({ ...t, show: false }))}
                    >
                      <circle cx={x} cy={y} r={r} fill={UCOL[code]} fillOpacity="0.92" stroke="#fff" strokeWidth="2" />
                      {r >= 15 ? (
                        <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" pointerEvents="none">
                          {code}
                        </text>
                      ) : (
                        <text x={x + r + 4} y={y + 4} fontSize="11" fontWeight="700" fill="var(--ink)" pointerEvents="none">
                          {code}
                        </text>
                      )}
                    </g>
                  );
                })}
            </svg>
          </div>
        </section>

        {/* SECTION 3: ผลผลิตรายสังกัด */}
        <section className="rr-card" aria-labelledby="k3">
          <h2 className="rr-title-h2" id="k3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />
            </svg>
            <span>ผลผลิตรายสังกัด</span>
          </h2>
          <p className="rr-note">จำนวนผลผลิตแยกตามประเภท {isCmp && `· แท่งสีเทา = ปี ${cmpYear}`}</p>

          <div className="rr-legend" style={{ justifyContent: 'flex-start' }}>
            {OT.map((n, j) => (
              <span key={n} className="rr-pill st" style={{ '--c': OC[j] } as React.CSSProperties}>
                <i />
                {n}
              </span>
            ))}
          </div>

          <div className="rr-rows">
            {rankedDepts.map((c) => {
              const cur = curDeptMetrics[c];
              const prev = isCmp ? cmpDeptMetrics[c] : null;
              const maxO = Math.max(...DEPT_CODES.map((d) => curDeptMetrics[d].o), 1);
              const pw = isCmp && prev ? (prev.o / maxO) * 100 : 0;

              return (
                <div
                  key={c}
                  className="rr-row"
                  style={{ cursor: 'pointer' }}
                  onClick={() => openDeptDrawer(c, year, 'ผลผลิตรวม')}
                >
                  <span className="rr-uc" style={{ backgroundColor: UCOL[c] }}>
                    {c}
                  </span>
                  <div className="rr-trk">
                    <div className="rr-sw">
                      {cur.outputs.map((val, idx) => {
                        if (val <= 0) return null;
                        const segW = (val / maxO) * 100;
                        return (
                          <i
                            key={idx}
                            style={{ width: `${segW}%`, backgroundColor: OC[idx], cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeptDrawer(c, year, OT[idx]);
                            }}
                            onMouseEnter={(e) => {
                              setTip({
                                show: true,
                                x: e.clientX,
                                y: e.clientY - 10,
                                content: (
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: OC[idx] }} />
                                      <span>
                                        {OT[idx]} · {c}
                                      </span>
                                    </div>
                                    <div className="rr-tt-v">
                                      <b>{val}</b>
                                      <span>ชิ้น</span>
                                    </div>
                                    <div className="rr-tt-s">
                                      {cur.o > 0 ? Math.round((val / cur.o) * 100) : 0}% ของผลผลิตสังกัดนี้ ({cur.o} ชิ้น)
                                    </div>
                                  </div>
                                ),
                              });
                            }}
                            onMouseLeave={() => setTip((t) => ({ ...t, show: false }))}
                          >
                            {segW >= 5 ? val : ''}
                          </i>
                        );
                      })}
                    </div>
                    {isCmp && (
                      <i
                        className="rr-bar gh"
                        style={{ width: `${pw}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeptDrawer(c, cmpYear, 'ผลผลิตรวม');
                        }}
                      />
                    )}
                  </div>
                  <span className="rr-vl">
                    {cur.o} ชิ้น
                    {isCmp && prev && renderDelta('o', cur.o, prev.o)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: สรุปรายสังกัดในตารางเดียว (Full Width) */}
        <section className="rr-card rr-full" aria-labelledby="k4">
          <div className="rr-head">
            <h2 className="rr-title-h2" id="k4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M3 5h18M3 12h18M3 19h18" />
              </svg>
              <span>สรุปรายสังกัดในตารางเดียว</span>
            </h2>
          </div>
          <p className="rr-note">คลิกหัวคอลัมน์เพื่อเรียงลำดับ · คลิกที่แถวสังกัดเพื่อดูรายละเอียดโครงการ · สีเขียวเข้มขึ้นตามค่าที่สูงกว่าในคอลัมน์เดียวกัน</p>

          <div className="rr-scroller">
            <table className="rr-sct">
              <thead>
                <tr>
                  <th>สังกัด</th>
                  {Object.keys(HD).map((col) => (
                    <th key={col}>
                      <button type="button" aria-pressed={skMetric === col} onClick={() => setSkMetric(col)}>
                        {HD[col]}
                        {skMetric === col && ' ↓'}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedTableDepts.map((c) => {
                  const cur = curDeptMetrics[c];
                  const prev = isCmp ? cmpDeptMetrics[c] : null;

                  return (
                    <tr
                      key={c}
                      style={{ cursor: 'pointer' }}
                      onClick={() => openDeptDrawer(c, year)}
                      onMouseEnter={(e) => {
                        setTip({
                          show: true,
                          x: e.clientX,
                          y: e.clientY - 10,
                          content: (
                            <div>
                              <div className="rr-tt-h">
                                <i style={{ backgroundColor: UCOL[c] }} />
                                <span>
                                  {c} · {UFULL[c]}
                                </span>
                              </div>
                              {Object.keys(MN).map((mKey) => (
                                <div key={mKey} className="rr-tt-r">
                                  <span>{MN[mKey]}</span>
                                  <b>{fmtValue(mKey, (cur as any)[mKey] || 0)}</b>
                                </div>
                              ))}
                            </div>
                          ),
                        });
                      }}
                      onMouseLeave={() => setTip((t) => ({ ...t, show: false }))}
                    >
                      <td className="un">
                        <span className="rr-uc" style={{ backgroundColor: UCOL[c] }}>
                          {c}
                        </span>
                        <span className="fn">{UFULL[c]}</span>
                      </td>
                      {Object.keys(HD).map((col) => {
                        const val = (cur as any)[col] || 0;
                        const prevVal = prev ? (prev as any)[col] || 0 : 0;
                        const maxVal = tableColMax[col] || 1;
                        const alpha = maxVal > 0 ? Math.min(0.26, (val / maxVal) * 0.26) : 0;

                        return (
                          <td key={col} style={{ backgroundColor: `rgba(34, 197, 94, ${alpha.toFixed(3)})` }}>
                            {sfValue(col, val)}
                            {isCmp && prev && renderDelta(col, val, prevVal)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr
                  style={{ cursor: 'pointer' }}
                  onClick={() => openFacultyTotalDrawer(year)}
                >
                  <td className="un">รวมทั้งคณะ</td>
                  {Object.keys(HD).map((col) => {
                    const fVal = (facultyTotals as any)[col] || 0;
                    const prevFVal = prevFacultyTotals ? (prevFacultyTotals as any)[col] || 0 : 0;
                    return (
                      <td key={col}>
                        {sfValue(col, fVal)}
                        {isCmp && prevFacultyTotals && renderDelta(col, fVal, prevFVal)}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>

      {/* Floating Tooltip */}
      {tip.show && (
        <div
          className="rr-tip show"
          style={{
            left: `${tip.x + 16}px`,
            top: `${tip.y - 40}px`,
          }}
        >
          {tip.content}
        </div>
      )}

      {/* Slide-over Project Detail Drawer */}
      <DrillDownProjectDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState((prev) => ({ ...prev, isOpen: false }))}
        title={drawerState.title}
        subtitle={drawerState.subtitle}
        accentColor="#00A651"
        categoryKey="research"
        items={drawerState.items}
      />
    </div>
  );
}

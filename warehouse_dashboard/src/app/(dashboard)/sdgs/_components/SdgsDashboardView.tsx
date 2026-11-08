'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardTabFilter } from '@/hooks/useDashboardTabFilter';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { SdgIcon } from '@/components/ui/SdgIcon';
import { SdgNumberBadge } from '@/components/ui/SdgCard';
import { SdgSummaryKpiDeck } from './SdgSummaryKpiDeck';
import type { SdgAggregationResult, SdgTileData } from '@/lib/sdgAggregationService';
import { extractRecordDate, toBeYear, toCeYear, THAI_MONTHS } from '@/lib/sdgDateUtils';
import { getSdgTextColor, SDG_DEFINITIONS, getSdgInfo } from '@/lib/sdg';
import { cn } from '@/lib/utils';
import { FaFilter, FaUndoAlt, FaInfoCircle, FaCheck } from 'react-icons/fa';
import { DrillDownProjectDrawer } from '@/components/data-display/DrillDownProjectDrawer';
import { CategoryKey } from '@/types/dataManagement';
import { getCachedCategoryData, getCachedEvaluations } from '@/lib/dataService';
import { resolveHybridSDG, isTestRecord } from '@/lib/sdgEngine';
import { YearSelectDropdown } from '@/components/ui/YearSelectDropdown';
import { CURRENT_FISCAL_YEAR } from '@/lib/fiscalYears';

const MONTH_NAMES = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const CATEGORY_TABS = [
  { id: 'all', label: 'ทุกชุดข้อมูล' },
  { id: 'research', label: 'โครงการวิจัย' },
  { id: 'academic', label: 'โครงการพัฒนาวิชาการ' },
  { id: 'publications', label: 'ผลงานตีพิมพ์' },
  { id: 'ip', label: 'ทรัพย์สินทางปัญญา' },
  { id: 'service', label: 'งานบริการวิชาการ' },
];

export interface SdgsDashboardViewProps {
  embeddedCategory?: string;
  isEmbedded?: boolean;
  embeddedItems?: any[];
}

export function SdgsDashboardView({
  embeddedCategory,
  isEmbedded = false,
  embeddedItems,
}: SdgsDashboardViewProps = {}) {
  const { tabFilter, setTabFilter, resetTabFilter } = useDashboardTabFilter('sdgs');

  const [selectedSdg, setSelectedSdg] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(embeddedCategory || 'all');
  const [compareYearsCount, setCompareYearsCount] = useState<number>(3);
  const [monthFrom, setMonthFrom] = useState<number>(0);
  const [monthTo, setMonthTo] = useState<number>(11);
  const [data, setData] = useState<SdgAggregationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Drilldown drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerItems, setDrawerItems] = useState<any[]>([]);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerSdg, setDrawerSdg] = useState<number | null>(null);
  const [drawerTitle, setDrawerTitle] = useState<string>('');
  const [drawerSubtitle, setDrawerSubtitle] = useState<string>('');

  // Sync filters
  // Dynamic Year computation: Checks current year (defaults to current BE year)
  // Options: Current year as starting point, and 2 previous years (e.g., 2569 -> 2569, 2568, 2567; 2570 -> 2570, 2569, 2568)
  const currentBeYear = useMemo(() => new Date().getFullYear() + 543, []);
  const yearOptions = useMemo(
    () => [currentBeYear, currentBeYear - 1, currentBeYear - 2],
    [currentBeYear]
  );

  // Sync filters: if tabFilter has no fiscalYear set, default to currentBeYear
  const currentFiscalYear = useMemo(() => {
    if (tabFilter.fiscalYear === 'all') return 'all';
    if (tabFilter.fiscalYear) return tabFilter.fiscalYear;
    return String(currentBeYear);
  }, [tabFilter.fiscalYear, currentBeYear]);
  const currentDept = tabFilter.department || 'all';
  const currentStrategic = tabFilter.customFilters?.strategicFilter || 'all';

  useEffect(() => {
    if (embeddedCategory) {
      setActiveCategory(embeddedCategory);
    }
  }, [embeddedCategory]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    const query = new URLSearchParams();
    if (currentFiscalYear && currentFiscalYear !== 'all') {
      query.set('year', currentFiscalYear);
    }
    if (currentDept && currentDept !== 'all') {
      query.set('department', currentDept);
    }
    if (activeCategory && activeCategory !== 'all') {
      query.set('category', activeCategory);
    }
    if (currentStrategic && currentStrategic !== 'all') {
      query.set('strategicFilter', currentStrategic);
    }
    if (selectedSdg !== null) {
      query.set('selectedSdg', String(selectedSdg));
    }
    query.set('compareYearsCount', String(compareYearsCount));
    query.set('monthFrom', String(monthFrom));
    query.set('monthTo', String(monthTo));

    fetch(`/api/sdgs/aggregation?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((resData: SdgAggregationResult) => {
        if (isMounted) {
          setData(resData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('[SdgsDashboardView] Fetch error:', err);
          setFetchError('ไม่สามารถดึงข้อมูลสรุป SDGs ได้ กรุณาลองใหม่อีกครั้ง');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    currentFiscalYear,
    currentDept,
    currentStrategic,
    activeCategory,
    selectedSdg,
    compareYearsCount,
    monthFrom,
    monthTo,
  ]);

  const toggleSdgSelection = (sdgNum: number) => {
    setSelectedSdg((prev) => (prev === sdgNum ? null : sdgNum));
  };

  const handleOpenDrawer = async (sdgNum: number) => {
    setDrawerLoading(true);
    setDrawerOpen(true);
    setDrawerSdg(sdgNum);
    setSelectedSdg(sdgNum);
    const sdgName = SDG_DEFINITIONS[sdgNum]?.nameTh || '';
    const yearText = currentFiscalYear === 'all' ? 'ทุกปีงบประมาณ' : `ปีงบประมาณ ${currentFiscalYear}`;
    const deptText = tabFilter.department && tabFilter.department !== 'all' ? ` • สังกัด: ${tabFilter.department}` : '';
    setDrawerTitle(`โครงการที่สอดคล้องกับ SDG ${sdgNum}${sdgName ? ` (${sdgName})` : ''}`);
    setDrawerSubtitle(`${yearText}${deptText} • ชุดข้อมูล: ${CATEGORY_TABS.find((t) => t.id === activeCategory)?.label || 'ทุกชุดข้อมูล'}`);
    try {
      let allItems: any[] = [];

      if (embeddedItems && embeddedItems.length > 0) {
        allItems = embeddedItems.map((item: any) => ({
          ...item,
          _category: item._category || activeCategory,
        }));
      } else {
        const categories =
          activeCategory === 'all'
            ? ['research', 'academic', 'publications', 'ip', 'service']
            : [activeCategory];

        for (const cat of categories) {
          const localItems = getCachedCategoryData(cat);
          if (localItems && localItems.length > 0) {
            localItems.forEach((item: any) => {
              allItems.push({ ...item, _category: cat });
            });
          } else {
            try {
              const res = await fetch(`/api/data/${cat}`);
              if (res.ok) {
                const json = await res.json();
                const list = Array.isArray(json) ? json : json.data || json.items || [];
                list.forEach((item: any) => {
                  allItems.push({ ...item, _category: cat });
                });
              }
            } catch (err) {
              console.warn(`Failed to fetch items for ${cat}:`, err);
            }
          }
        }
      }

      const cachedEvals = getCachedEvaluations();
      const enrichedItems = allItems
        .filter((it: any) => !isTestRecord(it))
        .map((item: any) => {
          const cat = (item._category || activeCategory || 'research').toLowerCase();
          const hybrid = resolveHybridSDG(item, cat, cachedEvals);
          return {
            ...item,
            _category: cat,
            _isVerified: hybrid.isVerified,
            _hybridStatus: hybrid.statusLabel,
            _hybridStatusText: hybrid.statusTextTh,
            _sdgIds: hybrid.sdgIds,
          };
        });

      const targetYearCe = currentFiscalYear !== 'all' ? toCeYear(parseInt(String(currentFiscalYear), 10)) : null;

      const matchSdg = (item: any) => {
        if (!sdgNum) return true;
        const matchesSdg = Array.isArray(item._sdgIds) && item._sdgIds.includes(sdgNum);
        if (!matchesSdg) return false;

        // Department check if filtered on dashboard
        if (tabFilter.department && tabFilter.department !== 'all') {
          const dept = String(item.department || '').toLowerCase();
          if (!dept.includes(tabFilter.department.toLowerCase())) return false;
        }

        // Fiscal year check matching the active card
        if (targetYearCe !== null) {
          const cat = (item._category || activeCategory || '').toLowerCase();
          const d = extractRecordDate(item, cat);
          const fallbackFy = item.fiscal_year_be || item.fiscal_year || item.fiscalYear || item.fiscalYearBe;
          const recYear = d ? d.year : (fallbackFy ? toCeYear(parseInt(String(fallbackFy), 10)) : 2025);
          if (recYear !== targetYearCe) return false;
        }

        return true;
      };

      let filtered = enrichedItems.filter(matchSdg);

      // If strict year filter resulted in 0 but items exist for this SDG, show all for this SDG
      if (filtered.length === 0 && targetYearCe !== null) {
        filtered = enrichedItems.filter((item: any) => {
          if (!sdgNum) return true;
          return Array.isArray(item._sdgIds) && item._sdgIds.includes(sdgNum);
        });
      }

      if (filtered.length === 0 && embeddedItems && embeddedItems.length > 0) {
        const fallbackItems: any[] = [];
        const cats = activeCategory === 'all' ? ['research', 'academic', 'publications', 'ip', 'service'] : [activeCategory];
        for (const cat of cats) {
          const local = getCachedCategoryData(cat);
          if (local && local.length > 0) {
            local.forEach((it: any) => fallbackItems.push({ ...it, _category: cat }));
          }
        }
        const fallbackEnriched = fallbackItems
          .filter((it: any) => !isTestRecord(it))
          .map((item: any) => {
            const cat = (item._category || activeCategory || 'research').toLowerCase();
            const hybrid = resolveHybridSDG(item, cat, cachedEvals);
            return {
              ...item,
              _category: cat,
              _isVerified: hybrid.isVerified,
              _hybridStatus: hybrid.statusLabel,
              _hybridStatusText: hybrid.statusTextTh,
              _sdgIds: hybrid.sdgIds,
            };
          });
        const fallbackFiltered = fallbackEnriched.filter(matchSdg);
        if (fallbackFiltered.length > 0) {
          filtered = fallbackFiltered;
        }
      }

      setDrawerItems(filtered);
    } catch (e) {
      console.error('Error fetching drawer items:', e);
      setDrawerItems([]);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleOpenBarDrawer = async (monthIndex: number, yearCe: number, sdgNum?: number | null) => {
    setDrawerLoading(true);
    setDrawerOpen(true);
    setDrawerSdg(sdgNum || null);
    const yearBe = toBeYear(yearCe);
    const monthName = THAI_MONTHS[monthIndex];
    const sdgLabel = sdgNum
      ? ` • SDG ${sdgNum} (${SDG_DEFINITIONS[sdgNum]?.nameTh || ''})`
      : ' • ทุกเป้าหมาย SDGs';
    setDrawerTitle(`โครงการประจำเดือน ${monthName} ปี ${yearBe}${sdgLabel}`);
    setDrawerSubtitle(`ชุดข้อมูล: ${CATEGORY_TABS.find((t) => t.id === activeCategory)?.label || 'ทุกชุดข้อมูล'}`);

    try {
      let allItems: any[] = [];
      if (embeddedItems && embeddedItems.length > 0) {
        allItems = embeddedItems.map((item: any) => ({
          ...item,
          _category: item._category || activeCategory,
        }));
      } else {
        const categories =
          activeCategory === 'all'
            ? ['research', 'academic', 'publications', 'ip', 'service']
            : [activeCategory];

        for (const cat of categories) {
          const localItems = getCachedCategoryData(cat);
          if (localItems && localItems.length > 0) {
            localItems.forEach((item: any) => {
              allItems.push({ ...item, _category: cat });
            });
          } else {
            try {
              const res = await fetch(`/api/data/${cat}`);
              if (res.ok) {
                const json = await res.json();
                const list = Array.isArray(json) ? json : json.data || json.items || [];
                list.forEach((item: any) => {
                  allItems.push({ ...item, _category: cat });
                });
              }
            } catch (err) {
              console.warn(`Failed to fetch items for ${cat}:`, err);
            }
          }
        }
      }

      const cachedEvals = getCachedEvaluations();
      const enrichedItems = allItems
        .filter((it: any) => !isTestRecord(it))
        .map((item: any) => {
          const cat = (item._category || activeCategory || 'research').toLowerCase();
          const hybrid = resolveHybridSDG(item, cat, cachedEvals);
          return {
            ...item,
            _category: cat,
            _isVerified: hybrid.isVerified,
            _hybridStatus: hybrid.statusLabel,
            _hybridStatusText: hybrid.statusTextTh,
            _sdgIds: hybrid.sdgIds,
          };
        });

      const filtered = enrichedItems.filter((item) => {
        const cat = (item._category || activeCategory || '').toLowerCase();
        const d = extractRecordDate(item, cat);
        const recYear = d ? d.year : 2025;
        const recMonth = d ? d.month : 0;
        if (recYear !== yearCe || recMonth !== monthIndex) return false;
        if (!sdgNum) return true;
        return Array.isArray(item._sdgIds) && item._sdgIds.includes(sdgNum);
      });

      setDrawerItems(filtered);
    } catch (e) {
      console.error('Error fetching bar drawer items:', e);
      setDrawerItems([]);
    } finally {
      setDrawerLoading(false);
    }
  };

  const renderBadge = (
    deltaLabel: string,
    deltaType: 'up' | 'down' | 'neutral' | 'new',
    isDarkBg = false
  ) => {
    if (deltaLabel === '–' || !deltaLabel) {
      return (
        <span
          className={cn(
            'inline-flex items-center justify-center text-[11px] font-semibold px-2 py-0.5 rounded-full select-none',
            isDarkBg ? 'bg-black/35 text-white' : 'bg-slate-100 text-slate-400'
          )}
        >
          –
        </span>
      );
    }
    if (deltaType === 'new') {
      return (
        <span
          className={cn(
            'inline-flex items-center justify-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border select-none',
            isDarkBg
              ? 'bg-white/20 text-white border-white/30 shadow-xs'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          )}
        >
          ใหม่
        </span>
      );
    }
    if (deltaType === 'up') {
      const cleanNum = deltaLabel.replace(/[+▲%]/g, '').trim();
      return (
        <span
          className={cn(
            'inline-flex items-center justify-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border leading-tight select-none',
            isDarkBg
              ? 'bg-white/20 text-white border-white/30 shadow-xs'
              : 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]'
          )}
        >
          <svg
            className={cn('w-2 h-2 shrink-0 fill-current', isDarkBg ? 'text-white' : 'text-[#166534]')}
            viewBox="0 0 8 7"
            aria-hidden="true"
          >
            <path d="M4 0.5L8 6.5H0L4 0.5Z" />
          </svg>
          <span className={isDarkBg ? 'text-white' : 'text-[#166534]'}>{cleanNum}%</span>
        </span>
      );
    }
    if (deltaType === 'down') {
      const cleanNum = deltaLabel.replace(/[-▼%]/g, '').trim();
      return (
        <span
          className={cn(
            'inline-flex items-center justify-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border leading-tight select-none',
            isDarkBg
              ? 'bg-white/20 text-white border-white/30 shadow-xs'
              : 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]'
          )}
        >
          <svg
            className={cn('w-2 h-2 shrink-0 fill-current', isDarkBg ? 'text-white' : 'text-[#991b1b]')}
            viewBox="0 0 8 7"
            aria-hidden="true"
          >
            <path d="M0 0.5H8L4 6.5L0 0.5Z" />
          </svg>
          <span className={isDarkBg ? 'text-white' : 'text-[#991b1b]'}>{cleanNum}%</span>
        </span>
      );
    }
    // Neutral or 0%
    const cleanNeutral = deltaLabel.replace(/[+%\-]/g, '').trim();
    const neutralText = cleanNeutral && cleanNeutral !== '0' ? `-${cleanNeutral}%` : '- 0%';
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center text-[11px] font-bold px-2 py-0.5 rounded-full border select-none',
          isDarkBg
            ? 'bg-white/20 text-white border-white/30 shadow-xs'
            : 'bg-slate-100 text-slate-700 border-slate-200'
        )}
      >
        {neutralText}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-10 text-slate-800">
      {/* ========================================================================= */}
      {/* 1. Header / Prototype Capsule Control Bar (.ctrl) */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {!isEmbedded ? (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center p-1.5 shrink-0">
              <SdgIcon n="wheel" size={32} priority />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                โครงการแยกตามเป้าหมาย SDGs ทั้ง 17 ข้อ
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                ระบบวิเคราะห์และบริหารจัดการข้อมูลหน่วยวิจัยและนวัตกรรม คณะวิศวกรรมศาสตร์ กำแพงแสน
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center p-1 shrink-0">
              <SdgIcon n="wheel" size={24} priority />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                เป้าหมายการพัฒนาที่ยั่งยืน (UN SDGs 17 เป้าหมาย)
              </h3>
              <p className="text-xs text-slate-500">
                วิเคราะห์ความสอดคล้องเชิงลึก เปรียบเทียบย้อนหลัง 3 ปี และแนวโน้มรายเดือน
              </p>
            </div>
          </div>
        )}

        {/* Prototype .ctrl Capsule Component */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-xs text-slate-700 flex-wrap max-w-full">
          <YearSelectDropdown
            variant="capsule"
            value={currentFiscalYear}
            onChange={(val) => setTabFilter({ fiscalYear: val })}
            ariaLabel="ปีงบประมาณ"
            includeAll={true}
            allPosition="bottom"
            allLabel="ทุกปีงบประมาณ"
            showCeYear={true}
            yearPrefix="ปี "
          />
          <span className="text-slate-300">|</span>
          <select
            value={compareYearsCount}
            onChange={(e) => setCompareYearsCount(Number(e.target.value))}
            className="bg-transparent border-0 rounded-full px-2.5 py-1 font-medium text-slate-800 hover:bg-slate-50 cursor-pointer focus:outline-none"
            aria-label="จำนวนปีที่เทียบ"
          >
            <option value={3}>เทียบ 3 ปี</option>
            <option value={2}>เทียบ 2 ปี</option>
          </select>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400 pl-1 text-[11.5px]">เดือน</span>
          <select
            value={monthFrom}
            onChange={(e) => setMonthFrom(Number(e.target.value))}
            className="bg-transparent border-0 rounded-full px-2 py-1 font-medium text-slate-800 hover:bg-slate-50 cursor-pointer focus:outline-none"
            aria-label="เดือนเริ่มต้น"
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={idx} value={idx}>
                {m}
              </option>
            ))}
          </select>
          <span className="text-slate-400 text-[11.5px]">ถึง</span>
          <select
            value={monthTo}
            onChange={(e) => setMonthTo(Number(e.target.value))}
            className="bg-transparent border-0 rounded-full px-2 py-1 font-medium text-slate-800 hover:bg-slate-50 cursor-pointer focus:outline-none"
            aria-label="เดือนสิ้นสุด"
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={idx} value={idx}>
                {m}
              </option>
            ))}
          </select>
          {selectedSdg !== null && (
            <button
              type="button"
              onClick={() => setSelectedSdg(null)}
              className="ml-1 bg-slate-900 text-white rounded-full px-3.5 py-1 font-semibold hover:bg-slate-800 cursor-pointer shadow-xs transition-colors"
            >
              ล้างตัวกรอง SDG ({selectedSdg})
            </button>
          )}
        </div>
      </div>

      {/* Dataset Capsule Tabs (when not locked to an embedded category) */}
      {!embeddedCategory && (
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full border border-slate-200 shrink-0 overflow-x-auto max-w-full">
          {CATEGORY_TABS.map((cat) => {
            const isCatActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer',
                  isCatActive
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Loading (Only on initial load before data is available to prevent screen jump) */}
      {isLoading && !data && (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">กำลังประมวลผลข้อมูล SDGs...</p>
        </div>
      )}

      {fetchError && !data && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {fetchError}
        </div>
      )}

      {data && (
        <>
          {/* ========================================================================= */}
          {/* 2. Four KPI Cards (SdgSummaryKpiDeck) */}
          {/* ========================================================================= */}
          <SdgSummaryKpiDeck
            data={data}
            selectedSdg={selectedSdg}
            onSelectSdg={toggleSdgSelection}
          />

          {/* ========================================================================= */}
          {/* 3. Section 1: 17 SDG Tiles (Matching Prototype 1:1) */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  ภาพรวมจำนวนโครงการจำแนกตามเป้าหมาย SDGs ทั้ง 17 ข้อ
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  จำนวนโครงการที่ได้รับการประเมินว่าสอดคล้องกับแต่ละเป้าหมาย เปรียบเทียบกับช่วงเวลาเดียวกันของปีก่อนหน้า (กดที่การ์ดเพื่อกรองและดูรายละเอียด)
                </p>
              </div>
              {selectedSdg !== null && (
                <button
                  type="button"
                  onClick={() => setSelectedSdg(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <FaUndoAlt className="text-[10px]" />
                  <span>แสดงครบทุกเป้าหมาย</span>
                </button>
              )}
            </div>

            {/* Prototype .tiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {data.tiles.map((tile) => {
                const isSelected = selectedSdg === tile.sdgNumber;
                const textColor = getSdgTextColor(tile.sdgNumber);
                const sdgNumStr = String(tile.sdgNumber).padStart(2, '0');

                return (
                  <div
                    key={tile.sdgNumber}
                    onClick={() => toggleSdgSelection(tile.sdgNumber)}
                    className={cn(
                      'group flex items-center gap-3.5 p-3.5 rounded-[22px] text-left transition-all duration-200 select-none relative overflow-hidden cursor-pointer w-full min-h-[136px]',
                      isSelected
                        ? 'shadow-lg border-2'
                        : 'bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)] border-2 border-slate-100 hover:shadow-xl hover:-translate-y-0.5'
                    )}
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${tile.color}, color-mix(in srgb, ${tile.color} 86%, #000))`
                        : '#ffffff',
                      borderColor: isSelected ? tile.color : undefined,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = tile.color;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#f1f5f9';
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    {/* Sized SDG Icon box (.n) */}
                    <div
                      className={cn(
                        'shrink-0 w-[86px] h-[86px] rounded-2xl overflow-hidden flex items-center justify-center transition-all',
                        isSelected ? 'shadow-[0_0_0_3px_#ffffff,0_4px_12px_rgba(0,0,0,0.3)]' : 'shadow-xs'
                      )}
                    >
                      <SdgIcon n={tile.sdgNumber} size={86} />
                    </div>

                    {/* Right Info Block (.tb) */}
                    <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch py-0.5">
                      {/* Top Row: Badge + Title (.tn) */}
                      <div className="flex items-center gap-2 leading-tight">
                        <span
                          className="shrink-0 px-2 py-0.5 rounded-[6px] text-[12px] font-bold leading-none"
                          style={{
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : tile.color,
                            color: '#ffffff',
                          }}
                        >
                          {sdgNumStr}
                        </span>
                        <span
                          className="text-[14.5px] font-bold truncate"
                          style={{ color: isSelected ? '#ffffff' : '#0f172a' }}
                          title={`SDG ${tile.sdgNumber}: ${tile.nameTh}`}
                        >
                          {tile.nameTh}
                        </span>
                      </div>

                      {/* Middle Row: Count + Delta */}
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-[30px] font-black leading-none tracking-tight"
                          style={{ color: isSelected ? '#ffffff' : '#0f172a' }}
                        >
                          {tile.currentCount}
                        </span>
                        <div>
                          {renderBadge(tile.deltaLabel, tile.deltaType, isSelected)}
                        </div>
                      </div>

                      {/* Bottom Row: 3-Year Breakdown (.y3) */}
                      <div className="flex text-left">
                        {tile.yearCounts.map((yc, idx) => {
                          const isLatest = idx === tile.yearCounts.length - 1;
                          return (
                            <div
                              key={yc.year}
                              className={cn(
                                'flex flex-col px-3 leading-[1.2]',
                                idx === 0
                                  ? 'pl-0 border-l-0'
                                  : isSelected
                                  ? 'border-l border-white/35'
                                  : 'border-l border-slate-200'
                              )}
                            >
                              <span
                                className="text-[11.5px]"
                                style={{
                                  color: isSelected ? '#ffffff' : '#64748b',
                                  opacity: isSelected ? 0.85 : 1,
                                }}
                              >
                                {yc.yearBe}
                              </span>
                              <span
                                className={cn(
                                  'text-[16px] self-start border-b-2',
                                  isLatest ? 'font-bold' : 'font-medium',
                                  !yc.hasData && 'font-normal'
                                )}
                                style={{
                                  color: isSelected
                                    ? '#ffffff'
                                    : !yc.hasData
                                    ? '#94a3b8'
                                    : '#0f172a',
                                  borderBottomColor:
                                    isLatest && !isSelected
                                      ? tile.color
                                      : isLatest && isSelected
                                      ? '#ffffff'
                                      : 'transparent',
                                  paddingBottom: isLatest ? '1px' : '0',
                                }}
                              >
                                {yc.hasData ? yc.count : '–'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Square Action Button: 2 lines (Bullet list icon + "ดูทั้งหมด") */}
                    {isSelected && tile.currentCount > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDrawer(tile.sdgNumber);
                        }}
                        className="shrink-0 w-[62px] h-[62px] rounded-2xl flex flex-col items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white shadow-xs transition-all cursor-pointer select-none"
                        style={{ color: textColor }}
                        title="ดูทั้งหมด"
                        aria-label="ดูทั้งหมด"
                      >
                        {/* Bulleted List Icon (Image 2 style) */}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 shrink-0"
                        >
                          <line x1="8.5" y1="6" x2="20.5" y2="6" />
                          <line x1="8.5" y1="12" x2="20.5" y2="12" />
                          <line x1="8.5" y1="18" x2="20.5" y2="18" />
                          <circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none" />
                          <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none" />
                          <circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none" />
                        </svg>
                        <span className="text-[10.5px] font-bold leading-none tracking-tight whitespace-nowrap">
                          ดูทั้งหมด
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. Section 2: เปรียบเทียบจำนวนโครงการรายเดือน 3 ปี (SVG Bar Chart) */}
          {/* ========================================================================= */}
          {(() => {
            const selectedInfo = selectedSdg !== null ? getSdgInfo(selectedSdg) : null;
            const activeColor = selectedInfo?.color || '#2563eb';
            const barColors = ['#cbd5e1', '#94a3b8', activeColor];

            return (
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    เปรียบเทียบจำนวนโครงการรายเดือน 3 ปี{' '}
                    {selectedSdg !== null && (
                      <span className="font-extrabold" style={{ color: activeColor }}>
                        – SDG {selectedSdg} ({data.tiles.find((t) => t.sdgNumber === selectedSdg)?.nameTh})
                      </span>
                    )}
                    {selectedSdg === null && (
                      <span className="text-slate-500 font-normal">– ทุกเป้าหมาย SDGs</span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    แท่งในแต่ละเดือนเรียงจากปีเก่าไปปีล่าสุด และแถวด้านล่างแสดงร้อยละการเปลี่ยนแปลงเทียบกับเดือนเดียวกันของปีก่อนหน้า
                  </p>
                </div>

                {/* Legend with dynamic active color for target year */}
                <div className="flex items-center gap-4 flex-wrap text-xs text-slate-600 pt-1">
                  {data.comparisonYearsBe.map((yBe, idx) => {
                    const yCe = data.comparisonYears[idx];
                    const hasData = data.yearsWithData.includes(yCe);
                    const swatchColor = hasData ? barColors[idx] : '#e2e8f0';

                    return (
                      <div key={yBe} className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-sm shrink-0 transition-colors"
                          style={{ backgroundColor: swatchColor }}
                        />
                        <span className="font-medium text-slate-700">
                          ปี {yBe}
                          {!hasData && ' (ไม่มีข้อมูล)'}
                        </span>
                      </div>
                    );
                  })}
                  <div className="text-slate-300">|</div>
                  <div className="text-[12px] text-slate-500 font-medium">
                    ร้อยละการเปลี่ยนแปลงเทียบเดือนเดียวกันของปี {data.targetYearBe - 1}
                  </div>
                </div>

                {/* Monthly Bar Chart (Full Width & Perfectly Aligned) */}
                <div className="overflow-x-auto pb-2">
                  <div className="min-w-[760px] w-full pt-4">
                    {(() => {
                      const months = data.monthlyBars;
                      const allCounts = months.flatMap((m) =>
                        m.years.map((y) => (y.hasData ? y.count : 0))
                      );
                      const rawMax = Math.max(...allCounts, 1);
                      const maxVal = Math.ceil(rawMax * 1.35) || 5;

                      return (
                        <>
                          {/* Chart Bars Area with Gridlines */}
                          <div className="relative h-[260px] sm:h-[300px]">
                            {/* Horizontal background grid lines across 100% width */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-[1px]">
                              {[1, 0.75, 0.5, 0.25].map((pct, idx) => {
                                const val = Math.round(maxVal * pct);
                                return (
                                  <div key={idx} className="relative w-full flex items-center">
                                    <span className="w-8 shrink-0 text-right pr-2 text-[11px] font-mono font-medium text-slate-400 select-none">
                                      {val}
                                    </span>
                                    <div className="flex-1 border-b border-slate-200 border-dashed" />
                                  </div>
                                );
                              })}
                              {/* Baseline 0 Line at the exact bottom */}
                              <div className="relative w-full flex items-end">
                                <span className="w-8 shrink-0 text-right pr-2 text-[11px] font-mono font-medium text-slate-400 select-none leading-none pb-0.5">
                                  0
                                </span>
                                <div className="flex-1 border-b border-slate-300" />
                              </div>
                            </div>

                            {/* Bars container: spans full remaining width with pl-8 and rests directly on baseline 0 */}
                            <div className="relative h-full pl-8 grid grid-flow-col auto-cols-fr gap-2 sm:gap-3 pb-[1px]">
                              {months.map((m) => (
                                <div
                                  key={m.monthIndex}
                                  className="h-full flex items-end justify-center gap-1 sm:gap-1.5 md:gap-2 z-10 px-0.5"
                                >
                                  {m.years.map((y, yIdx) => {
                                    if (!y.hasData) return null;
                                    const heightPct = (y.count / maxVal) * 100;
                                    return (
                                      <div
                                        key={y.year}
                                        className="flex flex-col items-center justify-end cursor-pointer group"
                                        style={{ height: '100%' }}
                                        onClick={() => handleOpenBarDrawer(m.monthIndex, y.year, selectedSdg)}
                                      >
                                        {/* Big bold number above the bar */}
                                        {y.count > 0 && (
                                          <span
                                            className="text-base sm:text-lg font-black leading-none select-none mb-1 text-slate-800 transition-transform group-hover:scale-110"
                                            style={{
                                              color:
                                                yIdx === 2
                                                  ? activeColor
                                                  : yIdx === 1
                                                  ? '#475569'
                                                  : '#64748b',
                                            }}
                                          >
                                            {y.count}
                                          </span>
                                        )}
                                        {/* The Bar */}
                                        <div
                                          style={{
                                            height: `${Math.max(y.count > 0 ? 4 : 0, heightPct)}%`,
                                            backgroundColor: barColors[yIdx],
                                          }}
                                          className="w-3.5 sm:w-5 md:w-6 rounded-t-md transition-all duration-200 group-hover:brightness-90 shadow-xs relative"
                                        >
                                          {/* Tooltip on hover */}
                                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-30">
                                            {m.monthName} {y.yearBe}: {y.count} โครงการ (คลิกเพื่อดูรายการ)
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Month Names & Badges Row: 100% matched columns with pl-8 */}
                          <div className="pl-8 grid grid-flow-col auto-cols-fr gap-2 sm:gap-3 text-center pt-3">
                            {months.map((m) => (
                              <div key={`col-${m.monthIndex}`} className="flex flex-col items-center gap-1.5 min-w-0">
                                <span className="text-[12.5px] sm:text-[13.5px] font-bold text-slate-800 select-none">
                                  {m.monthName}
                                </span>
                                <div className="flex justify-center w-full">
                                  {renderBadge(m.deltaLabel, m.deltaType)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* 5. Section 3: Heatmap (SDG x Month) */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                แผนภาพความเข้มข้นของจำนวนโครงการ จำแนกตาม SDGs และเดือน
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                สีเข้มหมายถึงมีจำนวนโครงการมาก ใช้พิจารณาช่วงเดือนที่แต่ละเป้าหมายมีโครงการกระจุกตัว (เลือกชื่อแถวเพื่อกรองข้อมูล)
              </p>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[840px] space-y-1">
                {/* Month headers */}
                <div className="grid grid-cols-[360px_repeat(12,minmax(34px,1fr))] gap-1.5 pb-2 border-b border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-700 text-left pl-2">
                    เป้าหมาย SDGs
                  </div>
                  {MONTH_NAMES.map((mon) => (
                    <div
                      key={mon}
                      className="text-xs font-semibold text-slate-700 py-1"
                    >
                      {mon}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {data.heatmap.map((row) => {
                  const isSelected = selectedSdg === row.sdgNumber;
                  const rowTextColor = getSdgTextColor(row.sdgNumber);

                  return (
                    <div
                      key={row.sdgNumber}
                      onClick={() => toggleSdgSelection(row.sdgNumber)}
                      className={cn(
                        'grid grid-cols-[360px_repeat(12,minmax(34px,1fr))] gap-1.5 items-center rounded-xl py-1 px-1.5 transition-all cursor-pointer select-none',
                        isSelected
                          ? 'shadow-xs'
                          : 'hover:bg-slate-50'
                      )}
                      style={
                        isSelected
                          ? {
                              outline: `2px solid ${row.color}`,
                              backgroundColor: `color-mix(in srgb, ${row.color} 8%, #ffffff)`,
                            }
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2.5 pr-2 min-w-0">
                        <SdgNumberBadge goalNumber={row.sdgNumber} className="w-8 h-8 rounded-lg text-xs font-bold shrink-0" />
                        <span
                          className={cn(
                            'text-[13px] whitespace-nowrap',
                            isSelected ? 'font-medium text-slate-900' : 'font-normal text-slate-700'
                          )}
                          title={`${row.code}: ${row.nameTh}`}
                        >
                          {row.nameTh}
                        </span>
                      </div>

                      {row.months.map((m) => {
                        if (m.count === -1) {
                          return (
                            <div
                              key={m.monthIndex}
                              className="h-9 rounded-lg flex items-center justify-center text-xs text-slate-300 font-medium bg-slate-50/50"
                            >
                              –
                            </div>
                          );
                        }

                        const opacity = m.count === 0 ? 0.04 : Math.max(0.18, m.intensity);
                        const isDimmed = selectedSdg !== null && selectedSdg !== row.sdgNumber;

                        return (
                          <div
                            key={m.monthIndex}
                            className={cn(
                              'h-9 rounded-lg flex items-center justify-center text-[13px] font-bold transition-all duration-150',
                              isDimmed ? 'opacity-30' : 'opacity-100'
                            )}
                            style={{
                              backgroundColor:
                                m.count === 0
                                  ? '#f8fafc'
                                  : `color-mix(in srgb, ${row.color} ${Math.round(
                                      opacity * 100
                                    )}%, transparent)`,
                              color:
                                opacity > 0.55
                                  ? rowTextColor
                                  : m.count === 0
                                  ? '#94a3b8'
                                  : '#0f172a',
                            }}
                            title={`SDG ${row.sdgNumber} • ${m.monthName} ${data.targetYearBe}: ${m.count} โครงการ`}
                          >
                            {m.count}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          
        </>
      )}

      {/* Drill down modal */}
      <DrillDownProjectDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerTitle || `รายการทั้งหมดที่สอดคล้องกับ SDG ${drawerSdg || selectedSdg || ''}`}
        subtitle={drawerSubtitle || `ชุดข้อมูล: ${CATEGORY_TABS.find((t) => t.id === activeCategory)?.label || 'ทุกชุดข้อมูล'}`}
        accentColor={(drawerSdg || selectedSdg) ? SDG_DEFINITIONS[drawerSdg || selectedSdg!]?.color : '#00A651'}
        categoryKey={(activeCategory === 'all' ? 'research' : activeCategory) as CategoryKey}
        items={drawerItems}
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardTabFilter } from '@/hooks/useDashboardTabFilter';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { SdgIcon } from '@/components/ui/SdgIcon';
import { SdgAggregationResult, SdgTileData } from '@/lib/sdgAggregationService';
import { getSdgTextColor, SDG_DEFINITIONS } from '@/lib/sdg';
import { cn } from '@/lib/utils';
import { FaFilter, FaUndoAlt, FaInfoCircle, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import { DrillDownProjectDrawer } from '@/components/data-display/DrillDownProjectDrawer';
import { CategoryKey } from '@/types/dataManagement';

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
}

export function SdgsDashboardView({
  embeddedCategory,
  isEmbedded = false,
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

  // Sync filters
  const currentFiscalYear = tabFilter.fiscalYear || '2569';
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
    try {
      const cat = activeCategory === 'all' ? 'research' : activeCategory;
      const res = await fetch(`/api/data/${cat}`);
      if (!res.ok) throw new Error('Failed to fetch items');
      const json = await res.json();
      const all: any[] = Array.isArray(json) ? json : json.data || json.items || [];
      const filtered = all.filter((item) => {
        const sdgs: any =
          item.evaluation?.sdg_ids ||
          item.sdg_ids ||
          item.evaluation?.sdgs ||
          item.sdgs;
        if (!sdgs) return false;
        if (Array.isArray(sdgs)) {
          return sdgs.some((s) => Number(String(s).replace(/\D/g, '')) === sdgNum);
        }
        return String(sdgs).includes(String(sdgNum));
      });
      setDrawerItems(filtered);
    } catch (e) {
      console.error('Error fetching drawer items:', e);
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
    if (deltaLabel === '–') {
      return (
        <span
          className={cn(
            'inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold',
            isDarkBg ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
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
            'inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold border',
            isDarkBg
              ? 'bg-blue-500/30 text-white border-blue-300'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          )}
        >
          ใหม่
        </span>
      );
    }
    if (deltaType === 'up') {
      return (
        <span
          className={cn(
            'inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold border',
            isDarkBg
              ? 'bg-emerald-500/30 text-white border-emerald-300'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          )}
        >
          {deltaLabel}
        </span>
      );
    }
    if (deltaType === 'down') {
      return (
        <span
          className={cn(
            'inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold border',
            isDarkBg
              ? 'bg-rose-500/30 text-white border-rose-300'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          )}
        >
          {deltaLabel}
        </span>
      );
    }
    return (
      <span
        className={cn(
          'inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold',
          isDarkBg ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
        )}
      >
        {deltaLabel}
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
          <select
            value={currentFiscalYear}
            onChange={(e) => setTabFilter({ fiscalYear: e.target.value })}
            className="bg-transparent border-0 rounded-full px-2.5 py-1 font-medium text-slate-800 hover:bg-slate-50 cursor-pointer focus:outline-none"
            aria-label="ปีงบประมาณ"
          >
            <option value="2569">ปี 2569 (2026)</option>
            <option value="2568">ปี 2568 (2025)</option>
            <option value="2567">ปี 2567 (2024)</option>
            <option value="all">ทุกปีงบประมาณ</option>
          </select>
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

      {/* Loading & Error States */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">กำลังประมวลผลข้อมูล SDGs...</p>
        </div>
      )}

      {fetchError && !isLoading && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {fetchError}
        </div>
      )}

      {!isLoading && data && (
        <>
          {/* ========================================================================= */}
          {/* 2. Four KPI Cards with Prototype Top Gradient Line */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-rose-500 to-[#DD1367]" />
              <span className="text-xs font-semibold text-slate-500">
                โครงการ ({data.targetYearBe})
              </span>
              <div className="my-2.5 flex items-baseline gap-2">
                <span className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-none">
                  {data.kpis.distinctProjectsCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">โครงการ</span>
              </div>
              <div className="text-[11.5px] text-slate-500 leading-relaxed">
                <div className="flex items-center gap-1.5">
                  {renderBadge(
                    data.kpis.distinctProjectsDeltaLabel,
                    data.kpis.distinctProjectsDeltaType
                  )}
                  <span>เทียบปี {data.targetYearBe - 1}</span>
                </div>
                <div className="mt-1 text-slate-400 font-normal">
                  {data.kpis.yearBreakdownText}
                </div>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-rose-500 to-[#DD1367]" />
              <span className="text-xs font-semibold text-slate-500">
                SDG ที่มีจำนวนโครงการสูงสุด
              </span>
              <div className="my-2.5">
                <span className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-none">
                  SDG {data.kpis.topSdgNumber}
                </span>
              </div>
              <div className="text-[11.5px] text-slate-600 truncate leading-relaxed">
                <span className="font-semibold text-slate-800">
                  {data.kpis.topSdgNameTh}
                </span>
                <span className="block text-slate-400">
                  {data.kpis.topSdgCount} โครงการ
                </span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-rose-500 to-[#DD1367]" />
              <span className="text-xs font-semibold text-slate-500">
                SDG ที่เติบโตสูงสุดเทียบปี {data.targetYearBe - 1}
              </span>
              <div className="my-2.5">
                <span className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-none">
                  {data.kpis.highestGrowingSdgNumber
                    ? `SDG ${data.kpis.highestGrowingSdgNumber}`
                    : '–'}
                </span>
              </div>
              <div className="text-[11.5px] text-slate-600 truncate leading-relaxed">
                {data.kpis.highestGrowingSdgNumber ? (
                  <>
                    <span className="font-semibold text-slate-800">
                      {data.kpis.highestGrowingSdgNameTh}
                    </span>
                    <span className="block mt-0.5">
                      {renderBadge(data.kpis.highestGrowingDeltaLabel, 'up')}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400">ไม่มีข้อมูลเทียบอัตราเติบโต</span>
                )}
              </div>
            </div>

            {/* KPI 4 */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-rose-500 to-[#DD1367]" />
              <span className="text-xs font-semibold text-slate-500">
                ความครอบคลุมเป้าหมาย
              </span>
              <div className="my-2.5 flex items-baseline gap-1">
                <span className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-none">
                  {data.kpis.coveredSdgCount}
                </span>
                <span className="text-xl font-bold text-slate-400">/ 17</span>
              </div>
              <div className="text-[11.5px] text-slate-500 leading-relaxed">
                เป้าหมาย SDGs ที่มีโครงการในช่วงเวลานี้
              </div>
            </div>
          </div>

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

                return (
                  <div
                    key={tile.sdgNumber}
                    onClick={() => toggleSdgSelection(tile.sdgNumber)}
                    className={cn(
                      'flex flex-col justify-between p-3.5 rounded-[18px] border text-left cursor-pointer transition-all select-none relative overflow-hidden',
                      isSelected
                        ? 'border-transparent shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    )}
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${tile.color}, color-mix(in srgb, ${tile.color} 86%, #000))`
                        : `color-mix(in srgb, ${tile.color} 6%, #ffffff)`,
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    {/* Top Section: 76px Icon + 76px Info Block (title at top, count flush with icon bottom edge) */}
                    <div className="flex items-start gap-3.5">
                      {/* 76x76 SDG Icon (.n) */}
                      <div
                        className={cn(
                          'shrink-0 w-[76px] h-[76px] rounded-[14px] overflow-hidden flex items-center justify-center transition-all',
                          isSelected ? 'shadow-[0_0_0_3px_#ffffff,0_4px_12px_rgba(0,0,0,0.3)]' : 'shadow-xs'
                        )}
                      >
                        <SdgIcon n={tile.sdgNumber} size={76} />
                      </div>

                      {/* Right Info Block (.tb): exact 76px height matching the icon */}
                      <div className="min-w-0 flex-1 h-[76px] flex flex-col justify-between py-0.5">
                        {/* Title (.tn) */}
                        <div className="flex items-start gap-1.5">
                          <span
                            className="shrink-0 px-1.5 py-0.2 rounded-md text-[11px] font-bold leading-5"
                            style={{
                              backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : tile.color,
                              color: isSelected ? '#ffffff' : textColor,
                            }}
                          >
                            {tile.sdgNumber}
                          </span>
                          <span
                            className="text-[12.5px] font-semibold leading-tight line-clamp-1 truncate"
                            style={{ color: isSelected ? textColor : '#0f172a' }}
                            title={`SDG ${tile.sdgNumber}: ${tile.nameTh}`}
                          >
                            {tile.nameTh}
                          </span>
                        </div>

                        {/* Count (.tc & .c) - bottom edge flush with the icon */}
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span
                              className="text-[26px] font-black leading-none tracking-tight"
                              style={{ color: isSelected ? textColor : '#0f172a' }}
                            >
                              {tile.currentCount}
                            </span>
                            <span
                              className="text-[11.5px] font-medium"
                              style={{
                                color: isSelected ? textColor : '#64748b',
                                opacity: isSelected ? 0.85 : 1,
                              }}
                            >
                              โครงการ
                            </span>
                          </div>
                          <div>
                            {renderBadge(tile.deltaLabel, tile.deltaType, isSelected)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3-Year Breakdown (.y3) */}
                    <div className="flex items-center pt-2 mt-2.5 border-t border-slate-200/50 text-left">
                      {tile.yearCounts.map((yc, idx) => {
                        const isLatest = idx === tile.yearCounts.length - 1;
                        return (
                          <div
                            key={yc.year}
                            className={cn(
                              'flex flex-col px-2.5 leading-tight flex-1',
                              idx === 0 ? 'pl-0' : 'border-l border-slate-200/60'
                            )}
                          >
                            <span
                              className="text-[10px]"
                              style={{
                                color: isSelected ? textColor : '#94a3b8',
                                opacity: isSelected ? 0.75 : 1,
                              }}
                            >
                              {yc.yearBe}
                            </span>
                            <span
                              className={cn(
                                'text-[13px]',
                                isLatest ? 'font-bold' : 'font-medium'
                              )}
                              style={{
                                color: isSelected
                                  ? textColor
                                  : isLatest
                                  ? '#0f172a'
                                  : '#64748b',
                                borderBottom:
                                  isLatest && !isSelected
                                    ? `2px solid ${tile.color}`
                                    : isLatest && isSelected
                                    ? `2px solid ${textColor}`
                                    : 'none',
                                paddingBottom: isLatest ? '1px' : '0',
                              }}
                            >
                              {yc.hasData ? yc.count : '–'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Drill down trigger */}
                    {isSelected && tile.currentCount > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDrawer(tile.sdgNumber);
                        }}
                        className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full bg-white/25 hover:bg-white/40 text-[11px] font-bold transition-colors"
                        style={{ color: textColor }}
                      >
                        <FaExternalLinkAlt className="text-[9px]" />
                        <span>ดู {tile.currentCount} โครงการ</span>
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
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                เปรียบเทียบจำนวนโครงการรายเดือน 3 ปี{' '}
                {selectedSdg !== null && (
                  <span className="text-emerald-700 font-extrabold">
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

            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap text-xs text-slate-600 pt-1">
              {data.comparisonYearsBe.map((yBe, idx) => {
                const yCe = data.comparisonYears[idx];
                const hasData = data.yearsWithData.includes(yCe);
                const colors = ['#cbd5e1', '#94a3b8', '#00A651'];
                const swatchColor = hasData ? colors[idx] : '#e2e8f0';

                return (
                  <div key={yBe} className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-xs shrink-0"
                      style={{ backgroundColor: swatchColor }}
                    />
                    <span className="font-medium">
                      ปี {yBe}
                      {!hasData && ' (ไม่มีข้อมูล)'}
                    </span>
                  </div>
                );
              })}
              <div className="text-slate-400">|</div>
              <div className="text-[11.5px] text-slate-500">
                ร้อยละการเปลี่ยนแปลงเทียบเดือนเดียวกันของปี {data.targetYearBe - 1}
              </div>
            </div>

            {/* Monthly SVG Bar Chart */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[700px] h-64 relative">
                {(() => {
                  const months = data.monthlyBars;
                  const allCounts = months.flatMap((m) =>
                    m.years.map((y) => (y.hasData ? y.count : 0))
                  );
                  const rawMax = Math.max(...allCounts, 1);
                  const maxVal = Math.ceil(rawMax * 1.25) || 5;

                  const chartHeight = 200;
                  const chartWidth = 720;
                  const leftMargin = 38;
                  const topMargin = 15;
                  const innerWidth = chartWidth - leftMargin - 15;
                  const groupWidth = innerWidth / months.length;
                  const barWidth = Math.min(22, (groupWidth * 0.7) / 3);

                  const barColors = ['#cbd5e1', '#94a3b8', '#00A651'];

                  return (
                    <svg
                      viewBox={`0 0 ${chartWidth} ${chartHeight + 35}`}
                      className="w-full h-full"
                      role="img"
                      aria-label="กราฟแท่งเปรียบเทียบรายเดือน"
                    >
                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                        const val = Math.round(maxVal * pct);
                        const y = topMargin + chartHeight - chartHeight * pct;
                        return (
                          <g key={`grid-${idx}`}>
                            <line
                              x1={leftMargin}
                              x2={chartWidth - 10}
                              y1={y}
                              y2={y}
                              stroke="#e2e8f0"
                              strokeDasharray={pct === 0 ? '' : '3 3'}
                            />
                            <text
                              x={leftMargin - 6}
                              y={y + 4}
                              textAnchor="end"
                              className="text-[10px] fill-slate-400 font-mono"
                            >
                              {val}
                            </text>
                          </g>
                        );
                      })}

                      {/* Bars */}
                      {months.map((m, mIdx) => {
                        const groupX = leftMargin + mIdx * groupWidth;
                        const centerX = groupX + groupWidth / 2;
                        const barsStartX = centerX - (barWidth * 3 + 4) / 2;

                        return (
                          <g key={m.monthIndex}>
                            {m.years.map((y, yIdx) => {
                              if (!y.hasData) return null;
                              const barHeight = (y.count / maxVal) * chartHeight;
                              const barX = barsStartX + yIdx * (barWidth + 2);
                              const barY = topMargin + chartHeight - barHeight;

                              return (
                                <rect
                                  key={y.year}
                                  x={barX}
                                  y={barY}
                                  width={barWidth}
                                  height={Math.max(2, barHeight)}
                                  rx={3}
                                  fill={barColors[yIdx]}
                                  className="transition-all hover:opacity-80"
                                >
                                  <title>
                                    {m.monthName} {y.yearBe}: {y.count} โครงการ
                                  </title>
                                </rect>
                              );
                            })}

                            <text
                              x={centerX}
                              y={topMargin + chartHeight + 18}
                              textAnchor="middle"
                              className="text-[11px] font-medium fill-slate-600"
                            >
                              {m.monthName}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  );
                })()}
              </div>

              {/* Monthly deltas row */}
              <div className="min-w-[700px] grid grid-flow-col auto-cols-fr gap-1 pt-1 border-t border-slate-100 text-center">
                {data.monthlyBars.map((m) => (
                  <div key={`delta-${m.monthIndex}`} className="py-1">
                    {renderBadge(m.deltaLabel, m.deltaType)}
                  </div>
                ))}
              </div>
            </div>
          </div>

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
              <div className="min-w-[760px] space-y-1">
                {/* Month headers */}
                <div className="grid grid-cols-[240px_repeat(12,1fr)] gap-1 pb-1 border-b border-slate-200 text-center">
                  <div className="text-[11px] font-bold text-slate-500 text-left pl-2">
                    เป้าหมาย SDGs
                  </div>
                  {MONTH_NAMES.map((mon) => (
                    <div
                      key={mon}
                      className="text-[11px] font-bold text-slate-600 py-1"
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
                        'grid grid-cols-[240px_repeat(12,1fr)] gap-1 items-center rounded-lg py-1 px-1 transition-colors cursor-pointer select-none',
                        isSelected
                          ? 'bg-emerald-50 ring-1 ring-emerald-300'
                          : 'hover:bg-slate-50'
                      )}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-extrabold shrink-0 shadow-2xs"
                          style={{
                            backgroundColor: row.color,
                            color: rowTextColor,
                          }}
                        >
                          {row.sdgNumber}
                        </span>
                        <span
                          className={cn(
                            'text-xs truncate',
                            isSelected ? 'font-bold text-emerald-950' : 'font-medium text-slate-700'
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
                              className="h-8 rounded-md flex items-center justify-center text-xs text-slate-300 font-medium bg-slate-50/50"
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
                              'h-8 rounded-md flex items-center justify-center text-xs font-semibold transition-all duration-150',
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

          {/* Bottom Footnote */}
          <div className="pt-2 text-xs text-slate-500 leading-relaxed font-normal">
            * ข้อมูลในหน้านี้เป็นข้อมูลจริงจากฐานข้อมูล โครงการ 1 โครงการอาจถูกประเมินสอดคล้องมากกว่า 1 SDG จึงไม่ควรนำผลรวมรายข้อมาเทียบกับจำนวนโครงการจริง
          </div>
        </>
      )}

      {/* Drill down modal */}
      <DrillDownProjectDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`รายชื่อโครงการที่สอดคล้องกับ SDG ${selectedSdg || ''}`}
        subtitle={`ชุดข้อมูล: ${activeCategory === 'all' ? 'ทุกชุดข้อมูล' : activeCategory}`}
        accentColor={selectedSdg ? SDG_DEFINITIONS[selectedSdg]?.color : '#00A651'}
        categoryKey={(activeCategory === 'all' ? 'research' : activeCategory) as CategoryKey}
        items={drawerItems}
      />
    </div>
  );
}

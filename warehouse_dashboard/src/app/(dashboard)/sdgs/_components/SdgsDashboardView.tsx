'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardTabFilter } from '@/hooks/useDashboardTabFilter';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { SdgIcon } from '@/components/ui/SdgIcon';
import { SdgAggregationResult, SdgTileData } from '@/lib/sdgAggregationService';
import { getSdgTextColor } from '@/lib/sdg';
import { cn } from '@/lib/utils';
import { FaFilter, FaUndoAlt, FaInfoCircle, FaCheck } from 'react-icons/fa';

export function SdgsDashboardView() {
  const { tabFilter, setTabFilter, resetTabFilter } = useDashboardTabFilter('sdgs');

  const [selectedSdg, setSelectedSdg] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [data, setData] = useState<SdgAggregationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Sync filters
  const currentFiscalYear = tabFilter.fiscalYear || '2569';
  const currentDept = tabFilter.department || 'all';
  const currentStrategic = tabFilter.customFilters?.strategicFilter || 'all';

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
    query.set('compareYearsCount', '3');

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
  }, [currentFiscalYear, currentDept, currentStrategic, activeCategory, selectedSdg]);

  const toggleSdgSelection = (sdgNum: number) => {
    setSelectedSdg((prev) => (prev === sdgNum ? null : sdgNum));
  };

  const CATEGORY_TABS = [
    { id: 'all', label: 'ทุกชุดข้อมูล' },
    { id: 'research', label: 'โครงการวิจัย' },
    { id: 'academic', label: 'โครงการพัฒนาวิชาการ' },
    { id: 'publications', label: 'ผลงานตีพิมพ์' },
    { id: 'ip', label: 'ทรัพย์สินทางปัญญา' },
    { id: 'service', label: 'งานบริการวิชาการ' },
  ];

  const renderBadge = (deltaLabel: string, deltaType: 'up' | 'down' | 'neutral' | 'new') => {
    if (deltaLabel === '–') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500">
          –
        </span>
      );
    }
    if (deltaType === 'new') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          ใหม่
        </span>
      );
    }
    if (deltaType === 'up') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {deltaLabel}
        </span>
      );
    }
    if (deltaType === 'down') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          {deltaLabel}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
        {deltaLabel}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* ========================================================================= */}
      {/* 1. Header & Title */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center p-1.5 shrink-0">
            <SdgIcon n="wheel" size={32} priority />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              โครงการแยกตามเป้าหมาย SDGs ทั้ง 17 ข้อ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              ระบบวิเคราะห์และบริหารจัดการข้อมูลหน่วยวิจัยและนวัตกรรม คณะวิศวกรรมศาสตร์ กำแพงแสน
            </p>
          </div>
        </div>

        {selectedSdg !== null && (
          <button
            type="button"
            onClick={() => setSelectedSdg(null)}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <FaUndoAlt className="text-[10px]" />
            <span>ล้างการเลือก SDG {selectedSdg}</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. Standard Top Filter Bar (System Filter) */}
      {/* ========================================================================= */}
      <DashboardTabFilterBar
        tabKey="sdgs"
        totalCount={data?.kpis.distinctProjectsCount}
        filteredCount={data?.kpis.distinctProjectsCount}
        showDepartment={true}
        showStrategic={true}
        showFiscalYear={true}
      >
        {/* Module Filter Slot: Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-lg border border-slate-200 shrink-0 overflow-x-auto max-w-full">
          {CATEGORY_TABS.map((cat) => {
            const isCatActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer',
                  isCatActive
                    ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </DashboardTabFilterBar>

      {/* Basis notice */}
      {data?.basisNote && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900">
          <FaInfoCircle className="text-emerald-700 shrink-0 text-sm" />
          <span>{data.basisNote}</span>
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
          {/* 3. Four KPI Cards */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Distinct Projects */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">
                โครงการ ({data.targetYearBe})
              </span>
              <div className="my-2 flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
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

            {/* KPI 2: Top SDG */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">
                SDG ที่มีจำนวนโครงการสูงสุด
              </span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
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

            {/* KPI 3: Highest Growing SDG */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">
                SDG ที่เติบโตสูงสุดเทียบกับปี {data.targetYearBe - 1}
              </span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
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

            {/* KPI 4: SDG Coverage */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">
                ความครอบคลุมเป้าหมาย
              </span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {data.kpis.coveredSdgCount}
                </span>
                <span className="text-lg font-bold text-slate-400">/ 17</span>
              </div>
              <div className="text-[11.5px] text-slate-500 leading-relaxed">
                เป้าหมาย SDGs ที่มีโครงการในช่วงเวลานี้
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. Section 1: ภาพรวมจำนวนโครงการจำแนกตามเป้าหมาย SDGs ทั้ง 17 ข้อ */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ภาพรวมจำนวนโครงการจำแนกตามเป้าหมาย SDGs ทั้ง 17 ข้อ
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                จำนวนโครงการที่ได้รับการประเมินว่าสอดคล้องกับแต่ละเป้าหมาย เปรียบเทียบกับช่วงเวลาเดียวกันของปีก่อนหน้า (กดที่การ์ดเพื่อกรองข้อมูลในส่วนอื่น)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {data.tiles.map((tile) => {
                const isSelected = selectedSdg === tile.sdgNumber;
                const textColor = getSdgTextColor(tile.sdgNumber);

                return (
                  <button
                    key={tile.sdgNumber}
                    type="button"
                    onClick={() => toggleSdgSelection(tile.sdgNumber)}
                    className={cn(
                      'flex flex-col justify-between p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-150 select-none',
                      isSelected
                        ? 'border-black/20 shadow-md ring-2 ring-black/10'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-xs'
                    )}
                    style={{
                      backgroundColor: isSelected ? tile.color : '#ffffff',
                    }}
                    aria-pressed={isSelected}
                  >
                    {/* Top Row: Icon + Number & Title */}
                    <div className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          'shrink-0 flex items-center justify-center transition-all',
                          isSelected ? 'rounded-md shadow-[0_0_0_3px_#ffffff]' : ''
                        )}
                      >
                        <SdgIcon n={tile.sdgNumber} size={30} />
                      </div>
                      <div className="min-w-0 flex-1 leading-snug">
                        <div
                          className="text-[12px] font-bold line-clamp-2"
                          style={{ color: isSelected ? textColor : '#0f172a' }}
                          title={`SDG ${tile.sdgNumber}: ${tile.nameTh}`}
                        >
                          <span className="font-extrabold mr-1.5">
                            {String(tile.sdgNumber).padStart(2, '0')}
                          </span>
                          {tile.nameTh}
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Count + Delta */}
                    <div className="my-3 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-2xl font-black"
                          style={{ color: isSelected ? textColor : '#0f172a' }}
                        >
                          {tile.currentCount}
                        </span>
                        <span
                          className="text-[11px] font-medium"
                          style={{
                            color: isSelected ? textColor : '#64748b',
                            opacity: isSelected ? 0.85 : 1,
                          }}
                        >
                          โครงการ
                        </span>
                      </div>
                      {!isSelected && renderBadge(tile.deltaLabel, tile.deltaType)}
                      {isSelected && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-white/20"
                          style={{ color: textColor }}
                        >
                          {tile.deltaLabel}
                        </span>
                      )}
                    </div>

                    {/* Bottom Row: Year Columns (year above number, latest year bold + underlined) */}
                    <div
                      className={cn(
                        'pt-2 border-t grid grid-cols-3 gap-1 text-center text-xs',
                        isSelected ? 'border-white/20' : 'border-slate-100'
                      )}
                    >
                      {tile.yearCounts.map((yc, idx) => {
                        const isLatest = idx === tile.yearCounts.length - 1;
                        return (
                          <div key={yc.year} className="flex flex-col items-center">
                            <span
                              className="text-[10px] font-medium"
                              style={{
                                color: isSelected ? textColor : '#94a3b8',
                                opacity: isSelected ? 0.8 : 1,
                              }}
                            >
                              {yc.yearBe}
                            </span>
                            <span
                              className={cn(
                                'text-[12px]',
                                isLatest ? 'font-black' : 'font-medium'
                              )}
                              style={{
                                color: isSelected ? textColor : isLatest ? '#0f172a' : '#475569',
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
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 5. Section 2: เปรียบเทียบจำนวนโครงการรายเดือน (Bar Chart) */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
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

            {/* Responsive Monthly SVG Bar Chart */}
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
                      {/* Horizontal Grid lines */}
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

                      {/* Month Bars */}
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

                            {/* Month Label */}
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

              {/* Delta percentages row beneath each month */}
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
          {/* 6. Section 3: Heatmap (SDG x Month) */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
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
                {/* Month Column Headers */}
                <div className="grid grid-cols-[240px_repeat(12,1fr)] gap-1 pb-1 border-b border-slate-200 text-center">
                  <div className="text-[11px] font-bold text-slate-500 text-left pl-2">
                    เป้าหมาย SDGs
                  </div>
                  {[
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
                  ].map((mon) => (
                    <div
                      key={mon}
                      className="text-[11px] font-bold text-slate-600 py-1"
                    >
                      {mon}
                    </div>
                  ))}
                </div>

                {/* Heatmap Rows */}
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
                      {/* Row Label Badge: Number + Thai Name */}
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

                      {/* 12 Month Cells */}
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

          {/* ========================================================================= */}
          {/* 7. Bottom Footnote */}
          {/* ========================================================================= */}
          <div className="pt-2 text-xs text-slate-500 leading-relaxed font-normal">
            * ข้อมูลในหน้านี้เป็นข้อมูลจริงจากฐานข้อมูล โครงการ 1 โครงการอาจถูกประเมินสอดคล้องมากกว่า 1 SDG จึงไม่ควรนำผลรวมรายข้อมาเทียบกับจำนวนโครงการจริง
          </div>
        </>
      )}
    </div>
  );
}

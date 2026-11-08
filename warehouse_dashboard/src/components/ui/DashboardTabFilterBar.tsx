'use client';

import React, { useMemo, useState } from 'react';
import { FaCalendarAlt, FaCheck, FaChevronDown, FaUndoAlt, FaTimes, FaSlidersH } from 'react-icons/fa';
import { DepartmentSelect } from './department-select';
import { StrategicFilterSelect } from './StrategicFilterSelect';
import { SearchInput } from './SearchInput';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useDashboardTabFilter, TabFilterState } from '@/hooks/useDashboardTabFilter';
import { AVAILABLE_YEARS, QUICK_FISCAL_YEARS } from '@/lib/fiscalYears';
import { getTimeFilterLabel } from '@/types/timeFilter';

export interface QuickFiscalYearOption {
  id: string;
  label: string;
  count?: number;
}

export interface DashboardTabFilterBarProps {
  /** Route / Tab identifier for state isolation */
  tabKey: 'overview' | 'research' | 'academic' | 'publications' | 'service' | 'ip' | 'personnel' | string;

  /** Total raw count of records in current tab */
  totalCount?: number;

  /** Filtered count after all filters applied */
  filteredCount?: number;

  /** Current tab filter state (optional if relying on tabKey hook) */
  filterState?: TabFilterState;

  /** State mutation callback (optional if relying on tabKey hook) */
  onFilterChange?: (next: Partial<TabFilterState>) => void;

  /** Single-tab reset callback (optional if relying on tabKey hook) */
  onReset?: () => void;

  // --- Quick Controls Configuration ---
  /** Whether to render quick Fiscal Year segmented buttons (default: true) */
  showFiscalYear?: boolean;

  /** Replace the older-years dropdown with a detailed time-range trigger */
  showDetailedTime?: boolean;

  /** Opens the shared detailed time modal */
  onOpenDetailedTime?: () => void;

  /** Custom label for the detailed time button (default: 'เลือกช่วงเวลา') */
  detailedTimeLabel?: string;

  /**
   * Custom fiscal year options. Leave undefined (recommended) to use the shared
   * options so every dashboard page shows the same years and stays aligned.
   */
  fiscalYearOptions?: QuickFiscalYearOption[];

  /** Whether to render DepartmentSelect (default: true) */
  showDepartment?: boolean;

  /** Label for all departments option (default: 'ทุกสังกัด') */
  departmentAllLabel?: string;

  /** Department select width class (default: 'w-[170px]') */
  departmentClassName?: string;

  /** Whether to render StrategicFilterSelect (default: true) */
  showStrategic?: boolean;

  /** Strategic select width class (default: 'w-[180px]') */
  strategicClassName?: string;

  /** Whether to render SearchInput (default: false) */
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;

  // --- Tab-Specific Custom Controls Slot ---
  /** Custom primary controls rendered between Department and FilterPopover */
  children?: React.ReactNode;

  /** Explicitly toggle whether secondary filter toggle button is rendered */
  showFilterToggle?: boolean;

  /** Whether to show the top-bar reset button (default: true) */
  showResetButton?: boolean;

  /** Whether to render ActiveFilterChips below bar (default: true) */
  showActiveChips?: boolean;

  /** Extra chip definitions if managed outside customFilters */
  extraChips?: Array<{
    id: string;
    label: string;
    onRemove: () => void;
  }>;

  /** Optional class and style overrides */
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Shared fiscal-year options so every dashboard tab shows the exact same
 * segmented control (same number of years, same order). Derived from the
 * current fiscal year instead of being hard-coded per page.
 */
const DEFAULT_FY_OPTIONS: QuickFiscalYearOption[] = [
  { id: 'all', label: 'ทั้งหมด' },
  ...QUICK_FISCAL_YEARS.map((fy) => ({ id: fy, label: `ปีงบ ${fy}` })),
];

export function DashboardTabFilterBar({
  tabKey,
  totalCount,
  filteredCount,
  filterState: propFilterState,
  onFilterChange: propOnFilterChange,
  onReset: propOnReset,
  showFiscalYear = true,
  showDetailedTime = false,
  onOpenDetailedTime,
  detailedTimeLabel = 'เลือกช่วงเวลา',
  fiscalYearOptions = DEFAULT_FY_OPTIONS,
  showDepartment = true,
  departmentAllLabel = 'ทุกสังกัด',
  departmentClassName = 'w-[170px]',
  showStrategic = true,
  strategicClassName = 'w-[180px]',
  showSearch = false,
  searchPlaceholder = 'ค้นหา...',
  searchValue,
  onSearchChange,
  children,
  showFilterToggle,
  showResetButton = true,
  showActiveChips = true,
  extraChips = [],
  className = '',
  style,
}: DashboardTabFilterBarProps) {
  const hookResult = useDashboardTabFilter(tabKey);

  const filterState = propFilterState || hookResult.tabFilter;
  const onFilterChange = propOnFilterChange || hookResult.setTabFilter;
  const onReset = propOnReset || hookResult.resetTabFilter;

  const currentFiscalYear = filterState.fiscalYear || 'all';
  const currentDepartment = filterState.department || 'all';
  const currentStrategic = filterState.customFilters?.strategicFilter || 'all';
  const currentSearch = searchValue !== undefined ? searchValue : (filterState.search || '');
  const hasDetailedNonFiscalTime =
    hookResult.timeFilter.mode === 'academic' || hookResult.timeFilter.mode === 'manual';

  // Quick pills show only the latest years; older years live in an overflow
  // dropdown so the bar never grows as new fiscal years are added.
  const quickYearIds = new Set(fiscalYearOptions.map((opt) => opt.id));
  const olderYearOptions = AVAILABLE_YEARS.filter((year) => !quickYearIds.has(year));
  const isOlderYearSelected = currentFiscalYear !== 'all' && !quickYearIds.has(currentFiscalYear);
  const isQuickFiscalTime =
    hookResult.timeFilter.mode === 'fiscal' &&
    hookResult.timeFilter.fiscalQuarter === 'all' &&
    quickYearIds.has(hookResult.timeFilter.fiscalYear);
  const [isOtherYearsOpen, setIsOtherYearsOpen] = useState(false);

  // Handle department change
  const handleDepartmentChange = (dept: string) => {
    onFilterChange({ department: dept });
  };

  // Quick fiscal-year pills are a shortcut for the same single time state.
  // Clear any detailed time selection so the pill always takes effect.
  const handleFiscalYearChange = (fiscalYear: string) => {
    onFilterChange({
      fiscalYear,
      dateFrom: undefined,
      dateTo: undefined,
      customFilters: {
        ...(filterState.customFilters || {}),
        timeFilter: undefined,
      },
    });
  };

  // Handle strategic filter change
  const handleStrategicChange = (strat: string) => {
    onFilterChange({
      customFilters: {
        ...(filterState.customFilters || {}),
        strategicFilter: strat,
      },
    });
  };

  // Handle search change
  const handleSearchChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      onFilterChange({ search: val });
    }
  };

  // Active filter badge count computation
  const activeCount = useMemo(() => {
    let count = 0;
    if (hookResult.timeFilter.mode !== 'all') count++;
    if (showDepartment && currentDepartment !== 'all') count++;
    if (showStrategic && currentStrategic !== 'all') count++;
    if (showSearch && currentSearch && currentSearch.trim() !== '') count++;
    if (filterState.customFilters) {
      Object.entries(filterState.customFilters).forEach(([key, val]) => {
        if (key === 'strategicFilter' || key === 'timeFilter' || key === 'popoverFilters' || key === 'dateFrom' || key === 'dateTo' || key === 'sdgs') return;
        if (
          val !== undefined &&
          val !== null &&
          val !== 'all' &&
          val !== '' &&
          val !== false &&
          !(Array.isArray(val) && val.length === 0)
        ) {
          count++;
        }
      });
    }
    if (extraChips.length > 0) {
      count += extraChips.length;
    }
    return count;
  }, [hookResult.timeFilter, showDepartment, currentDepartment, showStrategic, currentStrategic, showSearch, currentSearch, filterState.customFilters, extraChips]);

  const hasActiveFilters = activeCount > 0;

  // Active filter chips generation
  const activeChips = useMemo(() => {
    const list: Array<{ id: string; label: string; onRemove: () => void }> = [];

    // 1. Time — quick fiscal pills already show their own state.
    if (hookResult.timeFilter.mode !== 'all' && !isQuickFiscalTime) {
      list.push({
        id: 'timeFilter',
        label: getTimeFilterLabel(hookResult.timeFilter),
        onRemove: () => handleFiscalYearChange('all'),
      });
    }

    // 2. Department
    if (showDepartment && currentDepartment !== 'all') {
      list.push({
        id: 'department',
        label: `สังกัด: ${currentDepartment}`,
        onRemove: () => onFilterChange({ department: 'all' }),
      });
    }

    // 3. Search
    if (showSearch && currentSearch && currentSearch.trim() !== '') {
      list.push({
        id: 'search',
        label: `คำค้นหา: "${currentSearch.trim().slice(0, 30)}${currentSearch.length > 30 ? '...' : ''}"`,
        onRemove: () => handleSearchChange(''),
      });
    }

    // 4. Strategic Filter
    if (showStrategic && currentStrategic !== 'all') {
      list.push({
        id: 'strategicFilter',
        label: `ยุทธศาสตร์: ${currentStrategic}`,
        onRemove: () => handleStrategicChange('all'),
      });
    }

    // 5. Custom Filters
    if (filterState.customFilters) {
      const cf = filterState.customFilters;

      if (cf.fundingType && cf.fundingType !== 'all') {
        const fLabel = cf.fundingType === 'external' ? 'ทุนภายนอก' : 'ทุนภายใน';
        list.push({
          id: 'fundingType',
          label: `ประเภททุน: ${fLabel}`,
          onRemove: () => onFilterChange({ customFilters: { ...cf, fundingType: 'all' } }),
        });
      }

      if (cf.grantTier && cf.grantTier !== 'all') {
        const tierLabels: Record<string, string> = {
          tier1: '< 5 แสนบาท',
          tier2: '5 แสน - 2 ล้านบาท',
          tier3: '2 - 10 ล้านบาท',
          tier4: '≥ 10 ล้านบาท',
        };
        list.push({
          id: 'grantTier',
          label: `ขนาดงบ: ${tierLabels[cf.grantTier] || cf.grantTier}`,
          onRemove: () => onFilterChange({ customFilters: { ...cf, grantTier: 'all' } }),
        });
      }

      if (cf.selectedFund && cf.selectedFund !== 'all') {
        list.push({
          id: 'selectedFund',
          label: `แหล่งทุน: ${cf.selectedFund}`,
          onRemove: () => onFilterChange({ customFilters: { ...cf, selectedFund: 'all' } }),
        });
      }

      if (cf.selectedMonth && cf.selectedMonth !== 'all') {
        list.push({
          id: 'selectedMonth',
          label: `เดือน: ${cf.selectedMonth}`,
          onRemove: () => onFilterChange({ customFilters: { ...cf, selectedMonth: 'all' } }),
        });
      }

      if (cf.selectedClient && cf.selectedClient !== 'all') {
        list.push({
          id: 'selectedClient',
          label: `ผู้ว่าจ้าง: ${cf.selectedClient}`,
          onRemove: () => onFilterChange({ customFilters: { ...cf, selectedClient: 'all' } }),
        });
      }

      if (cf.hideMissingClient) {
        list.push({
          id: 'hideMissingClient',
          label: 'ซ่อนไม่ระบุลูกค้า',
          onRemove: () => onFilterChange({ customFilters: { ...cf, hideMissingClient: false } }),
        });
      }

      if (cf.levelFilter && cf.levelFilter !== 'all') {
        list.push({
          id: 'levelFilter',
          label: `ระดับคุณภาพ: ${cf.levelFilter}`,
          onRemove: () => onFilterChange({ customFilters: { ...cf, levelFilter: 'all' } }),
        });
      }

      if (cf.statusFilter && cf.statusFilter !== 'all') {
        const sLabels: Record<string, string> = {
          published: 'ตีพิมพ์แล้ว',
          prep: 'เตรียมพร้อม',
        };
        list.push({
          id: 'statusFilter',
          label: `สถานะ: ${sLabels[cf.statusFilter] || cf.statusFilter}`,
          onRemove: () => onFilterChange({ customFilters: { ...cf, statusFilter: 'all' } }),
        });
      }

      if (cf.selectedRole && cf.selectedRole !== 'all') {
        list.push({
          id: 'selectedRole',
          label: `บทบาท: ${cf.selectedRole}`,
          onRemove: () => onFilterChange({ customFilters: { ...cf, selectedRole: 'all' } }),
        });
      }

      if (cf.pipelineFilter && cf.pipelineFilter !== 'all') {
        const pLabels: Record<string, string> = {
          granted: 'คุ้มครองแล้ว',
          pending: 'ยื่นคำขอแล้ว',
          in_prep: 'เตรียมยื่นจด',
        };
        list.push({
          id: 'pipelineFilter',
          label: `สถานะสิทธิบัตร: ${pLabels[cf.pipelineFilter] || cf.pipelineFilter}`,
          onRemove: () => onFilterChange({ customFilters: { ...cf, pipelineFilter: 'all' } }),
        });
      }

      if (cf.typeFilter && cf.typeFilter !== 'all') {
        list.push({
          id: 'typeFilter',
          label: `ประเภท: ${cf.typeFilter}`,
          onRemove: () => onFilterChange({ customFilters: { ...cf, typeFilter: 'all' } }),
        });
      }
    }

    // Append any extra chips passed by parent
    extraChips.forEach((chip) => {
      list.push(chip);
    });

    return list;
  }, [hookResult.timeFilter, isQuickFiscalTime, currentDepartment, currentSearch, currentStrategic, filterState.customFilters, extraChips]);

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Count only secondary/advanced filters (excluding primary fiscalYear & department)
  const secondaryActiveCount = useMemo(() => {
    let count = 0;
    if (showStrategic && currentStrategic !== 'all') count++;
    if (filterState.customFilters) {
      Object.entries(filterState.customFilters).forEach(([key, val]) => {
        if (key === 'strategicFilter' || key === 'timeFilter' || key === 'popoverFilters' || key === 'dateFrom' || key === 'dateTo' || key === 'sdgs') return;
        if (
          val !== undefined &&
          val !== null &&
          val !== 'all' &&
          val !== '' &&
          val !== false &&
          !(Array.isArray(val) && val.length === 0)
        ) {
          count++;
        }
      });
    }
    return count;
  }, [showStrategic, currentStrategic, filterState.customFilters]);

  const isOverviewTab = tabKey === 'overview';
  // Overview's children are action buttons; every other tab's children are filters.
  const hasSecondaryControls =
    showFilterToggle !== undefined
      ? showFilterToggle
      : showStrategic || (!isOverviewTab && Boolean(children));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {/* Primary Sticky Control Dock */}
      <div
        className={className}
        style={{
          position: 'sticky',
          top: '50px',
          zIndex: 40,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          border: '1px solid #e2e8f0',
          padding: '10px 16px',
          borderRadius: '14px',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: showAdvanced && hasSecondaryControls ? '10px' : '0px',
          ...style,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            width: '100%',
          }}
        >
          {/* Left Side: Only Primary Context (Fiscal Year + Department) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Fiscal Year Segmented Pills (No Redundant Record Counts) */}
            {showFiscalYear && (
              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: '#f1f5f9',
                  padding: '3px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 500,
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 6px',
                    color: '#00A651',
                    fontSize: '13px',
                  }}
                  title="เลือกปีงบประมาณ"
                >
                  <FaCalendarAlt />
                </div>
                {fiscalYearOptions.map((opt) => {
                  const active =
                    opt.id === 'all'
                      ? currentFiscalYear === 'all' && !hasDetailedNonFiscalTime
                      : currentFiscalYear === opt.id;
                  const cleanLabel = opt.label.replace(/\s*\(\d+\)\s*$/, '');

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleFiscalYearChange(opt.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '7px',
                        border: 'none',
                        backgroundColor: active ? '#ffffff' : 'transparent',
                        color: active ? '#047857' : '#475569',
                        fontWeight: active ? 700 : 500,
                        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease, color 0.15s ease',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cleanLabel}
                    </button>
                  );
                })}

                {/* Detailed time picker replaces the older-years dropdown when enabled */}
                {showDetailedTime && onOpenDetailedTime ? (
                  <button
                    type="button"
                    onClick={onOpenDetailedTime}
                    aria-label={detailedTimeLabel}
                    title={detailedTimeLabel}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 9px',
                      borderRadius: '7px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontWeight: 500,
                      fontSize: '12px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                    }}
                  >
                    <FaSlidersH style={{ fontSize: '10px' }} />
                    <span>{detailedTimeLabel}</span>
                  </button>
                ) : olderYearOptions.length > 0 && (
                  <Popover open={isOtherYearsOpen} onOpenChange={setIsOtherYearsOpen}>
                    <PopoverTrigger
                      render={
                        <button
                          type="button"
                          aria-label="เลือกปีงบประมาณอื่น ๆ"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            minWidth: '80px',
                            boxSizing: 'border-box',
                            padding: '4px 8px',
                            borderRadius: '7px',
                            border: 'none',
                            backgroundColor: isOlderYearSelected || isOtherYearsOpen ? '#ffffff' : 'transparent',
                            color: isOlderYearSelected || isOtherYearsOpen ? '#047857' : '#475569',
                            fontWeight: isOlderYearSelected || isOtherYearsOpen ? 700 : 500,
                            boxShadow: isOlderYearSelected || isOtherYearsOpen ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease, color 0.15s ease',
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <span>
                            {isOlderYearSelected ? `ปีงบ ${currentFiscalYear}` : 'ปีอื่น ๆ'}
                          </span>
                          <FaChevronDown style={{ fontSize: '9px' }} />
                        </button>
                      }
                    />
                    <PopoverContent
                      align="start"
                      sideOffset={6}
                      className="max-h-60 w-40 gap-0 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"
                    >
                      {olderYearOptions.map((year) => {
                        const active = currentFiscalYear === year;
                        return (
                          <button
                            key={year}
                            type="button"
                            onClick={() => {
                              handleFiscalYearChange(year);
                              setIsOtherYearsOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                              width: '100%',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: active ? '#ecfdf5' : 'transparent',
                              color: active ? '#047857' : '#334155',
                              fontSize: '12px',
                              fontWeight: active ? 700 : 500,
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <span>ปีงบ {year}</span>
                            {active && <FaCheck style={{ fontSize: '10px' }} />}
                          </button>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            )}

            {/* Department Selector */}
            {showDepartment && (
              <DepartmentSelect
                value={currentDepartment}
                onChange={handleDepartmentChange}
                allowAll
                allLabel={departmentAllLabel}
                allValue="all"
                size="sm"
                className={departmentClassName}
              />
            )}

          </div>

          {/* Right Side: Actions (Overview) or Progressive Disclosure Toggle + Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {showSearch && (
              <SearchInput
                value={currentSearch}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-[180px]"
              />
            )}

            {hasSecondaryControls && (
              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                aria-expanded={showAdvanced}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '32px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: showAdvanced || secondaryActiveCount > 0 ? '1px solid #10b981' : '1px solid #cbd5e1',
                  backgroundColor: showAdvanced || secondaryActiveCount > 0 ? '#f0fdf4' : '#ffffff',
                  color: showAdvanced || secondaryActiveCount > 0 ? '#047857' : '#334155',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, border-color 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <FaSlidersH style={{ fontSize: '11px' }} />
                <span>ตัวกรอง</span>
                {secondaryActiveCount > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '18px',
                      height: '18px',
                      padding: '0 5px',
                      borderRadius: '999px',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {secondaryActiveCount}
                  </span>
                )}
              </button>
            )}

            {isOverviewTab && children}

            {/* Single-Tab Reset Button: shown only when not already duplicated by active chips row */}
            {hasActiveFilters && (!showActiveChips || activeChips.length === 0) && showResetButton && (
              <button
                type="button"
                onClick={onReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  height: '32px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: '1px solid #fed7aa',
                  backgroundColor: '#fffbeb',
                  color: '#b45309',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                title="ล้างตัวกรองทั้งหมดของแท็บนี้"
              >
                <FaUndoAlt style={{ fontSize: '10px' }} />
                <span className="max-[900px]:hidden">ล้างตัวกรอง</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Secondary Filters Drawer (Only visible when user clicks 'ตัวกรองเพิ่มเติม') */}
        {showAdvanced && hasSecondaryControls && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingTop: '10px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {showStrategic && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                    ตัวกรองทั่วไป:
                  </span>
                  <StrategicFilterSelect
                    value={currentStrategic}
                    onChange={handleStrategicChange}
                    className={strategicClassName}
                  />
                </div>
              )}
              {!isOverviewTab && children && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                    ตัวกรองเฉพาะแท็บ:
                  </span>
                  {children}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Secondary Tier: Dismissible Active Filter Chips */}
      {showActiveChips && activeChips.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            padding: '2px 4px',
          }}
        >
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, marginRight: '2px' }}>
            ตัวกรองที่ใช้งาน ({activeChips.length}):
          </span>

          {activeChips.map((chip) => (
            <div
              key={chip.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#f0fbf5',
                border: '1px solid #bbf7d0',
                color: '#047857',
                borderRadius: '999px',
                padding: '3px 10px',
                fontSize: '11.5px',
                fontWeight: 500,
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#047857',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '10px',
                }}
                aria-label={`ลบตัวกรอง ${chip.label}`}
              >
                <FaTimes />
              </button>
            </div>
          ))}

          {/* Quick Clear All Link */}
          <button
            type="button"
            onClick={onReset}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              color: '#dc2626',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '2px 6px',
              textDecoration: 'underline',
            }}
          >
            ล้างตัวกรอง
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, X as ClearIcon, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

export const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export interface MonthYearPickerProps {
  /** Format: 'YYYY-MM' e.g. '2026-10' */
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minYear?: number;
  maxYear?: number;
  size?: 'default' | 'sm';
}

/** Formats YYYY-MM to Thai Buddhist Era string, e.g. "ต.ค. 2569" */
export function formatMonthYearBE(ymStr?: string | null): string {
  if (!ymStr) return '';
  const parts = ymStr.split('-');
  if (parts.length < 2) return ymStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  if (isNaN(year) || isNaN(month) || month < 0 || month > 11) return ymStr;
  const yearBE = year + 543;
  return `${THAI_MONTHS_SHORT[month]} ${yearBE}`;
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = 'เลือกเดือน/ปี (พ.ศ.)',
  disabled = false,
  className,
  minYear = 2000,
  maxYear = 2040,
  size = 'default',
}: MonthYearPickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse current value
  const parsed = React.useMemo(() => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length >= 2) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(y) && !isNaN(m)) {
        return { year: y, month: m };
      }
    }
    return null;
  }, [value]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Viewing year state in popover
  const [viewYear, setViewYear] = React.useState<number>(() => {
    return parsed ? parsed.year : currentYear;
  });

  // When value changes from outside, sync viewYear
  React.useEffect(() => {
    if (parsed) {
      setViewYear(parsed.year);
    }
  }, [parsed]);

  const handlePrevYear = () => setViewYear((y) => Math.max(minYear, y - 1));
  const handleNextYear = () => setViewYear((y) => Math.min(maxYear, y + 1));

  const handleSelectMonth = (monthIndex: number) => {
    const m = String(monthIndex + 1).padStart(2, '0');
    const nextVal = `${viewYear}-${m}`;
    onChange(nextVal);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const displayText = parsed ? formatMonthYearBE(value) : '';

  return (
    <div className={cn('relative inline-flex items-center w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              type="button"
              variant="outline"
              className={cn(
                'w-full justify-between font-normal bg-background border-input hover:bg-accent/40 rounded-lg gap-2 cursor-pointer shadow-2xs',
                size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-10 px-3 text-sm min-h-[40px]',
                !displayText && 'text-muted-foreground'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <CalendarIcon className="size-4 text-emerald-600 shrink-0" />
                <span className={cn('truncate', displayText ? 'text-slate-800 font-medium' : '')}>
                  {displayText || placeholder}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {displayText && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={handleClear}
                    className="p-1 rounded-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="ล้างค่า"
                  >
                    <ClearIcon className="size-3.5" />
                  </span>
                )}
              </div>
            </Button>
          }
        />

        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-72 p-3 rounded-2xl shadow-lg border border-emerald-100 bg-white text-slate-900"
        >
          {/* Header with Year Switcher (พ.ศ.) */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handlePrevYear}
              disabled={viewYear <= minYear}
              className="size-8 rounded-full hover:bg-emerald-50 text-slate-600 hover:text-emerald-700"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="flex items-center gap-1 font-semibold text-sm text-slate-800">
              <span>พ.ศ.</span>
              <span className="text-emerald-700 font-bold">{viewYear + 543}</span>
              <span className="text-xs text-slate-400 font-normal">({viewYear})</span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleNextYear}
              disabled={viewYear >= maxYear}
              className="size-8 rounded-full hover:bg-emerald-50 text-slate-600 hover:text-emerald-700"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* 12 Months Grid */}
          <div className="grid grid-cols-3 gap-2">
            {THAI_MONTHS_SHORT.map((mName, idx) => {
              const monthNum = idx + 1;
              const isSelected = parsed && parsed.year === viewYear && parsed.month === monthNum;
              const isCurrent = currentYear === viewYear && currentMonth === monthNum;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectMonth(idx)}
                  className={cn(
                    'h-10 rounded-xl text-xs font-medium transition-all select-none',
                    'hover:bg-emerald-100/70 hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20',
                    isSelected
                      ? 'bg-[#00A651] text-white font-semibold shadow-xs hover:bg-[#008f45] hover:text-white'
                      : isCurrent
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold'
                      : 'text-slate-700 bg-slate-50/50 hover:bg-emerald-50'
                  )}
                >
                  {mName}
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11.5px]">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const m = String(now.getMonth() + 1).padStart(2, '0');
                onChange(`${now.getFullYear()}-${m}`);
                setOpen(false);
              }}
              className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline"
            >
              เดือนปัจจุบัน
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 hover:underline"
              >
                ล้างข้อมูล
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

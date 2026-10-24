'use client';

import * as React from 'react';
import { ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonthYearPicker } from './MonthYearPicker';

export interface MonthYearRangeValue {
  start: string | null;
  end: string | null;
}

export interface MonthYearRangePickerProps {
  value?: MonthYearRangeValue;
  onChange: (value: MonthYearRangeValue) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  showDuration?: boolean;
}

/** Calculates number of months between two 'YYYY-MM' strings inclusive */
export function calculateMonthsDiff(start?: string | null, end?: string | null): number | null {
  if (!start || !end) return null;
  const sParts = start.split('-').map(Number);
  const eParts = end.split('-').map(Number);
  if (sParts.length < 2 || eParts.length < 2) return null;
  const sTotal = sParts[0] * 12 + sParts[1];
  const eTotal = eParts[0] * 12 + eParts[1];
  if (eTotal < sTotal) return null;
  return eTotal - sTotal + 1; // inclusive count
}

/** Formats months into Thai duration string, e.g. "12 เดือน" or "1 ปี 6 เดือน" */
export function formatDurationThai(months: number | null): string {
  if (months === null || months <= 0) return '';
  if (months < 12) return `${months} เดือน`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} ปี (${months} เดือน)`;
  return `${years} ปี ${rem} เดือน (${months} เดือน)`;
}

export function MonthYearRangePicker({
  value = { start: null, end: null },
  onChange,
  startPlaceholder = 'เดือน/ปี เริ่มต้น',
  endPlaceholder = 'เดือน/ปี สิ้นสุด',
  disabled = false,
  className,
  showDuration = true,
}: MonthYearRangePickerProps) {
  const isInvalidRange = Boolean(
    value.start &&
    value.end &&
    value.end < value.start
  );

  const monthsDiff = React.useMemo(() => {
    return calculateMonthsDiff(value.start, value.end);
  }, [value.start, value.end]);

  const handleStartChange = (start: string | null) => {
    onChange({
      start,
      end: value.end,
    });
  };

  const handleEndChange = (end: string | null) => {
    onChange({
      start: value.start,
      end,
    });
  };

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 min-w-0">
          <MonthYearPicker
            value={value.start}
            onChange={handleStartChange}
            placeholder={startPlaceholder}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-center text-slate-400 shrink-0 px-1 py-0.5">
          <ArrowRight className="size-4" />
        </div>

        <div className="flex-1 min-w-0">
          <MonthYearPicker
            value={value.end}
            onChange={handleEndChange}
            placeholder={endPlaceholder}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Duration badge or error warning */}
      {isInvalidRange ? (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 animate-in fade-in-50">
          <AlertCircle className="size-3.5 shrink-0 text-red-500" />
          <span>เดือน/ปี สิ้นสุด ต้องไม่เกิดขึ้นก่อนเดือน/ปี เริ่มต้น</span>
        </div>
      ) : (
        showDuration && monthsDiff !== null && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start animate-in fade-in-50">
            <Clock className="size-3.5 text-emerald-600 shrink-0" />
            <span>ระยะเวลาโครงการ: {formatDurationThai(monthsDiff)}</span>
          </div>
        )
      )}
    </div>
  );
}

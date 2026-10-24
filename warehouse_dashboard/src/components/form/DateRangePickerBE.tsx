'use client';

import * as React from 'react';
import { ArrowRight, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';

export interface DateRangeBEValue {
  start?: string | null; // ISO YYYY-MM-DD
  end?: string | null;   // ISO YYYY-MM-DD
}

export interface DateRangePickerBEProps {
  value?: DateRangeBEValue;
  onChange: (val: DateRangeBEValue) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  showDurationDays?: boolean;
}

export function calculateDaysDiff(start?: string | null, end?: string | null): number | null {
  if (!start || !end) return null;
  const sDate = new Date(start);
  const eDate = new Date(end);
  if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) return null;
  const diffTime = eDate.getTime() - sDate.getTime();
  if (diffTime < 0) return null;
  return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive days
}

export function DateRangePickerBE({
  value = { start: null, end: null },
  onChange,
  startPlaceholder = 'วันที่เริ่มต้น (พ.ศ.)',
  endPlaceholder = 'วันที่สิ้นสุด (พ.ศ.)',
  disabled = false,
  className,
  showDurationDays = true,
}: DateRangePickerBEProps) {
  const isInvalid = Boolean(
    value.start &&
    value.end &&
    value.end < value.start
  );

  const daysCount = React.useMemo(() => {
    return calculateDaysDiff(value.start, value.end);
  }, [value.start, value.end]);

  const handleStartChange = (_date: Date | undefined, dateStr: string) => {
    onChange({
      start: dateStr || null,
      end: value.end,
    });
  };

  const handleEndChange = (_date: Date | undefined, dateStr: string) => {
    onChange({
      start: value.start,
      end: dateStr || null,
    });
  };

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 min-w-0">
          <DatePicker
            value={value.start || ''}
            onChange={handleStartChange}
            placeholder={startPlaceholder}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-center text-slate-400 shrink-0 px-1 py-0.5">
          <ArrowRight className="size-4" />
        </div>

        <div className="flex-1 min-w-0">
          <DatePicker
            value={value.end || ''}
            onChange={handleEndChange}
            placeholder={endPlaceholder}
            disabled={disabled}
          />
        </div>
      </div>

      {isInvalid ? (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 animate-in fade-in-50">
          <AlertCircle className="size-3.5 shrink-0 text-red-500" />
          <span>วันที่สิ้นสุดต้องไม่เกิดขึ้นก่อนวันที่เริ่มต้น</span>
        </div>
      ) : (
        showDurationDays && daysCount !== null && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start animate-in fade-in-50">
            <Calendar className="size-3.5 text-emerald-600 shrink-0" />
            <span>ระยะเวลากิจกรรม: {daysCount} วัน</span>
          </div>
        )
      )}
    </div>
  );
}

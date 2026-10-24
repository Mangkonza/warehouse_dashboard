'use client';

import * as React from 'react';
import { X as ClearIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { DateRange } from 'react-day-picker';

/**
 * Converts a Date or ISO date string (YYYY-MM-DD) to a standard JavaScript Date (Gregorian)
 */
export function parseDate(val?: Date | string | null): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;

  // Handle standard YYYY-MM-DD strings explicitly to avoid timezone shift
  const parts = String(val).trim().split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(y, m, d);
    if (!isNaN(dateObj.getTime())) return dateObj;
  }

  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

/**
 * Formats a Date object to standard Gregorian ISO date string (YYYY-MM-DD)
 */
export function formatDateToIso(date?: Date): string {
  if (!date || isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats a Date object to Thai Buddhist Era string, e.g. "23 ต.ค. 2569"
 */
export function formatThaiBuddhistDate(date?: Date): string {
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export interface DatePickerProps {
  value?: Date | string | null;
  onChange?: (date: Date | undefined, dateString: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  clearable?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'เลือกวันที่...',
  disabled = false,
  className,
  id,
  name,
  required = false,
  clearable = true,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = React.useMemo(() => parseDate(value), [value]);

  const handleSelect = (date: Date | undefined) => {
    setOpen(false);
    if (onChange) {
      onChange(date, formatDateToIso(date));
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(undefined, '');
    }
  };

  return (
    <div className={cn('relative inline-flex items-center w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          disabled={disabled}
          render={
            <Button
              variant="outline"
              type="button"
              className={cn(
                'w-full justify-start text-left font-normal bg-background border-input hover:bg-accent/40 h-9 px-3 text-sm rounded-lg',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <span className="flex-1 truncate">
                {selectedDate ? formatThaiBuddhistDate(selectedDate) : placeholder}
              </span>
              {clearable && selectedDate && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleClear(e as unknown as React.MouseEvent);
                    }
                  }}
                  className="p-0.5 rounded-full hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
                  title="ล้างค่าวันที่"
                >
                  <ClearIcon className="size-3.5" />
                </span>
              )}
            </Button>
          }
        />
        <PopoverContent
          className="w-auto p-2.5 z-[10050] rounded-2xl border border-emerald-200/80 bg-white/95 backdrop-blur-md shadow-xl shadow-emerald-950/5 dark:bg-slate-900/95 dark:border-emerald-800/40"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate || new Date()}
            captionLayout="dropdown"
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Hidden input to support native form submissions if name is provided */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={formatDateToIso(selectedDate)}
          required={required}
        />
      )}
    </div>
  );
}

export interface DateRangePickerProps {
  value?: DateRange | null;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'เลือกช่วงวันที่...',
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const displayLabel = React.useMemo(() => {
    if (!value?.from) return placeholder;
    if (value.to) {
      return `${formatThaiBuddhistDate(value.from)} - ${formatThaiBuddhistDate(value.to)}`;
    }
    return formatThaiBuddhistDate(value.from);
  }, [value, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            variant="outline"
            type="button"
            className={cn(
              'w-full justify-start text-left font-normal bg-background border-input hover:bg-accent/40 h-9 px-3 text-sm rounded-lg',
              !value?.from && 'text-muted-foreground',
              className
            )}
          >
            <span className="flex-1 truncate">{displayLabel}</span>
          </Button>
        }
      />
      <PopoverContent
        className="w-auto p-2.5 z-[10050] rounded-2xl border border-emerald-200/80 bg-white/95 backdrop-blur-md shadow-xl shadow-emerald-950/5 dark:bg-slate-900/95 dark:border-emerald-800/40"
        align="start"
      >
        <Calendar
          mode="range"
          selected={value || undefined}
          onSelect={onChange}
          numberOfMonths={2}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}

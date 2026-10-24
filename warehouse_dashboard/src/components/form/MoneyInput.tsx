'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MoneyInputProps {
  value?: number | string | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  currencyLabel?: string;
  id?: string;
  name?: string;
  min?: number;
  max?: number;
}

export function formatTwoDecimals(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function MoneyInput({
  value,
  onChange,
  placeholder = '0.00',
  disabled = false,
  className,
  inputClassName,
  currencyLabel = 'บาท',
  id,
  name,
  min = 0,
  max,
}: MoneyInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [displayValue, setDisplayValue] = React.useState<string>(() => {
    if (value !== null && value !== undefined && value !== '') {
      const num = Number(value);
      return !isNaN(num) ? formatTwoDecimals(num) : '';
    }
    return '';
  });

  // Sync from external value changes when not focused
  React.useEffect(() => {
    if (!isFocused) {
      if (value !== null && value !== undefined && value !== '') {
        const num = Number(value);
        setDisplayValue(!isNaN(num) ? formatTwoDecimals(num) : '');
      } else {
        setDisplayValue('');
      }
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const raw = input.value;

    // Disallow negative sign
    if (raw.includes('-')) return;

    // Disallow multiple decimal points
    const dotCount = (raw.match(/\./g) || []).length;
    if (dotCount > 1) return;

    if (raw === '') {
      setDisplayValue('');
      onChange(null);
      return;
    }

    // Capture cursor and count of digits/dots before cursor
    const cursor = input.selectionStart || 0;
    const beforeCursor = raw.slice(0, cursor);
    const validCountBefore = beforeCursor.replace(/[^0-9.]/g, '').length;

    // Format integer part with commas while typing, retain dot and max 2 decimal digits
    const cleaned = raw.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    let formatted = '';
    const intPart = parts[0] ? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') : (raw.startsWith('.') ? '0' : '');
    if (parts.length > 1) {
      formatted = `${intPart}.${parts[1].slice(0, 2)}`;
    } else {
      formatted = intPart;
    }

    setDisplayValue(formatted);

    const num = parseFloat(cleaned);
    if (!isNaN(num)) {
      if (max !== undefined && num > max) return;
      onChange(num);
    } else {
      onChange(null);
    }

    // Restore cursor position relative to valid digits
    requestAnimationFrame(() => {
      let currentValid = 0;
      let newCursor = formatted.length;
      for (let i = 0; i < formatted.length; i++) {
        if (/[0-9.]/.test(formatted[i])) {
          currentValid++;
        }
        if (currentValid === validCountBefore) {
          newCursor = i + 1;
          break;
        }
      }
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursor, newCursor);
      }
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!displayValue || displayValue.trim() === '') {
      onChange(null);
      setDisplayValue('');
      return;
    }

    const clean = displayValue.replace(/,/g, '');
    const parsed = parseFloat(clean);
    if (isNaN(parsed) || parsed < 0) {
      onChange(0);
      setDisplayValue(formatTwoDecimals(0));
    } else {
      const finalVal = min !== undefined ? Math.max(min, parsed) : parsed;
      onChange(finalVal);
      setDisplayValue(formatTwoDecimals(finalVal));
    }
  };

  return (
    <div className={cn('flex items-center gap-2.5 w-full', className)}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'flex-1 h-10 px-3 text-sm text-right tabular-nums font-medium rounded-lg border border-slate-300 bg-white shadow-2xs transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651]',
          disabled && 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400',
          inputClassName
        )}
      />
      {currencyLabel && (
        <span className="shrink-0 text-sm font-semibold text-slate-600 select-none w-7 text-left">
          {currencyLabel}
        </span>
      )}
    </div>
  );
}

export const CurrencyInput = MoneyInput;
export default MoneyInput;

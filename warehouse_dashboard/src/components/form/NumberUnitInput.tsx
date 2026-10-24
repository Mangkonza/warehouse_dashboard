'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NumberUnitInputProps {
  value?: number | null;
  onChange: (value: number | null) => void;
  unit: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number | string;
  allowDecimals?: boolean;
}

export function NumberUnitInput({
  value,
  onChange,
  unit,
  placeholder = '0',
  disabled = false,
  className,
  min = 0,
  max,
  step = 'any',
  allowDecimals = true,
}: NumberUnitInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>(() => {
    return value !== null && value !== undefined ? String(value) : '';
  });

  React.useEffect(() => {
    setDisplayValue(value !== null && value !== undefined ? String(value) : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setDisplayValue('');
      onChange(null);
      return;
    }

    // Numbers only, optionally decimals
    const regex = allowDecimals ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
    if (regex.test(raw)) {
      setDisplayValue(raw);
      const num = parseFloat(raw);
      if (!isNaN(num)) {
        if (min !== undefined && num < min) return;
        if (max !== undefined && num > max) return;
        onChange(num);
      } else {
        onChange(null);
      }
    }
  };

  const handleBlur = () => {
    if (displayValue === '') {
      onChange(null);
      return;
    }
    const num = parseFloat(displayValue);
    if (isNaN(num)) {
      setDisplayValue('');
      onChange(null);
    } else {
      const clamped = Math.max(min, max !== undefined ? Math.min(max, num) : num);
      setDisplayValue(String(clamped));
      onChange(clamped);
    }
  };

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <input
        type="text"
        inputMode={allowDecimals ? 'decimal' : 'numeric'}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full h-10 pl-3 pr-16 text-sm text-right font-mono font-medium rounded-lg border border-input bg-background shadow-2xs transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
          disabled && 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400'
        )}
      />
      <div className="absolute right-3 pointer-events-none flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 select-none">
        {unit}
      </div>
    </div>
  );
}

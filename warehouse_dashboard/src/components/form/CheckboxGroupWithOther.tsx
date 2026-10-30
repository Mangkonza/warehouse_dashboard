'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export interface CheckboxOption {
  label: string;
  value: string;
  hint?: string;
}

export interface CheckboxGroupWithOtherProps {
  options: CheckboxOption[];
  value?: string[] | string | null;
  onChange: (value: string[]) => void;
  allowOther?: boolean;
  otherOptionLabel?: string;
  otherPlaceholder?: string;
  otherPrefix?: string;
  orientation?: 'vertical' | 'horizontal' | 'grid';
  disabled?: boolean;
  className?: string;
}

export function CheckboxGroupWithOther({
  options,
  value = [],
  onChange,
  allowOther = true,
  otherOptionLabel = 'อื่นๆ (โปรดระบุ)',
  otherPlaceholder = 'โปรดระบุรายละเอียด...',
  otherPrefix = 'อื่นๆ: ',
  orientation = 'vertical',
  disabled = false,
  className,
}: CheckboxGroupWithOtherProps) {
  // Normalize value to string array
  const safeValue: string[] = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return [];
      return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }, [value]);

  // Find if there is an "other" value currently in the array
  const otherItem = React.useMemo(() => {
    return safeValue.find((v) => v.startsWith(otherPrefix) || v === 'other' || v === 'อื่นๆ');
  }, [safeValue, otherPrefix]);

  const isOtherChecked = Boolean(otherItem !== undefined);

  // Extract the custom text part
  const otherCustomText = React.useMemo(() => {
    if (!otherItem) return '';
    if (otherItem.startsWith(otherPrefix)) {
      return otherItem.slice(otherPrefix.length);
    }
    if (otherItem === 'other' || otherItem === 'อื่นๆ') {
      return '';
    }
    return otherItem;
  }, [otherItem, otherPrefix]);

  const [localOtherText, setLocalOtherText] = React.useState(otherCustomText);

  React.useEffect(() => {
    setLocalOtherText(otherCustomText);
  }, [otherCustomText]);

  const handleToggleOption = (optVal: string) => {
    if (disabled) return;
    if (safeValue.includes(optVal)) {
      onChange(safeValue.filter((v) => v !== optVal));
    } else {
      onChange([...safeValue, optVal]);
    }
  };

  const handleToggleOther = () => {
    if (disabled) return;
    if (isOtherChecked) {
      onChange(safeValue.filter((v) => !v.startsWith(otherPrefix) && v !== 'other' && v !== 'อื่นๆ'));
      setLocalOtherText('');
    } else {
      const newEntry = localOtherText.trim() ? `${otherPrefix}${localOtherText.trim()}` : `${otherPrefix}`;
      onChange([...safeValue, newEntry]);
    }
  };

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setLocalOtherText(text);

    const clean = text.trim();
    const newEntry = clean ? `${otherPrefix}${clean}` : `${otherPrefix}`;
    const next = safeValue.filter((v) => !v.startsWith(otherPrefix) && v !== 'other' && v !== 'อื่นๆ');
    next.push(newEntry);
    onChange(next);
  };

  return (
    <div
      className={cn(
        'w-full pt-0.5',
        orientation === 'vertical' && 'flex flex-col gap-2',
        orientation === 'horizontal' && 'flex flex-wrap gap-x-6 gap-y-2',
        orientation === 'grid' && 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5',
        className
      )}
    >
      {options.map((opt) => {
        const checked = safeValue.includes(opt.value);
        return (
          <label
            key={opt.value}
            className={cn(
              'inline-flex items-center gap-2.5 py-1 cursor-pointer select-none',
              disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => handleToggleOption(opt.value)}
              disabled={disabled}
            />
            <span className={cn('text-sm leading-snug', checked ? 'text-slate-900 font-medium' : 'text-slate-700')}>
              {opt.label}
            </span>
          </label>
        );
      })}

      {allowOther && (
        <div
          className={cn(
            'flex flex-col sm:flex-row sm:items-center gap-2',
            orientation === 'grid' && 'col-span-full',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          <label className="inline-flex items-center gap-2.5 py-1 cursor-pointer select-none shrink-0">
            <Checkbox
              checked={isOtherChecked}
              onCheckedChange={handleToggleOther}
              disabled={disabled}
            />
            <span className={cn('text-sm leading-snug', isOtherChecked ? 'text-slate-900 font-medium' : 'text-slate-700')}>
              {otherOptionLabel}
            </span>
          </label>

          {isOtherChecked && (
            <input
              type="text"
              value={localOtherText}
              onChange={handleOtherTextChange}
              placeholder={otherPlaceholder}
              disabled={disabled}
              autoFocus
              className="flex-1 h-9 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] text-slate-800 placeholder:text-slate-400"
            />
          )}
        </div>
      )}
    </div>
  );
}

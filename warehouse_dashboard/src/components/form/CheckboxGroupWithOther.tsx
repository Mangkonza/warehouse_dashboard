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
  value?: string[];
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
  // Find if there is an "other" value currently in the array
  const otherItem = React.useMemo(() => {
    return value.find((v) => v.startsWith(otherPrefix) || v === 'other' || v === 'อื่นๆ');
  }, [value, otherPrefix]);

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
    if (value.includes(optVal)) {
      onChange(value.filter((v) => v !== optVal));
    } else {
      onChange([...value, optVal]);
    }
  };

  const handleToggleOther = () => {
    if (disabled) return;
    if (isOtherChecked) {
      // Remove other item
      onChange(value.filter((v) => !v.startsWith(otherPrefix) && v !== 'other' && v !== 'อื่นๆ'));
      setLocalOtherText('');
    } else {
      // Add other item
      const newEntry = localOtherText.trim() ? `${otherPrefix}${localOtherText.trim()}` : `${otherPrefix}`;
      onChange([...value, newEntry]);
    }
  };

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setLocalOtherText(text);

    // Update parent
    const clean = text.trim();
    const newEntry = clean ? `${otherPrefix}${clean}` : `${otherPrefix}`;
    const next = value.filter((v) => !v.startsWith(otherPrefix) && v !== 'other' && v !== 'อื่นๆ');
    next.push(newEntry);
    onChange(next);
  };

  return (
    <div
      className={cn(
        'w-full',
        orientation === 'vertical' && 'flex flex-col gap-2.5',
        orientation === 'horizontal' && 'flex flex-wrap gap-4',
        orientation === 'grid' && 'grid grid-cols-1 sm:grid-cols-2 gap-2.5',
        className
      )}
    >
      {options.map((opt) => {
        const checked = value.includes(opt.value);
        return (
          <label
            key={opt.value}
            className={cn(
              'flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer select-none',
              checked
                ? 'bg-emerald-50/60 border-emerald-300 text-slate-900 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
              disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
          >
            <div className="pt-0.5">
              <Checkbox
                checked={checked}
                onCheckedChange={() => handleToggleOption(opt.value)}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-800 leading-tight">
                {opt.label}
              </span>
              {opt.hint && (
                <span className="text-[11px] text-slate-400 mt-0.5">{opt.hint}</span>
              )}
            </div>
          </label>
        );
      })}

      {allowOther && (
        <div
          className={cn(
            'flex flex-col gap-2 p-2 rounded-lg border transition-all',
            isOtherChecked
              ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50',
            orientation === 'grid' && 'col-span-full',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <Checkbox
              checked={isOtherChecked}
              onCheckedChange={handleToggleOther}
              disabled={disabled}
            />
            <span className="text-xs font-medium text-slate-800">
              {otherOptionLabel}
            </span>
          </label>

          {isOtherChecked && (
            <div className="pl-6 pt-1 animate-in fade-in-50 duration-150">
              <input
                type="text"
                value={localOtherText}
                onChange={handleOtherTextChange}
                placeholder={otherPlaceholder}
                disabled={disabled}
                autoFocus
                className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-emerald-500 text-slate-800 placeholder:text-slate-400 shadow-2xs"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

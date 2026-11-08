'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const THAI_PREFIXES = [
  'ศ.ดร.',
  'ศ.',
  'รศ.ดร.',
  'รศ.',
  'ผศ.ดร.',
  'ผศ.',
  'อ.ดร.',
  'อ.',
  'ดร.',
  'นาย',
  'นาง',
  'นางสาว',
];

export function normalizePrefix(s?: string | null): string {
  if (!s) return '';
  return s.replace(/\s+/g, '').trim().toLowerCase();
}

export function canonicalizePrefix(s?: string | null): string {
  if (!s) return '';
  const trimmed = s.trim();
  if (!trimmed) return '';
  const clean = normalizePrefix(trimmed);
  const match = THAI_PREFIXES.find((p) => normalizePrefix(p) === clean);
  return match || trimmed;
}

export interface PrefixComboboxProps {
  value?: string | null;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function PrefixCombobox({
  value,
  onChange,
  disabled = false,
  className,
  placeholder = 'คำนำหน้า',
}: PrefixComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);
    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
    };
  }, []);

  const currentValue = value ?? '';
  const cleanQuery = normalizePrefix(currentValue);

  // Suggestions: when empty/focused, shows all prefixes. While typing, shows matching ones.
  const matchingPrefixes = React.useMemo(() => {
    if (!cleanQuery) return THAI_PREFIXES;
    return THAI_PREFIXES.filter((p) => normalizePrefix(p).includes(cleanQuery));
  }, [cleanQuery]);

  // Direct typing handler: fully controlled, allows clearing down to 0 chars
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setIsOpen(true);
    onChange(raw);
  };

  // Selecting suggestion sets text and closes dropdown
  const handleSelectPrefix = (prefix: string) => {
    onChange(prefix);
    setIsOpen(false);
  };

  // Blur handler: trim whitespace and avoid duplicates differing only in spacing
  const handleBlur = () => {
    const trimmed = (value ?? '').trim();
    if (!trimmed) {
      if (value !== '') onChange('');
      return;
    }
    const canonical = canonicalizePrefix(trimmed);
    if (canonical !== value) {
      onChange(canonical);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={currentValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full h-10 pl-3 pr-7 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors shadow-2xs',
            'hover:border-slate-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
            disabled && 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setIsOpen((prev) => !prev);
              inputRef.current?.focus();
            }
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer disabled:cursor-not-allowed"
          title="ตัวเลือกคำนำหน้า"
        >
          <ChevronDown className="size-4 shrink-0" />
        </button>
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && matchingPrefixes.length > 0 && !disabled && (
        <div
          className="absolute left-0 top-full mt-1 w-44 max-h-56 p-1 overflow-y-auto rounded-lg shadow-lg border border-slate-200 bg-white z-[80] text-slate-800 text-sm"
          onMouseDown={(e) => {
            // Prevent input blur before click is handled
            e.preventDefault();
          }}
        >
          {matchingPrefixes.map((p) => {
            const isSelected = normalizePrefix(p) === cleanQuery;
            return (
              <div
                key={p}
                onClick={() => handleSelectPrefix(p)}
                className={cn(
                  'px-2.5 py-1.5 text-xs rounded-md cursor-pointer flex items-center justify-between transition-colors select-none',
                  isSelected ? 'bg-slate-100 font-semibold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                <span>{p}</span>
                {isSelected && <Check className="size-3.5 text-[#00A651] shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

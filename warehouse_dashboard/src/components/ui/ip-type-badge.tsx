'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';

export const IP_TYPE_COLOR = '#D4AF37';
export const IP_TYPE_BORDER = '#B8962E';

export type IPType = 'อนุสิทธิบัตร' | 'สิทธิบัตร' | 'ลิขสิทธิ์';

export interface IPTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | null;
  type?: string | null;
  className?: string;
}

/**
 * Normalizes any IP type alias into one of the 3 standard Thai labels.
 */
export function normalizeIPType(raw?: string | null): IPType | null {
  if (!raw) return null;
  const s = String(raw).trim().toLowerCase();
  if (!s || s === '-' || s === '–' || s === 'nan' || s === 'nat') return null;

  if (s.includes('อนุสิทธิบัตร') || s === 'petty' || s === 'petty_patent') {
    return 'อนุสิทธิบัตร';
  }
  if (s.includes('ลิขสิทธิ์') || s === 'copyright') {
    return 'ลิขสิทธิ์';
  }
  if (s.includes('สิทธิบัตร') || s === 'patent' || s === 'p') {
    return 'สิทธิบัตร';
  }
  return raw as IPType;
}

/**
 * Global component for rendering Intellectual Property Type Badge ("อนุสิทธิบัตร", "สิทธิบัตร", "ลิขสิทธิ์")
 * Matches DepartmentBadge and EvaluationTag dimensions, padding, pill radius, bold weight, and white text.
 * Background color uses design token --color-ip-type (#D4AF37).
 * Usage:
 *   <IPTypeBadge value="ลิขสิทธิ์" />
 *   <IPTypeBadge type="copyright" />
 */
export const IPTypeBadge: React.FC<IPTypeBadgeProps> = ({
  value,
  type,
  className,
  style,
  ...props
}) => {
  const normalized = normalizeIPType(type || value);

  if (!normalized) {
    return (
      <span
        className={cn('text-slate-400 font-normal select-none', className)}
        style={style}
        {...props}
      >
        –
      </span>
    );
  }

  return (
    <span
      className={cn(
        BADGE_BASE_CLASSES,
        'tag-ip-type bg-ip-type border border-ip-type-border text-white font-bold',
        className
      )}
      style={{
        backgroundColor: 'var(--color-ip-type, #D4AF37)',
        borderColor: 'var(--color-ip-type-border, #B8962E)',
        color: '#ffffff',
        ...style,
      }}
      title={normalized}
      {...props}
    >
      {normalized}
    </span>
  );
};

export default IPTypeBadge;

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';

export const PUBLICATION_TYPE_COLOR = '#5D4037';

export interface PublicationTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | null;
  type?: string | null;
  className?: string;
}

/**
 * Global component for rendering Publication Type Badge ("เตรียมความพร้อมตีพิมพ์", "เตรียมความพร้อมจดอนุสิทธิบัตร", "ตีพิมพ์", etc.)
 * Matches DepartmentBadge, ServiceTypeBadge, IPTypeBadge, and LevelBadge dimensions, padding, pill radius, bold weight, and white text.
 * Background color uses design token --color-publication-type (#5D4037).
 */
export const PublicationTypeBadge: React.FC<PublicationTypeBadgeProps> = ({
  value,
  type,
  className,
  style,
  ...props
}) => {
  const cleanVal = (type ?? value ?? '').toString().trim();

  if (!cleanVal || cleanVal === '-' || cleanVal === '–' || cleanVal === 'nan' || cleanVal === 'NaT') {
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
        'tag-publication-type text-white font-bold border-0 shadow-none',
        className
      )}
      style={{
        backgroundColor: 'var(--color-publication-type, #5D4037)',
        color: '#ffffff',
        ...style,
      }}
      title={cleanVal}
      {...props}
    >
      {cleanVal}
    </span>
  );
};

export default PublicationTypeBadge;

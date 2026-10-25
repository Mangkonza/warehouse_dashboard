'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';

export const SERVICE_TYPE_COLOR = '#2F007F';
export const SERVICE_TYPE_BORDER = '#7B63A8';

export interface ServiceTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | null;
  className?: string;
}

/**
 * Global component for rendering Academic Service Type Badge ("วิชาการ", "วิชาชีพ", "วิทยากร/อาจารย์พิเศษ", etc.)
 * Follows the exact same dimensions, padding, pill radius, typography, and white text as DepartmentBadge.
 * Background color uses design token --color-service-type (#2F007F).
 */
export const ServiceTypeBadge: React.FC<ServiceTypeBadgeProps> = ({
  value,
  className,
  style,
  ...props
}) => {
  const cleanVal = (value ?? '').toString().trim();

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
        'tag-service-type bg-service-type text-white border-0 shadow-none',
        className
      )}
      style={{
        backgroundColor: 'var(--color-service-type, #2F007F)',
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

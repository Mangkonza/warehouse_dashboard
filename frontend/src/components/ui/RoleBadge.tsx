import React from 'react';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';
import { AppRole } from '@/config/permissions';

export interface RoleBadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'role'> {
  role?: AppRole | string | null;
  className?: string;
  /** คงไว้เพื่อไม่ให้โค้ดเดิมที่ส่ง short พัง (ตอนนี้ข้อความเหมือนกันทั้งสองโหมด) */
  short?: boolean;
}

export function RoleBadge({ role, className, short: _short = false, ...props }: RoleBadgeProps) {
  const isAdmin = role === 'admin';

  const colorClasses = isAdmin
    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
    : 'bg-slate-100 text-slate-700 border-slate-200 font-medium';

  return (
    <span className={cn(BADGE_BASE_CLASSES, colorClasses, className)} {...props}>
      {isAdmin ? 'Admin' : 'User'}
    </span>
  );
}
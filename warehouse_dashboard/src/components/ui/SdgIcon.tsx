'use client';

import React from 'react';
import Image from 'next/image';
import { getSdgInfo, parseSdgNumber, SDG_WHEEL_ICON_PATH } from '@/lib/sdg';
import { cn } from '@/lib/utils';

export interface SdgIconProps {
  n: number | string | 'wheel' | 'logo';
  size?: number; // Size in pixels (default: 24)
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

/**
 * Universal SDG Icon component using next/image with fixed width and height.
 * Prevents layout shift and provides accessible descriptive alt text.
 */
export const SdgIcon: React.FC<SdgIconProps> = ({
  n,
  size = 24,
  className,
  style,
  priority = false,
}) => {
  if (n === 'wheel' || n === 'logo') {
    return (
      <Image
        src={SDG_WHEEL_ICON_PATH}
        alt="SDG Wheel Logo"
        width={size}
        height={size}
        className={cn('inline-block shrink-0 rounded object-contain', className)}
        style={{ width: `${size}px`, height: `${size}px`, ...style }}
        priority={priority}
      />
    );
  }

  const parsedNum = parseSdgNumber(n);
  const info = parsedNum ? getSdgInfo(parsedNum) : null;

  if (!info) {
    return null;
  }

  return (
    <Image
      src={info.iconPath}
      alt={`${info.code}: ${info.nameTh}`}
      title={`${info.code}: ${info.nameTh}`}
      width={size}
      height={size}
      className={cn('inline-block shrink-0 rounded object-contain', className)}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      priority={priority}
    />
  );
};

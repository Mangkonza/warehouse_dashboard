'use client';

import React from 'react';
import { getSdgInfo, parseSdgNumber, SDG_WHEEL_ICON_PATH } from '@/lib/sdg';
import { getAssetUrl } from '@/lib/api';
import { cn } from '@/lib/utils';

export interface SdgIconProps {
  n: number | string | 'wheel' | 'logo';
  size?: number; // Size in pixels (default: 24)
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

/**
 * Universal SDG Icon component using a plain <img> tag so that
 * getAssetUrl() correctly prepends the basePath for sub-path deployments.
 * next/image also adds basePath automatically, but only when the src is
 * a local string literal — dynamic strings from sdg.ts are NOT handled.
 */
export const SdgIcon: React.FC<SdgIconProps> = ({
  n,
  size = 24,
  className,
  style,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  priority = false,
}) => {
  if (n === 'wheel' || n === 'logo') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getAssetUrl(SDG_WHEEL_ICON_PATH)}
        alt="SDG Wheel Logo"
        width={size}
        height={size}
        className={cn('inline-block shrink-0 rounded object-contain', className)}
        style={{ width: `${size}px`, height: `${size}px`, ...style }}
      />
    );
  }

  const parsedNum = parseSdgNumber(n);
  const info = parsedNum ? getSdgInfo(parsedNum) : null;

  if (!info) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getAssetUrl(info.iconPath)}
      alt={`${info.code}: ${info.nameTh}`}
      title={`${info.code}: ${info.nameTh}`}
      width={size}
      height={size}
      className={cn('inline-block shrink-0 rounded object-contain', className)}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      onError={(e) => {
        // Fallback to wheel or hide broken image
        const wheelUrl = getAssetUrl(SDG_WHEEL_ICON_PATH);
        if (e.currentTarget.src !== wheelUrl) {
          e.currentTarget.src = wheelUrl;
        }
      }}
    />
  );
};

'use client';

import React from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl' | number;

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizeMap: Record<'sm' | 'md' | 'lg' | 'xl', { outer: number; stroke: number }> = {
  sm: { outer: 16, stroke: 2 },
  md: { outer: 24, stroke: 2.5 },
  lg: { outer: 40, stroke: 3.5 },
  xl: { outer: 56, stroke: 4.5 },
};

export function Spinner({
  size = 'md',
  className = '',
  label = 'กำลังโหลด...',
}: SpinnerProps) {
  const dimensions = typeof size === 'number'
    ? { outer: size, stroke: Math.max(2, Math.round(size * 0.08)) }
    : sizeMap[size] || sizeMap.md;

  const radius = (dimensions.outer - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: dimensions.outer, height: dimensions.outer }}
    >
      <svg
        className="ku-spinner-svg animate-spin motion-reduce:animate-none"
        viewBox={`0 0 ${dimensions.outer} ${dimensions.outer}`}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* Outer subtle ring (เขียวเข้มพื้นหลัง) */}
        <circle
          cx={dimensions.outer / 2}
          cy={dimensions.outer / 2}
          r={radius}
          fill="none"
          stroke="var(--color-brand-muted, rgba(0, 166, 81, 0.18))"
          strokeWidth={dimensions.stroke}
        />
        {/* Inner spinning indicator ring (เขียวสว่างแบรนด์ มก.) */}
        <circle
          cx={dimensions.outer / 2}
          cy={dimensions.outer / 2}
          r={radius}
          fill="none"
          stroke="var(--color-brand, #00A651)"
          strokeWidth={dimensions.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.65}
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

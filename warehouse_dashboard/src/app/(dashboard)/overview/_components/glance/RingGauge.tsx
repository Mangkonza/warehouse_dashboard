import React from 'react';

interface RingGaugeProps {
  /** Achievement percent (may exceed 100; the arc caps at a full circle). */
  percent: number;
  /** Optional marker position in percent, e.g. share of fiscal year elapsed. */
  marker?: number;
  color: string;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}

export function RingGauge({ percent, marker, color, size = 116, stroke = 11, children }: RingGaugeProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(100, percent));
  const center = size / 2;

  let markerLine: React.ReactNode = null;
  if (marker !== undefined && marker > 0 && marker < 100) {
    const angle = (marker / 100) * 2 * Math.PI - Math.PI / 2;
    const inner = r - stroke / 2 - 3;
    const outer = r + stroke / 2 + 3;
    markerLine = (
      <line
        x1={center + inner * Math.cos(angle)}
        y1={center + inner * Math.sin(angle)}
        x2={center + outer * Math.cos(angle)}
        y2={center + outer * Math.sin(angle)}
        stroke="#0f172a"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    );
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={center} cy={center} r={r} fill="none" stroke="#eef2f7" strokeWidth={stroke} />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(filled / 100) * c} ${c}`}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        {markerLine}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

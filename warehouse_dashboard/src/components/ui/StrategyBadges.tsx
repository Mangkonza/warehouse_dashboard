'use client';

import React from 'react';
import { resolveItemStrategicAlignment } from '@/lib/pastelTheme';

export interface StrategyBadgesProps {
  sdgs?: number[] | string[];
  isee?: string;
  iam?: string;
  item?: any;
  category?: string;
  compact?: boolean;
}

export function StrategyBadges({ sdgs, isee, iam, item, category, compact = false }: StrategyBadgesProps) {
  const hasSdgs = Array.isArray(sdgs) && sdgs.length > 0;
  const hasIsee = Boolean(isee && isee !== '-' && isee !== 'nan');
  const hasIam = Boolean(iam && iam !== '-' && iam !== 'nan');

  const resolved = item ? resolveItemStrategicAlignment(item, category) : null;
  const displaySdgs = hasSdgs ? sdgs! : (resolved ? [resolved.sdgNumber] : []);
  const displayIsee = hasIsee ? isee! : (resolved ? resolved.isee : undefined);
  const displayIam = hasIam ? iam! : (resolved ? resolved.iam : undefined);

  if (displaySdgs.length === 0 && !displayIsee && !displayIam) {
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '6px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          color: '#94a3b8',
          fontSize: '11px',
          fontStyle: 'italic',
        }}
      >
        รอระบุยุทธศาสตร์
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
      {displaySdgs.map((s, idx) => (
        <span
          key={`sdg-${idx}-${s}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '1px 6px',
            borderRadius: '6px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#047857',
            fontSize: '10.5px',
            fontWeight: 600,
          }}
          title={`เป้าหมายความยั่งยืน: SDG ${s}`}
        >
          SDG {s}
        </span>
      ))}

      {displayIsee && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '1px 6px',
            borderRadius: '6px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            fontSize: '10.5px',
            fontWeight: 600,
          }}
          title={`ยุทธศาสตร์ ISEE: ${displayIsee}`}
        >
          ISEE: {displayIsee}
        </span>
      )}

      {displayIam && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '1px 6px',
            borderRadius: '6px',
            backgroundColor: '#faf5ff',
            border: '1px solid #e9d5ff',
            color: '#7e22ce',
            fontSize: '10.5px',
            fontWeight: 600,
          }}
          title={`ค่านิยม IAM: ${displayIam}`}
        >
          IAM: {displayIam}
        </span>
      )}
    </div>
  );
}

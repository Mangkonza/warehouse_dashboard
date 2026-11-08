'use client';

import React from 'react';
import { MISSION_THEMES, type MissionKey } from '@/lib/pastelTheme';
import { dashboardTheme } from '@/lib/dashboardTheme';

export interface MissionKpiCardProps {
  /** Mission page theme used for the card's accent palette. */
  mission: MissionKey;
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  subtext?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  /** `manage` uses the flat white card style of the data-management tab. */
  variant?: 'pastel' | 'manage';
}

/**
 * Executive KPI card shared by the five mission dashboards.
 * Uses the same layout as the Academic Services page, with colors derived
 * from each page's mission theme.
 */
export function MissionKpiCard({
  mission,
  label,
  value,
  unit,
  subtext,
  icon,
  onClick,
  className,
  style,
  variant = 'pastel',
}: MissionKpiCardProps) {
  const theme = MISSION_THEMES[mission].card;
  const isManage = variant === 'manage';

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: isManage ? dashboardTheme.colors.surface : `linear-gradient(135deg, ${theme.surface} 0%, #ffffff 100%)`,
        border: `1px solid ${isManage ? dashboardTheme.colors.border : theme.border}`,
        borderRadius: isManage ? `${dashboardTheme.radius.card}px` : '16px',
        padding: isManage ? '18px 20px' : '20px',
        boxShadow: isManage ? 'none' : `0 4px 14px ${theme.glow}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: isManage ? '#475569' : theme.header,
            lineHeight: 1.4,
          }}
        >
          {label}
        </span>

        {icon ? (
          <div
            style={{
              width: isManage ? '34px' : '36px',
              height: isManage ? '34px' : '36px',
              borderRadius: isManage ? `${dashboardTheme.radius.control}px` : '10px',
              backgroundColor: isManage ? dashboardTheme.colors.primarySoft : theme.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isManage ? dashboardTheme.colors.primary : theme.icon,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: '12px' }}>
        <div
          style={{
            fontSize: isManage ? '30px' : '28px',
            fontWeight: isManage ? 700 : 800,
            color: isManage ? dashboardTheme.colors.text : '#1e293b',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
          {unit ? (
            <span
              style={{
                fontSize: isManage ? '15px' : '16px',
                fontWeight: 600,
                color: isManage ? dashboardTheme.colors.textSecondary : theme.header,
                marginLeft: '4px',
              }}
            >
              {unit}
            </span>
          ) : null}
        </div>

        {subtext ? (
          <div
            style={{
              fontSize: '12px',
              color: isManage ? dashboardTheme.colors.textMuted : theme.subtext,
              marginTop: '4px',
              lineHeight: 1.45,
            }}
          >
            {subtext}
          </div>
        ) : null}
      </div>
    </div>
  );
}

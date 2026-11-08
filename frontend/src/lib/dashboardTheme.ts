import type { CSSProperties } from 'react';

/**
 * Shared visual tokens for the dashboard tabs.
 * The "manage" tab is the product's visual reference: flat white surfaces,
 * a quiet slate border, 12px cards and green used as the single accent.
 */
export const dashboardTheme = {
  colors: {
    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    border: '#e2e8f0',
    borderStrong: '#cbd5e1',
    text: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    primary: '#00A651',
    primaryDark: '#047857',
    primarySoft: '#f0fdf4',
  },
  radius: {
    card: 12,
    control: 8,
  },
} as const;

export const dashboardPageTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 700,
  color: dashboardTheme.colors.text,
  letterSpacing: '-0.3px',
  lineHeight: 1.5,
};

export const dashboardPageSubtitleStyle: CSSProperties = {
  margin: '4px 0 0',
  fontSize: '12px',
  fontWeight: 400,
  color: dashboardTheme.colors.textSecondary,
  lineHeight: 1.5,
};

export const dashboardCardStyle: CSSProperties = {
  backgroundColor: dashboardTheme.colors.surface,
  border: `1px solid ${dashboardTheme.colors.border}`,
  borderRadius: `${dashboardTheme.radius.card}px`,
  boxShadow: 'none',
};

export const dashboardControlStyle: CSSProperties = {
  height: '36px',
  borderRadius: `${dashboardTheme.radius.control}px`,
  border: `1px solid ${dashboardTheme.colors.borderStrong}`,
  backgroundColor: dashboardTheme.colors.surface,
  color: '#334155',
  fontSize: '13px',
  boxSizing: 'border-box',
};

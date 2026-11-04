'use client';

import React from 'react';

export type KpiIllustrationVariant =
  | 'mint-coins'
  | 'sky-blueprint'
  | 'amber-spark'
  | 'violet-crown'
  | 'rose-journal'
  | 'teal-globe'
  | 'emerald-award'
  | 'peach-people'
  | 'indigo-network'
  | 'lavender-shield'
  | 'cyan-pipeline'
  | 'coral-progress';

export interface PastelIllustratedKpiCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  subtitle?: React.ReactNode;
  badgeText?: string;
  progressPercent?: number;
  variant: KpiIllustrationVariant;
}

const VARIANT_STYLES: Record<
  KpiIllustrationVariant,
  {
    bgGradient: string;
    borderColor: string;
    accentColor: string;
    softAccent: string;
    badgeBg: string;
    badgeText: string;
    barColor: string;
  }
> = {
  'mint-coins': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 60%, #dcfce7 100%)',
    borderColor: '#bbf7d0',
    accentColor: '#059669',
    softAccent: '#6ee7b7',
    badgeBg: '#dcfce7',
    badgeText: '#065f46',
    barColor: '#6ee7b7',
  },
  'sky-blueprint': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 60%, #e0f2fe 100%)',
    borderColor: '#bae6fd',
    accentColor: '#0284c7',
    softAccent: '#7dd3fc',
    badgeBg: '#e0f2fe',
    badgeText: '#075985',
    barColor: '#7dd3fc',
  },
  'amber-spark': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 60%, #fef3c7 100%)',
    borderColor: '#fde68a',
    accentColor: '#d97706',
    softAccent: '#fcd34d',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    barColor: '#fcd34d',
  },
  'violet-crown': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 60%, #ede9fe 100%)',
    borderColor: '#ddd6fe',
    accentColor: '#7c3aed',
    softAccent: '#c4b5fd',
    badgeBg: '#ede9fe',
    badgeText: '#5b21b6',
    barColor: '#c4b5fd',
  },
  'rose-journal': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 60%, #ffe4e6 100%)',
    borderColor: '#fecdd3',
    accentColor: '#e11d48',
    softAccent: '#fda4af',
    badgeBg: '#ffe4e6',
    badgeText: '#9f1239',
    barColor: '#fda4af',
  },
  'teal-globe': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 60%, #ccfbf1 100%)',
    borderColor: '#99f6e4',
    accentColor: '#0d9488',
    softAccent: '#5eead4',
    badgeBg: '#ccfbf1',
    badgeText: '#115e59',
    barColor: '#5eead4',
  },
  'emerald-award': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 60%, #d1fae5 100%)',
    borderColor: '#a7f3d0',
    accentColor: '#047857',
    softAccent: '#6ee7b7',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
    barColor: '#6ee7b7',
  },
  'peach-people': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 60%, #ffedd5 100%)',
    borderColor: '#fed7aa',
    accentColor: '#ea580c',
    softAccent: '#fdba74',
    badgeBg: '#ffedd5',
    badgeText: '#9a3412',
    barColor: '#fdba74',
  },
  'indigo-network': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 60%, #e0e7ff 100%)',
    borderColor: '#c7d2fe',
    accentColor: '#4f46e5',
    softAccent: '#a5b4fc',
    badgeBg: '#e0e7ff',
    badgeText: '#3730a3',
    barColor: '#a5b4fc',
  },
  'lavender-shield': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 60%, #f3e8ff 100%)',
    borderColor: '#e9d5ff',
    accentColor: '#7e22ce',
    softAccent: '#d8b4fe',
    badgeBg: '#f3e8ff',
    badgeText: '#6b21a8',
    barColor: '#d8b4fe',
  },
  'cyan-pipeline': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #ecfeff 60%, #cffafe 100%)',
    borderColor: '#a5f3fc',
    accentColor: '#0891b2',
    softAccent: '#67e8f9',
    badgeBg: '#cffafe',
    badgeText: '#155e75',
    barColor: '#67e8f9',
  },
  'coral-progress': {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 60%, #fce7f3 100%)',
    borderColor: '#fbcfe8',
    accentColor: '#db2777',
    softAccent: '#f9a8d4',
    badgeBg: '#fce7f3',
    badgeText: '#9d174d',
    barColor: '#f9a8d4',
  },
};

function CardIllustration({ variant }: { variant: KpiIllustrationVariant }) {
  switch (variant) {
    case 'mint-coins':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="82" cy="28" r="34" fill="#A7F3D0" fillOpacity="0.45" />
          <circle cx="52" cy="70" r="24" fill="#6EE7B7" fillOpacity="0.35" />
          <rect x="44" y="42" width="12" height="32" rx="5" fill="#6EE7B7" />
          <rect x="62" y="28" width="12" height="46" rx="5" fill="#34D399" />
          <rect x="80" y="16" width="12" height="58" rx="5" fill="#10B981" fillOpacity="0.85" />
          <circle cx="50" cy="28" r="8" fill="#FDE68A" />
          <path d="M44 36C54 28 66 22 86 12" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      );
    case 'sky-blueprint':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="80" cy="26" r="34" fill="#BAE6FD" fillOpacity="0.5" />
          <rect x="42" y="18" width="48" height="58" rx="10" fill="#7DD3FC" fillOpacity="0.45" />
          <rect x="50" y="26" width="38" height="50" rx="9" fill="#38BDF8" fillOpacity="0.75" />
          <rect x="57" y="35" width="24" height="5" rx="2.5" fill="#FFFFFF" />
          <rect x="57" y="45" width="18" height="5" rx="2.5" fill="#E0F2FE" />
          <rect x="57" y="55" width="22" height="5" rx="2.5" fill="#E0F2FE" />
          <circle cx="84" cy="66" r="11" fill="#A7F3D0" />
          <path d="M80 66L83 69L89 63" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'amber-spark':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="82" cy="30" r="34" fill="#FDE68A" fillOpacity="0.55" />
          <circle cx="54" cy="64" r="22" fill="#FDBA74" fillOpacity="0.35" />
          <path d="M72 14L80 34L100 42L80 50L72 70L64 50L44 42L64 34L72 14Z" fill="#FBBF24" fillOpacity="0.8" />
          <circle cx="72" cy="42" r="9" fill="#FFFBEB" />
          <circle cx="48" cy="24" r="5" fill="#F59E0B" fillOpacity="0.65" />
        </svg>
      );
    case 'violet-crown':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="80" cy="30" r="35" fill="#DDD6FE" fillOpacity="0.55" />
          <polygon points="44,62 50,32 64,46 74,24 84,46 98,32 94,62" fill="#A78BFA" fillOpacity="0.85" />
          <rect x="46" y="65" width="46" height="7" rx="3.5" fill="#8B5CF6" />
          <circle cx="50" cy="28" r="4" fill="#FDE68A" />
          <circle cx="74" cy="20" r="5" fill="#FCD34D" />
          <circle cx="98" cy="28" r="4" fill="#FDE68A" />
        </svg>
      );
    case 'rose-journal':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="82" cy="28" r="34" fill="#FECDD3" fillOpacity="0.55" />
          <rect x="44" y="22" width="38" height="50" rx="7" transform="rotate(-8 44 22)" fill="#FDA4AF" fillOpacity="0.65" />
          <rect x="54" y="20" width="38" height="50" rx="7" fill="#FB7185" fillOpacity="0.85" />
          <rect x="61" y="30" width="24" height="4.5" rx="2.2" fill="#FFFFFF" />
          <rect x="61" y="39" width="18" height="4.5" rx="2.2" fill="#FFE4E6" />
          <rect x="61" y="48" width="21" height="4.5" rx="2.2" fill="#FFE4E6" />
          <circle cx="86" cy="62" r="10" fill="#FDE68A" />
        </svg>
      );
    case 'teal-globe':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="74" cy="44" r="30" fill="#99F6E4" fillOpacity="0.55" />
          <circle cx="74" cy="44" r="22" stroke="#14B8A6" strokeWidth="2.5" fill="#5EEAD4" fillOpacity="0.35" />
          <ellipse cx="74" cy="44" rx="11" ry="22" stroke="#0D9488" strokeWidth="2" />
          <line x1="52" y1="44" x2="96" y2="44" stroke="#0D9488" strokeWidth="2" />
          <line x1="56" y1="33" x2="92" y2="33" stroke="#14B8A6" strokeWidth="1.5" />
          <line x1="56" y1="55" x2="92" y2="55" stroke="#14B8A6" strokeWidth="1.5" />
        </svg>
      );
    case 'emerald-award':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="78" cy="34" r="32" fill="#A7F3D0" fillOpacity="0.5" />
          <path d="M64 52L58 78L72 70L86 78L80 52" fill="#34D399" fillOpacity="0.75" />
          <circle cx="72" cy="38" r="19" fill="#6EE7B7" stroke="#10B981" strokeWidth="2.5" />
          <circle cx="72" cy="38" r="11" fill="#ECFDF5" />
          <path d="M72 31L74.2 35.5L79 36.2L75.5 39.6L76.3 44.4L72 42.1L67.7 44.4L68.5 39.6L65 36.2L69.8 35.5L72 31Z" fill="#F59E0B" />
        </svg>
      );
    case 'peach-people':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="80" cy="30" r="34" fill="#FED7AA" fillOpacity="0.55" />
          <circle cx="62" cy="34" r="10" fill="#FB923C" fillOpacity="0.85" />
          <path d="M44 66C44 55 52 48 62 48C72 48 80 55 80 66" fill="#FDBA74" />
          <circle cx="84" cy="38" r="8" fill="#F97316" fillOpacity="0.7" />
          <path d="M72 66C72 57 77 52 84 52C91 52 96 57 96 66" fill="#FED7AA" />
        </svg>
      );
    case 'indigo-network':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="80" cy="32" r="33" fill="#C7D2FE" fillOpacity="0.5" />
          <line x1="52" y1="54" x2="72" y2="28" stroke="#818CF8" strokeWidth="2.5" />
          <line x1="72" y1="28" x2="92" y2="48" stroke="#818CF8" strokeWidth="2.5" />
          <line x1="52" y1="54" x2="84" y2="66" stroke="#A5B4FC" strokeWidth="2.5" />
          <line x1="72" y1="28" x2="84" y2="66" stroke="#A5B4FC" strokeWidth="2" />
          <circle cx="72" cy="28" r="9" fill="#6366F1" fillOpacity="0.85" />
          <circle cx="52" cy="54" r="8" fill="#818CF8" />
          <circle cx="92" cy="48" r="7" fill="#A5B4FC" />
          <circle cx="84" cy="66" r="8" fill="#38BDF8" />
        </svg>
      );
    case 'lavender-shield':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="80" cy="30" r="34" fill="#E9D5FF" fillOpacity="0.55" />
          <path
            d="M72 16L94 25V44C94 59 84.5 71.5 72 76C59.5 71.5 50 59 50 44V25L72 16Z"
            fill="#C084FC"
            fillOpacity="0.8"
          />
          <path
            d="M65 45L70 50L81 39"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'cyan-pipeline':
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="80" cy="30" r="33" fill="#A5F3FC" fillOpacity="0.5" />
          <rect x="44" y="24" width="48" height="12" rx="6" fill="#67E8F9" />
          <rect x="52" y="42" width="40" height="12" rx="6" fill="#22D3EE" fillOpacity="0.85" />
          <rect x="60" y="60" width="32" height="12" rx="6" fill="#06B6D4" fillOpacity="0.8" />
          <circle cx="48" cy="48" r="5" fill="#FDE68A" />
        </svg>
      );
    case 'coral-progress':
    default:
      return (
        <svg width="110" height="96" viewBox="0 0 110 96" fill="none" aria-hidden="true">
          <circle cx="80" cy="32" r="33" fill="#FBCFE8" fillOpacity="0.5" />
          <circle cx="72" cy="46" r="22" stroke="#F9A8D4" strokeWidth="6" fill="none" />
          <path
            d="M72 24A22 22 0 1 1 52 55"
            stroke="#EC4899"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="72" cy="46" r="8" fill="#FCE7F3" />
        </svg>
      );
  }
}

export function PastelIllustratedKpiCard({
  label,
  value,
  unit,
  subtitle,
  badgeText,
  progressPercent,
  variant,
}: PastelIllustratedKpiCardProps) {
  const theme = VARIANT_STYLES[variant] || VARIANT_STYLES['mint-coins'];
  const clampedPct =
    typeof progressPercent === 'number' ? Math.max(6, Math.min(100, progressPercent)) : undefined;

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: theme.bgGradient,
        borderRadius: '18px',
        border: `1px solid ${theme.borderColor}`,
        padding: '18px 20px',
        boxShadow: '0 4px 14px -4px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '132px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Decorative Pastel Illustration Artwork */}
      <div
        style={{
          position: 'absolute',
          right: '-6px',
          top: '-4px',
          pointerEvents: 'none',
          opacity: 0.92,
        }}
      >
        <CardIllustration variant={variant} />
      </div>

      {/* Top Row: Label & Optional Pill Badge */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#334155',
            letterSpacing: '-0.01em',
          }}
        >
          {label}
        </span>
        {badgeText && (
          <span
            style={{
              padding: '2px 9px',
              borderRadius: '999px',
              backgroundColor: theme.badgeBg,
              color: theme.badgeText,
              border: `1px solid ${theme.borderColor}`,
              fontSize: '11px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Center Row: Primary Value & Unit */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
          margin: '2px 0 8px 0',
        }}
      >
        <span
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: theme.accentColor,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Bottom Row: Visual Mini Progress Bar + Subtitle */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {clampedPct !== undefined && (
          <div
            style={{
              height: '5px',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '7px',
              border: `1px solid ${theme.borderColor}`,
            }}
          >
            <div
              style={{
                width: `${clampedPct}%`,
                height: '100%',
                backgroundColor: theme.barColor,
                borderRadius: '999px',
                transition: 'width 0.35s ease',
              }}
            />
          </div>
        )}
        {subtitle && (
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 500,
              color: '#475569',
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

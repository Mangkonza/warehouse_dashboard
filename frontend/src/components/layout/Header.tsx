'use client';

import React from 'react';
import { THEME_COLORS } from '@/config/theme';

export interface HeaderProps {
  title?: string;
  layoutLeftOffset?: number;
  rightSlot?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  layoutLeftOffset = 70,
  rightSlot,
}) => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: `${layoutLeftOffset}px`,
        right: 0,
        height: '50px',
        backgroundColor: THEME_COLORS.primary,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 900,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'left 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: '16px',
            fontWeight: 500,
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
      </div>

      <div style={{ marginLeft: 'auto', zIndex: 1 }}>
        {rightSlot}
      </div>
    </header>
  );
};
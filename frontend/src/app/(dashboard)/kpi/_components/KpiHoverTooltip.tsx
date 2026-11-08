'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface KpiHoverTooltipProps {
  /** รหัสกำกับด้านหน้า เช่น รหัสตัวชี้วัด "1.1-1 (1)" หรือรหัสแผนงาน "แผนงานที่ 1.1-1" */
  badge?: string;
  /** ข้อความชื่อเต็มที่จะแสดงใน Tooltip */
  fullText: string;
  /** ข้อความรอง เช่น หมายเหตุ หรือคำแนะนำการคลิก */
  subText?: string;
  /** สีของ Badge ใน Tooltip */
  badgeColor?: 'green' | 'orange' | 'blue' | 'slate';
  /** เนื้อหาที่แสดงในตาราง (มักเป็นข้อความที่ตัด ... แล้ว) */
  children: React.ReactNode;
  /** สไตล์เพิ่มเติมของ wrapper */
  style?: React.CSSProperties;
  /** คลิกที่ข้อความได้หรือไม่ */
  onClick?: () => void;
}

export function KpiHoverTooltip({
  badge,
  fullText,
  subText,
  badgeColor = 'green',
  children,
  style,
  onClick,
}: KpiHoverTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placeAbove: boolean }>({
    top: 0,
    left: 0,
    placeAbove: false,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePosition = () => {
    if (!triggerRef.current || typeof window === 'undefined') return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < 140 && rect.top > 140;

    const maxLeft = Math.max(16, window.innerWidth - 460);
    const left = Math.min(Math.max(16, rect.left), maxLeft);
    const top = placeAbove ? rect.top - 8 : rect.bottom + 6;

    setCoords({ top, left, placeAbove });
  };

  const handleMouseEnter = () => {
    if (!fullText) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updatePosition();
      setVisible(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const badgePalette = {
    green: { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
    orange: { bg: '#ffedd5', text: '#c2410c', border: '#fdba74' },
    blue: { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
    slate: { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
  }[badgeColor];

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          minWidth: 0,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          cursor: onClick ? 'pointer' : 'default',
          ...style,
        }}
      >
        {children}
      </div>

      {visible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: coords.placeAbove ? 'translateY(-100%)' : 'none',
              zIndex: 99999,
              maxWidth: '440px',
              minWidth: '240px',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              padding: '10px 14px',
              borderRadius: '10px',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.35), 0 4px 10px -2px rgba(15, 23, 42, 0.2)',
              border: '1px solid #334155',
              pointerEvents: 'none',
              fontFamily: "'Kanit', sans-serif",
              lineHeight: 1.5,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {badge && (
              <div style={{ marginBottom: '5px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '1px 7px',
                    borderRadius: '4px',
                    backgroundColor: badgePalette.bg,
                    color: badgePalette.text,
                    border: `1px solid ${badgePalette.border}`,
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {badge}
                </span>
              </div>
            )}
            <div
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#ffffff',
                lineHeight: 1.45,
              }}
            >
              {fullText}
            </div>
            {subText && (
              <div
                style={{
                  marginTop: '6px',
                  paddingTop: '5px',
                  borderTop: '1px solid rgba(148, 163, 184, 0.22)',
                  fontSize: '11px',
                  color: '#94a3b8',
                }}
              >
                {subText}
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}

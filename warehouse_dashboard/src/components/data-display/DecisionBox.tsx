'use client';

import React, { ReactNode } from 'react';
import { FaLightbulb } from 'react-icons/fa';

export interface DecisionBoxProps {
  title: ReactNode;
  icon?: ReactNode;
  items?: ReactNode[];
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DecisionBox({
  title,
  icon = <FaLightbulb style={{ color: '#00A651', fontSize: '16px' }} />,
  items,
  children,
  className = '',
  style,
}: DecisionBoxProps) {
  return (
    <div
      className={`decision-box ${className}`.trim()}
      style={{
        backgroundColor: '#f0fbf5',
        border: '1px solid #a7f3d0',
        borderLeft: '4px solid #00A651',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '18px',
        marginTop: 0,
        boxShadow: '0 1px 2px rgba(0, 166, 81, 0.05)',
        ...style,
      }}
    >
      <div
        className="decision-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#1e293b',
        }}
      >
        {icon}
        <span>{title}</span>
      </div>
      {items && items.length > 0 ? (
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: items.length > 1 ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
            gap: '6px 16px',
          }}
        >
          {items.map((item, idx) => (
            <li
              key={idx}
              style={{
                padding: '2px 0 2px 16px',
                position: 'relative',
                fontSize: '13px',
                color: '#334155',
                lineHeight: 1.5,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}

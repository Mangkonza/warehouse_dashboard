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
  icon = <FaLightbulb style={{ color: '#f59e0b', fontSize: '18px' }} />,
  items,
  children,
  className = '',
  style,
}: DecisionBoxProps) {
  return (
    <div className={`decision-box ${className}`.trim()} style={style}>
      <div className="decision-header">
        {icon} {title}
      </div>
      {items && items.length > 0 ? (
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}

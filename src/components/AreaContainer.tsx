import React from 'react';
import type { ReactNode } from 'react';
import { Card } from 'antd';
import './AreaContainer.css';

interface AreaContainerProps {
  title: string;
  children: ReactNode;
  count?: number;
}

export const AreaContainer: React.FC<AreaContainerProps> = ({
  title,
  children,
  count,
}) => {
  return (
    <Card
      className="area-container glass-card"
      title={
        <div className="area-header">
          <span className="area-title">{title}</span>
          {count !== undefined && (
            <span className="area-count">{count}</span>
          )}
        </div>
      }
      variant="borderless"
    >
      <div className="area-content">
        {children}
      </div>
    </Card>
  );
};

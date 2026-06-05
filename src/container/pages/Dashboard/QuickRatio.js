import React from 'react';
import { Card, Progress } from 'antd';

function QuickRatio() {
  const ratio = 1.8;
  const target = 1.0;
  const percentage = Math.min((ratio / 2.5) * 100, 100); // Scale to fit a progress bar, e.g., max ratio of 2.5 is 100%

  return (
    <Card title="Quick Ratio" bordered={false} className="quick-ratio-card">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{ratio}</h2>
      <Progress percent={percentage} showInfo={false} strokeColor="#1890ff" />
      <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#8c8c8c' }}>
        {ratio >= target ? (
          <span style={{ color: '#52c41a' }}>1 or higher</span>
        ) : (
          <span style={{ color: '#f5222d' }}>Below target</span>
        )}
        : quick ratio target
      </p>
    </Card>
  );
}

export default QuickRatio;

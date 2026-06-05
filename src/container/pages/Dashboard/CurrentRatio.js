import React from 'react';
import { Card, Progress } from 'antd';

function CurrentRatio() {
  const ratio = 2.4;
  const target = 2.0;
  const percentage = Math.min((ratio / 3.0) * 100, 100); // Scale to fit a progress bar, e.g., max ratio of 3.0 is 100%

  return (
    <Card title="Current Ratio" bordered={false} className="current-ratio-card">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{ratio}</h2>
      <Progress percent={percentage} showInfo={false} strokeColor="#faad14" />
      <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#8c8c8c' }}>
        {ratio >= target ? (
          <span style={{ color: '#52c41a' }}>2 or higher</span>
        ) : (
          <span style={{ color: '#f5222d' }}>Below target</span>
        )}
        : current ratio target
      </p>
    </Card>
  );
}

export default CurrentRatio;

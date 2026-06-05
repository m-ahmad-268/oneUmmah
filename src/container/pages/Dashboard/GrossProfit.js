import React from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', profit: 8000 },
  { name: 'Feb', profit: 7000 },
  { name: 'Mar', profit: 6500 },
  { name: 'Apr', profit: 7200 },
  { name: 'May', profit: 6000 },
  { name: 'Jun', profit: 7500 },
  { name: 'Jul', profit: 8200 },
  { name: 'Aug', profit: 7800 },
  { name: 'Sep', profit: 8500 },
  { name: 'Oct', profit: 8100 },
  { name: 'Nov', profit: 8800 },
  { name: 'Dec', profit: 8500 },
];

function GrossProfit() {
  return (
    <Card title="Total Expense" bordered={false} className="gross-profit-card">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>$82.24k</h2>
      <p style={{ color: '#f5222d', fontSize: '14px', margin: '0 0 15px 0' }}>
        - 8% <span style={{ color: '#8c8c8c' }}>since last month</span>
      </p>
      <div style={{ width: '100%', height: 100 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <Tooltip />
            <Line type="monotone" dataKey="profit" stroke="#52c41a" strokeWidth={2} dot={false} />{' '}
            {/* Changed color for distinction */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default GrossProfit;

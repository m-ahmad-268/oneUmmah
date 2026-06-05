import React from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', profit: 4000 },
  { name: 'Feb', profit: 3000 },
  { name: 'Mar', profit: 2000 },
  { name: 'Apr', profit: 2780 },
  { name: 'May', profit: 1890 },
  { name: 'Jun', profit: 2390 },
  { name: 'Jul', profit: 3490 },
  { name: 'Aug', profit: 2800 },
  { name: 'Sep', profit: 3500 },
  { name: 'Oct', profit: 3200 },
  { name: 'Nov', profit: 4100 },
  { name: 'Dec', profit: 3900 },
];

function NetProfit() {
  return (
    <Card title="Net Profit" bordered={false} className="net-profit-card">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>$42.5k</h2>
      <p style={{ color: '#52c41a', fontSize: '14px', margin: '0 0 15px 0' }}>
        + 15% <span style={{ color: '#8c8c8c' }}>since last month</span>
      </p>
      <div style={{ width: '100%', height: 100 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <Tooltip />
            <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default NetProfit;

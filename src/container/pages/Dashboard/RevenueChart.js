import React from 'react';
import dayjs from 'dayjs';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Cards } from '../../../components/cards/frame/cards-frame';

function RevenueChart({ revenueByDay }) {
  const data = (revenueByDay ?? []).map((d) => ({
    ...d,
    label: dayjs(d.date).format('DD MMM'),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          padding: '10px 14px',
          boxShadow: '0 3px 16px rgba(173,181,217,0.2)',
          fontSize: 13,
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: 4, color: '#0A0A0A' }}>{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color, margin: '2px 0' }}>
            {entry.name}: {entry.name === 'Revenue (£)' ? `£${Number(entry.value).toFixed(2)}` : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <Cards title="Daily Revenue Overview" size="large">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#8C90A4' }}
            tickLine={false}
            axisLine={{ stroke: '#f0f0f0' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: '#8C90A4' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v >= 1000 ? `£${v / 1000}k` : `£${v}`)}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: '#8C90A4' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
            formatter={(value) => <span style={{ color: '#404040' }}>{value}</span>}
          />
          <Bar
            yAxisId="left"
            dataKey="amount"
            name="Revenue (£)"
            fill="#3da7dc"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="donationsCount"
            name="Donations"
            stroke="#01B81A"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Cards>
  );
}

export default RevenueChart;

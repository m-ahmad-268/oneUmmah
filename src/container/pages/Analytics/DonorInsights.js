import React, { useEffect, useState } from 'react';
import { Row, Col, DatePicker, Statistic, Spin, message } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { getDonorInsights } from '../../../services/analyticsService';

const { RangePicker } = DatePicker;

function DonorInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, 'days'),
    moment(),
  ]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await getDonorInsights({
        from: dateRange[0].format('YYYY-MM-DD'),
        to: dateRange[1].format('YYYY-MM-DD'),
      });
      setInsights(res?.data ?? res);
    } catch {
      message.error('Failed to load donor insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const countryData = (insights?.donorsByCountry ?? [])
    .slice(0, 10)
    .map((item) => ({ country: item.country, donors: item.count ?? item.donors ?? 0 }));

  return (
    <>
      <CardToolbox>
        <PageHeader ghost title="Donor Insights" />
      </CardToolbox>
      <Main>
        <div style={{ marginBottom: 24 }}>
          <RangePicker
            value={dateRange}
            onChange={(v) => v && setDateRange(v)}
            format="DD/MM/YYYY"
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
        ) : insights ? (
          <>
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
              <Col xs={12} sm={8} md={4}>
                <Cards headless>
                  <Statistic title="Total Donors" value={insights.totalDonors ?? 0} />
                </Cards>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Cards headless>
                  <Statistic title="New Donors" value={insights.newDonors ?? 0} />
                </Cards>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Cards headless>
                  <Statistic title="Returning Donors" value={insights.returningDonors ?? 0} />
                </Cards>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Cards headless>
                  <Statistic title="Gift Aid Eligible" value={insights.giftAidEligible ?? 0} />
                </Cards>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Cards headless>
                  <Statistic title="Opted Out" value={insights.optedOut ?? 0} />
                </Cards>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Cards headless>
                  <Statistic
                    title="Avg Lifetime Value"
                    value={insights.averageLifetimeValue ?? 0}
                    precision={2}
                    prefix="£"
                  />
                </Cards>
              </Col>
            </Row>

            {countryData.length > 0 && (
              <Cards title="Donors by Country (Top 10)">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={countryData}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="country" width={60} />
                    <Tooltip />
                    <Bar dataKey="donors" fill="#1890ff" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Cards>
            )}
          </>
        ) : (
          <div style={{ color: '#999' }}>No insights data available.</div>
        )}
      </Main>
    </>
  );
}

export default DonorInsights;

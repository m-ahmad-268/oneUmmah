import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Row, Col, Skeleton, message } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main } from '../../styled';
import { getDashboardAnalytics } from '../../../services/analyticsService';
import { getCampaigns } from '../../../services/campaignService';

const SummaryCards = lazy(() => import('./SummaryCards'));
const RevenueChart = lazy(() => import('./RevenueChart'));
const TopSellingProduct = lazy(() => import('./TopSellingProducts'));

const CardSkeleton = <Skeleton active paragraph={{ rows: 4 }} />;

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [topCampaigns, setTopCampaigns] = useState([]);
  const [totalCampaigns, setTotalCampaigns] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, campaignsRes] = await Promise.all([
          getDashboardAnalytics(),
          getCampaigns({ size: 1 }),
        ]);

        const data = analyticsRes?.data ?? analyticsRes ?? {};
        setSummary(data.summary ?? {});
        setRevenueByDay(data.revenueByDay ?? []);
        setTopCampaigns(data.topCampaigns ?? []);

        const total =
          campaignsRes?.data?.totalElements ??
          campaignsRes?.data?.content?.length ??
          0;
        setTotalCampaigns(total);
      } catch {
        message.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <PageHeader className="ninjadash-page-header-main" title="Dashboard" routes={[]} />
      <Main>
        <div style={{ padding: '10px' }}>
          {loading ? (
            <>
              <Skeleton active paragraph={{ rows: 3 }} style={{ marginBottom: 24 }} />
              <Skeleton active paragraph={{ rows: 8 }} />
            </>
          ) : (
            <>
              {/* Stat cards */}
              <Suspense fallback={CardSkeleton}>
                <SummaryCards summary={summary} totalCampaigns={totalCampaigns} />
              </Suspense>

              {/* Chart + Top Campaigns */}
              <Row gutter={[16, 16]}>
                <Col xxl={14} xs={24}>
                  <Suspense fallback={CardSkeleton}>
                    <RevenueChart revenueByDay={revenueByDay} />
                  </Suspense>
                </Col>
                <Col xxl={10} xs={24}>
                  <Suspense fallback={CardSkeleton}>
                    <TopSellingProduct topCampaigns={topCampaigns} />
                  </Suspense>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Main>
    </>
  );
}

export default Dashboard;

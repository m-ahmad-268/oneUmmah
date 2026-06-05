import React, { lazy, Suspense } from 'react';
import { Row, Col, Spin } from 'antd';

import { MixedCardWrap } from '../../../layout/Style';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame'; // Assuming this path is correct

// --- Lazy loaded components. Adjust paths if your new components are elsewhere ---
// OrderSummary path from your original code (assuming it's updated with static data)
const OrderSummary = lazy(() => import('./OrderSummary'));

// SalesByLocation from your original code
const SalesByLocation = lazy(() => import('./SalesByLocation'));

// SocialMediaOverview and DailyOverview from your original code
const SocialMediaOverview = lazy(() => import('./SocialMediaOverview'));
const DailyOverview = lazy(() => import('./DailyOverview'));

// NEW CHART COMPONENTS (assuming they are in the same directory as WidgetsCard.js)
const NetProfit = lazy(() => import('./NetProfit'));
const GrossProfit = lazy(() => import('./GrossProfit')); // Renamed from GrossProfit
const QuickRatio = lazy(() => import('./QuickRatio'));
const CurrentRatio = lazy(() => import('./CurrentRatio'));

function WidgetsCard() {
  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Dashboard',
    },
    {
      path: 'first',
      breadcrumbName: 'Campaign Analysis',
    },
  ];
  return (
    <>
      <PageHeader className="ninjadash-page-header-main" title="Widgets Mixed" routes={PageRoutes} />
      <Main>
        <MixedCardWrap>
          {/* Top Main Row: Events Summary (left) and the 4 Charts (right, in a single row) */}
          <Row gutter={25} style={{ marginBottom: '25px' }}>
            {' '}
            {/* Added marginBottom for spacing */}
            {/* Left Column for Events Summary (OrderSummary) */}
            <Col xxl={8} xl={10} xs={24}>
              <Cards headless>
                <Suspense fallback={<Spin style={{ display: 'block', margin: '50px auto' }} />}>
                  <OrderSummary />
                </Suspense>
              </Cards>
            </Col>
            {/* Right Column for the 4 Charts (Net Profit, Total Expense, Quick Ratio, Current Ratio) */}
            {/* These 4 charts are now in a single, direct Row within this Col */}
            <Col xxl={16} xl={14} xs={24}>
              <Row gutter={[25, 25]}>
                {/* Row 1: Net Profit + Total Expense */}
                <Col xxl={12} xl={12} md={12} xs={24}>
                  <Suspense
                    fallback={
                      <Cards headless>
                        <Spin />
                      </Cards>
                    }
                  >
                    <NetProfit />
                  </Suspense>
                </Col>
                <Col xxl={12} xl={12} md={12} xs={24}>
                  <Suspense
                    fallback={
                      <Cards headless>
                        <Spin />
                      </Cards>
                    }
                  >
                    <GrossProfit />
                  </Suspense>
                </Col>

                {/* Row 2: Quick Ratio + Current Ratio */}
                <Col xxl={12} xl={12} md={12} xs={24}>
                  <Suspense
                    fallback={
                      <Cards headless>
                        <Spin />
                      </Cards>
                    }
                  >
                    <QuickRatio />
                  </Suspense>
                </Col>
                <Col xxl={12} xl={12} md={12} xs={24}>
                  <Suspense
                    fallback={
                      <Cards headless>
                        <Spin />
                      </Cards>
                    }
                  >
                    <CurrentRatio />
                  </Suspense>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Bottom Main Row: Social Media Overview, Sales By Location, Daily Overview */}
          <Row gutter={25}>
            {' '}
            {/* This is a new, separate row for the bottom three components */}
            <Col xxl={8} md={12} xs={24}>
              {' '}
              {/* Social Media Overview */}
              <Suspense
                fallback={
                  <Cards headless>
                    <Spin />
                  </Cards>
                }
              >
                <SocialMediaOverview />
              </Suspense>
            </Col>
            <Col xxl={8} md={12} xs={24}>
              {' '}
              {/* Sales By Location */}
              <Suspense
                fallback={
                  <Cards headless>
                    <Spin />
                  </Cards>
                }
              >
                <SalesByLocation />
              </Suspense>
            </Col>
            <Col xxl={8} md={12} xs={24}>
              {' '}
              {/* Daily Overview */}
              <Suspense
                fallback={
                  <Cards headless>
                    <Spin />
                  </Cards>
                }
              >
                <DailyOverview />
              </Suspense>
            </Col>
          </Row>
        </MixedCardWrap>
      </Main>
    </>
  );
}

export default WidgetsCard;

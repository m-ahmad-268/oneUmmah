import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Row, Col, Skeleton, message } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Main } from '../../styled';
import { useNavigate, useLocation } from 'react-router-dom';

const OverviewDataList = lazy(() => import('./OverviewDataList.js'));
const SalesReport = lazy(() => import('./SalesReport'));
const SalesGrowth = lazy(() => import('./SalesGrowth'));
// const SalesByLocation = lazy(() => import('./SalesByLocation'));
const TopSellingProduct = lazy(() => import('./TopSellingProducts'));

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token_admin');
    const refreshToken = localStorage.getItem('refresh_token_admin');

    if (!accessToken || !refreshToken) {
      navigate(location.pathname('/sign-in'));
    }
  }, [navigate, location]);

  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Dashboard',
    },
    {
      path: 'first',
      breadcrumbName: 'Statistics',
    },
  ];
  return (
    <>
      <PageHeader className="ninjadash-page-header-main" title="Dashboard" routes={[]} />
      {/* <PageHeader className="ninjadash-page-header-main" title="Dashboard" routes={PageRoutes} /> */}

      <Main>
        <Row gutter={10} style={{ padding: '10px' }}>
          <Col xxl={12} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <OverviewDataList />
            </Suspense>
          </Col>
          <Col xxl={12} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <SalesReport />
            </Suspense>
          </Col>
          {/* <Col md={24} style={{ display: 'flex', backgroundColor: 'red', justifyContent: 'center' }}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <SalesGrowth />
            </Suspense>
          </Col> */}
          <Col md={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <TopSellingProduct />
            </Suspense>
          </Col>
        </Row>
      </Main>
    </>
  );
}

export default Dashboard;

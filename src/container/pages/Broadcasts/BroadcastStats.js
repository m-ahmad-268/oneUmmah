import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Statistic, Progress, Spin, message, Divider } from 'antd';
import dayjs from 'dayjs';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import { getBroadcastStats } from '../../../services/broadcastService';

function BroadcastStats() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBroadcastStats(id)
      .then((res) => setStats(res?.data ?? res))
      .catch(() => {
        message.error('Failed to load broadcast stats');
        navigate('/broadcasts');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) return null;

  const deliveryRate = stats.numSent > 0
    ? Math.round((stats.numDelivered / stats.numSent) * 100)
    : 0;
  const readRate = stats.numDelivered > 0
    ? Math.round((stats.numRead / stats.numDelivered) * 100)
    : 0;
  const replyRate = stats.numDelivered > 0
    ? Math.round((stats.numReplied / stats.numDelivered) * 100)
    : 0;

  return (
    <>
      <CardToolbox>
        <PageHeader
          ghost
          title="Broadcast Stats"
          buttons={[
            <Button key="back" type="default" onClick={() => navigate('/broadcasts')}>
              Back to Broadcasts
            </Button>,
          ]}
        />
      </CardToolbox>
      <Main>
        <Cards headless>
          <Row gutter={[24, 24]}>
            <Col xs={12} sm={8} md={4}>
              <Statistic title="Total Recipients" value={stats.totalRecipients ?? 0} />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic title="Sent" value={stats.numSent ?? 0} />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic title="Delivered" value={stats.numDelivered ?? 0} />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic title="Read" value={stats.numRead ?? 0} />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic title="Replied" value={stats.numReplied ?? 0} />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic title="Failed" value={stats.numFailed ?? 0} />
            </Col>
          </Row>

          <Divider />

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div style={{ marginBottom: 8 }}>Delivery Rate</div>
              <Progress percent={deliveryRate} status="active" />
            </Col>
            <Col xs={24} md={8}>
              <div style={{ marginBottom: 8 }}>Read Rate</div>
              <Progress percent={readRate} status="active" strokeColor="#52c41a" />
            </Col>
            <Col xs={24} md={8}>
              <div style={{ marginBottom: 8 }}>Reply Rate</div>
              <Progress percent={replyRate} status="active" strokeColor="#1890ff" />
            </Col>
          </Row>

          <Divider />

          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12}>
              <Statistic
                title="Started At"
                value={stats.startedAt ? dayjs(stats.startedAt).format('DD/MM/YYYY HH:mm') : 'Not started'}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Completed At"
                value={stats.completedAt ? dayjs(stats.completedAt).format('DD/MM/YYYY HH:mm') : 'In progress'}
              />
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
}

export default BroadcastStats;

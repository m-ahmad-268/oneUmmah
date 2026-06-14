import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Descriptions,
  Tag,
  Spin,
  message,
  Statistic,
  Row,
  Col,
  Tabs,
  Popconfirm,
  Empty,
} from 'antd';
import dayjs from 'dayjs';

import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import PermissionGate from '../../../components/utilities/PermissionGate';
import { getCampaignById, patchCampaignStatus } from '../../../services/campaignService';

const STATUS_COLORS = {
  DRAFT: 'default',
  ACTIVE: 'success',
  PAUSED: 'warning',
  CLOSED: 'error',
  SCHEDULED: 'processing',
};

function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);

  const load = async () => {
    try {
      const res = await getCampaignById(id);
      setCampaign(res?.data ?? res);
    } catch {
      message.error('Failed to load campaign');
      navigate('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleStatusChange = async (status) => {
    setActioning(true);
    try {
      await patchCampaignStatus(id, status);
      message.success(`Campaign ${status.toLowerCase()}d`);
      load();
    } catch {
      message.error('Failed to update status');
    } finally {
      setActioning(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!campaign) return null;

  const c = campaign;

  const statusActions = (
    <PermissionGate permission="CAMPAIGN_LAUNCH">
      <Row gutter={8}>
        {(c.status === 'DRAFT' || c.status === 'SCHEDULED') && (
          <Col>
            <Popconfirm
              title="Launch campaign? This will send live WhatsApp messages to donors."
              onConfirm={() => handleStatusChange('ACTIVE')}
              okText="Launch"
              okType="primary"
            >
              <Button type="primary" loading={actioning} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                Launch Campaign
              </Button>
            </Popconfirm>
          </Col>
        )}
        {c.status === 'ACTIVE' && (
          <Col>
            <Popconfirm
              title="Pause this campaign?"
              onConfirm={() => handleStatusChange('PAUSED')}
              okText="Pause"
            >
              <Button loading={actioning} style={{ background: '#fa8b0c', borderColor: '#fa8b0c', color: '#fff' }}>
                Pause
              </Button>
            </Popconfirm>
          </Col>
        )}
        {(c.status === 'ACTIVE' || c.status === 'PAUSED') && (
          <Col>
            <Popconfirm
              title="Close this campaign permanently?"
              onConfirm={() => handleStatusChange('CLOSED')}
              okText="Close"
              okType="danger"
            >
              <Button danger loading={actioning}>Close Campaign</Button>
            </Popconfirm>
          </Col>
        )}
      </Row>
    </PermissionGate>
  );

  const tabItems = [
    {
      key: 'info',
      label: 'Details',
      children: (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Name">{c.name}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLORS[c.status]}>{c.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Type">{c.type?.replace('_', ' ')}</Descriptions.Item>
          <Descriptions.Item label="Category">{c.category}</Descriptions.Item>
          <Descriptions.Item label="Minimum Amount">£{Number(c.minimumAmount ?? 0).toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Goal Amount">
            {c.goalAmount ? `£${Number(c.goalAmount).toFixed(2)}` : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Gift Aid">{c.giftAidEligible ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Auto-Close">{c.autoClose ? 'Yes' : 'No'}</Descriptions.Item>
          {c.billingCycles && (
            <Descriptions.Item label="Billing Cycles">{c.billingCycles}</Descriptions.Item>
          )}
          <Descriptions.Item label="Start Date">
            {c.startDate ? dayjs(c.startDate).format('DD MMM YYYY') : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {c.endDate ? dayjs(c.endDate).format('DD MMM YYYY') : '—'}
          </Descriptions.Item>
          {c.mediaUrl && (
            <Descriptions.Item label="Media URL" span={2}>
              <a href={c.mediaUrl} target="_blank" rel="noreferrer">{c.mediaUrl}</a>
            </Descriptions.Item>
          )}
          {c.description && (
            <Descriptions.Item label="Description" span={2}>{c.description}</Descriptions.Item>
          )}
          {c.amountOptions?.length > 0 && (
            <Descriptions.Item label="Amount Options" span={2}>
              {c.amountOptions.map((a) => (
                <Tag key={a} color="blue">£{a}</Tag>
              ))}
            </Descriptions.Item>
          )}
        </Descriptions>
      ),
    },
    {
      key: 'qr',
      label: 'QR Codes',
      children: <Empty description="QR Codes module coming soon" style={{ padding: 40 }} />,
    },
    {
      key: 'broadcasts',
      label: 'Broadcasts',
      children: <Empty description="Broadcasts module coming soon" style={{ padding: 40 }} />,
    },
    {
      key: 'funnel',
      label: 'Conversion Funnel',
      children: <Empty description="Analytics module coming soon" style={{ padding: 40 }} />,
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          ghost
          title={c.name}
          subTitle={<Tag color={STATUS_COLORS[c.status]}>{c.status}</Tag>}
          buttons={[
            <Button key="back" type="default" onClick={() => navigate('/campaigns')}>
              Back
            </Button>,
            <PermissionGate key="edit" permission="CAMPAIGN_EDIT">
              {(c.status === 'DRAFT' || c.status === 'PAUSED') && (
                <Button type="primary" onClick={() => navigate(`/campaigns/${id}/edit`)}>
                  Edit
                </Button>
              )}
            </PermissionGate>,
          ]}
        />
      </CardToolbox>
      <Main>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Cards headless>
              <Statistic
                title="Total Raised"
                value={c.totalRaised ?? 0}
                prefix="£"
                precision={2}
              />
            </Cards>
          </Col>
          <Col xs={24} sm={8}>
            <Cards headless>
              <Statistic title="Total Donors" value={c.totalDonors ?? 0} />
            </Cards>
          </Col>
          <Col xs={24} sm={8}>
            <Cards headless>
              <Statistic
                title="Avg Donation"
                value={c.averageDonation ?? 0}
                prefix="£"
                precision={2}
              />
            </Cards>
          </Col>
        </Row>

        <div style={{ marginTop: 12, marginBottom: 16 }}>{statusActions}</div>

        <Cards headless>
          <Tabs defaultActiveKey="info" items={tabItems} />
        </Cards>
      </Main>
    </>
  );
}

export default CampaignDetail;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Descriptions,
  Tag,
  Table,
  Statistic,
  Row,
  Col,
  Popconfirm,
  Spin,
  message,
  Divider,
  Timeline,
} from 'antd';
import dayjs from 'dayjs';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import PermissionGate from '../../../components/utilities/PermissionGate';
import { getDonorById, patchDonorOptOut } from '../../../services/donorService';

function DonorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDonor = async () => {
    setLoading(true);
    try {
      const res = await getDonorById(id);
      setDonor(res?.data ?? res);
    } catch {
      message.error('Failed to load donor profile');
      navigate('/donors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleOptOut = async () => {
    const newOptOut = !donor.broadcastOptedOut;
    try {
      await patchDonorOptOut(id, newOptOut);
      message.success(`Donor ${newOptOut ? 'opted out' : 'opted back in'} successfully`);
      loadDonor();
    } catch {
      message.error('Failed to update opt-out status');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!donor) return null;

  const donationColumns = [
    { title: 'Reference', dataIndex: 'reference', key: 'reference' },
    { title: 'Campaign', dataIndex: ['campaign', 'name'], key: 'campaign', render: (_, r) => r.campaign?.name ?? r.campaignName ?? '-' },
    { title: 'Amount (£)', dataIndex: 'amount', key: 'amount', render: (v) => `£${Number(v).toFixed(2)}` },
    { title: 'Billing Cycle', dataIndex: 'billingCycle', key: 'billingCycle', render: (v) => v ?? '-' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => {
        const colors = { COMPLETED: 'success', PENDING: 'processing', FAILED: 'error', REFUNDED: 'warning' };
        return <Tag color={colors[s] ?? 'default'}>{s}</Tag>;
      },
    },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (v) => (v ? dayjs(v).format('DD/MM/YYYY') : '-') },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          ghost
          title={donor.fullName ?? 'Donor Profile'}
          buttons={[
            <Button key="back" type="default" onClick={() => navigate('/donors')}>
              Back to Donors
            </Button>,
          ]}
        />
      </CardToolbox>
      <Main>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Cards title="Personal Information">
              <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
                <Descriptions.Item label="Full Name">{donor.fullName ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="Email">{donor.email ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="Phone">{donor.phone ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="WhatsApp">{donor.whatsappNumber ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="City">{donor.city ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="Country">{donor.country ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="Postcode">{donor.postcode ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="Gift Aid">
                  <Tag color={donor.giftAidEligible ? 'success' : 'default'}>
                    {donor.giftAidEligible ? 'Eligible' : 'Not Eligible'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Broadcast Opted Out">
                  <Tag color={donor.broadcastOptedOut ? 'error' : 'success'}>
                    {donor.broadcastOptedOut ? 'Yes' : 'No'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Cards>
          </Col>

          <Col xs={24} lg={8}>
            <Cards title="Stats">
              <Row gutter={[0, 16]}>
                <Col span={24}><Statistic title="Total Donated" value={donor.totalDonated ?? 0} precision={2} prefix="£" /></Col>
                <Col span={24}><Statistic title="Donation Count" value={donor.donationCount ?? 0} /></Col>
                <Col span={24}><Statistic title="Active Subscriptions" value={donor.activeSubscriptions ?? 0} /></Col>
              </Row>
              <Divider />
              <PermissionGate permission="DONOR_OPT_OUT">
                <Popconfirm
                  title={donor.broadcastOptedOut ? 'Opt this donor back in to broadcasts?' : 'Opt this donor out of broadcasts?'}
                  onConfirm={handleOptOut}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type={donor.broadcastOptedOut ? 'primary' : 'danger'} block>
                    {donor.broadcastOptedOut ? 'Opt Back In' : 'Opt Out of Broadcasts'}
                  </Button>
                </Popconfirm>
              </PermissionGate>
            </Cards>
          </Col>

          <Col span={24}>
            <Cards title="Donation History">
              <Table
                rowKey="id"
                dataSource={donor.donations ?? []}
                columns={donationColumns}
                pagination={{ pageSize: 10 }}
                size="small"
              />
            </Cards>
          </Col>

          {donor.consentHistory?.length > 0 && (
            <Col span={24}>
              <Cards title="Consent History">
                <Timeline
                  items={(donor.consentHistory ?? []).map((c) => ({
                    key: c.id,
                    color: c.status === 'GRANTED' ? 'green' : 'red',
                    children: (
                      <>
                        <strong>{c.type}</strong> — {c.status} via {c.channel}
                        <span style={{ marginLeft: 12, color: '#999', fontSize: 12 }}>
                          {c.createdAt ? dayjs(c.createdAt).format('DD/MM/YYYY HH:mm') : ''}
                        </span>
                      </>
                    ),
                  }))}
                />
              </Cards>
            </Col>
          )}
        </Row>
      </Main>
    </>
  );
}

export default DonorProfile;

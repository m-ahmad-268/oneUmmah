import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  InputNumber,
  Alert,
  Statistic,
  Spin,
  message,
  Divider,
} from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import { createBroadcast } from '../../../services/broadcastService';
import { getCampaigns } from '../../../services/campaignService';
import instance from '../../../API/axiosInstance';

const { Option } = Select;

const AUDIENCE_TYPES = [
  { value: 'ALL_DONORS', label: 'All Donors' },
  { value: 'PREVIOUS_CAMPAIGN_DONORS', label: 'Previous Campaign Donors' },
  { value: 'COUNTRY_SEGMENT', label: 'Country Segment' },
  { value: 'CUSTOM', label: 'Custom' },
];

function BroadcastForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [audienceType, setAudienceType] = useState('ALL_DONORS');
  const [estimatedRecipients, setEstimatedRecipients] = useState(null);
  const [estimating, setEstimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCampaigns({ status: 'ACTIVE', size: 100 })
      .then((res) => setActiveCampaigns(res?.data?.content ?? res?.data ?? []))
      .catch(() => { });
    getCampaigns({ size: 100 })
      .then((res) => setAllCampaigns(res?.data?.content ?? res?.data ?? []))
      .catch(() => { });
  }, []);

  const estimateRecipients = async () => {
    const values = form.getFieldsValue(['campaignId', 'audienceFilter']);
    if (!values.campaignId) return;
    setEstimating(true);
    try {
      const res = await instance.post('/broadcasts/estimate', {
        campaignId: values.campaignId,
        audienceFilter: values.audienceFilter,
      });
      setEstimatedRecipients(res.data?.data?.totalRecipients ?? res.data?.totalRecipients ?? null);
    } catch {
      setEstimatedRecipients(null);
    } finally {
      setEstimating(false);
    }
  };

  const handleAudienceTypeChange = (v) => {
    setAudienceType(v);
    estimateRecipients();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        campaignId: values.campaignId,
        templateName: values.templateName,
        scheduledAt: values.scheduledAt ? values.scheduledAt.toISOString() : undefined,
        audienceFilter: {
          type: values.audienceType,
          previousCampaignId: values.previousCampaignId,
          countries: values.countries,
          minDonationCount: values.minDonationCount,
          excludeRecentlyContacted: values.excludeRecentlyContacted ?? false,
        },
      };
      await createBroadcast(payload);
      message.success('Broadcast created successfully');
      navigate('/broadcasts');
    } catch (e) {
      message.error(e?.response?.data?.error?.message ?? 'Failed to create broadcast');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CardToolbox>
        <PageHeader
          ghost
          title="New Broadcast"
          buttons={[
            <Button key="back" type="default" onClick={() => navigate('/broadcasts')}>
              Cancel
            </Button>,
          ]}
        />
      </CardToolbox>
      <Main>
        <Cards headless>
          <Alert
            type="warning"
            showIcon
            message="WhatsApp template must be pre-approved before this broadcast can be sent. Approval takes 24-48 hours. Template status will show PENDING_APPROVAL until WhatsApp approves it."
            style={{ marginBottom: 24 }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ maxWidth: 760 }}
          >
            <Divider orientation="left">Broadcast Details</Divider>

            <Form.Item
              label="Broadcast Name"
              name="name"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input placeholder="e.g. Ramadan 2026 Launch" />
            </Form.Item>

            <Form.Item
              label="Campaign"
              name="campaignId"
              rules={[{ required: true, message: 'Campaign is required' }]}
            >
              <Select
                placeholder="Select active campaign"
                onChange={() => estimateRecipients()}
              >
                {activeCampaigns.map((c) => (
                  <Option key={c.campaignId} value={c.campaignId}>{c.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="WhatsApp Template Name"
              name="templateName"
              rules={[{ required: true, message: 'Template name is required' }]}
            >
              <Input placeholder="e.g. ramadan_appeal_2026" />
            </Form.Item>

            <Form.Item label="Scheduled At (leave blank to save as DRAFT)" name="scheduledAt">
              <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
            </Form.Item>

            <Divider orientation="left">Audience Filter</Divider>

            <Form.Item
              label="Audience Type"
              name="audienceType"
              initialValue="ALL_DONORS"
              rules={[{ required: true }]}
            >
              <Select onChange={handleAudienceTypeChange}>
                {AUDIENCE_TYPES.map((t) => (
                  <Option key={t.value} value={t.value}>{t.label}</Option>
                ))}
              </Select>
            </Form.Item>

            {audienceType === 'PREVIOUS_CAMPAIGN_DONORS' && (
              <Form.Item label="Previous Campaign" name="previousCampaignId">
                <Select placeholder="Select campaign">
                  {allCampaigns.map((c) => (
                    <Option key={c.campaignId} value={c.campaignId}>{c.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {audienceType === 'COUNTRY_SEGMENT' && (
              <Form.Item label="Countries" name="countries">
                <Select mode="multiple" placeholder="Select countries" onChange={() => estimateRecipients()}>
                  {/* Countries populated from donor data; add common ones as defaults */}
                  {['UK', 'US', 'CA', 'AU', 'PK', 'BD', 'IN', 'NG', 'EG', 'TR'].map((c) => (
                    <Option key={c} value={c}>{c}</Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item label="Minimum Donation Count (optional)" name="minDonationCount">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="Only include donors with this many donations" onChange={() => estimateRecipients()} />
            </Form.Item>

            <Form.Item label="Exclude Recently Contacted (last 24h)" name="excludeRecentlyContacted" valuePropName="checked">
              <Switch onChange={() => estimateRecipients()} />
            </Form.Item>

            <Divider />

            {estimating ? (
              <div style={{ marginBottom: 16 }}><Spin size="small" /> Estimating recipients...</div>
            ) : estimatedRecipients !== null ? (
              <Statistic
                title="Estimated Recipients"
                value={estimatedRecipients}
                style={{ marginBottom: 16 }}
              />
            ) : null}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} size="large">
                Create Broadcast
              </Button>
            </Form.Item>
          </Form>
        </Cards>
      </Main>
    </>
  );
}

export default BroadcastForm;

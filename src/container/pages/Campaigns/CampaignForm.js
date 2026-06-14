import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  DatePicker,
  Radio,
  Spin,
  message,
  Row,
  Col,
  Divider,
} from 'antd';
import dayjs from 'dayjs';

import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import {
  getCampaignById,
  createCampaign,
  updateCampaign,
} from '../../../services/campaignService';

const { TextArea } = Input;
const { Option } = Select;

const CATEGORIES = ['RAMADAN', 'GAZA', 'SADAQAH', 'ORPHAN', 'WIDOW', 'HIFZ', 'EMERGENCY'];
const BILLING_CYCLES = ['MONTHLY', 'ANNUAL', 'BOTH'];

function CampaignForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [campaignType, setCampaignType] = useState('ONE_TIME');

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getCampaignById(id);
        const c = res?.data ?? res;
        setCampaignType(c.type ?? 'ONE_TIME');
        form.setFieldsValue({
          ...c,
          startDate: c.startDate ? dayjs(c.startDate) : undefined,
          endDate: c.endDate ? dayjs(c.endDate) : undefined,
          amountOptions: c.amountOptions ?? [],
        });
      } catch {
        message.error('Failed to load campaign');
        navigate('/campaigns');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, form, navigate]);

  const handleTypeChange = (e) => {
    setCampaignType(e.target.value);
    if (e.target.value === 'ONE_TIME') {
      form.setFieldValue('billingCycles', undefined);
    }
  };

  const validateAmountOptions = (_, value) => {
    if (!value || value.length === 0) return Promise.reject(new Error('At least one amount option is required'));
    if (value.length > 6) return Promise.reject(new Error('Maximum 6 amount options allowed'));
    const min = form.getFieldValue('minimumAmount') ?? 0;
    const invalid = value.find((v) => Number(v) < Number(min));
    if (invalid) return Promise.reject(new Error(`All amounts must be ≥ minimum amount (£${min})`));
    return Promise.resolve();
  };

  const validateEndDate = (_, value) => {
    const start = form.getFieldValue('startDate');
    if (value && start && value.isBefore(start)) {
      return Promise.reject(new Error('End date must be after start date'));
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        endDate: values.endDate ? values.endDate.toISOString() : undefined,
        billingCycles: campaignType === 'SPONSORSHIP' ? values.billingCycles : undefined,
        amountOptions: (values.amountOptions ?? []).map(Number),
      };
      if (isEdit) {
        await updateCampaign(id, payload);
        message.success('Campaign updated successfully');
      } else {
        await createCampaign(payload);
        message.success('Campaign created successfully');
      }
      navigate('/campaigns');
    } catch (e) {
      const errMsg = e?.response?.data?.error?.message ?? 'Failed to save campaign';
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <CardToolbox>
        <PageHeader
          ghost
          title={isEdit ? 'Edit Campaign' : 'New Campaign'}
          buttons={[
            <Button key="back" type="default" onClick={() => navigate('/campaigns')}>
              Cancel
            </Button>,
          ]}
        />
      </CardToolbox>
      <Main>
        <Cards headless>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ giftAidEligible: true, type: 'ONE_TIME', autoClose: false }}
            style={{ maxWidth: 760 }}
          >
            <Divider orientation="left">Basic Details</Divider>

            <Form.Item label="Campaign Name" name="name" rules={[
              { required: true, message: 'Campaign name is required' },
              { max: 100, message: 'Maximum 100 characters' },
            ]}>
              <Input placeholder="e.g. Ramadan 2026 Appeal" />
            </Form.Item>

            <Form.Item label="Description" name="description" rules={[
              { max: 2000, message: 'Maximum 2000 characters' },
            ]}>
              <TextArea rows={4} placeholder="Optional description" showCount maxLength={2000} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Category is required' }]}>
                  <Select placeholder="Select category">
                    {CATEGORIES.map((c) => <Option key={c} value={c}>{c}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Campaign Type" name="type" rules={[{ required: true }]}>
                  <Radio.Group onChange={handleTypeChange}>
                    <Radio.Button value="ONE_TIME">One-Time</Radio.Button>
                    <Radio.Button value="SPONSORSHIP">Sponsorship</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            {campaignType === 'SPONSORSHIP' && (
              <Form.Item
                label="Billing Cycles"
                name="billingCycles"
                rules={[{ required: true, message: 'Billing cycle is required for Sponsorship campaigns' }]}
              >
                <Select placeholder="Select billing cycle">
                  {BILLING_CYCLES.map((b) => <Option key={b} value={b}>{b}</Option>)}
                </Select>
              </Form.Item>
            )}

            <Divider orientation="left">Amounts</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Minimum Amount (£)" name="minimumAmount" rules={[
                  { required: true, message: 'Minimum amount is required' },
                  { type: 'number', min: 0.01, message: 'Must be at least £0.01' },
                ]}>
                  <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} prefix="£" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Goal Amount (£)" name="goalAmount">
                  <InputNumber min={0} step={1} style={{ width: '100%' }} prefix="£" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Amount Options (up to 6 preset amounts)"
              name="amountOptions"
              rules={[{ validator: validateAmountOptions }]}
              tooltip="Type a number and press Enter to add. All values must be ≥ minimum amount."
            >
              <Select
                mode="tags"
                tokenSeparators={[',']}
                placeholder="e.g. 5, 10, 25, 50, 100"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Divider orientation="left">Settings</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Gift Aid Eligible" name="giftAidEligible" valuePropName="checked">
                  <Switch checkedChildren="Yes" unCheckedChildren="No" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Auto-Close when goal reached" name="autoClose" valuePropName="checked">
                  <Switch checkedChildren="Yes" unCheckedChildren="No" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Start Date" name="startDate">
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="End Date" name="endDate" rules={[{ validator: validateEndDate }]}>
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Media URL (WhatsApp message image)" name="mediaUrl">
              <Input placeholder="https://..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} size="large">
                {isEdit ? 'Save Changes' : 'Create Campaign'}
              </Button>
            </Form.Item>
          </Form>
        </Cards>
      </Main>
    </>
  );
}

export default CampaignForm;

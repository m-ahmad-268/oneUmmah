import React, { useEffect, useState } from 'react';
import { Row, Col, DatePicker, Select, Statistic, Spin, message } from 'antd';
import moment from 'moment';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { getFunnelAnalytics } from '../../../services/analyticsService';
import { getCampaigns } from '../../../services/campaignService';

const { RangePicker } = DatePicker;
const { Option } = Select;

const STEP_LABELS = [
  { key: 'qrScanned', label: 'QR Scanned' },
  { key: 'conversationStarted', label: 'Conversation Started' },
  { key: 'paymentLinkSent', label: 'Payment Link Sent' },
  { key: 'donationCompleted', label: 'Donation Completed' },
];

function dropOff(prev, curr) {
  if (!prev || prev === 0) return null;
  return Math.round(((prev - curr) / prev) * 100);
}

function ConversionFunnel() {
  const [funnel, setFunnel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, 'days'),
    moment(),
  ]);
  const [campaignId, setCampaignId] = useState(undefined);

  useEffect(() => {
    getCampaigns({ size: 100 })
      .then((res) => setCampaigns(res?.data?.content ?? res?.data ?? []))
      .catch(() => {});
  }, []);

  const fetchFunnel = async () => {
    setLoading(true);
    try {
      const params = {
        from: dateRange[0].format('YYYY-MM-DD'),
        to: dateRange[1].format('YYYY-MM-DD'),
      };
      if (campaignId) params.campaignId = campaignId;
      const res = await getFunnelAnalytics(params);
      setFunnel(res?.data ?? res);
    } catch {
      message.error('Failed to load funnel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunnel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, campaignId]);

  return (
    <>
      <CardToolbox>
        <PageHeader ghost title="Conversion Funnel" />
      </CardToolbox>
      <Main>
        <Cards headless>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <RangePicker
              value={dateRange}
              onChange={(v) => v && setDateRange(v)}
              format="DD/MM/YYYY"
            />
            <Select
              allowClear
              placeholder="Campaigns"
              style={{ width: 220 }}
              value={campaignId}
              onChange={setCampaignId}
            >
              {campaigns.map((c) => (
                <Option key={c.campaignId} value={c.campaignId}>{c.name}</Option>
              ))}
            </Select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
          ) : funnel ? (
            <div style={{ maxWidth: 480 }}>
              {STEP_LABELS.map((step, idx) => {
                const value = funnel[step.key] ?? 0;
                const prevKey = idx > 0 ? STEP_LABELS[idx - 1].key : null;
                const prevValue = prevKey ? (funnel[prevKey] ?? 0) : null;
                const drop = prevValue !== null ? dropOff(prevValue, value) : null;
                const maxVal = funnel[STEP_LABELS[0].key] ?? 1;
                const width = `${Math.max(Math.round((value / maxVal) * 100), 5)}%`;

                return (
                  <div key={step.key} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 500 }}>{step.label}</span>
                      <span>
                        <strong>{value.toLocaleString()}</strong>
                        {drop !== null && (
                          <span style={{ color: '#ff4d4f', marginLeft: 12, fontSize: 12 }}>
                            ▼ {drop}% drop-off
                          </span>
                        )}
                      </span>
                    </div>
                    <div style={{ background: '#f0f0f0', borderRadius: 4, height: 28 }}>
                      <div
                        style={{
                          background: idx === STEP_LABELS.length - 1 ? '#52c41a' : '#1890ff',
                          height: '100%',
                          width,
                          borderRadius: 4,
                          transition: 'width 0.4s',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: '#999' }}>No funnel data available.</div>
          )}
        </Cards>
      </Main>
    </>
  );
}

export default ConversionFunnel;

import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, Input, Modal, Statistic, Row, Col, message, Popconfirm } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import PermissionGate from '../../../components/utilities/PermissionGate';
import { getQrCodes, getQrStats, patchQrStatus } from '../../../services/qrCodeService';
import { getCampaigns } from '../../../services/campaignService';

const { Option } = Select;

const STATUS_COLORS = { ACTIVE: 'success', INACTIVE: 'default' };

function QRCodes() {
  const [qrCodes, setQrCodes] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ campaignId: undefined, status: undefined, placementCity: '' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const [statsModal, setStatsModal] = useState({ visible: false, data: null, loading: false });

  const fetchQrCodes = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page: page - 1, size: 20, ...filters };
      if (!params.campaignId) delete params.campaignId;
      if (!params.status) delete params.status;
      if (!params.placementCity) delete params.placementCity;
      const res = await getQrCodes(params);
      const list = res?.data?.content ?? res?.data ?? [];
      const total = res?.data?.totalElements ?? list.length;
      setQrCodes(list);
      setPagination((p) => ({ ...p, current: page, total }));
    } catch {
      message.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCampaigns({ status: 'ACTIVE', size: 100 })
      .then((res) => setCampaigns(res?.data?.content ?? res?.data ?? []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    fetchQrCodes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const openStats = async (id) => {
    setStatsModal({ visible: true, data: null, loading: true });
    try {
      const res = await getQrStats(id);
      setStatsModal({ visible: true, data: res?.data ?? res, loading: false });
    } catch {
      message.error('Failed to load QR stats');
      setStatsModal({ visible: false, data: null, loading: false });
    }
  };

  const handleToggleStatus = async (record) => {
    const newStatus = record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await record?.qrId && patchQrStatus(record.qrId, newStatus);
      message.success(`QR code ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
      fetchQrCodes(pagination.current);
    } catch {
      message.error('Failed to update status');
    }
  };

  const columns = [
    { title: 'Reference', dataIndex: 'qrReference', key: 'qrReference' },
    {
      title: 'Campaign',
      dataIndex: ['campaign', 'name'],
      key: 'campaign',
      render: (_, record) => record.campaign?.name ?? record.campaignName ?? '-',
    },
    { title: 'Placement Label', dataIndex: 'placementLabel', key: 'placementLabel' },
    { title: 'City', dataIndex: 'placementCity', key: 'placementCity' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={STATUS_COLORS[s] ?? 'default'}>{s}</Tag>,
    },
    { title: 'Total Scans', dataIndex: 'totalScans', key: 'totalScans', align: 'right' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" type="default" onClick={() => record?.qrId && openStats(record.qrId)}>
            View Stats
          </Button>
          {record?.qrImageUrl && (
            <Button size="small" type="default">
              <a href={record.qrImageUrl} download target="_blank" rel="noreferrer">
                Download
              </a>
            </Button>
          )}
          <PermissionGate permission="QR_MANAGE">
            <Popconfirm
              title={`${record.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} this QR code?`}
              onConfirm={() => handleToggleStatus(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" type={record.status === 'ACTIVE' ? 'danger' : 'primary'}>
                {record.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </Button>
            </Popconfirm>
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader ghost title="QR Codes" />
      </CardToolbox>
      <Main>
        <Cards headless>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <Select
              allowClear
              placeholder="Filter by Campaign"
              style={{ width: 220 }}
              value={filters.campaignId}
              onChange={(v) => setFilters((f) => ({ ...f, campaignId: v }))}
            >
              {campaigns.map((c) => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
            <Select
              allowClear
              placeholder="Filter by Status"
              style={{ width: 160 }}
              value={filters.status}
              onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            >
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
            </Select>
            <Input
              placeholder="Search by city"
              style={{ width: 180 }}
              value={filters.placementCity}
              onChange={(e) => setFilters((f) => ({ ...f, placementCity: e.target.value }))}
              allowClear
            />
          </div>

          <Table
            rowKey="qrId"
            loading={loading}
            dataSource={qrCodes}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: fetchQrCodes,
            }}
          />
        </Cards>
      </Main>

      <Modal
        title="QR Code Stats"
        open={statsModal.visible}
        onCancel={() => setStatsModal({ visible: false, data: null, loading: false })}
        footer={null}
        width={520}
      >
        {statsModal.loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
        ) : statsModal.data ? (
          <Row gutter={16}>
            <Col span={12}><Statistic title="Total Scans" value={statsModal.data.totalScans ?? 0} /></Col>
            <Col span={12}><Statistic title="Unique Scans" value={statsModal.data.uniqueScans ?? 0} /></Col>
            <Col span={12} style={{ marginTop: 16 }}><Statistic title="Conversations Started" value={statsModal.data.conversationsStarted ?? 0} /></Col>
            <Col span={12} style={{ marginTop: 16 }}><Statistic title="Donations Completed" value={statsModal.data.donationsCompleted ?? 0} /></Col>
            <Col span={12} style={{ marginTop: 16 }}><Statistic title="Total Amount Raised (£)" value={statsModal.data.totalAmountRaised ?? 0} precision={2} prefix="£" /></Col>
            <Col span={12} style={{ marginTop: 16 }}><Statistic title="Conversion Rate" value={statsModal.data.conversionRate ?? 0} precision={1} suffix="%" /></Col>
          </Row>
        ) : null}
      </Modal>
    </>
  );
}

export default QRCodes;

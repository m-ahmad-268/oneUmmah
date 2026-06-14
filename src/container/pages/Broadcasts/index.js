import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import PermissionGate from '../../../components/utilities/PermissionGate';
import { getBroadcasts, sendBroadcast, cancelBroadcast } from '../../../services/broadcastService';

const STATUS_COLORS = {
  DRAFT: 'default',
  SCHEDULED: 'processing',
  SENDING: 'blue',
  SENT: 'success',
  CANCELLED: 'warning',
};

const TEMPLATE_STATUS_COLORS = {
  PENDING_APPROVAL: 'processing',
  APPROVED: 'success',
  REJECTED: 'error',
};

function BroadcastsList() {
  const navigate = useNavigate();
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchBroadcasts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getBroadcasts({ page: page - 1, size: 20 });
      const list = res?.data?.content ?? res?.data ?? [];
      const total = res?.data?.totalElements ?? list.length;
      setBroadcasts(list);
      setPagination((p) => ({ ...p, current: page, total }));
    } catch {
      message.error('Failed to load broadcasts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts(1);
  }, []);

  const handleSend = async (id) => {
    try {
      await sendBroadcast(id);
      message.success('Broadcast sent successfully');
      fetchBroadcasts(pagination.current);
    } catch (e) {
      message.error(e?.response?.data?.error?.message ?? 'Failed to send broadcast');
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelBroadcast(id);
      message.success('Broadcast cancelled');
      fetchBroadcasts(pagination.current);
    } catch {
      message.error('Failed to cancel broadcast');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Campaign',
      key: 'campaign',
      render: (_, r) => r.campaign?.name ?? r.campaignName ?? '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={STATUS_COLORS[s] ?? 'default'}>{s}</Tag>,
    },
    { title: 'Template Name', dataIndex: 'templateName', key: 'templateName' },
    {
      title: 'Template Status',
      dataIndex: 'templateStatus',
      key: 'templateStatus',
      render: (s) => s ? <Tag color={TEMPLATE_STATUS_COLORS[s] ?? 'default'}>{s}</Tag> : '-',
    },
    { title: 'Recipients', dataIndex: 'totalRecipients', key: 'totalRecipients', align: 'right' },
    {
      title: 'Sent / Delivered / Read',
      key: 'delivery',
      render: (_, r) => `${r.numSent ?? 0} / ${r.numDelivered ?? 0} / ${r.numRead ?? 0}`,
    },
    {
      title: 'Scheduled At',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      render: (v) => (v ? dayjs(v).format('DD/MM/YYYY HH:mm') : 'Draft'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const canSend =
          (record.status === 'DRAFT' || record.status === 'SCHEDULED') &&
          record.templateStatus === 'APPROVED';
        const canCancel = record.status === 'DRAFT' || record.status === 'SCHEDULED';
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="small" type="default" onClick={() => record?.broadcastId && navigate(`/broadcasts/${record.broadcastId}/stats`)}>
              View Stats
            </Button>
            <PermissionGate permission="BROADCAST_SEND">
              {canSend && (
                <Popconfirm
                  title={`Send to ${record.totalRecipients ?? 0} recipients? Template: ${record.templateName}`}
                  onConfirm={() => record?.broadcastId && handleSend(record.broadcastId)}
                  okText="Send"
                  cancelText="Cancel"
                >
                  <Button size="small" type="primary">Send</Button>
                </Popconfirm>
              )}
              {canCancel && (
                <Popconfirm
                  title="Cancel this broadcast?"
                  onConfirm={() => record?.broadcastId && handleCancel(record.broadcastId)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button size="small" type="danger">Cancel</Button>
                </Popconfirm>
              )}
            </PermissionGate>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          ghost
          title="Broadcasts"
          buttons={[
            <PermissionGate key="create" permission="BROADCAST_CREATE">
              <Button type="primary" onClick={() => navigate('/broadcasts/new')}>
                + New Broadcast
              </Button>
            </PermissionGate>,
          ]}
        />
      </CardToolbox>
      <Main>
        <Cards headless>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={broadcasts}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: fetchBroadcasts,
            }}
            scroll={{ x: 900 }}
          />
        </Cards>
      </Main>
    </>
  );
}

export default BroadcastsList;

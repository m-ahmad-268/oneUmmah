import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Space, Select, Skeleton, Popconfirm, message, Row, Col } from 'antd';
import UilPlus from '@iconscout/react-unicons/icons/uil-plus';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import PermissionGate from '../../../components/utilities/PermissionGate';
import {
  getCampaigns,
  deleteCampaign,
  patchCampaignStatus,
} from '../../../services/campaignService';

const { Option } = Select;

const STATUS_COLORS = {
  DRAFT: 'default',
  ACTIVE: 'success',
  PAUSED: 'warning',
  CLOSED: 'error',
  SCHEDULED: 'processing',
};

const STATUS_OPTIONS = ['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'SCHEDULED'];
const TYPE_OPTIONS = ['ONE_TIME', 'SPONSORSHIP'];
const CATEGORY_OPTIONS = ['RAMADAN', 'GAZA', 'SADAQAH', 'ORPHAN', 'WIDOW', 'HIFZ', 'EMERGENCY'];

function CampaignsList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: undefined, type: undefined, category: undefined });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchData = useCallback(async (page = 1, pageSize = 20, f = filters) => {
    setLoading(true);
    try {
      const res = await getCampaigns({
        status: f.status,
        type: f.type,
        category: f.category,
        page: page - 1,
        size: pageSize,
      });
      const list = res?.data?.content ?? res?.data ?? res ?? [];
      const total = res?.data?.totalElements ?? list.length;
      setData(list);
      setPagination((p) => ({ ...p, current: page, pageSize, total }));
    } catch (e) {
      message.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchData(); }, []);

  const handleFilterChange = (key) => (val) => {
    const next = { ...filters, [key]: val || undefined };
    setFilters(next);
    fetchData(1, pagination.pageSize, next);
  };

  const handleTableChange = (pag) => {
    fetchData(pag.current, pag.pageSize);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Campaign?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ff4d4f',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCampaign(id);
          message.success('Campaign deleted');
          fetchData(pagination.current, pagination.pageSize);
        } catch {
          message.error('Failed to delete campaign');
        }
      }
    });
  };

  const handleStatusChange = async (id, status) => {
    try {
      await patchCampaignStatus(id, status);
      message.success(`Campaign ${status.toLowerCase()}d`);
      fetchData(pagination.current, pagination.pageSize);
    } catch {
      message.error('Failed to update campaign status');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span
          style={{ cursor: 'pointer', color: '#3da7dc', fontWeight: 500 }}
          onClick={() => navigate(`/campaigns/${record.id}`)}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (val) => (
        <Tag color={val === 'SPONSORSHIP' ? 'blue' : 'cyan'}>
          {val?.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val) => <Tag color={STATUS_COLORS[val] ?? 'default'}>{val}</Tag>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Min Amount (£)',
      dataIndex: 'minimumAmount',
      key: 'minimumAmount',
      render: (val) => `£${Number(val ?? 0).toFixed(2)}`,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (val) => (val ? dayjs(val).format('DD MMM YYYY') : '—'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (val) => (val ? dayjs(val).format('DD MMM YYYY') : '—'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            type="default"
            onClick={() => record?.campaignId && navigate(`/campaigns/${record.campaignId}`)}
            title="View"
          >
            <UilEye size={14} />
          </Button>

          <PermissionGate permission="CAMPAIGN_EDIT">
            {(record.status === 'DRAFT' || record.status === 'PAUSED') && (
              <Button
                size="small"
                type="primary"
                onClick={() => record?.campaignId && navigate(`/campaigns/${record.campaignId}/edit`)}
                title="Edit"
              >
                <UilEdit size={14} />
              </Button>
            )}
          </PermissionGate>

          <PermissionGate permission="CAMPAIGN_LAUNCH">
            {record.status === 'DRAFT' || record.status === 'SCHEDULED' ? (
              <Popconfirm
                title="Launch this campaign? This will send live WhatsApp messages."
                onConfirm={() => record?.campaignId && handleStatusChange(record.campaignId, 'ACTIVE')}
                okText="Launch"
                okType="primary"
              >
                <Button size="small" type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                  Launch
                </Button>
              </Popconfirm>
            ) : null}
            {record.status === 'ACTIVE' ? (
              <Popconfirm
                title="Pause this campaign?"
                onConfirm={() => record?.campaignId && handleStatusChange(record.campaignId, 'PAUSED')}
                okText="Pause"
              >
                <Button size="small" style={{ background: '#fa8b0c', borderColor: '#fa8b0c', color: '#fff' }}>
                  Pause
                </Button>
              </Popconfirm>
            ) : null}
            {(record.status === 'ACTIVE' || record.status === 'PAUSED') ? (
              <Popconfirm
                title="Close this campaign permanently?"
                onConfirm={() => record?.campaignId && handleStatusChange(record.campaignId, 'CLOSED')}
                okText="Close"
                okType="danger"
              >
                <Button size="small" danger>
                  Close
                </Button>
              </Popconfirm>
            ) : null}
          </PermissionGate>

          <PermissionGate permission="CAMPAIGN_DELETE">
            {record.status !== 'ACTIVE' && (
              <Button
                size="small"
                danger
                onClick={() => record?.campaignId && handleDelete(record.campaignId)}
                title="Delete"
              >
                <UilTrashAlt size={14} />
              </Button>
            )}
          </PermissionGate>
        </Space>
      ),
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          ghost
          title="Campaigns"
          buttons={[
            <PermissionGate key="create" permission="CAMPAIGN_CREATE">
              <Button type="primary" size="default" onClick={() => navigate('/campaigns/new')}>
                <UilPlus /> New Campaign
              </Button>
            </PermissionGate>,
          ]}
        />
      </CardToolbox>
      <Main>
        <Cards headless>
          <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
            <Col>
              <Select
                allowClear
                placeholder="Filter by Status"
                style={{ width: 180 }}
                onChange={handleFilterChange('status')}
              >
                {STATUS_OPTIONS.map((s) => (
                  <Option key={s} value={s}>{s}</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                allowClear
                placeholder="Filter by Type"
                style={{ width: 180 }}
                onChange={handleFilterChange('type')}
              >
                {TYPE_OPTIONS.map((t) => (
                  <Option key={t} value={t}>{t.replace('_', ' ')}</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                allowClear
                placeholder="Filter by Category"
                style={{ width: 180 }}
                onChange={handleFilterChange('category')}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <Option key={c} value={c}>{c}</Option>
                ))}
              </Select>
            </Col>
          </Row>

          {loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <Table
              dataSource={data}
              columns={columns}
              rowKey="id"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} campaigns`,
              }}
              onChange={handleTableChange}
              scroll={{ x: 900 }}
            />
          )}
        </Cards>
      </Main>
    </>
  );
}

export default CampaignsList;

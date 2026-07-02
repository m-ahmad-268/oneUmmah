import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Space, Select, Skeleton, message, Row, Col } from 'antd';
import UilPlus from '@iconscout/react-unicons/icons/uil-plus';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import dayjs from 'dayjs';

import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import PermissionGate from '../../../components/utilities/PermissionGate';
import { getCampaigns } from '../../../services/campaignService';

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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span
          style={{ cursor: 'pointer', color: '#3da7dc', fontWeight: 500 }}
          onClick={() => navigate(`/campaigns/${record.campaignId}`)}
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
        <Tag style={{ backgroundColor: val === 'SPONSORSHIP' ? '#1890ff' : '#13c2c2' }}>
          {val?.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val) => <Tag style={{ backgroundColor: '#fa8c16' }}>{val}</Tag>,
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
        <Button
          size="small"
          type="default"
          onClick={() => record?.campaignId && navigate(`/campaigns/${record.campaignId}`)}
          title="View"
        >
          <UilEye size={14} />
        </Button>
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

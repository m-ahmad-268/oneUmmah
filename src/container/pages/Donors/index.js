import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Select, Input, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import PermissionGate from '../../../components/utilities/PermissionGate';
import { getDonors, patchDonorOptOut } from '../../../services/donorService';

const { Option } = Select;

function DonorsList() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', country: undefined, optedOut: undefined });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [countries, setCountries] = useState([]);

  const fetchDonors = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page: page - 1, size: 20, ...filters };
      if (!params.search) delete params.search;
      if (params.country === undefined) delete params.country;
      if (params.optedOut === undefined) delete params.optedOut;
      const res = await getDonors(params);
      const list = res?.data?.content ?? res?.data ?? [];
      const total = res?.data?.totalElements ?? list.length;
      setDonors(list);
      setPagination((p) => ({ ...p, current: page, total }));
      // Build unique country list from results
      const uniqueCountries = [...new Set(list.map((d) => d.country).filter(Boolean))];
      setCountries((prev) => [...new Set([...prev, ...uniqueCountries])]);
    } catch {
      message.error('Failed to load donors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleOptOut = async (record) => {
    const newOptOut = !record.broadcastOptedOut;
    try {
      if (!record?.donorId) return;
      await patchDonorOptOut(record.donorId, newOptOut);
      message.success(`Donor ${newOptOut ? 'opted out' : 'opted back in'} successfully`);
      fetchDonors(pagination.current);
    } catch {
      message.error('Failed to update opt-out status');
    }
  };

  const columns = [
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'WhatsApp Number', dataIndex: 'whatsappNumber', key: 'whatsappNumber' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    {
      title: 'Gift Aid Eligible',
      dataIndex: 'giftAidEligible',
      key: 'giftAidEligible',
      render: (v) => <Tag color={v ? 'success' : 'default'}>{v ? 'Yes' : 'No'}</Tag>,
    },
    {
      title: 'Opted Out',
      dataIndex: 'broadcastOptedOut',
      key: 'broadcastOptedOut',
      render: (v) => <Tag color={v ? 'error' : 'success'}>{v ? 'Yes' : 'No'}</Tag>,
    },
    {
      title: 'Last Contact',
      dataIndex: 'lastContact',
      key: 'lastContact',
      render: (v) => (v ? dayjs(v).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" type="default" onClick={() => record?.donorId && navigate(`/donors/${record.donorId}`)}>
            View Profile
          </Button>
          <PermissionGate permission="DONOR_OPT_OUT">
            <Popconfirm
              title={`${record.broadcastOptedOut ? 'Opt this donor back in?' : 'Opt this donor out of broadcasts?'}`}
              onConfirm={() => handleOptOut(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" type={record.broadcastOptedOut ? 'primary' : 'danger'}>
                {record.broadcastOptedOut ? 'Opt In' : 'Opt Out'}
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
        <PageHeader ghost title="Donors" />
      </CardToolbox>
      <Main>
        <Cards headless>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <Input
              placeholder="Search by name, email, phone..."
              style={{ width: 260 }}
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              allowClear
            />
            <Select
              allowClear
              placeholder="Filter by Country"
              style={{ width: 180 }}
              value={filters.country}
              onChange={(v) => setFilters((f) => ({ ...f, country: v }))}
            >
              {countries.map((c) => (
                <Option key={c} value={c}>{c}</Option>
              ))}
            </Select>
            <Select
              allowClear
              placeholder="Opted Out"
              style={{ width: 160 }}
              value={filters.optedOut}
              onChange={(v) => setFilters((f) => ({ ...f, optedOut: v }))}
            >
              <Option value={false}>Opted In</Option>
              <Option value={true}>Opted Out</Option>
            </Select>
          </div>

          <Table
            rowKey="donorId"
            loading={loading}
            dataSource={donors}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: fetchDonors,
            }}
             scroll={{ x: 1000 }}
          />
        </Cards>
      </Main>
    </>
  );
}

export default DonorsList;

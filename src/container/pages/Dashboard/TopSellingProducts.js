import React from 'react';
import { Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { TopSellerWrap } from '../../../layout/Style';
import { BorderLessHeading, TableDefaultStyle } from '../../styled';

const TopSellingProduct = React.memo(({ topCampaigns }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Campaign',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span
          style={{ color: '#3da7dc', fontWeight: 500, cursor: 'pointer' }}
          onClick={() => navigate(`/campaigns/${record.campaignId}`)}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Conversations',
      dataIndex: 'conversations',
      key: 'conversations',
      align: 'right',
      sorter: (a, b) => a.conversations - b.conversations,
    },
    {
      title: 'Donors',
      dataIndex: 'donors',
      key: 'donors',
      align: 'right',
      sorter: (a, b) => a.donors - b.donors,
    },
    {
      title: 'Amount Raised',
      dataIndex: 'totalRaised',
      key: 'totalRaised',
      align: 'right',
      render: (v) => `£${Number(v ?? 0).toFixed(2)}`,
      sorter: (a, b) => a.totalRaised - b.totalRaised,
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      align: 'right',
      render: (v) => (
        <Tag color={v > 0 ? 'success' : 'default'}>{`${Number(v ?? 0).toFixed(1)}%`}</Tag>
      ),
    },
  ];

  const dataSource = (topCampaigns ?? []).map((c) => ({ ...c, key: c.campaignId }));

  return (
    <div className="full-width-table">
      <BorderLessHeading>
        <Cards title="Top Campaigns" size="large">
          <TableDefaultStyle className="ninjadash-having-header-bg">
            <TopSellerWrap>
              <div className="table-bordered top-seller-table table-responsive">
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  size="small"
                />
              </div>
            </TopSellerWrap>
          </TableDefaultStyle>
        </Cards>
      </BorderLessHeading>
    </div>
  );
});

export default TopSellingProduct;

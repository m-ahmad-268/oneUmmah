// src/container/pages/DecorExtras.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Tag, Space, message, Modal, Image } from 'antd';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import DecorExtraFormModal from './DecorExtraFormModal';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';

function DecorExtras() {
  const [extrasData, setExtrasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExtra, setEditingExtra] = useState(null);

  const accessToken = localStorage.getItem('access_token_admin');

  // Fetch all extras and their options
  const fetchExtras = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}decorExtras/getAllExtrasData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.code === 200 && data.status === 'OK' && Array.isArray(data.result)) {
        setExtrasData(data.result.map(item => ({ ...item, key: item.serExtrasId })));
      } else {
        message.error(data.message || 'Failed to fetch extras');
        setExtrasData([]);
      }
    } catch (e) {
      console.error('Error fetching extras:', e);
      setError(e.message);
      message.error(`Failed to load extras: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchExtras();
  }, [fetchExtras]);

  const showAddModal = () => {
    setEditingExtra(null);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingExtra(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: `Do you want to delete the extra '${record.txtExtrasName}'?`,
      content: 'This will also delete all of its options. This action cannot be undone.',
      centered: true,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        const deleteEndpoint = `${process.env.REACT_APP_API_URL}decorExtras/deleteById`;
        try {
          const response = await fetch(deleteEndpoint, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: record.serExtrasId }),
          });
          const data = await response.json();
          if (data.code === 200) {
            message.success(data.message || 'Extra deleted successfully');
            fetchExtras();
          } else {
            throw new Error(data.message || 'Failed to delete extra');
          }
        } catch (err) {
          console.error('Delete error:', err);
          message.error(err.message || 'Failed to delete extra.');
        }
      },
    });
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingExtra(null);
    fetchExtras();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingExtra(null);
  };

  // Columns for the nested (options) table
  const optionsColumns = [
    {
      title: 'Option Code',
      dataIndex: 'txtOptionCode',
      key: 'txtOptionCode',
    },
    {
      title: 'Option Name',
      dataIndex: 'txtOptionName',
      key: 'txtOptionName',
    },
    {
      title: 'Active',
      dataIndex: 'blnIsActive',
      key: 'blnIsActive',
      render: (isActive) => <Tag color={isActive ? 'Green' : 'Red'}>{isActive ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Document',
      dataIndex: 'document',
      key: 'document',
      render: (document) => {
        if (!document) return 'N/A';
        // if (!originalName) return 'N/A';
        // const imageUrl = `${process.env.REACT_APP_API_URL}decorExtras/getImage?originalName=${originalName}`;
        return <Image width={50} src={document?.txtDocumentUrl} alt={document?.originalName} />;
      },
    },
  ];

  // Columns for the main (extras) table
  const extrasColumns = [
    {
      title: 'Code',
      dataIndex: 'txtExtrasCode',
      key: 'txtExtrasCode',
    },
    {
      title: 'Name',
      dataIndex: 'txtExtrasName',
      key: 'txtExtrasName',
    },
    {
      title: 'Price',
      dataIndex: 'numPrice',
      key: 'numPrice',
    },
    {
      title: 'Active',
      dataIndex: 'blnIsActive',
      key: 'blnIsActive',
      render: (isActive) => <Tag color={isActive ? 'Green' : 'Red'}>{isActive ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'action',
      width: '180px',
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => showEditModal(record)}
            title="Edit Extra"
          >
            <UilEdit />
          </Button>
          {/* <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => handleDelete(record)}
            title="Delete Extra"
          >
            <UilTrashAlt />
          </Button> */}
        </Space>
      ),
    },
  ];

  const breadcrumb = [
    {
      path: '/admin',
      breadcrumbName: 'Dashboard',
    },
    {
      path: '',
      breadcrumbName: 'Decor Extras',
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          className="ninjadash-page-header-main"
          ghost
          title="Decor Extras"
          subTitle={
            <>
              <span className="title-counter">{extrasData.length} Extras </span>
            </>
          }
          buttons={[
            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
              + Add New Extra
            </Button>,
          ]}
        />
      </CardToolbox>
      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading decor extras...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={extrasColumns}
                  dataSource={extrasData}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: true }}
                  expandable={{
                    expandedRowRender: (record) => (
                      <Table
                        columns={optionsColumns}
                        dataSource={record.decorExtrasOptions.map(option => ({ ...option, key: option.serExtraOptionId }))}
                        pagination={false}
                        showHeader={true}
                      />
                    ),
                    rowExpandable: (record) => record.decorExtrasOptions && record.decorExtrasOptions.length > 0,
                  }}
                />
              )}
            </Cards>
          </Col>
        </Row>
      </Main>
      <DecorExtraFormModal
        visible={isModalVisible}
        initialData={editingExtra}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      />
    </>
  );
}

export default DecorExtras;
// src/container/pages/DecorServices.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Tag, Space, message, Modal, Image } from 'antd';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import DecorServiceFormModal from './DecorServiceFormModal';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';

function DecorServices() {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const accessToken = localStorage.getItem('access_token_admin');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}decorExtras/getAllServicesData`, {
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
        setServicesData(data.result.map(item => ({ ...item, key: item.serExtrasId })));
      } else {
        message.error(data.message || 'Failed to fetch services');
        setServicesData([]);
      }
    } catch (e) {
      console.error('Error fetching services:', e);
      setError(e.message);
      message.error(`Failed to load services: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const showAddModal = () => {
    setEditingService(null);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingService(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: `Do you want to delete the service '${record.txtExtrasName}'?`,
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
            message.success(data.message || 'Service deleted successfully');
            fetchServices();
          } else {
            throw new Error(data.message || 'Failed to delete service');
          }
        } catch (err) {
          console.error('Delete error:', err);
          message.error(err.message || 'Failed to delete service.');
        }
      },
    });
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingService(null);
    fetchServices();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingService(null);
  };

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
        return <Image width={50} src={document?.txtDocumentUrl} alt={document?.originalName} />;
      },
    },
  ];

  const servicesColumns = [
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
            title="Edit Service"
          >
            <UilEdit />
          </Button>
          {/* <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => handleDelete(record)}
            title="Delete Service"
          >
            <UilTrashAlt />
          </Button> */}
        </Space>
      ),
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          className="ninjadash-page-header-main"
          ghost
          title="Service"
          subTitle={
            <>
              <span className="title-counter">{servicesData.length} Service </span>
            </>
          }
          buttons={[
            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
              + Add New Service
            </Button>,
          ]}
        />
      </CardToolbox>
      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading services...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={servicesColumns}
                  dataSource={servicesData}
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
      <DecorServiceFormModal
        visible={isModalVisible}
        initialData={editingService}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      />
    </>
  );
}

export default DecorServices;

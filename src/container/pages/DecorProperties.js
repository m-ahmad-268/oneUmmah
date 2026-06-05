// src/container/pages/DecorProperties.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Tag, Space, message, Modal } from 'antd';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import DecorPropertyFormModal from './DecorPropertyFormModal'; // We will create this next
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';

function DecorProperties() {
  const [propertyData, setPropertyData] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Store all categories for the form
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const accessToken = localStorage.getItem('access_token_admin');

  // This function fetches all categories and then flattens the property data
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}decorCategoryMaster/getAllDecorMasterData`, {
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
        setAllCategories(data.result); // Store all categories for the form

        // Flatten the nested data structure
        const flattenedProperties = data.result.flatMap(category =>
          category.categoryProperties.map(property => ({
            ...property,
            // Add parent category details to each property for easy access
            parentCategory: {
              serDecorCategoryId: category.serDecorCategoryId,
              txtDecorCategoryCode: category.txtDecorCategoryCode,
              txtDecorCategoryName: category.txtDecorCategoryName,
            },
            key: property.serPropertyId, // Unique key for Ant Design Table
          }))
        );
        setPropertyData(flattenedProperties);
      } else {
        message.error(data.message || 'Failed to fetch decor properties');
        setPropertyData([]);
      }
    } catch (e) {
      console.error('Error fetching properties:', e);
      setError(e.message);
      message.error(`Failed to load properties: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const showAddModal = () => {
    setEditingProperty(null);
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingProperty(record);
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setEditingProperty(record);
    setIsViewMode(true);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: `Do you want to delete the property '${record.txtPropertyName}'?`,
      content: 'This action cannot be undone.',
      centered: true,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}decorCategoryPropertyMaster/deleteById`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ id: `${record.serPropertyId}` }),
          });

          const data = await response.json();
          if (data.code === 200) {
            message.success(data.message || 'Property deleted successfully');
            fetchProperties(); // Re-fetch data to update the table
          } else {
            throw new Error(data.message || 'Failed to delete property');
          }
        } catch (err) {
          console.error('Delete error:', err);
          message.error(err.message || 'Failed to delete property.');
        }
      },
    });
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingProperty(null);
    fetchProperties(); // Re-fetch data after successful save/update
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingProperty(null);
  };

  const columns = [
    {
      title: 'Property Name',
      dataIndex: 'txtPropertyName',
      key: 'txtPropertyName',
      sorter: (a, b) => a.txtPropertyName.localeCompare(b.txtPropertyName),
    },
    {
      title: 'Category Name',
      dataIndex: ['parentCategory', 'txtDecorCategoryName'],
      key: 'parentCategoryName',
      sorter: (a, b) => a.parentCategory.txtDecorCategoryName.localeCompare(b.parentCategory.txtDecorCategoryName),
    },
    {
      title: 'Input Type',
      dataIndex: 'txtInputType',
      key: 'txtInputType',
    },
    {
      title: 'Price',
      dataIndex: 'numPrice',
      key: 'numPrice',
      sorter: (a, b) => a.numPrice.localeCompare(b.numPrice),
    },
    {
      title: 'Required',
      dataIndex: 'blnIsRequired',
      key: 'blnIsRequired',
      render: (isRequired) => <Tag color={isRequired ? 'volcano' : 'cyan'}>{isRequired ? 'Yes' : 'No'}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'blnIsActive',
      key: 'blnIsActive',
      render: (isActive) => <Tag color={isActive ? 'Green' : 'Red'}>{isActive ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      width: '220px',
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => showViewModal(record)}
            title="View Details"
          >
            <UilEye />
          </Button>
          <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => showEditModal(record)}
            title="Edit Property"
          >
            <UilEdit />
          </Button>
          {/* <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => handleDelete(record)}
            title="Delete Property"
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
      breadcrumbName: 'Decor Properties',
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          className="ninjadash-page-header-main"
          ghost
          title="Decor Items"
          subTitle={
            <>
              <span className="title-counter">{propertyData.length} Items </span>
            </>
          }
          buttons={[
            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
              + Add New Property
            </Button>,
          ]}
        />
      </CardToolbox>

      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading decor properties...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={columns}
                  dataSource={propertyData}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: true }}
                />
              )}
            </Cards>
          </Col>
        </Row>
      </Main>

      <DecorPropertyFormModal
        visible={isModalVisible}
        initialData={editingProperty}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        allCategories={allCategories}
        isViewMode={isViewMode}
      />
    </>
  );
}

export default DecorProperties;
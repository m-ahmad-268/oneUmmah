// src/container/pages/Decors.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Tag, Space, message, Modal } from 'antd';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import DecorFormModal from './DecorFormModal'; // We will create this next
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';

export function useDeleteConfirmation(fetchDataAfterDelete) {
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem('access_token_admin');

  const showDeleteConfirm = async ({ name, id, endpoint, type, fullRecord }) => {
    Modal.confirm({
      title: `Do you want to delete ${name}?`,
      content: 'This action cannot be undone.',
      centered: true,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true);
        try {
          await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ id: `${id}` }), // send string ID
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);

              if (data.code !== 200) throw new Error(data.message || 'Delete failed');
              message.success(data.message || 'Deleted successfully');
            });

          window.location.reload();
        } catch (err) {
          console.error('Delete error:', err);
          message.error(err.message || 'Failed to delete.');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return { showDeleteConfirm, loading };
}

function Decors() {
  const [decorData, setDecorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allExistingCodes, setAllExistingCodes] = useState([]); // To manage unique codes

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDecor, setEditingDecor] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const accessToken = localStorage.getItem('access_token_admin');

  const fetchDecors = useCallback(async () => {
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
        // Filter out unnecessary data before setting state
        const essentialData = data.result.map(decor => ({
          serDecorCategoryId: decor.serDecorCategoryId,
          txtDecorCategoryCode: decor.txtDecorCategoryCode,
          txtDecorCategoryName: decor.txtDecorCategoryName,
          numPrice: decor.numPrice,
          blnIsActive: decor.blnIsActive,
          referenceDocuments: [] // Set this as an empty array to match the desired payload
        }));

        setDecorData(essentialData);
        const codes = essentialData.map((decor) => decor.txtDecorCategoryCode);
        setAllExistingCodes(codes);
      } else {
        message.error(data.message || 'Failed to fetch decor categories');
        setDecorData([]);
      }
    } catch (e) {
      console.error('Error fetching decors:', e);
      setError(e.message);
      message.error(`Failed to load decors: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const { showDeleteConfirm } = useDeleteConfirmation(fetchDecors);

  useEffect(() => {
    fetchDecors();
  }, [fetchDecors]);

  const showAddModal = () => {
    setEditingDecor(null); // Clear any previous data
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingDecor(record);
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setEditingDecor(record);
    setIsViewMode(true);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingDecor(null);
    fetchDecors(); // Re-fetch data after successful save/update
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingDecor(null);
  };

  const handleDelete = (record) => {
    showDeleteConfirm({
      name: `${record.txtDecorCategoryName} Category`,
      id: record.serDecorCategoryId,
      endpoint: `${process.env.REACT_APP_API_URL}decorCategoryMaster/deleteById`,
      type: 'decor', // <- triggers cascade logic
      fullRecord: record, // needed for nested deletion
    });
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'txtDecorCategoryCode',
      key: 'txtDecorCategoryCode',
      sorter: (a, b) => a.txtDecorCategoryCode.localeCompare(b.txtDecorCategoryCode),
    },
    {
      title: 'Name',
      dataIndex: 'txtDecorCategoryName',
      key: 'txtDecorCategoryName',
      sorter: (a, b) => a.txtDecorCategoryName.localeCompare(b.txtDecorCategoryName),
    },{
      title: 'Price',
      dataIndex: 'numPrice',
      key: 'numPrice',
      sorter: (a, b) => a.numPrice.localeCompare(b.numPrice),
    },
    {
      title: 'Status',
      dataIndex: 'blnIsActive',
      key: 'blnIsActive',
      render: (isActive) => <Tag color={isActive ? 'Green' : 'Red'}>{isActive ? 'Active' : 'Inactive'}</Tag>,
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.blnIsActive === value,
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
            title="Edit Event"
          >
            <UilEdit />
          </Button>
          {/* <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => handleDelete(record)}
            title="Delete Event"
          >
            <UilTrashAlt />
          </Button> */}
        </Space>
      ),
    },
  ];

  const decorTableData = decorData.map((decor) => ({
    ...decor,
    key: decor.serDecorCategoryId, // Ant Design table needs a unique key
  }));

  const breadcrumb = [
    {
      path: '/admin',
      breadcrumbName: 'Dashboard',
    },
    {
      path: '',
      breadcrumbName: 'Decors',
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          className="ninjadash-page-header-main"
          ghost
          title="Decor Categories"
          subTitle={
            <>
              <span className="title-counter">{decorData.length} Categories </span>
            </>
          }
          buttons={[
            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
              + Add New Decor Category
            </Button>,
          ]}
        />
      </CardToolbox>

      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading decor categories...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={columns}
                  dataSource={decorTableData}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: true }}
                />
              )}
            </Cards>
          </Col>
        </Row>
      </Main>

      {/* The Decor Form Modal */}
      <DecorFormModal
        visible={isModalVisible}
        initialData={editingDecor}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        allExistingCodes={allExistingCodes}
        isViewMode={isViewMode}
      />
    </>
  );
}

export default Decors;
// src/container/pages/Vendors.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Tag, Space, message } from 'antd';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import VendorFormModal from './VendorFormModal';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';
import { useDeleteConfirmation } from '../../components/hooks/useDeleteConfirmation';

function Vendors() {
  const [vendorData, setVendorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allExistingVendorCodes, setAllExistingVendorCodes] = useState([]); // State to store all unique vendor codes

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null); // Stores vendor data for editing
  const [isViewMode, setIsViewMode] = useState(false); // State for view mode
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const accessToken = localStorage.getItem('access_token_admin');

  // Function to fetch vendor data (wrapped in useCallback for memoization)
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}vendorMaster/getAllData`, {
        method: 'POST', // Assuming POST with empty body as per other APIs
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
      console.log(data);

      if (data.code === 200 && data.status === 'OK' && Array.isArray(data.result)) {
        setVendorData(data.result);

        // Extract all unique vendor codes
        const codes = new Set();
        data.result.forEach((vendor) => {
          if (vendor.txtVendorCode) {
            codes.add(vendor.txtVendorCode);
          }
        });
        setAllExistingVendorCodes(Array.from(codes)); // Convert Set to Array
      } else {
        throw new Error(data.message || 'Invalid data format received');
      }
    } catch (e) {
      setError(e.message);
      message.error(`Failed to load vendors: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const { showDeleteConfirm } = useDeleteConfirmation(fetchVendors);

  // Initial data fetch on component mount
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Handlers for modal
  const showAddModal = () => {
    setEditingVendor(null); // Clear any previous editing data for a new item
    setIsViewMode(false); // Ensure not in view mode
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingVendor(record); // Set data for editing
    setIsViewMode(false); // Ensure not in view mode
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setEditingVendor(record); // Pass the record to display
    setIsViewMode(true); // Set to view mode
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingVendor(null); // Clear editing data on cancel
    setIsViewMode(false); // Reset view mode state
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingVendor(null); // Clear editing data on success
    setIsViewMode(false); // Reset view mode state
    fetchVendors(); // Refresh the table after add/edit
  };

  const handleDelete = (record) => {
    showDeleteConfirm({
      name: `${record.txtVendorName}`,
      id: record.serVendorId,
      endpoint: `${process.env.REACT_APP_API_URL}vendorMaster/deleteById`,
    });
  };

  // Define table columns
  const columns = [
    {
      title: 'Sr #',
      dataIndex: 'Sr #',
      key: 'Sr #',
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1, // Continuous iteration number across pages
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Vendor Code',
      dataIndex: 'txtVendorCode',
      key: 'txtVendorCode',
      sorter: (a, b) => a.txtVendorCode.localeCompare(b.txtVendorCode),
    },
    {
      title: 'Vendor Name',
      dataIndex: 'txtVendorName',
      key: 'txtVendorName',
      sorter: (a, b) => a.txtVendorName.localeCompare(b.txtVendorName),
    },
    {
      title: 'Vendor Type',
      dataIndex: 'enmVendorType',
      key: 'enmVendorType',
      render: (type) => <Tag color="Green">{type}</Tag>,
      sorter: (a, b) => a.enmVendorType.localeCompare(b.enmVendorType),
    },
    {
      title: 'Phone Number',
      dataIndex: 'txtPhoneNumber',
      key: 'txtPhoneNumber',
    },
    {
      title: 'Status',
      dataIndex: 'blnIsActive',
      key: 'blnIsActive',
      render: (isActive) => (
        <span
          style={{
            backgroundColor: isActive ? '#d4edda' : '#f8d7da',
            color: isActive ? '#155724' : '#721c24',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            display: 'inline-block',
          }}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
      sorter: (a, b) => (a.blnIsActive === b.blnIsActive ? 0 : a.blnIsActive ? -1 : 1),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
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
            title="Edit Vendor"
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

  // Prepare data for the Ant Design Table
  const vendorTableData = vendorData.map((vendor) => ({
    ...vendor,
    key: vendor.serVendorId, // Use unique ID for the key
  }));

  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Dashboard',
    },
    {
      path: '',
      breadcrumbName: 'Vendors',
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          className="ninjadash-page-header-main"
          ghost
          title="Vendors"
          subTitle={
            <>
              <span className="title-counter">{vendorData.length} Vendors </span>
            </>
          }
          buttons={[
            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
              + Add New Vendor
            </Button>,
          ]}
        />
      </CardToolbox>

      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading vendors...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={columns}
                  dataSource={vendorTableData}
                  // pagination={{ pageSize: 10 }}
                  pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                      setPagination({ current: page, pageSize });
                    },
                    onShowSizeChange: (current, size) => {
                      setPagination({ current: 1, pageSize: size });
                    },
                  }}
                  scroll={{ x: true }}
                />
              )}
            </Cards>
          </Col>
        </Row>
      </Main>

      {/* The Vendor Form Modal */}
      <VendorFormModal
        visible={isModalVisible}
        initialData={editingVendor}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        allExistingVendorCodes={allExistingVendorCodes} // Pass all existing codes for validation
        isViewMode={isViewMode}
      />
    </>
  );
}

export default Vendors;

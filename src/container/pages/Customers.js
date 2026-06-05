// src/container/pages/Customers.js

import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { Row, Col, Table, Tag, Space, message } from 'antd'; // Import message for notifications
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';
// import { Link } from 'react-router-dom'; // Link is no longer needed for the Add button

import CustomerFormModal from './CustomerFormModal';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
// import Heading from '../../components/heading/heading'; // Heading not directly used here
import { Button } from '../../components/buttons/buttons';
import { useDeleteConfirmation } from '../../components/hooks/useDeleteConfirmation';
import { useParams } from 'react-router-dom';
import { render } from '@testing-library/react';

function Customers() {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const accessToken = localStorage.getItem('access_token_admin');

  // State for modal visibility and data
  const [isViewMode, setViewMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null); // Stores customer data for editing


  const { id } = useParams();

  // useEffect(() => {
  //   debugger
  //   if (id) {
  //     openCustomerDetailModal(id); // show modal if ID exists
  //   }
  // }, [id]);

  // Function to fetch customer data (wrapped in useCallback for memoization)
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}customerMaster/getAllData`, {
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
      // console.log(data);

      if (data.code === 200 && data.status === 'OK' && Array.isArray(data.result)) {
        setCustomerData(data.result);
        // console.log(data.result);
      } else {
        throw new Error(data.message || 'Invalid data format received');
      }
    } catch (e) {
      setError(e.message);
      message.error(`Failed to load customers: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, so it's memoized once

  const { showDeleteConfirm } = useDeleteConfirmation(fetchCustomers);

  // Initial data fetch on component mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]); // Depend on fetchCustomers

  // Handlers for modal
  const showAddModal = () => {
    setViewMode(false);
    setEditingCustomer(null); // Clear any previous editing data
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingCustomer(record); // Set data for editing
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingCustomer(null); // Clear editing data on cancel
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingCustomer(null); // Clear editing data on success
    fetchCustomers(); // Refresh the table after add/edit
  };

  const handleDelete = (record) => {
    showDeleteConfirm({
      name: `${record.txtCustName} Category`,
      id: record.serCustId,
      endpoint: `${process.env.REACT_APP_API_URL}customerMaster/deleteById`,
    });
  };

  // Define table columns
  const columns = [
    {
      title: 'Sr #',
      dataIndex: 'Sr #',
      key: 'Sr #',
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1, // Continuous iteration number across pages
    },
    {
      title: 'Cusotmer Code',
      dataIndex: 'txtCustCode',
      key: 'txtCustCode',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => {
        const nameA = `${a.txtFirstName || ''} ${a.txtLastName || ''}`;
        const nameB = `${b.txtFirstName || ''} ${b.txtLastName || ''}`;
        return nameA.localeCompare(nameB);
      },
      render: (text, record) => `${record.txtFirstName || ''} ${record.txtLastName || ''}`, // Combine first and last name
    },
    {
      title: 'Email',
      dataIndex: 'txtEmail',
      key: 'txtEmail',
      render: (text, record) => `${record.txtEmail.substring(0, 15)}${record?.txtEmail?.length > 15 ? "..." : ""}`,
    },
    {
      title: 'Phone Number',
      dataIndex: 'txt_phone_number_1',
      key: 'txt_phone_number_1',
    },
    // {
    //   title: 'Role',
    //   dataIndex: 'role',
    //   key: 'role',
    //   render: () => <span>Customer</span>, // Always 'Customer' for this page
    // },
    {
      title: 'Status',
      dataIndex: 'blnIsActive',
      key: 'blnIsActive',
      render: (isActive) => (
        <span
          style={{
            backgroundColor: isActive ? '#d4edda' : '#f8d7da', // Light green for active, light red for deactivated
            color: isActive ? '#155724' : '#721c24', // Dark green text for active, dark red for deactivated
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            display: 'inline-block', // Ensures padding and background apply correctly
          }}
        >
          {isActive ? 'Active' : 'Deactivated'}
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
            onClick={() => {
              setViewMode(true);
              showEditModal(record)
              // console.log('View', record)
            }

            }
            title="View Details"
          >
            <UilEye />
          </Button>
          <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => {
              setViewMode(false);
              showEditModal(record)
            }} // <--- Changed to open edit modal
            title="Edit Customer"
          >
            <UilEdit />
          </Button>
          {/* <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => handleDelete(record)}
            title="Delete Customer"
          >
            <UilTrashAlt />
          </Button> */}
        </Space>
      ),
    },
  ];

  // Prepare data for the Ant Design Table
  const customerTableData = customerData.map((customer) => ({
    ...customer, // Spread all original properties
    key: customer.serCustId, // Use a unique ID for the key
    // The render functions in columns will handle displaying combined names, roles, and status
  }));

  // Filtered data for search
  const filteredCustomerData = customerTableData.filter(
    (customer) =>
      customer.txtFirstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.txtLastName?.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.txtEmail?.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.txt_phone_number_1?.includes(searchText),
  );

  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Dashboard',
    },
    {
      path: '',
      breadcrumbName: 'Customers',
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          className="ninjadash-page-header-main"
          ghost
          title="Customers"
          subTitle={
            <>
              <span className="title-counter">{customerData.length} Customers </span>
            </>
          }
          buttons={[
            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
              {' '}
              {/* <--- Changed to open add modal */}+ Add New Customer
            </Button>,
          ]}
        />
      </CardToolbox>

      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading customers...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={columns}
                  dataSource={filteredCustomerData}
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

      {/* The Customer Form Modal */}
      <CustomerFormModal
        visible={isModalVisible}
        initialData={editingCustomer}
        onCancel={handleModalCancel}
        isViewMode={isViewMode}
        onOk={handleModalOk} // This will trigger fetchCustomers in parent
      />
    </>
  );
}

export default Customers;

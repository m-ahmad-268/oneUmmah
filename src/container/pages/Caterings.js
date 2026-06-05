// src/container/pages/Caterings.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Tag, Space, message } from 'antd';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import CateringFormModal from './CateringFormModal';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';
import { useDeleteConfirmation } from '../../components/hooks/useDeleteConfirmation';

function Caterings() {
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allExistingFoodCodes, setAllExistingFoodCodes] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const accessToken = localStorage.getItem('access_token_admin');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Helper to determine food type string from boolean flags
  const getFoodTypeString = (foodItem) => {
    if (foodItem.blnIsMainCourse) return 'MainCourse';
    if (foodItem.blnIsAppetiser) return 'Appetiser';
    if (foodItem.blnIsStarter) return 'Starter';
    if (foodItem.blnIsSaladAndCondiment) return 'SaladAndCondiment';
    if (foodItem.blnIsDessert) return 'Dessert';
    if (foodItem.blnIsDrink) return 'Drink';
    return 'Unknown';
  };

  // Function to fetch food data (wrapped in useCallback for memoization)
  const fetchFoods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}menuFoodMaster/getAllFoodsByType`, {
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
      console.log(data);

      if (data.code === 200 && data.status === 'OK' && data.result) {
        const flattenedFoodItems = [];
        const codes = new Set();

        // FIX: Replaced for...in loop with Object.keys().forEach()
        Object.keys(data.result).forEach((typeKey) => {
          const foodItemsOfType = data.result[typeKey];
          if (Array.isArray(foodItemsOfType)) {
            foodItemsOfType.forEach((foodItem) => {
              flattenedFoodItems.push(foodItem);
              if (foodItem.txtMenuFoodCode) {
                codes.add(foodItem.txtMenuFoodCode);
              }
            });
          }
        });
        setFoodData(flattenedFoodItems);
        setAllExistingFoodCodes(Array.from(codes));
      } else {
        throw new Error(data.message || 'Invalid data format received');
      }
    } catch (e) {
      setError(e.message);
      message.error(`Failed to load food items: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const { showDeleteConfirm } = useDeleteConfirmation(fetchFoods);

  // Initial data fetch on component mount
  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  // Handlers for modal
  const showAddModal = () => {
    setEditingFood(null);
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingFood(record);
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setEditingFood(record);
    setIsViewMode(true);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingFood(null);
    setIsViewMode(false);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingFood(null);
    setIsViewMode(false);
    fetchFoods();
  };

  const handleDelete = (record) => {
    showDeleteConfirm({
      name: `${record.txtMenuFoodName} from Food Menu`,
      id: record.serMenuFoodId,
      endpoint: `${process.env.REACT_APP_API_URL}menuFoodMaster/deleteById`,
    });
  };

  // Define table columns
  const columns = [
    {
      title: 'Sr #',
      dataIndex: 'iteration',
      key: 'iteration',
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1, // Continuous iteration number across pages
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Food Code',
      dataIndex: 'txtMenuFoodCode',
      key: 'txtMenuFoodCode',
      sorter: (a, b) => a.txtMenuFoodCode.localeCompare(b.txtMenuFoodCode),
    },
    {
      title: 'Type',
      key: 'type',
      render: (text, record) => {
        const typeString = getFoodTypeString(record);
        let color = 'default';
        switch (typeString) {
          case 'MainCourse':
            color = 'Blue';
            break;
          case 'Appetiser':
            color = 'Green';
            break;
          case 'Starter':
            color = 'Purple';
            break;
          case 'SaladAndCondiment':
            color = 'Cyan';
            break;
          case 'Dessert':
            color = 'Magenta';
            break;
          case 'Drink':
            color = 'Orange';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{typeString}</Tag>;
      },
      sorter: (a, b) => getFoodTypeString(a).localeCompare(getFoodTypeString(b)),
    },
    {
      title: 'Food Name',
      dataIndex: 'txtMenuFoodName',
      key: 'txtMenuFoodName',
      sorter: (a, b) => a.txtMenuFoodName.localeCompare(b.txtMenuFoodName),
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
            title="Edit Food Item"
          >
            <UilEdit />
          </Button>
          <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => handleDelete(record)}
            title="Delete Event"
          >
            <UilTrashAlt />
          </Button>
        </Space>
      ),
    },
  ];

  // Prepare data for the Ant Design Table
  const foodTableData = foodData.map((foodItem) => ({
    ...foodItem,
    key: foodItem.serMenuFoodId,
  }));

  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Dashboard',
    },
    {
      path: '',
      breadcrumbName: 'Caterings',
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          className="ninjadash-page-header-main"
          ghost
          title="Food Menu"
          subTitle={
            <>
              <span className="title-counter">{foodData.length} Items </span>
            </>
          }
          buttons={[
            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
              + Add New Food Item
            </Button>,
          ]}
        />
      </CardToolbox>

      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading food items...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={columns}
                  dataSource={foodTableData}
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

      {/* The Catering Form Modal */}
      <CateringFormModal
        visible={isModalVisible}
        initialData={editingFood}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        allExistingFoodCodes={allExistingFoodCodes}
        isViewMode={isViewMode}
      />
    </>
  );
}

export default Caterings;

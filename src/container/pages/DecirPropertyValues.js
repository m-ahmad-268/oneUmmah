// src/container/pages/DecorPropertyValues.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Tag, Space, message, Modal, Image, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';

import DecorPropertyValueFormModal from './DecorPropertyValueFormModal';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';
import { SET_DECOR_SEARCH_QUERY, SET_DECOR_SEARCH_PAGINATION } from '../../redux/decorSearch/actions';
import { searchDecorPropertyValueByKeyword } from '../../services/commonService';

function DecorPropertyValues() {
  const dispatch = useDispatch();
  const { searchQuery, pagination } = useSelector((state) => state.decorSearch);

  const [propertyValuesData, setPropertyValuesData] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPropertyValue, setEditingPropertyValue] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // debouncedQuery is initialised from Redux so first fetch on re-mount uses
  // the persisted search term immediately (no 500ms delay on navigation back).
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const accessToken = localStorage.getItem('access_token_admin');

  // Debounce — 500ms, same as food menu
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      // Reset to page 1 only when the user actually changes the query
      dispatch({
        type: SET_DECOR_SEARCH_PAGINATION,
        payload: { ...pagination, current: 1 },
      });
    }, 500);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Fetch paginated/searched results
  const fetchPropertyValues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const req = {
        q: debouncedQuery,
        page: pagination.current - 1,
        size: pagination.pageSize,
      };
      const data = await searchDecorPropertyValueByKeyword(req);
      if (data?.code === 200 && data?.result?.content) {
        const arr = data.result.content.flatMap(x =>
          x.categoryProperties?.flatMap(y =>
            y.propertyValues?.map(z => ({
              ...z,
              parentProperty: {
                serPropertyId: y.serPropertyId,
                txtInputType: y.txtInputType,
                txtDescription: y.txtDescription,
                txtPropertyValue: y.txtPropertyValue,
              },
              txtPropertyName: y?.txtPropertyName ?? 'helo',
              txtDecorCategoryName: x?.txtDecorCategoryName ?? 'helo',
            })) || []
          ) || []
        );
        setPropertyValuesData(
          arr
        );
        // setPropertyValuesData(
        //   data.result.content.map((v) => ({ ...v, key: v.serDecorPropertyValueId })),
        // );
        // setTotalItems(data.result.totalElements);
        setTotalItems(arr.length);
      } else {
        setPropertyValuesData([]);
        setTotalItems(0);
      }
    } catch (e) {
      console.error('Error fetching property values:', e);
      setError(e.message);
      message.error(`Failed to load property values: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, pagination]);

  useEffect(() => {
    fetchPropertyValues();
  }, [fetchPropertyValues]);

  // Separate fetch for allProperties — used only by the modal select box.
  // Kept on the existing getAllDecorMasterData endpoint, unaffected by search.
  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}decorCategoryMaster/getAllDecorMasterData`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({}),
          },
        );
        if (!response.ok) return;
        const data = await response.json();
        if (data.code === 200 && data.status === 'OK' && Array.isArray(data.result)) {
          const flattenedProperties = data.result.flatMap((category) =>
            category.categoryProperties.map((property) => ({
              ...property,
              parentCategory: {
                serDecorCategoryId: category.serDecorCategoryId,
                txtDecorCategoryCode: category.txtDecorCategoryCode,
                txtDecorCategoryName: category.txtDecorCategoryName,
              },
              key: property.serPropertyId,
            })),
          );
          setAllProperties(flattenedProperties);
        }
      } catch (e) {
        console.error('Error fetching all properties for modal:', e);
      }
    };
    fetchAllProperties();
  }, [accessToken]);

  const showAddModal = () => {
    setEditingPropertyValue(null);
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingPropertyValue(record);
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setEditingPropertyValue(record);
    setIsViewMode(true);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: `Do you want to delete the value '${record.txtPropertyValue}'?`,
      content: 'This action cannot be undone.',
      centered: true,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        const deleteEndpoint = `${process.env.REACT_APP_API_URL}decorCategoryPropertyValue/deleteById`;
        try {
          const response = await fetch(deleteEndpoint, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: `${Number(record.serPropertyValueId)}` }),
          });
          const data = await response.json();
          if (data.code === 200) {
            message.success(data.message || 'Property value deleted successfully');
            fetchPropertyValues();
          } else {
            throw new Error(data.message || 'Failed to delete property value');
          }
        } catch (err) {
          console.error('Delete error:', err);
          message.error(err.message || 'Failed to delete property value.');
        }
      },
    });
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingPropertyValue(null);
    fetchPropertyValues();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingPropertyValue(null);
  };

  const columns = [
    {
      title: 'Category',
      // dataIndex: ['parentCategory', 'txtDecorCategoryName'],
      // dataIndex: ['parentCategory', 'txtDecorCategoryName'],
      // key: 'parentCategoryName',
      dataIndex: 'txtDecorCategoryName',
      key: 'txtDecorCategoryName',
      sorter: (a, b) =>
        a.txtDecorCategoryName.localeCompare(b.txtDecorCategoryName),
      // a.parentCategory.txtDecorCategoryName.localeCompare(b.parentCategory.txtDecorCategoryName),
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Property',
      // dataIndex: ['parentProperty', 'txtPropertyName'],
      // key: 'parentPropertyName',
      dataIndex: 'txtPropertyName',
      key: 'txtPropertyName',
      sorter: (a, b) =>
        // a.parentProperty.txtPropertyName.localeCompare(b.parentProperty.txtPropertyName),
        a.txtPropertyName.localeCompare(b.txtPropertyName),
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Value',
      dataIndex: 'txtPropertyValue',
      key: 'txtPropertyValue',
      sorter: (a, b) => a.txtPropertyValue.localeCompare(b.txtPropertyValue),
    },
    {
      title: 'Image',
      dataIndex: 'document',
      key: 'image',
      render: (document) => {
        if (!document) return null;
        return (
          <Image width={50} src={document?.txtDocumentUrl} alt={document?.originalName || 'Image'} />
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'blnIsActive',
      key: 'blnIsActive',
      render: (isActive) => (
        <Tag color={isActive ? 'Green' : 'Red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
      ),
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
            title="Edit Property Value"
          >
            <UilEdit />
          </Button>
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
          title="Item Values"
          subTitle={<span className="title-counter">{totalItems} Values</span>}
          buttons={[
            <div
              key="header-actions"
              className="page-header-actions"
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Input
                placeholder="Search..."
                style={{
                  height: '40px',
                  backgroundColor: '#fff',
                  borderColor: '#d9d9d9',
                  boxShadow: 'none',
                }}
                value={searchQuery}
                onChange={(e) =>
                  dispatch({ type: SET_DECOR_SEARCH_QUERY, payload: e.target.value })
                }
                allowClear
                onClear={() => {
                  dispatch({ type: SET_DECOR_SEARCH_QUERY, payload: '' });
                  dispatch({
                    type: SET_DECOR_SEARCH_PAGINATION,
                    payload: { current: 1, pageSize: 10 },
                  });
                }}
              />
              <Button className="btn-add_new" size="default" type="primary" onClick={showAddModal}>
                + Add New Property Value
              </Button>
            </div>,
          ]}
        />
      </CardToolbox>

      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading decor property values...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={columns}
                  dataSource={propertyValuesData}
                  pagination={true}
                  // pagination={{
                  //   ...pagination,
                  //   total: totalItems,
                  //   showSizeChanger: false,
                  //   onChange: (page, pageSize) =>
                  //     dispatch({
                  //       type: SET_DECOR_SEARCH_PAGINATION,
                  //       payload: { current: page, pageSize },
                  //     }),
                  // }}
                  scroll={{ x: true }}
                />
              )}
            </Cards>
          </Col>
        </Row>
      </Main>

      <DecorPropertyValueFormModal
        visible={isModalVisible}
        initialData={editingPropertyValue}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        allProperties={allProperties}
        isViewMode={isViewMode}
      />
    </>
  );
}

export default DecorPropertyValues;

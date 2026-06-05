// src/container/pages/Caterings.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Tag, Space, message, Select, Input } from 'antd';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';
import { useDeleteConfirmation } from '../../components/hooks/useDeleteConfirmation';
import { getAllItemRoles, getAllItemsTree, getAllMenuItemRoles, getAllMenuType, searchMenuItemByKeyword } from '../../services/commonService';
import MenuFoodItem from './MenuFoodItem';

function MenuManagement() {
    const [foodData, setFoodData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allExistingFoodCodes, setAllExistingFoodCodes] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [arrTypes, setArrTypes] = useState([]);
    const [arrItemRole, setArrItemRole] = useState([]);
    const [arrItems, setArrItems] = useState([]);
    const [activeType, setActiveType] = useState('ITEM');
    const [editingFood, setEditingFood] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    const accessToken = localStorage.getItem('access_token_admin');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [totalItems, setTotalItems] = useState(0);

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
            const response = await fetch(`${process.env.REACT_APP_API_URL}admin/menu/getAllRoles`, {
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

    const fetchItems = async () => {
        try {
            setLoading(true);
            const req = {
                q: debouncedQuery,
                page: pagination.current - 1,
                size: pagination.pageSize,
            };
            const data = await searchMenuItemByKeyword(req);
            if (data && data?.code == 200 && data?.result) {
                if (data.result?.content && data.result.content?.length) {
                    setArrItems(data.result.content);
                    setTotalItems(data.result.totalElements);
                } else {
                    setArrItems([]);
                    setTotalItems(0);
                }
            } else {
                setArrItems([]);
                setTotalItems(0);
            }
            setLoading(false);
        } catch (error) {
            console.log('Server Error', error?.message);
            setLoading(false);
        }
    };

    const getRoleByItem = async () => {
        try {

            const data = await getAllMenuItemRoles();
            if (data && data?.code == 200 && data?.result && data?.result?.length) {
                const arr = data.result.map((x, index) => {
                    return {
                        ...x,
                        id: x?.serMenuItemRoleId,
                        label: x?.txtRoleName
                    }
                });

                setArrItemRole(arr);
            }

        } catch (error) {
            console.log('Server Error', error?.message);

        }
    };

    const getAllFoodsByType = async () => {
        try {
            const response = await getAllMenuType();
            if (response && response?.code == 200 && response?.result && response?.result?.length) {

                const arr = response.result.map((x, index) => {
                    return {
                        id: index + 1,
                        label: x,
                    }
                })
                setArrTypes([...arr]);
            }

        } catch (error) {
            console.log('Server Error', error?.message);
            setLoading(false);
        }
    };

    const { showDeleteConfirm } = useDeleteConfirmation(fetchFoods);
    useEffect(() => {
        if (activeType)
            console.log('Server', activeType);


    }, [activeType]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
            setPagination(prev => ({ ...prev, current: 1 }));
        }, 500);
        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        fetchItems();
    }, [debouncedQuery, pagination]);

    // Initial data fetch on component mount
    useEffect(() => {
        // fetchFoods();
        getRoleByItem();
        getAllFoodsByType();
    }, []);

    // Handlers for modal
    const showAddModal = () => {
        setEditingFood(null);
        setIsViewMode(false);
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        console.log('Server Error', record);
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
        fetchItems();
    };

    const handleDelete = (record) => {
        showDeleteConfirm({
            name: `${record.txtMenuFoodName} from Food Menu`,
            id: record.serMenuFoodId,
            endpoint: `${process.env.REACT_APP_API_URL}menuFoodMaster/deleteById`,
        });
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    // Define table columns
    const columns = [
        // {
        //     title: 'Sr #',
        //     dataIndex: 'iteration',
        //     key: 'iteration',
        //     render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1, // Continuous iteration number across pages
        //     // render: (text, record, index) => index + 1,
        // },
        {
            title: 'Item Code',
            dataIndex: 'txtCode',
            key: 'txtCode',
            // sorter: (a, b) => a.txtMenuFoodCode.localeCompare(b.txtCode),
            sorter: (a, b) => (a.txtCode || '').localeCompare(b.txtCode || ''),
        },
        {
            title: 'Item Name',
            dataIndex: 'txtName',
            key: 'txtName',
            // sorter: (a, b) => a.txtMenuFoodCode.localeCompare(b.txtName),
        },
        {
            title: 'Item Role',
            dataIndex: 'txtRole',
            key: 'txtRole',
            // sorter: (a, b) => a.txtMenuFoodCode.localeCompare(b.txtType),
        },
        {
            title: 'Price',
            dataIndex: 'numPrice',
            key: 'numPrice',
            // sorter: (a, b) => a.txtMenuFoodCode.localeCompare(b.txtType),
        },
        // {
        //     title: 'Type',
        //     key: 'type',
        //     render: (text, record) => {
        //         const typeString = getFoodTypeString(record);
        //         let color = 'default';
        //         switch (typeString) {
        //             case 'MainCourse':
        //                 color = 'Blue';
        //                 break;
        //             case 'Appetiser':
        //                 color = 'Green';
        //                 break;
        //             case 'Starter':
        //                 color = 'Purple';
        //                 break;
        //             case 'SaladAndCondiment':
        //                 color = 'Cyan';
        //                 break;
        //             case 'Dessert':
        //                 color = 'Magenta';
        //                 break;
        //             case 'Drink':
        //                 color = 'Orange';
        //                 break;
        //             default:
        //                 color = 'default';
        //         }
        //         return <Tag color={color}>{typeString}</Tag>;
        //     },
        //     sorter: (a, b) => getFoodTypeString(a).localeCompare(getFoodTypeString(b)),
        // },
        // {
        //     title: 'Food Name',
        //     dataIndex: 'txtMenuFoodName',
        //     key: 'txtMenuFoodName',
        //     sorter: (a, b) => a.txtMenuFoodName.localeCompare(b.txtMenuFoodName),
        // },
        {
            title: 'Multiple Items',
            dataIndex: 'blnIsCompostie',
            key: 'blnIsCompostie',
            render: (blnIsCompostie) => (
                <span
                    style={{
                        // backgroundColor: blnIsCompositionRole ? '#d4edda' : '#f8d7da',
                        // color: blnIsCompositionRole ? '#155724' : '#721c24',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        // fontWeight: 'bold',
                        display: 'inline-block',
                    }}
                >
                    {blnIsCompostie ? 'Yes' : 'No'}
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
    const foodTableData = arrItems.map((foodItem) => ({
        ...foodItem,
        key: foodItem.serMenuItemId,
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
                    title="Items"
                    subTitle={
                        <>
                            <span className="title-counter">{totalItems} Items </span>
                        </>
                    }
                    buttons={[
                        <div className="page-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Input
                                placeholder='Search...'
                                style={{
                                    height: '40px',
                                    backgroundColor: "#ffff",
                                    borderColor: "#d9d9d9",
                                    boxShadow: "none",
                                }}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                allowClear
                            />
                            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
                                Add {activeType ? capitalizeFirstLetter(activeType) : ''}
                            </Button>
                        </div>,
                    ]}
                />
            </CardToolbox >

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
                                        total: totalItems,
                                        showSizeChanger: false,
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
            <MenuFoodItem
                visible={isModalVisible}
                initialData={editingFood}
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                allExistingFoodCodes={allExistingFoodCodes}
                isViewMode={isViewMode}
                allTypes={arrTypes}
                type={activeType}
                itemRoles={arrItemRole}
            />
        </>
    );
}

export default MenuManagement;

// src/container/pages/Caterings.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Space, message, Select, Form, Input, Switch, Button } from 'antd';
const { Option } = Select;
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { useDeleteConfirmation } from '../../components/hooks/useDeleteConfirmation';
import { getAllItemRoles, getAllItemsTree, getAllMenuType, getAllRoles, saveOrUpdateRoles } from '../../services/commonService';
import { StyledFullModal } from './customer-modal-style';

function MenuCategory() {
    const [form] = Form.useForm();
    const [foodData, setFoodData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allExistingFoodCodes, setAllExistingFoodCodes] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [arrTypes, setArrTypes] = useState([]);
    const [arrItemRole, setArrItemRole] = useState([]);
    const [arrItems, setArrItems] = useState([]);
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

    const getAllItems = async () => {
        try {
            setLoading(true);
            const data = await getAllRoles();
            if (data && data?.code == 200 && data?.result && data?.result?.length) {
                // const arr = data.result.map((x, index) => {
                //     return {
                //         id: index + 1,
                //         label: x
                //     }
                // });

                setArrItems(data.result);
            }

            setLoading(false);
        } catch (error) {
            console.log('Server Error', error?.message);
            setLoading(false);

        }
    };

    const getRoleByItem = async () => {
        try {

            const data = await getAllItemRoles();
            if (data && data?.code == 200 && data?.result && data?.result?.length) {
                const arr = data.result.map((x, index) => {
                    return {
                        id: index + 1,
                        label: x
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

    // Initial data fetch on component mount
    useEffect(() => {
        // fetchFoods();
        // getRoleByItem();
        // getAllFoodsByType();
        getAllItems();
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
        getAllItems();
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

    // Populate form when modal opens for edit/view
    useEffect(() => {
        if (isModalVisible) {
            if (editingFood) {
                form.setFieldsValue({
                    txtRoleCode: editingFood.txtRoleCode || '',
                    txtRoleName: editingFood.txtRoleName || '',
                    parentMenuRoleId: editingFood.parentMenuRoleId ?? null,
                    blnIsCompositionRole: editingFood.blnIsCompositionRole === true,
                    blnIsActive: editingFood.blnIsActive !== false,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    parentMenuRoleId: null,
                    blnIsCompositionRole: false,
                    blnIsActive: true,
                });
            }
        }
    }, [isModalVisible, editingFood, form, arrItems]);

    const handleSubmit = async (values) => {
        if (isViewMode) {
            message.info('You are in view mode. Cannot submit changes.');
            return;
        }
        // TODO: Wire up with save/update API once available
        try {
            setLoading(true);

            const payload = editingFood?.serMenuItemRoleId ?
                {
                    serMenuItemRoleId: editingFood.serMenuItemRoleId,
                    ...values,
                } : {
                    ...values,
                };
            const data = await saveOrUpdateRoles(payload);
            if (data && data?.code == 200) {
                handleModalOk();
                message.success(`Category ${editingFood ? 'updated' : 'created'} successfully!.`);
            } else {
                message.error(data?.message || 'failure in saving data!');
            }

            setLoading(false);


        } catch (error) {
            message.error(error?.message || 'Something went wrong!');
            setLoading(false);
        }
    };

    const isEditMode = !!editingFood;

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
            title: 'Category Code',
            dataIndex: 'txtRoleCode',
            key: 'txtRoleCode',
            // sorter: (a, b) => a.txtMenuFoodCode.localeCompare(b.txtRoleCode),
            sorter: (a, b) => (a.txtRoleCode || '').localeCompare(b.txtRoleCode || ''),
        },
        {
            title: 'Category Name',
            dataIndex: 'txtRoleName',
            key: 'txtRoleName',
            // sorter: (a, b) => a.txtMenuFoodCode.localeCompare(b.txtRoleName),
        },
        // {
        //     title: 'Type',
        //     dataIndex: 'txtType',
        //     key: 'txtType',
        //     sorter: (a, b) => a.txtMenuFoodCode.localeCompare(b.txtType),
        // },
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
            dataIndex: 'blnIsCompositionRole',
            key: 'blnIsCompositionRole',
            render: (blnIsCompositionRole) => (
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
                    {blnIsCompositionRole ? 'Yes' : 'No'}
                </span>
            ),
            // sorter: (a, b) => (a.blnIsActive === b.blnIsActive ? 0 : a.blnIsActive ? -1 : 1),
        },
        {
            title: 'Active',
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
                        style={{ color: '#a0a0a0', fontSize: '12px', padding: '0 4px', backgroundColor: 'transparent' }}
                        onClick={() => showViewModal(record)}
                        title="View Details"
                    >
                        <UilEye size={16} />
                    </Button>
                    <Button
                        className=""
                        type="link"
                        style={{ color: '#a0a0a0', fontSize: '12px', padding: '0 4px', backgroundColor: 'transparent' }}
                        onClick={() => showEditModal(record)}
                        title="Edit Food Item"
                    >
                        <UilEdit size={16} />
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
        key: foodItem.serMenuItemRoleId,
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
                    title="Item Category"
                    subTitle={
                        <>
                            <span className="title-counter">{arrItems.length} Item Category </span>
                        </>
                    }
                    buttons={[
                        <>
                            {/* <Form.Item
                                name="serVenueMasterId"
                                label="Venue"
                                rules={[{ required: false, message: 'Please select a venue' }]}
                            > */}
                            {/* <Select
                                value={activeType}
                                onChange={(value) => setActiveType(value)}
                                // style={{ width: '100%' }}
                                placeholder="Select food type"
                                allowClear
                            >
                                {arrTypes.filter(x => x.blnIsActive == true).map((venue) => ()}
                                {arrTypes.map((item) => (
                                    <Option key={item.id} value={item.label}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select> */}
                            {/* </Form.Item> */}
                            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
                                Add Category
                            </Button>
                        </>
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
            <StyledFullModal
                title={isViewMode ? 'View Category' : isEditMode ? 'Edit Category' : 'Add Category'}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                width="60vw"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        blnIsActive: true,
                        blnIsCompositionRole: false,
                    }}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="txtRoleCode"
                                label="Category Code"
                                rules={[{ required: true, message: 'Please enter role code' }]}
                            >
                                <Input placeholder="Enter role code" disabled={isViewMode} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="txtRoleName"
                                label="Category Name"
                                rules={[{ required: true, message: 'Please enter role name' }]}
                            >
                                <Input placeholder="Enter role name" disabled={isViewMode} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="parentMenuRoleId"
                                label="Parent Role"
                            >
                                <Select
                                    placeholder="Select parent role"
                                    disabled={isViewMode}
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {arrItems
                                        .filter(item => !editingFood || item.serMenuItemRoleId !== editingFood.serMenuItemRoleId)
                                        .map(item => (
                                            <Option key={item.serMenuItemRoleId || item.serMenuItemId} value={item.serMenuItemRoleId || item.serMenuItemId}>
                                                {item.txtName || item.txtRoleName || item.txtCode}
                                            </Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="blnIsCompositionRole" label="Multilple Items" valuePropName="checked">
                                <Switch
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                    disabled={isViewMode}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="blnIsActive" label="Active" valuePropName="checked">
                                <Switch
                                    checkedChildren="Active"
                                    unCheckedChildren="Inactive"
                                    disabled={isViewMode}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* {!isViewMode && (
                        <Form.Item style={{ marginTop: 24 }}>
                            <Button type="button" onClick={handleModalCancel} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {isEditMode ? 'Update Role' : 'Add Role'}
                            </Button>
                        </Form.Item>
                    )}
                    {isViewMode && (
                        <Form.Item style={{ marginTop: 24 }}>
                            <Button onClick={handleModalCancel}>Close</Button>
                        </Form.Item>
                    )} */}
                </Form>
                <div style={{ display: 'flex', justifyContent: 'start', gap: '5px', marginTop: '30px' }}>
                    <Button onClick={handleModalCancel} htmlType="button" >
                        {'Close'}
                    </Button>
                    {!isViewMode && <Button type="primary" htmlType="submit"
                        onClick={() => {
                            form.submit();
                        }}
                        loading={loading}>
                        {isEditMode ? 'Update Category' : 'Add Category'}
                    </Button>}
                </div>
            </StyledFullModal>
        </>
    );
}

export default MenuCategory;
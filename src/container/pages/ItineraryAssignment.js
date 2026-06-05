// src/container/pages/Caterings.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Space, message, Select, Form, Input, Switch, Button, Divider, InputNumber } from 'antd';
const { Option } = Select;
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { useDeleteConfirmation } from '../../components/hooks/useDeleteConfirmation';
import { createAssignmentItem, generateCodeAssignment, generateCodeItem, getAllAssignment, getAllByRoleId, getAllItem, getAllItemType, getAllItineraryUnits, getAllMenuType, getAllRoles, saveItemType, saveItinerayItem, updateAssignmentItem, updateItemType, updateItinerayItem } from '../../services/commonService';
import { StyledFullModal } from './customer-modal-style';

function ItineraryAssignment() {
    const [form] = Form.useForm();
    const [nestedForm] = Form.useForm(); // Separate form for nested itinerary items
    const [foodData, setFoodData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allExistingFoodCodes, setAllExistingFoodCodes] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [arrRoles, setArrRoles] = useState([]);
    const [items, setItems] = useState([]);
    const [arrItems, setArrItems] = useState([]);
    const [editingFood, setEditingFood] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    // State for nested itinerary items form
    const [itineraryItemEntries, setItineraryItemEntries] = useState([]);
    const [editingItineraryItemId, setEditingItineraryItemId] = useState(null);
    const [itineraryItemsList, setItineraryItemsList] = useState([]);
    const [multiplierTypeOptions, setMultiplierTypeOptions] = useState([]);

    // Multiplier type options - adjust as per your requirements
    // const multiplierTypeOptions = [
    //     { value: 'NONE', label: 'None' },
    //     { value: 'PER_GUEST', label: 'Per Guest' },
    //     { value: 'FIXED', label: 'Fixed' },
    //     { value: 'FACTOR', label: 'Factor' },
    // ];

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

    const fetchAllAssignment = async () => {
        try {
            setLoading(true);
            const data = await getAllAssignment();
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
            console.error('Server Error', error?.message);
            setLoading(false);

        }
    };

    const fetchAllRoles = async () => {
        try {

            const data = await getAllRoles();
            if (data && data?.code == 200 && data?.result && data?.result?.length) {
                const arr = data.result.map((x, index) => {
                    return {
                        ...x,
                        id: x?.serMenuItemRoleId,
                        label: x?.txtRoleName
                    }
                });
                setArrRoles(arr);
            }

        } catch (error) {
            console.error('Server Error', error?.message);

        }
    };

    // const getAllItemTypes = async () => {
    //     try {

    //         const data = await getAllItemType();
    //         if (data && data?.code == 200 && data?.result && data?.result?.length) {
    //             const arr = data.result.map((x, index) => {
    //                 return {
    //                     ...x,
    //                     id: x?.serItineraryItemTypeId,
    //                     label: x?.txtName
    //                 }
    //             });
    //             setArrTypes(arr);
    //         }

    //     } catch (error) {
    //         console.log('Server Error', error?.message);

    //     }
    // };


    const { showDeleteConfirm } = useDeleteConfirmation(fetchFoods);

    const handleChange = async (label, activeId) => {
        try {

            if (label == 'item') {
                const item = items.find((it) => String(it.serMenuItemId) === String(activeId));
                form.setFieldsValue({
                    selectedItemCode: item?.txtCode || '',
                    selectedItemName: item?.txtName || '',
                    selectedItemDesc: item?.txtDescription || '',
                });

                return;
            }

            let req = {
                id: activeId
            };
            const data = await getAllByRoleId(req);
            if (data && data?.code == 200 && data?.result && data.result?.length) {
                const arr = data.result.map(x => {
                    return {
                        ...x,
                        id: x?.serMenuItemId,
                        label: x?.txtName
                    }
                });
                editingFood && editingFood?.serMenuItemId && handleChange('item', editingFood?.serMenuItemId);
                setItems([...arr]);
            } else {
                setItems([]);
                form.setFieldsValue({
                    serMenuItemId: null,
                })
                message.warning(data?.message || 'no records found!')
            }

        } catch (error) {
            console.error('Server Error', error?.message);

        }
    };

    const fetchMultiplier = async () => {
        try {
            const data = await getAllItineraryUnits();
            if (data && data?.code == 200 && data?.result && data?.result?.length) {
                const arr = data.result.map((x, index) => ({
                    id: index + 1,
                    label: x,
                    value: x,
                }));
                setMultiplierTypeOptions(arr);
            }
        } catch (error) {
            console.error('Server Error', error?.message);
        }



    };


    // Fetch itinerary items for dropdown
    const fetchItineraryItems = async () => {
        try {
            const data = await getAllItem();
            if (data && data?.code == 200 && data?.result && data?.result?.length) {
                const arr = data.result.map((x) => ({
                    ...x,
                    id: x?.serItineraryItemId,
                    label: x?.txtName,
                    value: x?.serItineraryItemId,
                }));
                setItineraryItemsList(arr);
            }
        } catch (error) {
            console.error('Server Error', error?.message);
        }
    };

    // Initial data fetch on component mount
    useEffect(() => {
        // fetchFoods();
        // getRoleByItem();
        // getAllFoodsByType();
        // getAllItemTypes();
        fetchAllRoles();
        fetchMultiplier();
        fetchAllAssignment();
        fetchItineraryItems();
    }, []);

    // Handlers for modal
    const showAddModal = () => {
        setEditingFood(null);
        setIsViewMode(false);
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        nestedForm.resetFields();
        setEditingFood(record);
        setIsViewMode(false);
        setIsModalVisible(true);
    };

    const showViewModal = (record) => {
        nestedForm.resetFields();
        setEditingFood(record);
        setIsViewMode(true);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingFood(null);
        setIsViewMode(false);
        setItineraryItemEntries([]);
        setEditingItineraryItemId(null);
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
        setEditingFood(null);
        setIsViewMode(false);
        setItineraryItemEntries([]);
        setEditingItineraryItemId(null);
        fetchAllAssignment();
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

    // Handlers for nested itinerary items form
    const handleAddItineraryItem = async () => {
        try {
            const values = await nestedForm.validateFields();
            if (editingItineraryItemId) {
                // Update existing entry
                setItineraryItemEntries((prev) =>
                    prev.map((entry) =>
                        entry.serItineraryAssignmentDetailId === editingItineraryItemId
                            ? {
                                ...entry,
                                serItineraryItemId: values.serItineraryItemId,
                                numDisplayOrder: values.numDisplayOrder,
                                enmMultiplierType: values.enmMultiplierType,
                                txtNotes: values.txtNotes || '',
                                // Store label for display
                                itineraryItemName: itineraryItemsList.find(item => item.id === values.serItineraryItemId)?.label || '',
                                multiplierTypeLabel: multiplierTypeOptions.find(opt => opt.value === values.enmMultiplierType)?.label || values.enmMultiplierType,
                            }
                            : entry
                    )
                );
            } else {
                // Add new entry
                const selectedItem = itineraryItemsList.find(item => item.id === values.serItineraryItemId);
                const newEntry = {
                    serItineraryAssignmentDetailId: Date.now(), // Local unique ID for UI
                    serItineraryItemId: values.serItineraryItemId,
                    numDisplayOrder: values.numDisplayOrder,
                    enmMultiplierType: values.enmMultiplierType,
                    txtNotes: values.txtNotes || '',
                    itineraryItemName: selectedItem?.label || '',
                    multiplierTypeLabel: multiplierTypeOptions.find(opt => opt.value === values.enmMultiplierType)?.label || values.enmMultiplierType,
                };
                setItineraryItemEntries((prev) => [...prev, newEntry]);
            }

            // Clear nested form fields and reset editing state
            nestedForm.resetFields();
            setEditingItineraryItemId(null);
        } catch (validationError) {
            // AntD will show validation errors automatically
        }
    };

    const handleEditItineraryItem = (id) => {
        const entry = itineraryItemEntries.find((e) => e.serItineraryAssignmentDetailId === id);
        if (!entry) return;
        setEditingItineraryItemId(id);
        nestedForm.setFieldsValue({
            serItineraryItemId: entry.serItineraryItemId,
            numDisplayOrder: entry.numDisplayOrder,
            enmMultiplierType: entry.enmMultiplierType,
            txtNotes: entry.txtNotes || '',
        });
    };

    const handleRemoveItineraryItem = (id) => {
        setItineraryItemEntries((prev) => prev.filter((entry) => entry.serItineraryAssignmentDetailId !== id));
    };

    // Populate form when modal opens for edit/view
    useEffect(() => {
        if (isModalVisible) {
            if (editingFood) {
                form.setFieldsValue({
                    serMenuItemRoleId: editingFood?.serMenuItemRoleId || '',
                    txtAssignmentCode: editingFood?.txtAssignmentCode || '',
                    txtAssignmentName: editingFood?.txtAssignmentName || '',
                    txtDescription: editingFood?.txtDescription || '',
                    serMenuItemId: editingFood?.serMenuItemId || '',
                    blnIsActive: editingFood.blnIsActive !== false,
                    // TODO: Load itinerary item entries if editingFood has them
                });
                const arr = editingFood.details.map(x => {
                    return {
                        ...x,
                        multiplierTypeLabel: multiplierTypeOptions.find(opt => opt.value === x.enmMultiplierType)?.label || x.enmMultiplierType
                    }
                });
                handleChange('role', editingFood?.serMenuItemRoleId);
                setItineraryItemEntries([...arr] || []);
            } else {
                form.resetFields();
                nestedForm.resetFields();
                setItineraryItemEntries([]);
                setEditingItineraryItemId(null);
                (async () => {
                    try {
                        let code;
                        const data = await generateCodeAssignment();
                        if (data && data?.code == 200 && data?.result) {
                            code = data.result
                        }
                        form.setFieldsValue({
                            txtAssignmentCode: code || '', // Set auto-generated code
                            blnIsActive: true,
                            // blnIsSelectable: true,
                        });
                    } catch (error) {
                        console.error('Server Error', error?.message);

                    }
                })();
            }
        }
    }, [isModalVisible, editingFood, form, arrItems]);

    const handleSubmit = async (values) => {
        if (isViewMode) {
            message.info('You are in view mode. Cannot submit changes.');
            return;
        }




        try {
            // setLoading(true);

            // Prepare itinerary item entries for submission (remove local ID, keep only API fields)
            const itineraryItemsPayload = itineraryItemEntries.map(({ id, itineraryItemName, multiplierTypeLabel, ...rest }) => rest);

            let req = {
                ...values,
                details: itineraryItemsPayload, // Include nested itinerary items
            };

            // TODO: Wire up with save/update API once available
            // The API should accept the itineraryItems array in the request
            const data = isEditMode ? await updateAssignmentItem({
                serItineraryAssignmentId: editingFood?.serItineraryAssignmentId,
                ...req,
            }) : await createAssignmentItem(req);

            if (data && data?.code == 200) {
                handleModalOk();
                message.success(`Assignment ${editingFood ? 'updated' : 'created'} successfully!`);
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
            title: 'Code',
            dataIndex: 'txtAssignmentCode',
            key: 'txtAssignmentCode',
            sorter: (a, b) => a.txtAssignmentCode.localeCompare(b.txtAssignmentCode),
        },
        {
            title: 'Name',
            dataIndex: 'txtAssignmentName',
            key: 'txtAssignmentName',
            // sorter: (a, b) => a.txtMenuFoodCode.localeCompare(b.txtAssignmentName),
        },
        {
            title: 'Description',
            dataIndex: 'txtDescription',
            key: 'txtDescription',
            // sorter: (a, b) => a.txtMenuFoodCode.localeCompare(b.txtDescription),
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
        // key: foodItem.serMenuItemRoleId,
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
                    title="Itinerary Assignment"
                    subTitle={
                        <>
                            <span className="title-counter">{arrItems.length} Assignments</span>
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
                                Add Assignment
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
                title={isViewMode ? 'View Itinerary' : isEditMode ? 'Edit Itinerary' : 'Add Itinerary'}
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
                        <Col md={8}>
                            <Form.Item
                                name="serMenuItemRoleId"
                                label="Role"
                                rules={[{ required: true, message: 'Please select role' }]}
                            >
                                <Select
                                    disabled={!!editingFood?.serMenuItemRoleId}
                                    // value={activeType}
                                    onChange={(value) => handleChange('role', value)}
                                    // style={{ width: '100%' }}
                                    placeholder="Select Role"
                                    allowClear
                                >
                                    {/* {arrTypes.filter(x => x.blnIsActive == true).map((venue) => ()} */}
                                    {arrRoles.filter(x => x.blnIsActive == true).map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.label}
                                        </Option>
                                    ))}
                                </Select>

                            </Form.Item>
                        </Col>
                        <Col md={8}>
                            <Form.Item
                                name="serMenuItemId"
                                label="Item"
                                rules={[{ required: true, message: 'Please select item' }]}
                            >
                                <Select
                                    onChange={(value) => handleChange('item', value)}
                                    // style={{ width: '100%' }}
                                    placeholder="Select Item"
                                    allowClear
                                    disabled={!!editingFood?.serMenuItemRoleId}
                                >
                                    {/* {arrTypes.filter(x => x.blnIsActive == true).map((venue) => ()} */}
                                    {items.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.label}
                                        </Option>
                                    ))}
                                </Select>

                            </Form.Item>
                        </Col>
                        <Col md={8}></Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Item Code" name="selectedItemCode">
                                <Input disabled placeholder="Will be filled from selected item" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Item Name" name="selectedItemName">
                                <Input disabled placeholder="Will be filled from selected item" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Item Description" name="selectedItemDesc">
                                {/* <Input disabled placeholder="Will be filled from selected item" /> */}
                                <Input.TextArea
                                    disabled
                                    placeholder=""
                                    autoSize={{ minRows: 1, maxRows: 5 }}
                                />
                            </Form.Item>
                            {/* <Form.Item label="Item Description" name="selectedItemType">
                                <Input disabled placeholder="Will be filled from selected item" />
                            </Form.Item> */}
                        </Col>

                        <Divider />
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="txtAssignmentCode"
                                label="Assignment Code"
                                rules={[{ required: true, message: 'Please enter code' }]}
                            >
                                <Input placeholder="Enter code" disabled={true} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="txtAssignmentName"
                                label="Assignment Name"
                                rules={[{ required: false, message: 'Please enter assignment name' }]}
                            >
                                <Input placeholder="Enter Assignment name" disabled={isViewMode} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="txtDescription"
                                label="Assignment Description"
                                rules={[{ required: false, message: 'Please enter description' }]}
                            >
                                <Input placeholder="Enter description here" disabled={isViewMode} />
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

                    {/* Nested Form: Itinerary Items */}
                    <Divider orientation="left">Itinerary Items</Divider>
                    <Form form={nestedForm} layout="vertical">
                        <Row gutter={16} align="bottom">
                            <Col md={8}>
                                <Form.Item
                                    name="serItineraryItemId"
                                    label="Itinerary Item"
                                    rules={[{ required: true, message: 'Please select itinerary item' }]}
                                >
                                    <Select
                                        placeholder="Select Itinerary Item"
                                        allowClear
                                        disabled={isViewMode}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {itineraryItemsList
                                            .filter(item => item.blnIsActive !== false)
                                            .map((item) => (
                                                <Option key={item.id} value={item.id}>
                                                    {item.label} {item.txtCode ? `(${item.txtCode})` : ''}
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={8}>
                                <Form.Item
                                    name="numDisplayOrder"
                                    label="Display Order"
                                    rules={[
                                        { required: false, message: 'Please enter display order' },
                                        { type: 'number', min: 1, message: 'Display order must be at least 1' },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder="Order"
                                        style={{ width: '100%' }}
                                        min={1}
                                        disabled={isViewMode}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={8}>
                                <Form.Item
                                    name="enmMultiplierType"
                                    label="Multiplier Type"
                                    rules={[{ required: true, message: 'Please select multiplier type' }]}
                                >
                                    <Select
                                        placeholder="Select Type"
                                        allowClear
                                        disabled={isViewMode}
                                    >
                                        {multiplierTypeOptions.map((option) => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={8}>
                                <Form.Item
                                    name="txtNotes"
                                    label="Notes"
                                >
                                    <Input
                                        placeholder="Enter notes (optional)"
                                        disabled={isViewMode}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            {!isViewMode && (
                                <Col xs={24} md={24} style={{ textAlign: 'right' }}>
                                    <Form.Item label=" ">
                                        <Button
                                            type="primary"
                                            onClick={handleAddItineraryItem}
                                        >
                                            {editingItineraryItemId ? 'Update' : '+ Add'}
                                        </Button>
                                    </Form.Item>
                                </Col>
                            )}
                        </Row>
                    </Form>

                    {/* Itinerary Items Table */}
                    {itineraryItemEntries.length > 0 && (
                        <Row style={{ marginTop: 16, marginBottom: 16 }}>
                            <Col span={24}>
                                <Table
                                    columns={[
                                        {
                                            title: 'Itinerary Item',
                                            dataIndex: 'itineraryItemName',
                                            key: 'itineraryItemName',
                                        },
                                        {
                                            title: 'Display Order',
                                            dataIndex: 'numDisplayOrder',
                                            key: 'numDisplayOrder',
                                            sorter: (a, b) => a.numDisplayOrder - b.numDisplayOrder,
                                        },
                                        {
                                            title: 'Multiplier Type',
                                            dataIndex: 'multiplierTypeLabel',
                                            key: 'multiplierTypeLabel',
                                        },
                                        {
                                            title: 'Notes',
                                            dataIndex: 'txtNotes',
                                            key: 'txtNotes',
                                            ellipsis: true,
                                        },
                                        ...(!isViewMode
                                            ? [
                                                {
                                                    title: 'Actions',
                                                    key: 'action',
                                                    render: (text, record) => (
                                                        <Space size="middle">
                                                            <Button
                                                                type="link"
                                                                size="small"
                                                                onClick={() => handleEditItineraryItem(record.serItineraryAssignmentDetailId)}
                                                                style={{ padding: 0 }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                type="link"
                                                                size="small"
                                                                danger
                                                                onClick={() => handleRemoveItineraryItem(record.serItineraryAssignmentDetailId)}
                                                                style={{ padding: 0 }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </Space>
                                                    ),
                                                },
                                            ]
                                            : []),
                                    ]}
                                    dataSource={itineraryItemEntries.map((entry) => ({
                                        ...entry,
                                        key: entry.id,
                                    }))}
                                    pagination={false}
                                    size="small"
                                />
                            </Col>
                        </Row>
                    )}

                    <Divider />
                    {/* <Col xs={24} sm={12}>
                            <Form.Item
                                name="serMenuItemId"
                                label="Items"
                                rules={[{ required: true, message: 'Please select items' }]}
                            >
                                <Select
                                    // value={activeType}
                                    // onChange={(value) => setActiveType(value)}
                                    // style={{ width: '100%' }}
                                    placeholder="Select Itinerary type"
                                    allowClear
                                >
                                    {arrTypes.filter(x => x.blnIsActive == true).map((item) => (
                                        <Option key={item.serItineraryItemTypeId} value={item.serItineraryItemTypeId}>
                                            {item.txtName}
                                        </Option>
                                    ))}
                                </Select>

                            </Form.Item>
                        </Col> */}
                    {/* <Col xs={24} sm={12}>
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
                        </Col> */}
                    {/* <Col xs={24} sm={12}>
                            <Form.Item name="blnIsCompositionRole" label="Is Composition Role" valuePropName="checked">
                                <Switch
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                    disabled={isViewMode}
                                />
                            </Form.Item>
                        </Col> */}
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
                        {isEditMode ? 'Update Itinerary' : 'Add Itinerary'}
                    </Button>}
                </div>
            </StyledFullModal>
        </>
    );
}

export default ItineraryAssignment;
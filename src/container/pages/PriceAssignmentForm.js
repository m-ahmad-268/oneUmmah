// src/container/pages/PriceAssignmentForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Space, message, Select, Form, Input, Button, Divider, InputNumber, Checkbox } from 'antd';
const { Option } = Select;
import { useNavigate, useParams } from 'react-router-dom';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import {
    getAllPricing,
    getAllActiveItem,
    getAllItemType,
    getAllActiveMenuItemRole,
    getAllActiveCompositeItems,
    getAllByRoleId,
    getAllItineraryUnits,
    getGroupsByParent,
    createPriceEntry
} from '../../services/commonService';

function PriceAssignmentForm() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode
    const isEditMode = !!id;

    // Loading states
    const [loading, setLoading] = useState(false);
    const [loadingPriceVersions, setLoadingPriceVersions] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const [loadingTypes, setLoadingTypes] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [loadingCompositeItems, setLoadingCompositeItems] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);

    // Dropdown data
    const [priceVersions, setPriceVersions] = useState([]);
    const [selectedPriceVersion, setSelectedPriceVersion] = useState(null);
    const [allItems, setAllItems] = useState([]);
    const [itemTypes, setItemTypes] = useState([]);
    const [roles, setRoles] = useState([]);
    const [compositeItems, setCompositeItems] = useState([]);
    const [units, setUnits] = useState([]);
    const [itemsByFilter, setItemsByFilter] = useState([]); // Items filtered by type/role/composite

    // Table data
    const [selectedItemsTable, setSelectedItemsTable] = useState([]); // Items added via AllItems dropdown
    const [assignToItems, setAssignToItems] = useState([]); // Items from Assign TO section

    // Static currency options
    const currencyOptions = [
        { value: 'USD', label: 'Dollar' },
        { value: 'GBP', label: 'Pound' },
    ];

    // Fetch Price Versions
    const fetchPriceVersions = useCallback(async () => {
        setLoadingPriceVersions(true);
        try {
            const data = await getAllPricing();
            if (data && data?.code === 200 && Array.isArray(data?.result)) {
                setPriceVersions(data.result);
            } else {
                message.error(data?.message || 'Failed to load price versions');
            }
        } catch (e) {
            console.error('Error loading price versions', e);
            message.error(`Failed to load price versions: ${e.message}`);
        } finally {
            setLoadingPriceVersions(false);
        }
    }, []);

    // Fetch All Items
    const fetchAllItems = useCallback(async () => {
        setLoadingItems(true);
        try {
            const data = await getAllActiveItem();
            if (data && data?.code === 200 && Array.isArray(data?.result)) {
                setAllItems(data.result);
            } else {
                message.error(data?.message || 'Failed to load items');
            }
        } catch (e) {
            console.error('Error loading items', e);
            message.error(`Failed to load items: ${e.message}`);
        } finally {
            setLoadingItems(false);
        }
    }, []);

    // Fetch Item Types
    const fetchItemTypes = useCallback(async () => {
        setLoadingTypes(true);
        try {
            const data = await getAllItemType();
            if (data && data?.code === 200 && Array.isArray(data?.result)) {
                setItemTypes(data.result);
            } else {
                message.error(data?.message || 'Failed to load item types');
            }
        } catch (e) {
            console.error('Error loading item types', e);
            message.error(`Failed to load item types: ${e.message}`);
        } finally {
            setLoadingTypes(false);
        }
    }, []);

    // Fetch Roles
    const fetchRoles = useCallback(async () => {
        setLoadingRoles(true);
        try {
            const data = await getAllActiveMenuItemRole();
            if (data && data?.code === 200 && Array.isArray(data?.result)) {
                setRoles(data.result);
            } else {
                message.error(data?.message || 'Failed to load roles');
            }
        } catch (e) {
            console.error('Error loading roles', e);
            message.error(`Failed to load roles: ${e.message}`);
        } finally {
            setLoadingRoles(false);
        }
    }, []);

    // Fetch Composite Items
    const fetchCompositeItems = useCallback(async () => {
        setLoadingCompositeItems(true);
        try {
            const data = await getAllActiveCompositeItems();
            if (data && data?.code === 200 && Array.isArray(data?.result)) {
                setCompositeItems(data.result);
            } else {
                message.error(data?.message || 'Failed to load composite items');
            }
        } catch (e) {
            console.error('Error loading composite items', e);
            message.error(`Failed to load composite items: ${e.message}`);
        } finally {
            setLoadingCompositeItems(false);
        }
    }, []);

    // Fetch Units
    const fetchUnits = useCallback(async () => {
        setLoadingUnits(true);
        try {
            const data = await getAllItineraryUnits();
            if (data && data?.code === 200 && Array.isArray(data?.result)) {
                const arr = data.result.map((x, index) => ({
                    id: index + 1,
                    label: x,
                    value: x,
                }));
                setUnits(arr);
            } else {
                message.error(data?.message || 'Failed to load units');
            }
        } catch (e) {
            console.error('Error loading units', e);
            message.error(`Failed to load units: ${e.message}`);
        } finally {
            setLoadingUnits(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchPriceVersions();
        fetchAllItems();
        fetchItemTypes();
        fetchRoles();
        fetchCompositeItems();
        fetchUnits();

        // Load data for edit mode if id exists
        if (id) {
            // TODO: Fetch assignment data by id
            // const loadAssignmentData = async () => {
            //     const data = await getPriceAssignmentById(id);
            //     // Populate form
            // };
            // loadAssignmentData();
        }
    }, [id, fetchPriceVersions, fetchAllItems, fetchItemTypes, fetchRoles, fetchCompositeItems, fetchUnits]);

    // Handle Price Version Selection
    const handlePriceVersionChange = (versionId) => {
        const version = priceVersions.find((v) => String(v.serPriceVersionId) === String(versionId));
        setSelectedPriceVersion(version || null);

        if (version) {
            form.setFieldsValue({
                priceVersionCode: version.txtVersionCode || '',
                priceVersionName: version.txtName || '',
                priceVersionStatus: version.txtPriceVersionStatus || '',
                // priceVersionType: version.txtType || '',
            });
        }
    };

    // Handle Add Item (from AllItems dropdown)
    const handleAddItem = () => {
        const itemId = form.getFieldValue('selectedItemId');
        if (!itemId) {
            message.warning('Please select an item first');
            return;
        }

        const item = allItems.find((it) => String(it.serMenuItemId) === String(itemId));
        if (!item) {
            message.error('Item not found');
            return;
        }

        // Check if item already exists
        if (selectedItemsTable.find((it) => it.serMenuItemId === item.serMenuItemId)) {
            message.warning('Item already added');
            return;
        }
        const newItem = {
            serMenuItemId: item.serMenuItemId,
            txtCode: item.txtCode || '',
            txtName: item.txtName || '',
            txtType: item.txtType || '',
            itemPrice: item.numPrice || 0,
            inputPrice: item.numPrice || 0, // Editable price field
            checked: true, // Default checked
        };

        setSelectedItemsTable((prev) => [...prev, newItem]);
        form.setFieldsValue({ selectedItemId: null }); // Clear dropdown
    };

    // Handle Delete Item from table
    const handleDeleteItem = (itemId) => {
        setSelectedItemsTable((prev) => prev.filter((item) => item.serMenuItemId !== itemId));
    };

    // Handle Price Update in table
    const handlePriceChange = (itemId, price) => {
        setSelectedItemsTable((prev) =>
            prev.map((item) =>
                item.serMenuItemId === itemId ? { ...item, inputPrice: price } : item
            )
        );
    };

    // Handle Checkbox Change in table
    const handleItemCheckboxChange = (itemId, checked) => {
        setSelectedItemsTable((prev) =>
            prev.map((item) =>
                item.serMenuItemId === itemId ? { ...item, checked } : item
            )
        );
    };

    // Handle Assign TO - By Type
    const handleAssignByTypeChange = async (typeId) => {
        // Clear other dropdowns
        form.setFieldsValue({
            assignByRole: null,
            assignByComposite: null,
        });

        if (!typeId) {
            setItemsByFilter([]);
            setAssignToItems([]);
            return;
        }

        try {
            setLoadingItems(true);
            // TODO: Replace with actual API call to get items by type
            // For now, filtering from allItems
            const filtered = allItems.filter((item) => String(item.serItineraryItemTypeId) === String(typeId));
            setItemsByFilter(filtered);
            // Set all items as selected by default
            setAssignToItems(
                filtered.map((item) => ({
                    ...item,
                    checked: true,
                }))
            );
        } catch (e) {
            console.error('Error loading items by type', e);
            message.error(`Failed to load items: ${e.message}`);
        } finally {
            setLoadingItems(false);
        }
    };

    // Handle Assign TO - By Role
    const handleAssignByRoleChange = async (roleId) => {
        // Clear other dropdowns
        form.setFieldsValue({
            assignByType: null,
            assignByComposite: null,
        });

        setSelectedItemsTable([]);
        return;
        if (!roleId) {
            setItemsByFilter([]);
            setAssignToItems([]);
            return;
        }

        try {
            setLoadingItems(true);
            const data = await getAllByRoleId({ id: roleId });
            if (data && data?.code === 200 && Array.isArray(data?.result)) {
                setItemsByFilter(data.result);
                // Set all items as selected by default
                setAssignToItems(
                    data.result.map((item) => ({
                        ...item,
                        checked: true,
                    }))
                );
            } else {
                setItemsByFilter([]);
                setAssignToItems([]);
            }
        } catch (e) {
            console.error('Error loading items by role', e);
            message.error(`Failed to load items: ${e.message}`);
            setItemsByFilter([]);
            setAssignToItems([]);
        } finally {
            setLoadingItems(false);
        }
    };

    // Handle Assign TO - By Composite Item
    const handleAssignByCompositeChange = async (compositeId) => {
        // Clear other dropdowns
        form.setFieldsValue({
            assignByType: null,
            assignByRole: null,
        });

        setSelectedItemsTable([]);

        return;
        if (!compositeId) {
            setItemsByFilter([]);
            setAssignToItems([]);
            return;
        }

        try {
            setLoadingItems(true);
            const data = await getGroupsByParent({ id: compositeId });
            if (data && data?.code === 200 && data?.result) {
                // Extract items from composition
                const items = [];
                if (data.result.components && Array.isArray(data.result.components)) {
                    data.result.components.forEach((component) => {
                        if (component.componentItems && Array.isArray(component.componentItems)) {
                            items.push(...component.componentItems);
                        }
                    });
                }
                setItemsByFilter(items);
                // Set all items as selected by default
                setAssignToItems(
                    items.map((item) => ({
                        ...item,
                        checked: true,
                    }))
                );
            } else {
                setItemsByFilter([]);
                setAssignToItems([]);
            }
        } catch (e) {
            console.error('Error loading items by composite', e);
            message.error(`Failed to load items: ${e.message}`);
            setItemsByFilter([]);
            setAssignToItems([]);
        } finally {
            setLoadingItems(false);
        }
    };

    // Handle Assign TO table checkbox change
    const handleAssignToCheckboxChange = (itemId, checked) => {
        setAssignToItems((prev) =>
            prev.map((item) =>
                String(item.serMenuItemId) === String(itemId) ? { ...item, checked } : item
            )
        );
    };

    // Handle Form Submit
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            // {
            //     "targetIds": [2, 3, 4],
            //     "assignmentType": "SELECTED_ITEMS",
            //     "scope": "ITEM",
            //     "scopeValue": null,
            //     "priceData": {
            //       "numPrice": 18.50,
            //       "txtCurrency": "GBP",
            //       "unit": "PER_GUEST",
            //       "numMinQuantity": 1,
            //       "numMaxQuantity": 100,
            //       "calculationMethod": "DIRECT"
            //     },
            //     "metadata": {
            //       "notes": "Summer promotion",
            //       "season": "SUMMER"
            //     },
            //     "replaceExisting": true
            //   }
            let activeObjectData = {
                scope: "",
                scopeValue: null,
            };
            let assignToObj = false;
            if (values?.assignByRole) {
                assignToObj = true;
                const obj = roles.find((role) => role.serMenuItemRoleId === values?.assignByRole);
                if (obj) {
                    activeObjectData = {
                        scope: obj?.txtRoleName,
                        scopeValue: obj.serMenuItemRoleId,
                    }
                }
            } else if (values?.assignByComposite) {
                assignToObj = true;
                const obj = compositeItems.find((composite) => composite.serMenuItemId === values?.assignByComposite);
                if (obj) {
                    activeObjectData = {
                        scope: obj?.txtName,
                        scopeValue: obj.serMenuItemId,
                    };
                }
            } else if (values?.assignByType) {
                assignToObj = true;
                const obj = itemTypes.find((type) => type.serItineraryItemTypeId === values?.assignByType);
                if (obj) {
                    activeObjectData = {
                        scope: obj?.txtName,
                        scopeValue: obj.serItineraryItemTypeId,
                    };
                }
            }

            if (selectedItemsTable.length === 0 && !assignToObj) {
                message.error('Please select at least one item and a valid assign to');
                return;
            }

            if (selectedItemsTable.length) {
                activeObjectData = {
                    scope: "ITEM",
                    scopeValue: null,
                };
            }

            // Prepare payload
            const payload = {
                targetIds: selectedItemsTable.filter((item) => item.checked).map((item) => item.serMenuItemId),
                assignmentType: "SELECTED_ITEMS",
                scope: activeObjectData?.scope,
                scopeValue: activeObjectData?.scopeValue,
                priceData: {
                    "numPrice": 0,
                    "txtCurrency": values.currency,
                    "unit": values.unit,
                    "numMinQuantity": values.minValue,
                    "numMaxQuantity": values.maxValue,
                    "calculationMethod": "DIRECT"
                },
                replaceExisting: true

            };



            // TODO: Replace with actual API call
            const data = isEditMode
                ? await updatePriceAssignment({ ...payload, id })
                : await createPriceEntry(selectedPriceVersion?.serPriceVersionId, payload);

            // debugger

            // console.log('Price Assignment Payload:', payload);
            // message.success(`Price Assignment ${isEditMode ? 'updated' : 'created'} successfully!`);
            // navigate('/price-assignment');

        } catch (e) {
            console.error('Error saving price assignment', e);
            message.error(`Failed to save: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Table columns for selected items
    const selectedItemsColumns = [
        {
            title: '',
            key: 'checkbox',
            width: 50,
            render: (_text, record) => (
                <Checkbox
                    checked={record.checked}
                    onChange={(e) => handleItemCheckboxChange(record.serMenuItemId, e.target.checked)}
                />
            ),
        },
        {
            title: 'Item Code',
            dataIndex: 'txtCode',
            key: 'txtCode',
        },
        {
            title: 'Item Name',
            dataIndex: 'txtName',
            key: 'txtName',
            // render: (price) => price?.toFixed(2) || '0.00',
        },
        {
            title: 'Item Type',
            dataIndex: 'txtType',
            key: 'txtType',
        },
        {
            title: 'Item Price',
            key: 'inputPrice',
            render: (_text, record) => (
                <InputNumber
                    value={record.inputPrice}
                    // readOnly={true}
                    disabled={true}
                    onChange={(value) => handlePriceChange(record.serMenuItemId, value)}
                    style={{ width: '100%' }}
                    min={0}
                    step={0.01}
                    precision={2}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_text, record) => (
                <UilTrashAlt
                    size={16}
                    style={{ cursor: 'pointer', color: '#ff4d4f' }}
                    onClick={() => handleDeleteItem(record.serMenuItemId)}
                    title="Delete"
                />
            ),
        },
    ];

    // Table columns for Assign TO items
    const assignToItemsColumns = [
        {
            title: '',
            key: 'checkbox',
            width: 50,
            render: (_text, record) => (
                <Checkbox
                    checked={record.checked}
                    onChange={(e) => handleAssignToCheckboxChange(record.serMenuItemId, e.target.checked)}
                />
            ),
        },
        {
            title: 'Item Code',
            dataIndex: 'txtCode',
            key: 'txtCode',
        },
        {
            title: 'Item Name',
            dataIndex: 'txtName',
            key: 'txtName',
        },
        {
            title: 'Item Type',
            dataIndex: 'txtType',
            key: 'txtType',
        },
    ];

    return (
        <>
            <CardToolbox>
                <PageHeader
                    className="ninjadash-page-header-main"
                    ghost
                    title={isEditMode ? 'Edit Price Assignment' : 'Add Price Assignment'}
                    subTitle=""
                />
            </CardToolbox>

            <Main>
                <Row gutter={25}>
                    <Col sm={24} xs={24}>
                        <Cards headless>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{}}
                            >
                                {/* Price Version Section */}
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="priceVersionId"
                                            label="Price Version"
                                            rules={[{ required: true, message: 'Please select a price version' }]}
                                        >
                                            <Select
                                                placeholder="Select Price Version"
                                                loading={loadingPriceVersions}
                                                onChange={handlePriceVersionChange}
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {priceVersions.map((version) => (
                                                    <Option key={version.serPriceVersionId} value={version.serPriceVersionId}>
                                                        {version.txtName} ({version.txtVersionCode})
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Readonly Fields for Selected Price Version */}
                                {selectedPriceVersion && (
                                    <Row gutter={16}>
                                        <Col xs={24} md={8}>
                                            <Form.Item label="Code" name="priceVersionCode">
                                                <Input disabled placeholder="Will be filled from selected version" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item label="Name" name="priceVersionName">
                                                <Input disabled placeholder="Will be filled from selected version" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item label="Status" name="priceVersionStatus">
                                                <Input disabled placeholder="Will be filled from selected version" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )}

                                <Divider />

                                {/* All Items Section */}
                                <Row gutter={16} align="bottom">
                                    <Col xs={24} md={20}>
                                        <Form.Item
                                            name="selectedItemId"
                                            label="All Items"
                                        >
                                            <Select
                                                placeholder="Select Item"
                                                loading={loadingItems}
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {allItems.map((item) => (
                                                    <Option key={item.serMenuItemId} value={item.serMenuItemId}>
                                                        {item.txtName} ({item.txtCode})
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={4}>
                                        <Form.Item label=" ">
                                            <Button type="primary" onClick={handleAddItem} block>
                                                Add
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Selected Items Table */}
                                {selectedItemsTable.length > 0 && (
                                    <Row style={{ marginTop: 16, marginBottom: 24 }}>
                                        <Col span={24}>
                                            <Table
                                                columns={selectedItemsColumns}
                                                dataSource={selectedItemsTable.map((item) => ({
                                                    ...item,
                                                    key: item.serMenuItemId,
                                                }))}
                                                pagination={false}
                                                size="small"
                                            />
                                        </Col>
                                    </Row>
                                )}

                                <Divider orientation="left">Assign TO</Divider>

                                {/* Assign TO Dropdowns */}
                                <Row gutter={16}>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name="assignByType"
                                            label="By Type"
                                        >
                                            <Select
                                                placeholder="Select Type"
                                                loading={loadingTypes}
                                                onChange={handleAssignByTypeChange}
                                                allowClear
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {itemTypes.map((type) => (
                                                    <Option key={type.serItineraryItemTypeId} value={type.serItineraryItemTypeId}>
                                                        {type.txtName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name="assignByRole"
                                            label="By Role"
                                        >
                                            <Select
                                                placeholder="Select Role"
                                                loading={loadingRoles}
                                                onChange={handleAssignByRoleChange}
                                                allowClear
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {roles.map((role) => (
                                                    <Option key={role.serMenuItemRoleId} value={role.serMenuItemRoleId}>
                                                        {role.txtRoleName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name="assignByComposite"
                                            label="By Composite Item"
                                        >
                                            <Select
                                                placeholder="Select Composite Item"
                                                loading={loadingCompositeItems}
                                                onChange={handleAssignByCompositeChange}
                                                allowClear
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {compositeItems.map((item) => (
                                                    <Option key={item.serMenuItemId} value={item.serMenuItemId}>
                                                        {item.txtName} ({item.txtCode})
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Assign TO Items Table */}
                                {assignToItems.length > 0 && (
                                    <Row style={{ marginTop: 16, marginBottom: 24 }}>
                                        <Col span={24}>
                                            <Table
                                                columns={assignToItemsColumns}
                                                dataSource={assignToItems.map((item) => ({
                                                    ...item,
                                                    key: item.serMenuItemId,
                                                }))}
                                                pagination={false}
                                                size="small"
                                            />
                                        </Col>
                                    </Row>
                                )}

                                <Divider />

                                {/* Currency, Unit, Min/Max Section */}
                                <Row gutter={16}>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name="currency"
                                            label="Currency"
                                            rules={[{ required: true, message: 'Please select currency' }]}
                                        >
                                            <Select placeholder="Select Currency">
                                                {currencyOptions.map((curr) => (
                                                    <Option key={curr.value} value={curr.value}>
                                                        {curr.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name="unit"
                                            label="Unit"
                                            rules={[{ required: true, message: 'Please select unit' }]}
                                        >
                                            <Select
                                                placeholder="Select Unit"
                                                loading={loadingUnits}
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {units.map((unit) => (
                                                    <Option key={unit?.id} value={unit.value}>
                                                        {unit.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name="minValue"
                                            label="Min"
                                            rules={[{ required: true, message: 'Please enter min value' }]}
                                        >
                                            <InputNumber
                                                placeholder="Enter Min Value"
                                                style={{ width: '100%' }}
                                                min={0}
                                                step={0.01}
                                                precision={2}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name="maxValue"
                                            label="Max"
                                            rules={[{ required: true, message: 'Please enter max value' }]}
                                        >
                                            <InputNumber
                                                placeholder="Enter Max Value"
                                                style={{ width: '100%' }}
                                                min={0}
                                                step={0.01}
                                                precision={2}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Submit Buttons */}
                                <Divider />
                                <Row justify="end" gutter={8}>
                                    <Col>
                                        <Button onClick={() => navigate('/price-assignment')}>
                                            Cancel
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            {isEditMode ? 'Update' : 'Save'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Cards>
                    </Col>
                </Row>
            </Main>
        </>
    );
}

export default PriceAssignmentForm;

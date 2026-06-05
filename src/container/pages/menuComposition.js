// src/container/pages/menuComposition.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Space, message, Form, Input, Select, Divider, Button as AntButton } from 'antd';

import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';
import { getAllActiveCompositeItems, getAllActiveCompositionRoles, getAllActiveMenuItemRole, getAllItemsTree, getAllByRoleId, saveOrUpdateBulk, getAllActiveItem, getAllCompositions, getGroupsByParent, getAllActiveItemsOfOtherSubCategory } from '../../services/commonService';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';
import { StyledFullModal } from './customer-modal-style';

const { Option } = Select;

function MenuComposition() {
  const [form] = Form.useForm();
  const [componentForm] = Form.useForm(); // Separate form for component addition

  // Main compositions list (all saved compositions)
  const [allCompositions, setAllCompositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingComposition, setEditingComposition] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // Form state
  const [selectedCompositionItem, setSelectedCompositionItem] = useState(null);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [components, setComponents] = useState([]); // Array of component objects with role and items

  // Dropdown data
  const [compositionItems, setCompositionItems] = useState([]);
  const [activeRoles, setActiveRoles] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [itemsByRole, setItemsByRole] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingCompositionItems, setLoadingCompositionItems] = useState(false);

  // Component form state (inline, not modal)
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [editingComponentIndex, setEditingComponentIndex] = useState(null);
  const [currentComponentItems, setCurrentComponentItems] = useState([]); // Items in current component being added/edited

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // --- Fetch Composition Items (for main dropdown) ---
  const fetchCompositionItems = useCallback(async () => {
    setLoadingCompositionItems(true);
    try {
      const data = await getAllActiveCompositeItems();
      if (data && data?.code === 200 && Array.isArray(data?.result)) {
        setCompositionItems(data.result);
      } else {
        message.error(data?.message || 'Failed to load composition items');
      }
    } catch (e) {
      console.error('Error loading composition items', e);
      message.error(`Failed to load composition items: ${e.message}`);
    } finally {
      setLoadingCompositionItems(false);
    }
  }, []);

  // --- Fetch Active Roles (for component form) ---
  const fetchActiveRoles = useCallback(async () => {
    setLoadingRoles(true);
    try {
      const data = await getAllActiveCompositionRoles();
      if (data && data?.code === 200 && Array.isArray(data?.result)) {
        setActiveRoles(data.result);
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

  // --- Fetch Items by Role ---
  // const fetchAllItemsByRole = useCallback(async (roleId) => {
  const fetchAllItems = useCallback(async () => {
    // if (!roleId) {
    //   setItemsByRole([]);
    //   return;
    // }
    setLoadingItems(true);
    try {
      // const data = await getAllByRoleId({ id: roleId });
      const data = await getAllActiveItemsOfOtherSubCategory();
      if (data && data?.code === 200 && Array.isArray(data?.result)) {
        setItemsByRole(data.result);
      } else {
        setItemsByRole([]);
        message.warning(data?.message || 'No items found for this role');
      }
    } catch (e) {
      console.error('Error loading items by role', e);
      message.error(`Failed to load items: ${e.message}`);
      setItemsByRole([]);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  // --- Fetch All Compositions (main table data) ---
  const fetchAllCompositions = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to fetch all compositions
      // For now, using empty array - you'll need to add the API endpoint
      const data = await getAllCompositions();

      if (data && data?.code === 200 && Array.isArray(data?.result)) {
        setAllCompositions(data.result);

      } else {
        setAllCompositions([]); // Placeholder
      }
    } catch (e) {
      console.error('Error loading compositions', e);
      message.error(`Failed to load compositions: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCompositionItems();
    fetchActiveRoles();
    fetchAllItems();
    fetchAllCompositions();
  }, [fetchCompositionItems, fetchActiveRoles, fetchAllItems]);

  // --- Handle Composition Item Selection ---
  const handleCompositionItemChange = (itemId) => {
    const item = compositionItems.find((it) => String(it.serMenuItemId) === String(itemId));
    setSelectedCompositionItem(item || null);
    setIsFormEnabled(!!item);
    // Populate disabled fields with selected item details
    form.setFieldsValue({
      itemCode: item?.txtCode || '',
      itemName: item?.txtName || '',
      itemType: item?.txtDescription || '',
    });

    // Clear components when changing item
    setComponents([]);
    componentForm.resetFields();
    setShowComponentForm(false);
    setEditingComponentIndex(null);
  };

  // --- Component Form Handlers (Inline) ---
  const handleOpenComponentForm = () => {
    if (!selectedCompositionItem) {
      message.warning('Please select a Composition Item first');
      return;
    }
    setEditingComponentIndex(null);
    setShowComponentForm(true);
    setCurrentComponentItems([]);
    componentForm.resetFields();
  };

  const handleEditComponent = (index) => {

    // Focus the Display Name field when editing a component
    // Wait for form and showComponentForm state to update, then focus field
    setTimeout(() => {
      const input = document.querySelector('.childForm input[placeholder="Enter Display Role Name"]');
      if (input) input.focus();
    }, 0); // Run as soon as possible after render


    const component = components[index];
    if (!component) return;

    let arrItems;
    if (component.items?.length)
      arrItems = component.items.map((x) => x.serMenuItemId);

    setEditingComponentIndex(index);
    setShowComponentForm(true);
    setCurrentComponentItems(component.items);
    // debugger
    componentForm.setFieldsValue({
      serComponentId: component.serComponentId || null,
      roleId: component.roleId,
      txtDisplayName: component?.txtDisplayName || '',
      itemIds: arrItems || [],
    });
  };

  const handleAddItemsToComponent = () => {
    try {
      componentForm.validateFields(['roleId']).then((values) => {
        const { roleId } = values;

        if (!roleId) {
          message.warning('Please select a role first');
          return;
        }

        // Get selected role name
        const selectedRole = activeRoles.find((r) => String(r.serMenuItemRoleId) === String(roleId));

        // Show the items dropdown - user will select items
        // The table will be populated based on selectedItems state
      });
    } catch (error) {
      // Validation will show errors
    }
  };

  const handleItemSelectionChange = (selectedItemIds) => {
    // Update current component items based on selected item IDs
    const selectedItems = itemsByRole.filter((item) =>
      selectedItemIds.includes(item.serMenuItemId)
    );

    setCurrentComponentItems(
      selectedItems.map((item) => ({
        serMenuItemId: item.serMenuItemId,
        txtCode: item.txtCode,
        txtName: item.txtName,
        txtType: item.txtType,
      }))
    );
  };

  const handleSaveComponent = async () => {
    try {
      const values = await componentForm.validateFields();
      const { roleId } = values;

      if (currentComponentItems.length === 0) {
        message.warning('Please select at least one item');
        return;
      }

      // Get selected role name
      const selectedRole = activeRoles.find((r) => String(r.serMenuItemRoleId) === String(roleId));
      // debugger
      const componentData = {
        roleId,
        serComponentId: values?.serComponentId || null,
        txtDisplayName: values?.txtDisplayName || '',
        roleName: selectedRole?.txtRoleName || '',
        roleCode: selectedRole?.txtRoleCode || '',
        items: [...currentComponentItems],
      };

      if (editingComponentIndex !== null) {
        // Update existing component
        setComponents((prev) => {
          const updated = [...prev];
          updated[editingComponentIndex] = componentData;
          return updated;
        });
      } else {
        // Add new component
        setComponents((prev) => [...prev, componentData]);
      }

      // Reset form for next component
      componentForm.resetFields();
      setShowComponentForm(false);
      setEditingComponentIndex(null);
      setCurrentComponentItems([]);
    } catch (validationError) {
      // AntD will show validation errors automatically
    }
  };

  const handleCancelComponentForm = () => {
    componentForm.resetFields();
    setShowComponentForm(false);
    setEditingComponentIndex(null);
    setCurrentComponentItems([]);
  };

  // Handle edit/delete item in current component table
  const handleEditItemInComponent = (itemId) => {
    // For now, just allow removing - edit can be done by removing and re-adding
    // Or you can implement inline editing if needed
    message.info('Edit functionality - remove and re-add item');
  };

  const handleDeleteItemFromCurrentComponent = (itemId) => {
    setCurrentComponentItems((prev) =>
      prev.filter((item) => item.serMenuItemId !== itemId)
    );
    // Also update the form's itemIds field
    const currentItemIds = componentForm.getFieldValue('itemIds') || [];
    componentForm.setFieldsValue({
      itemIds: currentItemIds.filter((id) => id !== itemId),
    });
  };

  const handleRemoveComponent = (index) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveItemFromComponent = (componentIndex, itemId) => {
    setComponents((prev) =>
      prev.map((comp, idx) => {
        if (idx === componentIndex) {
          return {
            ...comp,
            items: comp.items.filter((item) => item.serMenuItemId !== itemId),
          };
        }
        return comp;
      })
    );
  };

  // --- Main Modal Handlers ---
  const handleOpenModal = () => {
    setIsModalVisible(true);
    setIsViewMode(false);
    setEditingComposition(null);
    setSelectedCompositionItem(null);
    setIsFormEnabled(false);
    setComponents([]);
    form.resetFields();
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setIsViewMode(false);
    setEditingComposition(null);
    setSelectedCompositionItem(null);
    setIsFormEnabled(false);
    setComponents([]);
    form.resetFields();
    componentForm.resetFields();
    setShowComponentForm(false);
    setEditingComponentIndex(null);
    setCurrentComponentItems([]);
  };

  const showEditModal = (record) => {
    setEditingComposition(record);
    setIsViewMode(false);
    setIsModalVisible(true);

    // TODO: Load composition data into form
    // For now, this is a placeholder - you'll need to populate based on your data structure
    form.setFieldsValue({
      compositionItemId: record.parentMenuItemId,
    });

    const arr = record.components.map(x => {
      const name = activeRoles.find(item => item.serMenuItemRoleId == x?.serComponenetKindRoleId);
      return {
        ...x,

        roleId: x?.serComponenetKindRoleId,
        roleName: name?.txtRoleName || 'N/A',
        items: x?.componentItems || [],
      }
    });

    handleCompositionItemChange(record.parentMenuItemId);
    setComponents(arr || []);
    setIsFormEnabled(true);
    // setSelectedCompositionItem(record);
  };

  const showViewModal = async (record) => {
    // let req = {
    //   id: record?.serMenuItemId
    // };
    // const data = await getGroupsByParent(req);

    setEditingComposition(record);
    setIsViewMode(true);
    setIsModalVisible(true);

    form.setFieldsValue({
      compositionItemId: record.parentMenuItemId,
    });

    const arr = record.components.map(x => {
      const name = activeRoles.find(item => item.serMenuItemRoleId == x?.serComponenetKindRoleId);
      return {
        ...x,

        roleId: x?.serComponenetKindRoleId,
        roleName: name?.txtRoleName || 'N/A',
        items: x?.componentItems || [],
      }
    });

    handleCompositionItemChange(record.parentMenuItemId);
    setComponents(arr || []);
    setIsFormEnabled(true);
    // TODO: Load composition data for view
  };

  const handleSave = async () => {
    if (!selectedCompositionItem) {
      message.error('Please select a Composition Item');
      return;
    }

    if (components.length === 0) {
      message.error('Please add at least one component');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        parentMenuItemId: selectedCompositionItem.serMenuItemId,
        components: components.map((comp) => ({
          serComponentId: comp?.serComponentId || null,
          parentMenuItemId: selectedCompositionItem.serMenuItemId,
          serComponenetKindRoleId: comp.roleId,
          txtComponenetKindRoleName: comp.roleName,
          txtComponenetKindRoleCode: comp.roleCode,
          txtDisplayName: comp.txtDisplayName,
          componentItems: comp.items.map((item) => ({
            serMenuItemId: item.serMenuItemId,
            txtCode: item.txtCode,
            txtName: item.txtName,
          })),
        })),
      };

      // TODO: Use appropriate API - update or create based on editingComposition
      const data = editingComposition
        ? await saveOrUpdateBulk({ ...payload, serCompositionId: editingComposition?.serCompositionId || null })
        : await saveOrUpdateBulk(payload);

      // debugger
      if (data && data?.code === 200) {
        message.success(`Composition ${editingComposition ? 'updated' : 'created'} successfully!`);
        handleCloseModal();
        fetchAllCompositions();
        fetchCompositionItems();
      } else {
        message.error(data?.message || 'Failed to save composition');
      }
    } catch (e) {
      console.error('Error saving composition', e);
      message.error(`Failed to save composition: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Table Columns for Main Compositions Table ---
  const mainTableColumns = [
    {
      title: 'Sr #',
      dataIndex: 'iteration',
      key: 'iteration',
      render: (_text, _record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Code',
      dataIndex: 'txtparentMenuItemCode',
      key: 'txtparentMenuItemCode',
    },
    {
      title: 'Name',
      dataIndex: 'txtparentMenuItemName',
      key: 'txtparentMenuItemName',
    },
    {
      title: 'Components',
      dataIndex: 'txtcomponenetNameLst',
      key: 'txtcomponenetNameLst',
      render: (value) => {
        // let arr = [];
        // debugger
        // // Try parsing JSON if it's a stringified array, else treat as comma separated
        // if (typeof value === 'string') {
        //   try {
        //     arr = JSON.parse(value);
        //     if (!Array.isArray(arr)) arr = value.split(',').map(s => s.trim()).filter(Boolean);
        //   } catch (e) {
        //     arr = value.split(',').map(s => s.trim()).filter(Boolean);
        //   }
        // } else if (Array.isArray(value)) {
        //   arr = value;
        // }
        // Show up to 3 tags; use professional coloring
        const displayArr = value.slice(0, 3);
        return (
          <span>
            {displayArr.map((name, i) => (
              <span
                key={name + i}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  borderRadius: '16px',
                  padding: '2px 12px',
                  fontSize: 13,
                  fontWeight: 500,
                  marginRight: 6,
                  marginBottom: 2,
                  maxWidth: 120,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={name}
              >
                {name}
              </span>
            ))}
            {value.length > 3 && (
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: '#fadb14',
                  color: '#222',
                  borderRadius: '16px',
                  padding: '2px 10px',
                  fontSize: 13,
                  fontWeight: 500,
                  marginRight: 0
                }}
                title={`${value.length - 3} more`}
              >
                +{value.length - 3}
              </span>
            )}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text, record) => (
        <Space size="middle">
          <AntButton
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '12px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => showViewModal(record)}
            title="View Details"
          >
            <UilEye size={16} />
          </AntButton>
          <AntButton
            type="link"
            style={{ color: '#a0a0a0', fontSize: '12px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => showEditModal(record)}
            title="Edit Composition"
          >
            <UilEdit size={16} />
          </AntButton>
        </Space>
      ),
    },
  ];

  // --- Table Columns for Component Items (in saved components) ---
  const componentItemColumns = (componentIndex) => [
    {
      title: 'Item Index',
      dataIndex: 'itemIndex',
      key: 'itemIndex',
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_text, record) => (
        <Space size="middle">
          {/* <UilEdit
            size={16}
            style={{ cursor: 'pointer', color: '#1890ff' }}
            onClick={() => handleEditItemInComponent(record.serMenuItemId)}
            title="Edit"
          /> */}
          {!isViewMode && <UilTrashAlt
            size={16}
            style={{ cursor: 'pointer', color: '#ff4d4f' }}
            onClick={() => handleRemoveItemFromComponent(componentIndex, record.serMenuItemId)}
            title="Delete"
          />}
        </Space>
      ),
    },
  ];

  // --- Table Columns for Current Component Items (in form) ---
  const currentComponentItemColumns = [
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_text, record) => (
        <Space size="middle">
          <UilEdit
            size={16}
            style={{ cursor: 'pointer', color: '#1890ff' }}
            onClick={() => handleEditItemInComponent(record.serMenuItemId)}
            title="Edit"
          />
          <UilTrashAlt
            size={16}
            style={{ cursor: 'pointer', color: '#ff4d4f' }}
            onClick={() => handleDeleteItemFromCurrentComponent(record.serMenuItemId)}
            title="Delete"
          />
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
          title="Menu Composition"
          subTitle={
            <>
              <span className="title-counter">{allCompositions.length} Compositions</span>
            </>
          }
          buttons={[
            <Button
              className="btn-add_new"
              size="default"
              type="primary"
              key="1"
              onClick={handleOpenModal}
            >
              Add Composition
            </Button>,
          ]}
        />
      </CardToolbox>

      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading compositions...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={mainTableColumns}
                  dataSource={allCompositions.map((comp, index) => ({
                    ...comp,
                    key: comp.parentMenuItemId || index,
                  }))}
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

      {/* Main Composition Modal */}
      <StyledFullModal
        title={isViewMode ? 'View Composition' : editingComposition ? 'Edit Composition' : 'Add Composition'}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width="80vw"
      >
        <Form form={form} layout="vertical">
          {/* Composition Item Selection */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="compositionItemId"
                label="Composition Item"
                rules={[{ required: true, message: 'Please select a composition item' }]}
              >
                <Select
                  placeholder="Select Composition Item"
                  loading={loadingCompositionItems}
                  onChange={handleCompositionItemChange}
                  disabled={isViewMode || !!editingComposition}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {compositionItems.map((item) => (
                    <Option key={item.serMenuItemId} value={item.serMenuItemId}>
                      {item.txtName} ({item.txtCode})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Disabled Fields for Selected Item Details */}
          {selectedCompositionItem && (
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Item Code" name="itemCode">
                  <Input disabled placeholder="Will be filled from selected item" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Item Name" name="itemName">
                  <Input disabled placeholder="Will be filled from selected item" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Item Description" name="itemType">
                  {/* <Input disabled placeholder="Will be filled from selected item" /> */}
                  <Input.TextArea
                    disabled
                    placeholder="Will be filled from selected item"
                    autoSize={{ minRows: 1, maxRows: 5 }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* Component Addition Section - Only enabled after item selection */}
          {/* {isFormEnabled && ( */}
          {true && (
            <>
              {/* Saved Components List */}
              {components.length > 0 && (
                <Row gutter={16}>
                  <Col span={24}>
                    {components.map((component, compIndex) => (
                      <div key={compIndex} style={{ marginBottom: 24, border: '1px solid #f0f0f0', padding: 16, borderRadius: 4 }}>
                        <Row gutter={16} align="middle" style={{ display: 'flex', alignItems: 'center', marginBottom: 12, backgroundColor: 'lightgrey' }}>
                          <Col span={8}>
                            <h4 style={{ margin: 0 }}>Role: {component.roleName}</h4>
                          </Col>
                          <Col span={8}>
                            <h4 style={{ margin: 0 }}>Display Name: {component.txtDisplayName}</h4>
                          </Col>
                          <Col span={8}>
                            {!isViewMode && (
                              <AntButton
                                type="link"
                                onClick={() => handleEditComponent(compIndex)}
                              >
                                Edit Component
                              </AntButton>
                            )}
                          </Col>
                          {/* {!isViewMode && (
                            <Col span={4} style={{ textAlign: 'right' }}>
                              <AntButton
                                type="link"
                                danger
                                onClick={() => handleRemoveComponent(compIndex)}
                              >
                                Remove Component
                              </AntButton>
                            </Col>
                          )} */}
                        </Row>
                        <Table
                          columns={componentItemColumns(compIndex)}
                          dataSource={component.items.map((item, index) => ({
                            ...item,
                            itemIndex: index + 1,
                            key: index + 1,
                          }))}
                          pagination={false}
                          size="small"
                        />
                      </div>
                    ))}
                  </Col>
                </Row>
              )}
            </>
          )}
          <Divider orientation="left">Components</Divider>

          {!isViewMode && (
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={24}>
                <AntButton type="primary" onClick={handleOpenComponentForm}>
                  + Add Component
                </AntButton>
              </Col>
            </Row>
          )}
          {/* Inline Component Form */}
          {showComponentForm && !isViewMode && (
            <div className='childForm' style={{ marginBottom: 24, border: '1px solid #d9d9d9', padding: 16, borderRadius: 4, backgroundColor: '#fafafa' }}>
              <Form form={componentForm} layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="roleId"
                      label="Component Type"
                      rules={[{ required: true, message: 'Please select a role' }]}
                    >
                      <Select
                        placeholder="Select Role"
                        loading={loadingRoles}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {activeRoles.map((role) => (
                          <Option key={role.serMenuItemRoleId} value={role.serMenuItemRoleId}>
                            {role.txtRoleName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="txtDisplayName"
                      label="Display Name"
                      rules={[{ required: true, message: 'Please enter name' }]}
                    >
                      <Input placeholder="Enter Display Role Name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8} hidden>
                    <Form.Item
                      name="serComponentId"
                      label="Component Id"
                      rules={[{ required: false, message: 'Please enter name' }]}
                    >
                      <Input disabled='true' placeholder="Enter Display Role Name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="itemIds"
                      label="Items"
                      rules={[{ required: true, message: 'Please select at least one item' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select Items"
                        loading={loadingItems}
                        onChange={handleItemSelectionChange}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {itemsByRole.map((item) => (
                          <Option key={item.serMenuItemId} value={item.serMenuItemId}>
                            {item.txtName} ({item.txtCode})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Items Table */}
                {/* <Row style={{ marginTop: 16 }}>
                      <Col span={24}>
                        <Table
                          columns={currentComponentItemColumns}
                          dataSource={currentComponentItems.map((item) => ({
                            ...item,
                            key: item.serMenuItemId,
                          }))}
                          pagination={false}
                          size="small"
                          locale={{ emptyText: 'No items selected' }}
                        />
                      </Col>
                    </Row> */}

                <Row justify="end" gutter={8} style={{ marginTop: 16 }}>
                  <Col>
                    <AntButton onClick={handleCancelComponentForm}>
                      Cancel
                    </AntButton>
                  </Col>
                  <Col>
                    <AntButton type="primary" onClick={handleSaveComponent}>
                      {editingComponentIndex !== null ? 'Update Component' : 'Add Component'}
                    </AntButton>
                  </Col>
                </Row>
              </Form>
            </div>
          )}

          {/* Save and Close Buttons */}
          <Divider />
          <Row justify="end" gutter={8}>
            <Col>
              <AntButton onClick={handleCloseModal} htmlType="button">
                Close
              </AntButton>
            </Col>
            {!isViewMode && isFormEnabled && (
              <Col>
                <AntButton type="primary" onClick={handleSave} loading={loading} htmlType="button">
                  {editingComposition ? 'Update' : 'Save'}
                </AntButton>
              </Col>
            )}
          </Row>
        </Form>
      </StyledFullModal>

    </>
  );
}

export default MenuComposition;

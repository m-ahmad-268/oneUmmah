// src/container/pages/CateringFormModal.js

import React, { useEffect, useState, useCallback } from 'react';
import { Form, Input, Button, message, Select, Row, Col, Switch } from 'antd';
import propTypes from 'prop-types';

// Third-party icon imports
import UilUtensils from '@iconscout/react-unicons/icons/uil-utensils'; // For food icon

// Internal/relative imports - adjusted order
import { StyledFullModal } from './customer-modal-style';
import { Main } from '../styled';
import { generateFoodItemCode, getAllPriceUnitTypes, getSaveItem, getUpdateItem, getValidParentByRole } from '../../services/commonService';

const { Option } = Select;

// Define all possible food types
const foodTypes = ['MainCourse', 'Appetiser', 'Starter', 'SaladAndCondiment', 'Dessert', 'Drink'];

// Helper to determine food type string from boolean flags
const getFoodTypeString = (foodItem) => {
  if (foodItem.blnIsMainCourse) return 'MainCourse';
  if (foodItem.blnIsAppetiser) return 'Appetiser';
  if (foodItem.blnIsStarter) return 'Starter';
  if (foodItem.blnIsSaladAndCondiment) return 'SaladAndCondiment';
  if (foodItem.blnIsDessert) return 'Dessert';
  if (foodItem.blnIsDrink) return 'Drink';
  return ''; // Return empty string if no type is true
};

function MenuFoodItem({ visible, initialData, onCancel, onOk, allTypes, type, allExistingFoodCodes, isViewMode, itemRoles }) {
  const [form] = Form.useForm();

  const [multiTypes, setMultiTypes] = useState([]);
  const [arrParent, setArrParent] = useState([]);
  const [activeParent, setActiveParent] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const [loadingParents, setLoadingParents] = useState(false);
  const accessToken = localStorage.getItem('access_token_admin');

  // Helper to generate a unique food code
  const generateUniqueFoodCode = (existingCodes) => {
    const prefix = 'FD-';
    let maxNum = 0;
    existingCodes.forEach((code) => {
      if (code && code.startsWith(prefix)) {
        const numPart = parseInt(code.substring(prefix.length), 10);
        if (!Number.isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });
    return `${prefix}${String(maxNum + 1).padStart(3, '0')}`; // FD-001, FD-002, etc.
  };


  useEffect(() => {
    (async () => {
      try {
        const data = await getAllPriceUnitTypes();
        if (data && data?.code == 200 && data?.result && data?.result?.length) {
          setMultiTypes(data?.result);

        }

      } catch (error) {
        console.error('Server Error', error?.message);
      }
    })();

  }, []);

  // Function to fetch valid parents by role
  const fetchParentsByRole = useCallback(async (roleValue) => {
    if (!roleValue) {
      setArrParent([]);
      return;
    }

    setLoadingParents(true);
    try {
      const req = {
        id: roleValue,
      };
      const data = await getValidParentByRole(req);
      if (data && data?.code === 200 && data?.result && data?.result?.length) {
        // Assuming the API returns an array of parent items
        // Format the data similar to itemRoles structure if needed
        const arr = data?.result.map(parent => {
          return {
            id: parent.serMenuItemId,
            label: parent.txtName || 'N/A',
            value: parent.serMenuItemId,
          }
        });

        setArrParent(arr);
        // const formattedParents = Array.isArray(data.result)
        //   ? data.result.map((parent, index) => {
        //     if (typeof parent === 'object' && parent !== null) {
        //       return {
        //         id: parent.serMenuFoodId,
        //         label: parent.txtName || 'N/A',
        //         value: parent.serMenuFoodId,
        //       };
        //     }
        //   })
        //   : [];
      } else {
        setArrParent([]);
        message.warning('No valid parents found for the selected role.');
      }
      setLoadingParents(false);
    } catch (error) {
      setLoadingParents(false);
      console.error('Error fetching parents by role:', error);
      message.error(`Failed to load parents: ${error?.message || 'Unknown error'}`);
      setArrParent([]);
    }
  }, []);

  // Handler for role change
  const handleRoleChange = (roleValue) => {
    // Clear parent selection when role changes
    form.setFieldsValue({ parentId: undefined });
    // Fetch new parents based on selected role
    setSelectedRole(roleValue);
    fetchParentsByRole(roleValue);
  };


  useEffect(() => {
    if (visible) {
      // Reset parent array when modal opens
      setArrParent([]);

      if (initialData) {
        // Editing an existing food item
        const foodTypeString = getFoodTypeString(initialData);
        form.setFieldsValue({
          txtCode: initialData.txtCode || '',
          txtName: initialData.txtName || '',
          txtShortName: initialData.txtShortName || '',
          txtDescription: initialData.txtDescription || '',
          txtRole: initialData.txtRole || '',
          serMenuItemRoleId: initialData.serMenuItemRoleId || '',
          parentId: initialData.parentId || undefined,
          foodType: foodTypeString, // Set selected value for the dropdown
          txtPriceMultiplierType: initialData.txtPriceMultiplierType,
          numDisplayOrder: initialData.numDisplayOrder,
          numPrice: initialData?.numPrice && String(initialData.numPrice) || 0,
          blnIsActive: initialData.blnIsActive === true,
          blnIsCompostie: initialData?.blnIsCompostie === true,
          blnIsCateringItem: initialData?.blnIsCateringItem === true,
          blnIsSelectable: initialData.blnIsSelectable !== false,
          blnHasSelectionLimit: initialData.blnHasSelectionLimit === true,
          numSelectionLimit: initialData.numSelectionLimit || '',
        });

        // Fetch parents if role exists in initialData
        if (initialData?.serMenuItemRoleId) {
          setSelectedRole(initialData.serMenuItemRoleId);
          fetchParentsByRole(initialData.serMenuItemRoleId);
        }
      } else {
        // Adding a new food item
        form.resetFields();
        // const newCode = generateUniqueFoodCode(allExistingFoodCodes); // Auto-generate code

        (async () => {
          let req = {
            "searchKeyword": type
          };

          let code;
          const data = await generateFoodItemCode(req);
          if (data && data?.code == 200 && data?.result) {
            code = data.result
          }
          form.setFieldsValue({
            txtCode: code || '', // Set auto-generated code
            blnIsSelectable: true,
            blnIsCompostie: true,
            blnIsCateringItem: false,
            blnIsActive: true,
          });

        })();

      }
    } else {
      setArrParent([]);
      setSelectedRole(null);
    }
  }, [visible, initialData, form, allExistingFoodCodes, type, fetchParentsByRole]);

  // Custom validator for food codes
  const validateCode = (isEditModeProp, originalCode) => (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Food Code cannot be empty'));
    }

    // When editing, the original code for that specific item is allowed
    if (isEditModeProp && value === originalCode) {
      return Promise.resolve();
    }

    // For new items or changed codes during edit, check against all existing codes
    const codesToCheckAgainst = allExistingFoodCodes.filter((code) => {
      // If we are editing and this is the original code of the item being edited, exclude it from the check
      if (isEditModeProp && originalCode && originalCode === code) {
        return false;
      }
      return true; // Include all other codes for uniqueness check
    });

    if (codesToCheckAgainst.includes(value)) {
      return Promise.reject(new Error('Food Code already exists! Please enter a unique code.'));
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    if (isViewMode) {
      message.info('You are in view mode. Cannot submit changes.');
      return;
    }
    try {
      // const response = await fetch(`${process.env.REACT_APP_API_URL}menuFoodMaster/saveOrUpdate`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      //   body: JSON.stringify(payload),
      // });
      let req = {
        ...values,
        txtType: values?.txtRole,
        numDisplayOrder: values?.numDisplayOrder ? Number(values?.numDisplayOrder) : 0
      };

      const data = initialData && initialData?.serMenuItemId ? await getUpdateItem({ ...req, serMenuItemId: initialData.serMenuItemId }) : await getSaveItem(req);
      if (data && data?.code == 200) {
        message.success(`Food item ${initialData ? 'updated' : 'added'} successfully!`);
        onOk(); // Close modal and trigger refresh in parent
      } else {
        throw new Error(data.message || 'Failed to save food item');
      }
    }
    // if (!response.ok) {
    //   const errorText = await response.text();
    //   throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    // }
    // const data = await response.json();
    // if (data.code === 200 && data.status === 'OK') {
    //   message.success(`Food item ${initialData ? 'updated' : 'added'} successfully!`);
    //   onOk(); // Close modal and trigger refresh in parent
    // } else {
    //   throw new Error(data.message || 'Failed to save food item');
    // }
    catch (e) {
      message.error(`Error saving food item: ${e.message}`);

    }
  };

  const isEditMode = !!initialData; // Convenience variable for edit mode

  return (
    <StyledFullModal
      title={isViewMode ? 'View Item' : isEditMode ? 'Edit Item' : 'Add Item'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="70vw"
      height="80vh"
    >
      {/* <Main> */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          blnIsCompostie: true,
          blnIsCateringItem: false,
          blnIsSelectable: true,
          blnIsActive: true,
          foodType: '', // Ensure foodType is initialized
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="serMenuItemRoleId"
              label="Role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select
                placeholder="Select Item Role"
                disabled={isViewMode}
                onChange={handleRoleChange}
              >
                {itemRoles.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role?.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="parentId"
              label="Parent"
              rules={[{ required: false, message: 'Please select a parent' }]}
            >
              <Select
                placeholder={loadingParents ? 'Loading parents...' : 'Select Parent'}
                disabled={isViewMode || loadingParents || arrParent.length === 0}
                loading={loadingParents}
                notFoundContent={loadingParents ? 'Loading...' : 'No parents available'}
              >
                {arrParent.map((parent) => (
                  <Option key={parent.id || parent.value} value={parent.value || parent.id}>
                    {parent.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtCode"
              label="Item Code"
            // rules={[{ validator: validateCode(isEditMode, initialData?.txtMenuFoodCode) }]}
            >
              <Input
                // placeholder="Enter Food Code"
                prefix={<UilUtensils />}
                disabled={true} // Disabled in edit and view mode
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtName"
              label="Item Name"
              rules={[{ required: true, message: 'Please enter item name' }]}
            >
              <Input placeholder="Enter Name" disabled={isViewMode} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtShortName"
              label="Short Name"
              rules={[{ required: false, message: 'Please enter food name' }]}
            >
              <Input placeholder="Enter Short Name" disabled={isViewMode} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtDescription"
              label="Ingredient"
              rules={[{ required: false, message: 'Please select Ingredient' }]}
            >

              <Input
                placeholder="Enter Ingredient"
                disabled={isViewMode} // Disabled in edit and view mode
              />
              {/* <Select placeholder="Select a Food Type" disabled={isViewMode}>
                {foodTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </Option>
                ))}
              </Select> */}
            </Form.Item>
          </Col>
          {selectedRole == 3 && <Col xs={24} sm={12}>
            <Form.Item
              name="txtPriceMultiplierType"
              label="Multiplier Type"
              rules={[{ required: true, message: 'Please select type' }]}
            >
              <Select
                placeholder="Select type"
                disabled={isViewMode}
              >
                {multiTypes.map((item, idx) => (
                  <Option key={idx} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>}
          {selectedRole == 2 && <>
            <Col xs={24} md={12}>
              <Form.Item name="blnHasSelectionLimit" label="Has Selection Limit" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" disabled={isViewMode} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="numSelectionLimit" label="Selection Limit">
                <Input type="number" placeholder="Enter selection limit" disabled={isViewMode} />
              </Form.Item>
            </Col>
          </>}
          <Col span={12}>
            <Form.Item
              name="numPrice"
              label="Price (£)"
            // rules={[{ message: 'Please enter price' }]}
            >
              <Input type="number" placeholder="Enter Price"
              />
              {/* prefix={<UilMoneyBill />} /> */}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="numDisplayOrder"
              label="Display Order"
            // rules={[{ message: 'Please enter price' }]}
            >
              <Input type="number" placeholder="Enter order number"
              />
              {/* prefix={<UilMoneyBill />} /> */}
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="blnIsSelectable" label="Selectable" valuePropName="checked">
              <Switch
                checkedChildren="Yes"
                unCheckedChildren="No"
                disabled={isViewMode}
                defaultChecked // <--- FIX: Changed defaultChecked={true} to defaultChecked
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="blnIsActive" label="Active" valuePropName="checked">
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                disabled={isViewMode}
                defaultChecked // <--- FIX: Changed defaultChecked={true} to defaultChecked
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="blnIsCompostie" label="Multiple Items" valuePropName="checked">
              <Switch
                checkedChildren="Yes"
                unCheckedChildren="No"
                disabled={isViewMode}
                defaultChecked // <--- FIX: Changed defaultChecked={true} to defaultChecked
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="blnIsCateringItem" label="Catering Item" valuePropName="checked">
              <Switch
                checkedChildren="Yes"
                unCheckedChildren="No"
                disabled={isViewMode}
                defaultChecked // <--- FIX: Changed defaultChecked={true} to defaultChecked
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit/Cancel Buttons - only visible in Edit/Add mode */}
        {!isViewMode && (
          <Form.Item style={{ marginTop: '30px' }}>
            <Button onClick={onCancel} style={{ marginRight: '8px' }}>Close</Button>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              {isEditMode ? 'Update Item' : 'Add Item'}
            </Button>
          </Form.Item>
        )}
        {/* Close button for View Mode */}
        {isViewMode && (
          <Form.Item style={{ marginTop: '30px' }}>
            <Button onClick={onCancel}>Close</Button>
          </Form.Item>
        )}
      </Form>
      {/* </Main> */}
    </StyledFullModal>
  );
}

MenuFoodItem.propTypes = {
  visible: propTypes.bool.isRequired,
  initialData: propTypes.object,
  onCancel: propTypes.func.isRequired,
  onOk: propTypes.func.isRequired,
  allExistingFoodCodes: propTypes.arrayOf(propTypes.string).isRequired,
  isViewMode: propTypes.bool,
};

export default MenuFoodItem;

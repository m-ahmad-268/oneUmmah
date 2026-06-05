// src/container/pages/CateringFormModal.js

import React, { useEffect } from 'react';
import { Form, Input, Button, message, Select, Row, Col, Switch } from 'antd';
import propTypes from 'prop-types';

// Third-party icon imports
import UilUtensils from '@iconscout/react-unicons/icons/uil-utensils'; // For food icon

// Internal/relative imports - adjusted order
import { StyledFullModal } from './customer-modal-style';
import { Main } from '../styled';

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

function CateringFormModal({ visible, initialData, onCancel, onOk, allExistingFoodCodes, isViewMode }) {
  const [form] = Form.useForm();

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

  // Effect to set form fields when initialData changes (for editing or adding)
  useEffect(() => {
    if (visible) {
      if (initialData) {
        // Editing an existing food item
        const foodTypeString = getFoodTypeString(initialData);
        form.setFieldsValue({
          txtMenuFoodCode: initialData.txtMenuFoodCode || '',
          txtMenuFoodName: initialData.txtMenuFoodName || '',
          foodType: foodTypeString, // Set selected value for the dropdown
          blnIsActive: initialData.blnIsActive === true,
        });
      } else {
        // Adding a new food item
        form.resetFields();
        const newCode = generateUniqueFoodCode(allExistingFoodCodes); // Auto-generate code
        form.setFieldsValue({
          txtMenuFoodCode: newCode, // Set auto-generated code
          foodType: '', // Default empty selection for new
          blnIsActive: true,
        });
      }
    }
  }, [visible, initialData, form, allExistingFoodCodes]);

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

    const selectedFoodType = values.foodType;

    // Construct the payload with only one blnIsXxx set to true
    const payload = {
      serMenuFoodId: initialData?.serMenuFoodId || null, // 0 for new, existing ID for update
      txtMenuFoodCode: values.txtMenuFoodCode,
      txtMenuFoodName: values.txtMenuFoodName,
      blnIsMainCourse: selectedFoodType === 'MainCourse',
      blnIsAppetiser: selectedFoodType === 'Appetiser',
      blnIsStarter: selectedFoodType === 'Starter',
      blnIsSaladAndCondiment: selectedFoodType === 'SaladAndCondiment',
      blnIsDessert: selectedFoodType === 'Dessert',
      blnIsDrink: selectedFoodType === 'Drink',
      blnIsActive: values.blnIsActive,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}menuFoodMaster/saveOrUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      if (data.code === 200 && data.status === 'OK') {
        message.success(`Food item ${initialData ? 'updated' : 'added'} successfully!`);
        onOk(); // Close modal and trigger refresh in parent
      } else {
        throw new Error(data.message || 'Failed to save food item');
      }
    } catch (e) {
      message.error(`Error saving food item: ${e.message}`);
    }
  };

  const isEditMode = !!initialData; // Convenience variable for edit mode

  return (
    <StyledFullModal
      title={isViewMode ? 'View Food Item' : isEditMode ? 'Edit Food Item' : 'Add New Food Item'}
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
          blnIsActive: true,
          foodType: '', // Ensure foodType is initialized
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtMenuFoodCode"
              label="Food Code"
              rules={[{ validator: validateCode(isEditMode, initialData?.txtMenuFoodCode) }]}
            >
              <Input
                placeholder="Enter Food Code"
                prefix={<UilUtensils />}
                disabled={isEditMode || isViewMode} // Disabled in edit and view mode
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtMenuFoodName"
              label="Food Name"
              rules={[{ required: true, message: 'Please enter food name' }]}
            >
              <Input placeholder="Enter Food Name" prefix={<UilUtensils />} disabled={isViewMode} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="foodType"
              label="Food Type"
              rules={[{ required: true, message: 'Please select a food type' }]}
            >
              <Select placeholder="Select a Food Type" disabled={isViewMode}>
                {foodTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type.replace(/([A-Z])/g, ' $1').trim()} {/* Convert 'MainCourse' to 'Main Course' */}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="blnIsActive" label="Status" valuePropName="checked">
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
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
              {isEditMode ? 'Update Food Item' : 'Add Food Item'}
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

CateringFormModal.propTypes = {
  visible: propTypes.bool.isRequired,
  initialData: propTypes.object,
  onCancel: propTypes.func.isRequired,
  onOk: propTypes.func.isRequired,
  allExistingFoodCodes: propTypes.arrayOf(propTypes.string).isRequired,
  isViewMode: propTypes.bool,
};

export default CateringFormModal;

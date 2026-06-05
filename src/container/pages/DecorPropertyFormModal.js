// src/container/pages/DecorPropertyFormModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, message, Col, Row, Button, InputNumber } from 'antd';
import { StyledFullModal } from './customer-modal-style';
import {
  UilMoneyBill
} from '@iconscout/react-unicons';

const { Option } = Select;

function DecorPropertyFormModal({ visible, initialData, onCancel, onOk, allCategories, isViewMode }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem('access_token_admin');

  useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue({
        ...initialData,
        serDecorCategoryId: initialData.parentCategory.serDecorCategoryId,
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialData, form]);

  const handleSave = async (values) => {
    setLoading(true);

    try {
      const selectedCategory = allCategories.find(cat => cat.serDecorCategoryId === values.serDecorCategoryId);
      if (!selectedCategory) {
        throw new Error('Selected category not found.');
      }

      // We will build a single, clean payload here
      const payload = {
        txtPropertyName: values.txtPropertyName,
        txtInputType: values.txtInputType,
        txtRemarks: values.txtRemarks,
        numPrice: values.numPrice !== undefined && values.numPrice !== '' ? Number(values.numPrice) : 0,
        numDisplayOrder: values?.numDisplayOrder ? Number(values?.numDisplayOrder) : 0,
        blnIsRequired: values.blnIsRequired || false,
        blnIsActive: values.blnIsActive == true,
        serDecorCategoryId: selectedCategory.serDecorCategoryId,
        txtDecorCategoryCode: selectedCategory.txtDecorCategoryCode,
        txtDecorCategoryName: selectedCategory.txtDecorCategoryName,
      };

      // If we are in 'edit' mode, add the serPropertyId to the payload
      if (initialData) {
        payload.serPropertyId = initialData.serPropertyId;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}decorCategoryPropertyMaster/saveOrUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.code === 200) {
        message.success(initialData ? 'Property updated successfully!' : 'Property added successfully!');
        form.resetFields();
        onOk(); // Signal to parent to re-fetch all data
      } else {
        throw new Error(data.message || 'Save failed');
      }
    } catch (e) {
      console.error('API Error:', e);
      message.error(e.message || 'Failed to save property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledFullModal
      title={isViewMode ? 'View Property' : (initialData ? 'Edit Property' : 'Add New Property')}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="70vw"
      height="80vh"
    >

      {/* <Modal
        title={isViewMode ? 'View Property' : (initialData ? 'Edit Property' : 'Add New Property')}
        visible={visible}
        onCancel={onCancel}
        footer={!isViewMode && [
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
            Save
          </Button>
        ]}
      > */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        disabled={isViewMode}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="serDecorCategoryId"
              label="Parent Category"
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select placeholder="Select a category" disabled={!!initialData}>
                {!!initialData && allCategories.map(cat => (
                  <Option key={cat.serDecorCategoryId} value={cat.serDecorCategoryId}>
                    {cat.txtDecorCategoryName} ({cat.txtDecorCategoryCode})
                  </Option>
                ))}
                {!initialData && allCategories.filter(x => x.blnIsActive == true).map(cat => (
                  <Option key={cat.serDecorCategoryId} value={cat.serDecorCategoryId}>
                    {cat.txtDecorCategoryName} ({cat.txtDecorCategoryCode})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="txtPropertyName"
              label="Property Name"
              rules={[{ required: true, message: 'Please enter a property name!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="txtInputType"
              label="Input Type"
              rules={[{ required: true, message: 'Please select an input type!' }]}
            >
              <Select placeholder="Select input type">
                <Option value="dropdown">Dropdown</Option>
                <Option value="image">Image</Option>

              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="numDisplayOrder"
              label="Display Order"
            // rules={[{ message: 'Please enter display order!' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="numPrice"
              label="Price (£)"
              // rules={[{ message: 'Please enter price!' }]}
            >
              <Input type="number" prefix={<UilMoneyBill />} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="txtRemarks"
              label="Remarks"
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>


        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="blnIsRequired"
              label="Required"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="blnIsActive"
              label="Active"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ display: 'flex', gap: '5px', marginTop: "30px" }}>
        <Button key="back" onClick={onCancel}>
          Close
        </Button>
        {!isViewMode && <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Save
        </Button>}
      </div>
      {/* </Modal> */}
    </StyledFullModal>
  );
}

export default DecorPropertyFormModal;
// src/container/pages/VenueFormModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Button, Col, Row, Switch, Divider, Tooltip } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { StyledFullModal } from './customer-modal-style';
import { getGenerateVenueCode } from '../../services/commonService';

const { Option } = Select;

function VenueFormModal({ visible, initialData, onCancel, onOk, cities, allExistingCodes, isViewMode }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem('access_token_admin');

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          txtVenueCode: initialData.txtVenueCode,
          txtVenueName: initialData.txtVenueName,
          txtAddress: initialData.txtAddress,
          serCityId: initialData.cityMaster?.serCityId,
          txtPhoneNumber: initialData.txtPhoneNumber,
          txtEmailAddress: initialData.txtEmailAddress,
          txtWebLink: initialData.txtWebLink,
          blnIsActive: initialData.blnIsActive,
          venueMasterDetails: initialData.venueMasterDetails?.map(hall => ({
            serVenueMasterDetailId: hall.serVenueMasterDetailId,
            txtHallCode: hall.txtHallCode,
            txtHallName: hall.txtHallName,
            numCapacity: hall.numCapacity,
            txtCapacity: hall.txtCapacity,
            numPrice: hall.numPrice,
            blnIsActive: hall.blnIsActive,
          })) || [],
        });
      } else {
        form.resetFields();
        generateVenueCode();
      }
    }
  }, [visible, initialData, form]);

  const generateVenueCode = async () => {
    try {
      setLoading(true);
      const data = await getGenerateVenueCode();
      if (data && data?.code == 200 && data?.result) {
        form.setFieldValue('txtVenueCode', data?.result);
      }
      setLoading(false);
    } catch (error) {
      console.error('Server error', error?.message);
      setLoading(false);
    }
  };

  const validateVenueCode = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please enter a venue code!'));
    }
    const isCodeExists = allExistingCodes.includes(value.toUpperCase());
    if (isCodeExists && (!initialData || value.toUpperCase() !== initialData.txtVenueCode.toUpperCase())) {
      return Promise.reject(new Error('This venue code already exists!'));
    }
    return Promise.resolve();
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      const venueData = {
        txtVenueCode: values.txtVenueCode.toUpperCase(),
        txtVenueName: values.txtVenueName,
        txtAddress: values.txtAddress,
        serCityId: values.serCityId,
        txtPhoneNumber: values.txtPhoneNumber,
        txtEmailAddress: values.txtEmailAddress,
        txtWebLink: values.txtWebLink,
        blnIsActive: !!values?.blnIsActive,
        venueMasterDetails: (values.venueMasterDetails || []).map(hall => ({
          ...(hall.serVenueMasterDetailId ? { serVenueMasterDetailId: hall.serVenueMasterDetailId } : {}),
          txtHallCode: hall.txtHallCode?.toUpperCase(),
          txtHallName: hall.txtHallName,
          numCapacity: Number(hall.numCapacity),
          txtCapacity: hall.txtCapacity || '',
          numPrice: Number(hall.numPrice),
          blnIsActive: !!hall.blnIsActive,
        })),
      };

      if (initialData) {
        venueData.serVenueMasterId = initialData.serVenueMasterId;
      }

      const formData = new FormData();
      formData.append('venueData', JSON.stringify(venueData));

      const emptyFile = new Blob([''], { type: 'text/plain' });
      formData.append('files', emptyFile, 'empty.txt');

      const response = await fetch(`${process.env.REACT_APP_API_URL}venueMaster/saveVenue`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await response.json();
      if (data.code === 200) {
        message.success(initialData ? 'Venue updated successfully!' : 'Venue added successfully!');
        form.resetFields();
        onOk();
      } else {
        throw new Error(data.message || 'Save failed');
      }
    } catch (e) {
      console.error('API Error:', e);
      message.error(e.message || 'Failed to save venue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledFullModal
      title={isViewMode ? 'View Venue' : (initialData ? 'Edit Venue' : 'Add New Venue')}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="70vw"
      height="80vh"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        disabled={isViewMode}
      >
        {/* Venue-level fields */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="txtVenueCode"
              label="Venue Code"
              rules={[
                { required: true, message: '' },
                { validator: validateVenueCode },
              ]}
            >
              <Input disabled={true} placeholder="Auto-generated" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="txtVenueName"
              label="Venue Name"
              rules={[{ required: true, message: 'Please enter a venue name!' }]}
            >
              <Input placeholder="Enter Venue Name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="txtAddress"
              label="Address"
              rules={[{ required: true, message: 'Please enter an address!' }]}
            >
              <Input.TextArea placeholder="Enter Address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="serCityId"
              label="City"
              rules={[{ required: true, message: 'Please select a city!' }]}
            >
              <Select placeholder="Select a city">
                {cities?.map(city => (
                  <Option key={city.serCityId} value={city.serCityId}>
                    {city.txtCityName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="txtPhoneNumber"
              label="Phone Number"
            >
              <Input placeholder="Enter Phone Number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="txtEmailAddress"
              label="Email Address"
              rules={[
                { type: 'email', message: 'The input is not a valid email!' },
              ]}
            >
              <Input placeholder="Enter Email Address" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="txtWebLink"
              label="Web Link"
            >
              <Input placeholder="Enter Web Link" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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

        {/* Hall Details */}
        <Divider orientation="left">Hall Details</Divider>

        <Form.List name="venueMasterDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{ marginBottom: 16, padding: 16, border: '1px solid #d9d9d9', borderRadius: 4 }}
                >
                  {/* Hidden field for existing hall ID */}
                  <Form.Item {...restField} name={[name, 'serVenueMasterDetailId']} hidden>
                    <Input />
                  </Form.Item>

                  <Row gutter={16} align="middle">
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'txtHallCode']}
                        label="Hall Code"
                        rules={[{ required: true, message: 'Please enter hall code!' }]}
                      >
                        <Input placeholder="Hall Code" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'txtHallName']}
                        label="Hall Name"
                        rules={[{ required: true, message: 'Please enter hall name!' }]}
                      >
                        <Input placeholder="Hall Name" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'numCapacity']}
                        label="Capacity"
                        rules={[{ required: true, message: 'Required!' }]}
                      >
                        <Input type="number" placeholder="Capacity" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'numPrice']}
                        label="Price"
                        rules={[{ required: true, message: 'Required!' }]}
                      >
                        <Input type="number" placeholder="Price" min={0} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16} align="middle">
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'txtCapacity']}
                        label="Capacity Description"
                      >
                        <Input placeholder="e.g. Up to 500 Guests" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'blnIsActive']}
                        label="Active"
                        valuePropName="checked"
                        initialValue={true}
                      >
                        <Switch />
                      </Form.Item>
                    </Col>
                    {!isViewMode && (
                      <Col span={4} style={{ display: 'flex', alignItems: 'center', paddingTop: 8 }}>
                        <Tooltip title="Remove Hall">
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ fontSize: 20, color: '#ff4d4f', cursor: 'pointer' }}
                          />
                        </Tooltip>
                      </Col>
                    )}
                  </Row>
                </div>
              ))}

              {!isViewMode && (
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Hall
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </Form>

      <div style={{ marginTop: 30 }}>
        <Button key="back" onClick={onCancel}>
          Close
        </Button>
        {!isViewMode && (
          <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()} style={{ marginLeft: 8 }}>
            Save
          </Button>
        )}
      </div>
    </StyledFullModal>
  );
}

export default VenueFormModal;

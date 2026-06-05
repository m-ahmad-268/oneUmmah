// src/container/pages/CustomerFormModal.js

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Select, Row, Col, Switch } from 'antd';
import propTypes from 'prop-types'; // <--- ADDED: Import propTypes for validation

// Third-party icon imports
import UilUser from '@iconscout/react-unicons/icons/uil-user';
import UilEnvelope from '@iconscout/react-unicons/icons/uil-envelope';
import UilPhone from '@iconscout/react-unicons/icons/uil-phone';
import UilHeart from '@iconscout/react-unicons/icons/uil-heart';
import UilMapMarker from '@iconscout/react-unicons/icons/uil-map-marker';

// Internal/relative imports - adjusted order
import { StyledFullModal } from './customer-modal-style';
import { Main } from '../styled'; // <--- MOVED: This import now comes after third-party
import { getAllActiveCities, getGenerateCustomerCode } from '../../services/commonService';

const { Option } = Select;

// Dummy city data for the dropdown. In a real app, you'd fetch this from an API.
const cities = [
  { value: 'LHR', label: 'Lahore' },
  { value: 'KHI', label: 'Karachi' },
  { value: 'ISB', label: 'Islamabad' },
  { value: 'NYC', label: 'New York' },
  { value: 'LDN', label: 'London' },
];


function CustomerFormModal({ visible, initialData, onCancel, onOk, isViewMode }) {
  const [form] = Form.useForm();
  const [arrCity, setArrCity] = useState([]);

  const getAllCities = async () => {
    try {
      const data = await getAllActiveCities();
      if (data && data?.code == 200 && data?.result && data.result?.length) {
        // const arr = data.result.map(x => {
        //   return {
        //     ...x,
        //     label: x?.txtCityName || '',
        //     value: x?.txtCityCode || '',
        //   }
        // })
        setArrCity(data.result);
      }

    } catch (error) {
      console.log('Server Error', error?.message);

    }
  };

  useEffect(() => {
    getAllCities();
  }, []);

  const generateCustomerCode = async () => {
    try {
      // setLoading(true);
      const data = await getGenerateCustomerCode();
      if (data && data?.code == 200 && data?.result) {
        form.setFieldsValue({
          txtCustCode: data.result,
          blnIsActive: true,
        });
      }
      // setLoading(false);
    } catch (error) {
      console.error('Server error', error?.message);
      // setLoading(false);
    }


  };


  useEffect(() => {
    if (visible && initialData) {
      console.log(initialData);
      form.setFieldsValue({
        txtCustCode: initialData.txtCustCode || '',
        txtFirstName: initialData.txtFirstName || '',
        txtLastName: initialData.txtLastName || '',
        txtEmail: initialData.txtEmail || '',
        txt_phone_number_1: initialData.txt_phone_number_1 || '',
        txtCityCode: initialData.txtPostalCode || '', // Use code for select
        txtCountryName: 'United Kingdom',
        blnIsActive: initialData.blnIsActive,
        serCityId: initialData?.serCityId || '',
        // txtCountryName: initialData.countryMaster || '',
      });
    } else if (visible && !initialData) {
      // Reset form for adding new
      form.resetFields();
      generateCustomerCode();
    }
  }, [visible, initialData, form]);


  const accessToken = localStorage.getItem('access_token_admin');

  const handleSubmit = async (values) => {
    const payload = {
      ...values, // Form values (txtFirstName, txtLastName, etc.)
      serCustId: initialData ? initialData.serCustId : null, // Include serCustId for edit, 0 for new
      blnIsActive: values.blnIsActive, // Keep status active by default for new
      blnIsApproved: initialData ? initialData.blnIsApproved : true, // Keep approved by default for new
      // Default/empty values for other fields not in the form but required by API
      txtAddress1: initialData?.txtAddress1 || '',
      txtAddress2: initialData?.txtAddress2 || '',
      address3: initialData?.address3 || '',
      txtCustName: `${values.txtFirstName || ''} ${values.txtLastName || ''}`,
      txt_phone_number_2: initialData?.txt_phone_number_2 || '',
      comments: initialData?.comments || '',
      num_longitude: initialData?.num_longitude || 0,
      numLatitude: initialData?.numLatitude || 0,
      txtGMapUrl: initialData?.txtGMapUrl || '',
      txtStreetName: initialData?.txtStreetName || '',
      txtBuildingName: initialData?.txtBuildingName || '',
      txtBuildingNumber: initialData?.txtBuildingNumber || '',
      txtPostalCode: initialData?.txtPostalCode || '',
      txtDistrict: initialData?.txtDistrict || '',
      txtStateCode: initialData?.txtStateCode || '',
      txtStateName: initialData?.txtStateName || '',
      serCityId: values.serCityId || '', // Get city name from code

      // txtCityName: values.txtCityCode || '' ? cities.find((c) => c.value === values.txtCityCode)?.label : '', // Get city name from code
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}customerMaster/saveOrUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.code === 200 && data.status === 'OK') {
        console.log(data.result);

        message.success(`Customer ${initialData ? 'updated' : 'added'} successfully!`);
        onOk(); // Close modal and trigger refresh in parent
      } else {
        throw new Error(data.message || 'Failed to save customer');
      }
    } catch (e) {
      message.error(`Error saving customer: ${e.message}`);
    }
  };

  return (
    <StyledFullModal
      title={initialData ? 'Edit Customer' : 'Add New Customer'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="70vw"
      height="80vh"
      style={{ width: '100%' }}
    >
      {/* <Main> */}
      <Form
        disabled={isViewMode}
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          txtFirstName: '',
          txtLastName: '',
          txtEmail: '',
          txt_phone_number_1: '',
          txtCityCode: '',
          blnIsActive: true,
          txtCountryName: 'United Kingdom',
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtCustCode"
              label="Customer Code"
            // rules={[{ validator: validateCode(isEditMode, initialData?.txtEventTypeCode, null) }]}
            >
              <Input disabled={true} placeholder="Enter Customer Code" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtFirstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input placeholder="Enter First Name" prefix={<UilUser />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtLastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input placeholder="Enter Last Name" prefix={<UilUser />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtEmail"
              label="Email"
              rules={[{ required: true, message: 'Please enter email', type: 'email' }]}
            >
              <Input placeholder="Enter Email" prefix={<UilEnvelope />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txt_phone_number_1"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input placeholder="Enter Phone Number" prefix={<UilPhone />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="txtCountryName" label="Country">
              <Input disabled={true} placeholder="Enter Country" prefix={<UilMapMarker />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="serCityId" label="City">
              {!!arrCity?.length && <Select placeholder="Select a City" prefix={<UilMapMarker />}>
                {arrCity.map((city) => (
                  <Option key={city.serCityId} value={city.serCityId}>
                    {city.txtCityName}
                  </Option>
                ))}
              </Select>}
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item name="blnIsActive" label="Status" valuePropName="checked">
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              // disabled={isViewMode}
              // defaultChecked // Fixed boolean value
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Form.Item>
        <Button onClick={onCancel} style={{ marginRight: '8px' }}>Close</Button>
        {!isViewMode && <Button type="primary" onClick={() => {
          form.submit();
        }} htmlType="button" style={{ marginRight: '8px' }}>
          {initialData ? 'Update Customer' : 'Add Customer'}
        </Button>}
      </Form.Item>
      {/* </Main> */}
    </StyledFullModal>
  );
}

// <--- ADDED: PropTypes validation for CustomerFormModal
CustomerFormModal.propTypes = {
  visible: propTypes.bool.isRequired,
  initialData: propTypes.object, // Can be null for new customer, so not isRequired
  onCancel: propTypes.func.isRequired,
  onOk: propTypes.func.isRequired,
};

export default CustomerFormModal;

import React, { useEffect } from 'react';
import { Form, Input, Button, message, Row, Col, Switch } from 'antd';
import propTypes from 'prop-types';

// Third-party icon imports
import UilBuilding from '@iconscout/react-unicons/icons/uil-building'; // For vendor/building icon
import UilUser from '@iconscout/react-unicons/icons/uil-user'; // For name icon
import UilMapMarker from '@iconscout/react-unicons/icons/uil-map-marker'; // For address icon
import UilPhone from '@iconscout/react-unicons/icons/uil-phone'; // For phone number icon

// Internal/relative imports - adjusted order
import { StyledFullModal } from './customer-modal-style';
import { Main } from '../styled';
import { getGenerateVendorCode } from '../../services/commonService';

function VendorFormModal({ visible, initialData, onCancel, onOk, allExistingVendorCodes, isViewMode }) {
  const [form] = Form.useForm();

  const accessToken = localStorage.getItem('access_token_admin');

  // Helper to generate a unique vendor code
  const generateUniqueVendorCode = (existingCodes) => {
    const prefix = 'VEN-';
    let maxNum = 0;
    existingCodes.forEach((code) => {
      if (code && code.startsWith(prefix)) {
        const numPart = parseInt(code.substring(prefix.length), 10);
        if (!Number.isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });
    return `${prefix}${String(maxNum + 1).padStart(3, '0')}`; // VEN-001, VEN-002, etc.
  };

  // Effect to set form fields when initialData changes (for editing or adding)
  useEffect(() => {
    if (visible) {
      if (initialData) {
        // Editing an existing vendor
        form.setFieldsValue({
          txtVendorCode: initialData.txtVendorCode || '',
          txtVendorName: initialData.txtVendorName || '',
          enmVendorType: initialData.enmVendorType || '',
          txtAddress: initialData.txtAddress || '',
          txtPhoneNumber: initialData.txtPhoneNumber || '',
          blnIsActive: initialData.blnIsActive === true,
        });
      } else {
        // Adding a new vendor
        form.resetFields();
        // const newCode = generateUniqueVendorCode(allExistingVendorCodes); // Auto-generate code
        generateVendorCode();
        // form.setFieldsValue({
        //   txtVendorCode: newCode, // Set auto-generated code
        //   enmVendorType: '', // Default empty
        //   blnIsActive: true,
        // });
      }
    }
  }, [visible, initialData, form, allExistingVendorCodes]);

  const generateVendorCode = async () => {
    try {
      // setLoading(true);

      const data = await getGenerateVendorCode();
      if (data && data?.code == 200 && data?.result) {
        // form.setFieldValue('txtVendorCode', data?.result);
        form.setFieldsValue({
          txtVendorCode: data?.result, // Set auto-generated code
          enmVendorType: '', // Default empty
          blnIsActive: true,
        });
      }

      // setLoading(false);
    } catch (error) {
      console.error('Server error', error?.message);
      // setLoading(false);
    }


  };

  // Custom validator for vendor codes
  const validateCode = (isEditModeProp, originalCode) => (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vendor Code cannot be empty'));
    }

    // When editing, the original code for that specific item is allowed
    if (isEditModeProp && value === originalCode) {
      return Promise.resolve();
    }

    // For new items or changed codes during edit, check against all existing codes
    const codesToCheckAgainst = allExistingVendorCodes.filter((code) => {
      // If we are editing and this is the original code of the item being edited, exclude it from the check
      if (isEditModeProp && originalCode && originalCode === code) {
        return false;
      }
      return true; // Include all other codes for uniqueness check
    });

    if (codesToCheckAgainst.includes(value)) {
      return Promise.reject(new Error('Vendor Code already exists! Please enter a unique code.'));
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    if (isViewMode) {
      message.info('You are in view mode. Cannot submit changes.');
      return;
    }

    const payload = {
      serVendorId: initialData?.serVendorId || null, // 0 for new, existing ID for update
      txtVendorCode: values.txtVendorCode,
      txtVendorName: values.txtVendorName,
      enmVendorType: values.enmVendorType,
      txtAddress: values.txtAddress,
      txtPhoneNumber: values.txtPhoneNumber,
      blnIsActive: values.blnIsActive,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}vendorMaster/saveOrUpdate`, {
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
        message.success(`Vendor ${initialData ? 'updated' : 'added'} successfully!`);
        onOk(); // Close modal and trigger refresh in parent
      } else {
        throw new Error(data.message || 'Failed to save vendor');
      }
    } catch (e) {
      message.error(`Error saving vendor: ${e.message}`);
    }
  };

  const isEditMode = !!initialData; // Convenience variable for edit mode

  return (
    <StyledFullModal
      title={isViewMode ? 'View Vendor' : isEditMode ? 'Edit Vendor' : 'Add New Vendor'}
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
          enmVendorType: '', // Ensure vendorType is initialized
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtVendorCode"
              label="Vendor Code"
              rules={[{ validator: validateCode(isEditMode, initialData?.txtVendorCode) }]}
            >
              <Input
                placeholder="Enter Vendor Code"
                prefix={<UilBuilding />}
                disabled={true || isEditMode || isViewMode} // Disabled in edit and view mode
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtVendorName"
              label="Vendor Name"
              rules={[{ required: true, message: 'Please enter vendor name' }]}
            >
              <Input placeholder="Enter Vendor Name" prefix={<UilUser />} disabled={isViewMode} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="enmVendorType"
              label="Vendor Type"
              rules={[{ required: true, message: 'Please enter vendor type' }]}
            >
              <Input
                placeholder="Enter Vendor Type (e.g., CATERING, DECORATION)"
                prefix={<UilBuilding />}
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtPhoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input placeholder="Enter Phone Number" type='number' prefix={<UilPhone />} disabled={isViewMode} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24}>
            {' '}
            {/* Full width for address */}
            <Form.Item
              name="txtAddress"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input.TextArea rows={3} placeholder="Enter Address" prefix={<UilMapMarker />} disabled={isViewMode} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="blnIsActive" label="Status" valuePropName="checked">
              <Switch
                // checkedChildren="Active"
                // unCheckedChildren="Inactive"
                disabled={isViewMode}
                defaultChecked // Fixed boolean value
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit/Cancel Buttons - only visible in Edit/Add mode */}
        {!isViewMode && (
          <Form.Item style={{ marginTop: '30px' }}>
            <Button onClick={onCancel} style={{ marginRight: '8px' }}>Close</Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? 'Update Vendor' : 'Add Vendor'}
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

VendorFormModal.propTypes = {
  visible: propTypes.bool.isRequired,
  initialData: propTypes.object,
  onCancel: propTypes.func.isRequired,
  onOk: propTypes.func.isRequired,
  allExistingVendorCodes: propTypes.arrayOf(propTypes.string).isRequired,
  isViewMode: propTypes.bool,
};

export default VendorFormModal;

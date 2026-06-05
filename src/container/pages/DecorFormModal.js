// src/container/pages/DecorFormModal.js

import React, { useEffect, useState, useCallback } from 'react';
import { Form, Input, Button, message, Select, Row, Col, Switch, Upload, InputNumber } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import propTypes from 'prop-types';

import {
  UilBuilding, // Reusing existing icons conceptually
  UilTagAlt,
  UilMoneyBill,
  UilFileAlt,
  UilPuzzlePiece,
} from '@iconscout/react-unicons';

import { Main } from '../styled';
import { StyledFullModal } from './customer-modal-style';

const { Option } = Select;
const { TextArea } = Input;

function DecorFormModal({ visible, initialData, onCancel, onOk, allExistingCodes, isViewMode }) {
  const [form] = Form.useForm();

  const accessToken = localStorage.getItem('access_token_admin');

  // Using a local state to generate unique codes for new items within the modal,
  // ensuring they don't clash with existing ones.
  const [localExistingCodes, setLocalExistingCodes] = useState(new Set(allExistingCodes));

  useEffect(() => {
    setLocalExistingCodes(new Set(allExistingCodes));
  }, [allExistingCodes]);

  const generateUniqueCode = useCallback((prefix, codesSet) => {
    let maxNum = 0;
    // Iterate through current codes in the set to find max number for prefix
    codesSet.forEach((code) => {
      if (code && code.startsWith(prefix)) {
        const numPart = parseInt(code.substring(prefix.length), 10);
        if (!Number.isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });
    const newCode = `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
    codesSet.add(newCode); // Add new code to the set to prevent duplicates within the same form session
    return newCode;
  }, []);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        console.log('DecorFormModal: initialData received for edit/view:', initialData);
        form.setFieldsValue({
          txtDecorCategoryCode: initialData.txtDecorCategoryCode || '',
          txtDecorCategoryName: initialData.txtDecorCategoryName || '',
          numPrice: initialData.numPrice || '',
          numDisplayOrder: initialData.numDisplayOrder || '',
          blnIsActive: initialData.blnIsActive === true,
          // Map properties and their values for Ant Design Form.List
          categoryProperties:
            initialData.categoryProperties?.map((prop) => ({
              ...prop,
              key: prop.serPropertyId || `new-prop-${Math.random().toString(36).substring(7)}`,
              blnIsRequired: prop.blnIsRequired === true,
              blnIsActive: prop.blnIsActive === true,
              // Map property values
              propertyValues:
                prop.propertyValues?.map((val) => ({
                  ...val,
                  key: val.serPropertyValueId || `new-val-${Math.random().toString(36).substring(7)}`,
                })) || [],
            })) || [],
          // Map existing documents for Upload component
          referenceDocuments:
            initialData.referenceDocuments && initialData.referenceDocuments.length > 0
              ? initialData.referenceDocuments.map((doc) => {
                let imageUrl = '';
                if (doc.txtDocumentUrl) {
                  const basePathOnServer = '/home/talha/Desktop/diamondMedia'; // This must match your server config
                  const mediaPathIndex = doc.txtDocumentUrl.indexOf(basePathOnServer);
                  if (mediaPathIndex !== -1) {
                    const relativePath = doc.txtDocumentUrl.substring(mediaPathIndex + basePathOnServer.length);
                    // Construct the HTTP URL. Adjust http://localhost:8080/media to your actual static file endpoint
                    imageUrl = `http://localhost:8080/media${relativePath}`;
                  } else {
                    // Fallback if path format is unexpected, might be a direct URL already
                    imageUrl = doc.txtDocumentUrl;
                  }
                }
                return {
                  uid: String(doc.documentId || `existing-doc-${Math.random().toString(36).substring(7)}`),
                  name: doc.originalName || 'image',
                  status: 'done',
                  url: imageUrl,
                  response: doc, // Store original document data for `handleSubmit`
                };
              })
              : [],
        });
      } else {
        // Reset form for adding new decor
        form.resetFields();
        const newDecorCode = generateUniqueCode('DCR-', localExistingCodes);
        form.setFieldsValue({
          txtDecorCategoryCode: newDecorCode,
          blnIsActive: true,
          categoryProperties: [],
          referenceDocuments: [],
        });
      }
    }
  }, [visible, initialData, form, generateUniqueCode, localExistingCodes]);

  const validateCode = useCallback(
    (isEditModeProp, originalCode, currentItemId, prefixType) => (_, value) => {
      if (!value) {
        return Promise.reject(new Error('Code cannot be empty'));
      }

      // For editing, if the code hasn't changed, it's valid
      if (isEditModeProp && value === originalCode) {
        return Promise.resolve();
      }

      // For category codes, check against all existing codes from fetched data
      // For property codes, check against other property codes AND category codes
      let codesToCompare = new Set(allExistingCodes); // Start with all codes
      if (prefixType === 'DCR-PRP-') {
        // If validating a property code, we only care about other property codes or category codes,
        // but not the *current* property code's original value if in edit mode.
        // This is complex for nested items, simplest is to let backend handle strict uniqueness if possible,
        // or ensure that generated codes for new items are unique enough.
        // For frontend validation, we'll generally check against all codes.
      }

      if (codesToCompare.has(value)) {
        return Promise.reject(new Error('Code already exists! Please enter a unique code.'));
      }
      return Promise.resolve();
    },
    [allExistingCodes],
  );

  const isEditMode = !!initialData;

  // Helper for logging FormData contents for debugging
  const logFormData = (formData, name) => {
    console.log(`--- FormData for ${name} ---`);
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File || pair[1] instanceof Blob) {
        console.log(`${pair[0]}: File - Name: ${pair[1].name}, Type: ${pair[1].type}, Size: ${pair[1].size} bytes`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }
    console.log(`--- End FormData for ${name} ---`);
  };

  const handleSubmit = async (values) => {
    if (isViewMode) {
      message.info('You are in view mode. Cannot submit changes.');
      return;
    }

    message.loading('Saving decor...', 0);

    try {
      // --- Step 1: Save Decor Category (with files) ---
      const categoryFilesToUpload = [];
      const categoryDocumentsPayload = []; // For referenceDocuments in categoryData

      if (values.referenceDocuments && values.referenceDocuments.length > 0) {
        values.referenceDocuments.forEach((file) => {
          if (file.originFileObj) {
            // New file being uploaded for the category
            categoryFilesToUpload.push(file.originFileObj);
            categoryDocumentsPayload.push({ originalName: file.name });
          } else if (file.status === 'done' && file.response) {
            // Existing file, retain its metadata
            categoryDocumentsPayload.push({
              documentId: file.response.documentId,
              originalName: file.response.originalName,
            });
          }
        });
      }

      const decorCategoryPayload = {
        serDecorCategoryId: initialData?.serDecorCategoryId || null, // Pass ID for update
        txtDecorCategoryCode: values.txtDecorCategoryCode,
        txtDecorCategoryName: values.txtDecorCategoryName,
        numPrice: values.numPrice,
        numDisplayOrder: values?.numDisplayOrder ? Number(values?.numDisplayOrder) : 0,
        blnIsActive: values.blnIsActive,
        referenceDocuments: categoryDocumentsPayload,
      };

      console.log('Decor Category Payload (for saveOrUpdateWithFiles):', decorCategoryPayload);

      const categoryFormData = new FormData();
      categoryFormData.append('data', JSON.stringify(decorCategoryPayload));

      if (categoryFilesToUpload.length > 0) {
        categoryFilesToUpload.forEach((file) => {
          categoryFormData.append('documents', file, file.name);
          console.log(`Appending category file to FormData: ${file.name}`);
        });
      } else {
        categoryFormData.append('documents', new Blob([]), ''); // Send empty blob if no files
      }
      logFormData(categoryFormData, 'Decor Category FormData');

      const categoryResponse = await fetch(
        `${process.env.REACT_APP_API_URL}decorCategoryMaster/saveOrUpdateWithFiles`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: categoryFormData,
        },
      );

      if (!categoryResponse.ok) {
        const errorText = await categoryResponse.text();
        throw new Error(`Failed to save decor category: ${errorText}`);
      }
      const categoryResult = await categoryResponse.json();
      if (categoryResult.code !== 200 || categoryResult.status !== 'OK') {
        throw new Error(categoryResult.message || 'Failed to save decor category due to API error.');
      }
      const serDecorCategoryId = categoryResult.result.serDecorCategoryId;
      console.log('Decor Category saved/updated. ID:', serDecorCategoryId);

      // --- Step 2: Save Decor Category Properties ---
      const decorProperties = values.categoryProperties || [];
      for (const prop of decorProperties) {
        const decorPropertyPayload = {
          serPropertyId: prop.serPropertyId || null, // Pass ID for update
          txtPropertyName: prop.txtPropertyName,
          txtInputType: prop.txtInputType,
          txtRemarks: prop.txtRemarks,
          blnIsRequired: prop.blnIsRequired,
          blnIsActive: prop.blnIsActive,
          serDecorCategoryId: serDecorCategoryId, // Link to the saved category
          txtDecorCategoryCode: values.txtDecorCategoryCode, // For context
        };
        console.log(`Saving Decor Property: ${prop.txtPropertyName}`, decorPropertyPayload);

        const propertyResponse = await fetch(
          `${process.env.REACT_APP_API_URL}decorCategoryPropertyMaster/saveOrUpdate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify(decorPropertyPayload),
          },
        );

        if (!propertyResponse.ok) {
          const errorText = await propertyResponse.text();
          throw new Error(`Failed to save decor property ${prop.txtPropertyName}: ${errorText}`);
        }
        const propertyResult = await propertyResponse.json();
        if (propertyResult.code !== 200 || propertyResult.status !== 'OK') {
          throw new Error(
            propertyResult.message || `Failed to save decor property ${prop.txtPropertyName} due to API error.`,
          );
        }
        const serPropertyId = propertyResult.result.serPropertyId;
        console.log(`Decor Property "${prop.txtPropertyName}" saved/updated. ID:`, serPropertyId);

        // --- Step 3: Save Decor Category Property Values ---
        const propertyValues = prop.propertyValues || [];
        for (const val of propertyValues) {
          const propertyValuePayload = {
            serPropertyValueId: val.serPropertyValueId || null, // Pass ID for update
            txtPropertyValue: val.txtPropertyValue,
            serPropertyId: serPropertyId, // Link to the saved property
            txtPropertyName: prop.txtPropertyName, // For context
          };
          console.log(
            `Saving Property Value: ${val.txtPropertyValue} for property ${prop.txtPropertyName}`,
            propertyValuePayload,
          );

          const valueResponse = await fetch(`${process.env.REACT_APP_API_URL}decorCategoryPropertyValue/saveOrUpdate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify(propertyValuePayload),
          });

          if (!valueResponse.ok) {
            const errorText = await valueResponse.text();
            throw new Error(`Failed to save property value ${val.txtPropertyValue}: ${errorText}`);
          }
          const valueResult = await valueResponse.json();
          if (valueResult.code !== 200 || valueResult.result === null) {
            // Note: Backend returns null result for values with null blnIsActive?
            console.warn(`Property value ${val.txtPropertyValue} saved but result is null or non-OK status.`);
            // If backend doesn't return serPropertyValueId, we can't ensure it's saved.
            // For now, proceed if status is OK, but keep an eye on backend's response here.
          }
          console.log(`Property Value "${val.txtPropertyValue}" saved/updated.`);
        }
      }

      message.destroy();
      message.success(
        `Decor Category "${values.txtDecorCategoryName}" ${initialData ? 'updated' : 'added'} successfully!`,
      );
      onOk(); // Close modal and refresh table
    } catch (e) {
      message.destroy();
      message.error(`Error saving decor: ${e.message}`);
      console.error('Overall form submission error:', e);
    }
  };

  return (
    <StyledFullModal
      title={isViewMode ? 'View Decor Category' : isEditMode ? 'Edit Decor Category' : 'Add New Decor Category'}
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
          categoryProperties: [],
          referenceDocuments: [],
        }}
      >
        {/* Decor Category Fields */}
        <Row gutter={16}>
          <Col xs={24} sm={24}>
            <Form.Item
              name="txtDecorCategoryCode"
              label="Category Code"
              rules={[{ validator: validateCode(isEditMode, initialData?.txtDecorCategoryCode, null, 'DCR-') }]}
            >
              <Input placeholder="Enter Category Code" prefix={<UilBuilding />} disabled={true} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item
              name="txtDecorCategoryName"
              label="Category Name"
              rules={[{ required: true, message: 'Please enter category name' }]}
            >
              <Input placeholder="Enter Category Name" prefix={<UilTagAlt />} disabled={isViewMode} />
            </Form.Item>
          </Col>

          <Col md={12}>
            <Form.Item
              name="numDisplayOrder"
              label="Display Order"
            // rules={[{ message: 'Please enter display order' }]}
            >
              <Input type="number" placeholder="Enter display order" disabled={isViewMode} />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name="numPrice"
              label="Category Price (£)"
              // rules={[{ message: 'Please enter category price' }]}
            >
              <Input type="number" placeholder="Enter Category Price" prefix={<UilMoneyBill />} disabled={isViewMode} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="blnIsActive" label="Status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" disabled={isViewMode} />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit/Cancel Buttons */}
        {true && (
          <Form.Item style={{ marginTop: '30px' }}>
            <Button onClick={onCancel}>Close</Button>
            {!isViewMode && <Button Button type="primary" htmlType="submit" style={{ marginLeft: '5px' }}>
              {isEditMode ? 'Update Decor' : 'Add Decor'}
            </Button>}
          </Form.Item>
        )}
        {/* {isViewMode && (
          <Form.Item style={{ marginTop: '30px' }}>
            <Button onClick={onCancel}>Close</Button>
          </Form.Item>
        )} */}
      </Form>
      {/* </Main> */}
    </StyledFullModal >
  );
}

DecorFormModal.propTypes = {
  visible: propTypes.bool.isRequired,
  initialData: propTypes.object,
  onCancel: propTypes.func.isRequired,
  onOk: propTypes.func.isRequired,
  allExistingCodes: propTypes.arrayOf(propTypes.string).isRequired,
  isViewMode: propTypes.bool,
};

export default DecorFormModal;

// src/container/pages/DecorPropertyValueFormModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, message, Col, Row, Button, Upload, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { StyledFullModal } from './customer-modal-style';
import { Form as AntForm } from 'antd';

const { Option } = Select;

function DecorPropertyValueFormModal({ visible, initialData, onCancel, onOk, allProperties, isViewMode }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [fileList, setFileList] = useState([]);

  const accessToken = localStorage.getItem('access_token_admin');

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          txtPropertyValue: initialData.txtPropertyValue,
          txtDescription: initialData.txtDescription,
          serPropertyId: initialData.parentProperty.serPropertyId,
          blnIsActive: initialData.blnIsActive,
        });
        setSelectedProperty(initialData.parentProperty);
        if (initialData.document && initialData.document.originalName) {
          const fileUrl = initialData.document?.txtDocumentUrl || 'No Url Found';
          // const fileUrl = `${process.env.REACT_APP_API_URL}decorCategoryProperty/getImage?originalName=${initialData.document.originalName}`;
          setFileList([
            {
              uid: '-1',
              name: initialData.document.originalName,
              status: 'done',
              url: fileUrl,
            },
          ]);
        } else {
          setFileList([]);
        }
      } else {
        form.resetFields();
        setSelectedProperty(null);
        setFileList([]);
      }
    }
  }, [visible, initialData, form, allProperties]);

  const handlePropertyChange = (serPropertyId) => {
    const property = allProperties.find((p) => p.serPropertyId === serPropertyId);
    setSelectedProperty(property);
    setFileList([]);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    if (newFileList.length && newFileList[0]?.size > 3145728) {
      message.info('Maximum upload size exceeded!');
      return;
    }
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error(`${file.name} is not a valid image file!`);
    }
    const returnValue = isImage || Upload.LIST_IGNORE;
    return returnValue;
  };

  const handleSave = async (values) => {
    //     {
    //   "serPropertyId": 4,
    //   "txtPropertyName": "Chair Style",
    //   "txtInputType": "image",
    //   "txtRemarks": "Choose your preferred chair style",
    //   "blnIsRequired": true,
    //   "blnIsActive": true,
    //   "serDecorCategoryId": 101,
    //   "propertyValues": [
    //     {
    //       "txtPropertyValue": "Red Modern Chair",
    //       "serPropertyId": 4,
    //       "txtPropertyName": "Chair Style",
    //       "blnIsActive": true,
    //       "document": {

    //         "originalName": "chair1.jpeg"
    //       }
    //     },
    //     {
    //       "txtPropertyValue": "Blue Modern Chair",
    //       "serPropertyId": 4,
    //       "txtPropertyName": "Chair Style",
    //       "blnIsActive": true,
    //       "document": {

    //         "originalName": "chair2.jpeg"
    //       }
    //     }
    //   ]
    // }\
    setLoading(true);
    try {
      const property = allProperties.find((p) => p.serPropertyId === values.serPropertyId);
      if (!property) throw new Error('Selected property not found.');

      const response = await fetch(`${process.env.REACT_APP_API_URL}decorCategoryMaster/getAllDecorMasterData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({}),
      });
      const fullData = await response.json();
      const latestProperty = fullData.result
        .flatMap((cat) => cat.categoryProperties)
        .find((prop) => prop.serPropertyId === property.serPropertyId);
      if (!latestProperty) throw new Error('Could not find latest property data.');

      let updatedValuesList;
      if (initialData) {
        // --- This is the fix for the multiplication bug ---
        // 1. Filter out the OLD item from the list
        // const otherValues = latestProperty.propertyValues.filter(
        //   (val) => val.serDecorPropertyValueId !== initialData.serDecorPropertyValueId,
        // );
        // const otherValues = latestProperty.propertyValues.filter(
        //   (val) => val.serPropertyValueId !== initialData.serPropertyValueId,
        // );

        // 2. Create the NEW, clean item
        const hasNewFile = !!fileList[0]?.originFileObj;
        const updatedValue = {
          // serPropertyValueId: initialData.serDecorPropertyValueId, // Correctly use the ID for update
          serPropertyValueId: initialData.serPropertyValueId, // Correctly use the ID for update
          txtPropertyValue: values.txtPropertyValue,
          txtDescription: values.txtDescription,
          blnIsActive: values.blnIsActive ? true : false,
          blnIsDocument: latestProperty.txtInputType === 'Image',
          document: hasNewFile
            ? {
              documentId: initialData.document?.documentId || null,
              originalName: fileList[0].originFileObj.name,
              documentType: fileList[0].originFileObj.type,
              size: fileList[0].originFileObj.size,
              documentName: 'files',
              serPropertyValueId: initialData.serPropertyValueId,
            }
            : fileList?.length ? initialData.document : null,
        };

        // 3. Add the new item to the filtered list
        // updatedValuesList = [...otherValues, updatedValue];
        updatedValuesList = [updatedValue];
      } else {
        const hasNewFile = !!fileList[0]?.originFileObj;
        // Logic for CREATE remains the same
        const newValue = {
          txtPropertyValue: values.txtPropertyValue,
          txtDescription: values.txtDescription,
          blnIsActive: values.blnIsActive == true,
          blnIsDocument: latestProperty.txtInputType === 'Image',
          document: hasNewFile
            ? {
              originalName: fileList[0].originFileObj.name,
              documentType: fileList[0].originFileObj.type,
              size: fileList[0].originFileObj.size,
              documentName: 'files',
            } : null
        };
        // updatedValuesList = [...latestProperty.propertyValues, newValue];
        updatedValuesList = [newValue];
      }

      const payload = {
        serPropertyId: latestProperty.serPropertyId,
        txtPropertyName: latestProperty.txtPropertyName,
        txtInputType: latestProperty.txtInputType,
        txtRemarks: latestProperty.txtRemarks,
        blnIsRequired: latestProperty.blnIsRequired,
        blnIsActive: latestProperty.blnIsActive,
        serDecorCategoryId: latestProperty.serDecorCategoryId,
        propertyValues: updatedValuesList, // Use the new, clean list
      };

      const formData = new FormData();
      formData.append('dtoDecorCategoryProperty', JSON.stringify(payload));

      const fileToUpload = fileList[0]?.originFileObj;

      console.log('There is a file to upload:', fileToUpload);

      if (fileToUpload) {
        formData.append('files', fileToUpload);
      } else {
        const emptyFile = new Blob([''], { type: 'text/plain' });
        formData.append('files', emptyFile, 'empty.txt');
      }

      // console.log('--- Form Data ---');
      Object.entries(formData).forEach(([key, value]) => console.log(`${key}: ${value}`));
      // console.log('--- End Form Data ---');

      const saveResponse = await fetch(
        `${process.env.REACT_APP_API_URL}decorCategoryPropertyValue/saveValuesWithDocuments`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        },
      );

      const data = await saveResponse.json();

      if (data.code === 200) {
        message.success(initialData ? 'Property value updated successfully!' : 'Property value added successfully!');
        onOk();
      } else {
        throw new Error(data.message || 'Save failed');
      }
    } catch (e) {
      console.error('API Error:', e);
      message.error(e.message || 'Failed to save property value.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledFullModal
      title={isViewMode ? 'View Property Value' : initialData ? 'Edit Property Value' : 'Add New Property Value'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="70vw"
      height="80vh"
    >

      {/* <Modal
        title={isViewMode ? 'View Property Value' : initialData ? 'Edit Property Value' : 'Add New Property Value'}
        visible={visible}
        onCancel={onCancel}
        footer={
          !isViewMode && [
            <Button key="back" onClick={onCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
              Save
            </Button>,
          ]
        }
      > */}
      <Form form={form} layout="vertical" onFinish={handleSave} disabled={isViewMode}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="serPropertyId"
              label="Select Property"
              rules={[{ required: true, message: 'Please select a property!' }]}
            >
              <Select
                showSearch
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                onChange={handlePropertyChange}
                disabled={!!initialData}
                options={
                  !initialData ? allProperties.filter(x => x.blnIsActive == true).map((prop) => ({
                    value: prop.serPropertyId,
                    label: `${prop.txtPropertyName} (${prop.txtInputType})`,
                  }))
                    :
                    allProperties.map((prop) => ({
                      value: prop.serPropertyId,
                      label: `${prop.txtPropertyName} (${prop.txtInputType})`,
                    }))

                }
              />
            </Form.Item>
          </Col>
        </Row>
        {/* <span>
          {JSON.stringify(selectedProperty)}
        </span> */}
        {selectedProperty && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="txtPropertyValue"
                  label="Property Value Name"
                  rules={[{ required: true, message: 'Please enter a value name!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="txtDescription"
                  label="Property Description"
                  // rules={[{ required: true, message: 'Please enter description!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            {(selectedProperty.txtInputType).toLowerCase() === 'image' && (
              <Row gutter={16}>
                <Col span={24}>
                  <AntForm.Item
                    label="Attachment (Image)"
                    name="imageFile"
                    disabled={fileList?.length}
                  >
                    <Upload
                      beforeUpload={() => false}
                      accept="image/*"
                      fileList={fileList}
                      onChange={handleFileChange}
                      listType="picture"
                      showUploadList={{
                        showRemoveIcon: true,
                        showPreviewIcon: true,
                      }}
                      maxCount={1}
                    >
                      {fileList?.length >= 5 ? null : (
                        <Button disabled={!!fileList.length} icon={<UploadOutlined />}>Attach Image</Button>
                      )}
                    </Upload>
                  </AntForm.Item>
                  {/* <Form.Item label="Upload Image" name="imageFile">
                    <Upload
                      listType="picture"
                      maxCount={1}
                      beforeUpload={beforeUpload}
                      onChange={handleFileChange}
                      fileList={fileList}
                      accept=".png,.jpeg,.jpg"
                    >
                      <Button icon={<UploadOutlined />}>Select Image {JSON.stringify(selectedProperty) + 'Hello'} </Button>
                    </Upload>
                  </Form.Item> */}
                </Col>
              </Row>
            )}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="blnIsActive" label="Is Active" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
      <div style={{ display: 'flex', gap: '5px', marginTop: '30px' }}>
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

export default DecorPropertyValueFormModal;

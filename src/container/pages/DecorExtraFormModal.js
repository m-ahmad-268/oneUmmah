// src/container/pages/DecorExtraFormModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, message, Col, Row, Button, Upload, Tag, Tooltip } from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getBase64 } from '../../components/utilities/utilities';
import UilImage from '@iconscout/react-unicons/icons/uil-image';
import { StyledFullModal } from './customer-modal-style';

import {
  UilMoneyBill
} from '@iconscout/react-unicons';

function DecorExtraFormModal({ visible, initialData, onCancel, onOk }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem('access_token_admin');

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          serExtrasId: initialData.serExtrasId,
          txtExtrasCode: initialData.txtExtrasCode,
          txtExtrasName: initialData.txtExtrasName,
          blnIsActive: initialData.blnIsActive,
          numPrice: Number(initialData.numPrice) || 0,
          numDisplayOrder: Number(initialData.numDisplayOrder) || 0,
          decorExtrasOptions: initialData.decorExtrasOptions.map((option) => ({
            ...option,
            serExtraOptionId: option.serExtraOptionId,
            blnIsDocument: !!option.document,
            // Re-map document for Antd Upload component
            image: option.document
              ? [
                {
                  uid: option.document.originalName,
                  name: option.document.originalName,
                  status: 'done',
                  url: option.document.txtDocumentUrl || '',
                  // url: `${process.env.REACT_APP_API_URL}decorExtras/getImage?originalName=${option.document.originalName}`,
                  isExisting: true,
                },
              ]
              : [],
          })),
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ blnIsActive: true });
      }
    }
  }, [visible, initialData, form]);

  const beforeUpload = (file) => {
    if (file && file?.size > 3145728) {
      message.info('Maximum upload size exceeded!');
      return;
    } else {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error(`${file.name} is not a valid image file!`);
      }
      if (!isImage) return Upload.LIST_IGNORE;
      return false;
    }
  };

  const handleSave = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();
      const files = [];

      // Clean the options list for the DTO and extract files
      let cleanedOptions = [];
      if (values?.decorExtrasOptions && values.decorExtrasOptions.length) {
        cleanedOptions = values.decorExtrasOptions.map((option) => {
          const cleanedOption = {
            txtOptionCode: option.txtOptionCode,
            txtOptionName: option.txtOptionName,
            blnIsActive: option.blnIsActive,
            blnIsDocument: false,
          };

          if (option.serExtraOptionId) {
            cleanedOption.serExtraOptionId = option.serExtraOptionId;
          }
          const fileList = option.image && Array.isArray(option.image) ? option.image : [];
          const file = fileList[0];

          // Case 1: A new file is uploaded
          if (file && file.originFileObj) {
            cleanedOption.blnIsDocument = true;
            cleanedOption.document = { originalName: file.name };
            files.push(file.originFileObj);
          }
          // Case 2: An existing document is being kept
          else if (file && file.isExisting) {
            cleanedOption.blnIsDocument = true;
            cleanedOption.document = { originalName: file.name };
          }
          // Case 3: No document (or a previous one was removed)
          else {
            // We will rely on the backend to handle document removal if blnIsDocument becomes false
            // and no new document is provided.
          }

          return cleanedOption;
        });
      }

      const payload = {
        serExtrasId: initialData?.serExtrasId,
        txtExtrasCode: values.txtExtrasCode,
        txtExtrasName: values.txtExtrasName,
        blnIsActive: values.blnIsActive ?? false,
        numPrice: values.numPrice,
        numDisplayOrder: values?.numDisplayOrder ? Number(values?.numDisplayOrder) : 0,
        decorExtrasOptions: cleanedOptions,
        blnIsService: false,
      };

      formData.append('decorExtrasMaster', JSON.stringify(payload));

      // Append all collected files to the FormData
      if (files.length > 0) {
        files.forEach((file) => formData.append('files', file));
      } else {
        // As per previous discussions, append an empty file if no files are present
        const emptyFile = new Blob([''], { type: 'text/plain' });
        formData.append('files', emptyFile, 'empty.txt');
      }

      console.log('Form data:');
      for (const entry of formData.entries()) {
        console.log(entry);
      }

      // API endpoint from the screenshot
      const endpoint = `${process.env.REACT_APP_API_URL}decorExtras/saveWithDocs`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await response.json();
      if (data.code === 200) {
        message.success(initialData ? 'Extra updated successfully!' : 'Extra added successfully!');
        form.resetFields();
        onOk();
      } else {
        throw new Error(data.message || 'Save failed');
      }
    } catch (e) {
      console.error('API Error:', e);
      message.error(e.message || 'Failed to save extra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledFullModal
      title={initialData ? 'Edit Extra' : 'Add New Extra'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="70vw"
      height="80vh"
    >

      {/* <Modal
        title={initialData ? 'Edit Extra' : 'Add New Extra'}
        visible={visible}
        onCancel={onCancel}
        width={800}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
            Save
          </Button>,
        ]}
      > */}
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="txtExtrasCode"
              label="Extra Code"
              rules={[{ required: true, message: 'Please enter a code!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="txtExtrasName"
              label="Extra Name"
              rules={[{ required: true, message: 'Please enter a name!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="numPrice"
              label="Price (£)"
            >
              <Input type="number" placeholder="Enter Price" prefix={<UilMoneyBill />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="numDisplayOrder"
              label="Display Order"
            >
              <Input type="number" placeholder="Enter display Order"
              // prefix={<UilMoneyBill />}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="blnIsActive" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="decorExtrasOptions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div
                  key={key}
                  style={{ marginBottom: 16, padding: 16, border: '1px solid #d9d9d9', borderRadius: '4px' }}
                >
                  <Row gutter={16} align="middle">
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'txtOptionCode']}
                        fieldKey={[fieldKey, 'txtOptionCode']}
                        label="Option Code"
                        rules={[{ required: true, message: 'Missing code' }]}
                      >
                        <Input placeholder="Option Code" />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'txtOptionName']}
                        fieldKey={[fieldKey, 'txtOptionName']}
                        label="Option Name"
                        rules={[{ required: true, message: 'Missing name' }]}
                      >
                        <Input placeholder="Option Name" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'blnIsActive']}
                        fieldKey={[fieldKey, 'blnIsActive']}
                        valuePropName="checked"
                        label="Active"
                      >
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'blnIsDocument']}
                        fieldKey={[fieldKey, 'blnIsDocument']}
                        valuePropName="checked"
                        label="Has Document"
                      >
                        <Switch />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prev, curr) =>
                          prev.decorExtrasOptions?.[name]?.blnIsDocument !== curr.decorExtrasOptions?.[name]?.blnIsDocument
                        }
                      >
                        {() => {
                          const hasDocument = form.getFieldValue(['decorExtrasOptions', name, 'blnIsDocument']);
                          return hasDocument ? (
                            <Form.Item
                              {...restField}
                              name={[name, 'image']}
                              fieldKey={[fieldKey, 'image']}
                              label="Upload Image"
                              valuePropName="fileList"
                              getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                  return e;
                                }

                                if (e?.fileList.length && e?.fileList[0]?.size > 3145728) {
                                  // message.info('Maximum upload size exceeded!');
                                  return [];
                                }

                                return e?.fileList;
                              }}
                            >
                              <Upload name="image" listType="picture" maxCount={1} beforeUpload={beforeUpload}>
                                <Button icon={<UploadOutlined />}>Select Image</Button>
                              </Upload>
                            </Form.Item>
                          ) : null;
                        }}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row justify="end">
                    <Col>
                      <Tooltip title="Remove Option">
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: '20px', color: '#999' }} />
                      </Tooltip>
                    </Col>
                  </Row>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Extra Option
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
      <div style={{ marginTop: '30px' }}>
        <Button key="back" onClick={onCancel}>
          Close
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Save
        </Button>
      </div>
      {/* </Modal> */}
    </StyledFullModal>
  );
}

export default DecorExtraFormModal;

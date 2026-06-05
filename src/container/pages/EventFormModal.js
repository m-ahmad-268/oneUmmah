/* eslint-disable import/order */ // Disable import order rule for the entire file

// src/container/pages/EventFormModal.js

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Select, Row, Col, Switch, Upload } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import propTypes from 'prop-types';

// Third-party icon imports
import UilCalendarAlt from '@iconscout/react-unicons/icons/uil-calendar-alt';

// Internal/relative imports - adjusted order
import { Main } from '../styled';
import { StyledFullModal } from './customer-modal-style';
import { getGenerateEventTypeCode } from '../../services/commonService';

const { Option } = Select;

function EventFormModal({ visible, initialData, onCancel, onOk, allExistingCodes, isViewMode }) {
  console.log(initialData);

  const accessToken = localStorage.getItem('access_token_admin');

  const [form] = Form.useForm();

  // Helper for logging FormData contents for debugging
  const logFormData = (formData, name) => {
    console.log(`--- FormData for ${name} ---`);
    for (const pair of formData.entries()) {
      // Check if the value is a File or Blob object
      if (pair[1] instanceof File || pair[1] instanceof Blob) {
        console.log(`${pair[0]}: File - Name: ${pair[1].name}, Type: ${pair[1].type}, Size: ${pair[1].size} bytes`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }
    console.log(`--- End FormData for ${name} ---`);
  };

  // Function to generate a unique event code (e.g., ET-001, ET-002)
  const generateUniqueEventCode = (existingCodes) => {
    // debugger
    const subEventLength = initialData?.subEvents?.length || 0;
    if (subEventLength)
      console.log('initialData', initialData.subEvents[subEventLength - 1]?.txtEventTypeCode);
    // debugger

    const prefix = 'ET-';
    let maxNum = 0;
    existingCodes.forEach((code) => {
      if (code && code.startsWith(prefix)) {
        const numPart = parseInt(code.substring(prefix.length), 10);
        if (!Number.isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });
    const eventCodeMock = `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
    console.log('eventCodeMock'), eventCodeMock;

    // Pad with leading zeros to ensure 3 digits (e.g., 1 becomes 001)
    return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
  };

  useEffect(() => {
    console.log('initialData', initialData);
    const subEventLength = initialData?.subEvents?.length || 0;
    if (initialData?.subEvents)
      console.log('initialData', initialData.subEvents[subEventLength - 1]?.txtEventTypeCode);

  }, [initialData]);

  const generateEventTypeCode = async () => {
    try {
      // setLoading(true);
      const data = await getGenerateEventTypeCode();
      if (data && data?.code == 200 && data?.result) {
        return data?.result;
      }
      return '';
      // setLoading(false);
    } catch (error) {
      console.error('Server error', error?.message);
      // setLoading(false);
    }


  };

  // Effect to set form fields when initialData changes (for editing or adding)
  useEffect(() => {
    if (!visible) return;

    if (initialData) {
      // Existing event (edit or view)
      form.setFieldsValue({
        txtEventTypeCode: initialData.txtEventTypeCode || '',
        txtEventTypeName: initialData.txtEventTypeName || '',
        blnIsActive: initialData.blnIsActive === true,

        subEvents:
          initialData.subEvents?.map((sub) => {
            const doc = sub.documents?.[0];

            const fileList = doc
              ? [
                {
                  uid: String(doc.documentId ?? `doc-${Math.random().toString(36).slice(2)}`),
                  name: doc.originalName ?? 'uploaded-file.jpg',
                  status: 'done',
                  url:
                    doc.txtDocumentUrl ||
                    `https://placehold.co/60x60/aabbcc/ffffff?text=${(doc.originalName || 'IMG')
                      .slice(0, 2)
                      .toUpperCase()}`,
                  response: doc, // keep original metadata if needed later
                },
              ]
              : [];

            return {
              ...sub,
              key: sub.serEventTypeId || `new-${Math.random().toString(36).substring(7)}`,
              blnIsActive: sub.blnIsActive === true,
              file: fileList,
            };
          }) || [],
      });
    } else {
      // New event creation
      form.resetFields(); // Reset everything
      // const newCode = generateUniqueEventCode(allExistingCodes); // Generate a new unique code
      (async () => {
        const generatedCode = await generateEventTypeCode();
        form.setFieldsValue({
          txtEventTypeCode: generatedCode,
          blnIsActive: true,
          subEvents: [],
        });
      })();
    }
  }, [visible, initialData, form, allExistingCodes]);

  // Custom validator for event codes (main and sub-events)
  const validateCode = (isEditModeProp, originalCode, currentItemId) => (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Code cannot be empty'));
    }

    // If in edit mode and the code hasn't changed, it's valid
    if (isEditModeProp && value === originalCode) {
      return Promise.resolve();
    }

    // Filter out the current item's original code from the existing codes list
    // to allow editing other fields without triggering a false positive for code duplication
    const codesToCheckAgainst = allExistingCodes.filter((code) => {
      // For a sub-event in edit mode
      if (isEditModeProp && currentItemId) {
        const originalSubEvent = initialData?.subEvents?.find((s) => s.serEventTypeId === currentItemId);
        if (originalSubEvent && originalSubEvent.txtEventTypeCode === code) {
          return false; // Exclude its own original code
        }
      }
      // For a main event in edit mode
      if (isEditModeProp && !currentItemId && initialData && initialData.txtEventTypeCode === code) {
        return false; // Exclude its own original code
      }
      return true; // Keep other codes for checking
    });

    // Check if the new code already exists among others
    if (codesToCheckAgainst.includes(value)) {
      return Promise.reject(new Error('Code already exists! Please enter a unique code.'));
    }
    return Promise.resolve();
  };

  // Determine if the modal is in edit mode (has initial data)
  const isEditMode = !!initialData;

  // Handler for form submission
  const handleSubmit = async (values) => {
    if (isViewMode) {
      message.info('You are in view mode. Cannot submit changes.');
      return;
    }

    message.loading('Saving event...', 0); // Show a persistent loading message

    try {
      // --- 1. Prepare and Save Main Event Payload ---
      const mainEventPayload = {
        serEventTypeId: initialData?.serEventTypeId || null, // 0 for new event, existing ID for update
        txtEventTypeCode: values.txtEventTypeCode,
        txtEventTypeName: values.txtEventTypeName,
        blnIsMainEvent: true, // Always true for the main event
        parentEventTypeId: null, // Main events do not have a parent
        documents: [], // Main events do not have documents as per API structure
        blnIsActive: values.blnIsActive,
      };

      console.log('Main Event Payload (before JSON.stringify):', mainEventPayload);

      const mainEventFormData = new FormData();
      mainEventFormData.append('eventTypeData', JSON.stringify(mainEventPayload));
      // Append an empty File object for the 'files' key, as the API expects it even if no files
      mainEventFormData.append('files', new File([], ''), '');

      logFormData(mainEventFormData, 'Main Event'); // Log main event FormData for debugging

      const mainEventResponse = await fetch(`${process.env.REACT_APP_API_URL}eventType/saveEventType`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: mainEventFormData,
      });

      if (!mainEventResponse.ok) {
        const errorText = await mainEventResponse.text();
        console.error('Main Event Error Response Body:', errorText);
        throw new Error(`Failed to save main event: HTTP error! status: ${mainEventResponse.status} - ${errorText}`);
      }
      const mainEventResult = await mainEventResponse.json();
      console.log('Main Event Result:', mainEventResult);

      if (mainEventResult.code !== 200 || mainEventResult.status !== 'OK') {
        throw new Error(mainEventResult.message || 'Failed to save main event due to API error.');
      }

      const savedMainEventId = mainEventResult.result.serEventTypeId;
      message.success(`Main Event "${values.txtEventTypeName}" ${initialData ? 'updated' : 'added'} successfully!`);

      // --- 2. Process Sub-Events Sequentially ---
      if (values.subEvents && values.subEvents.length > 0) {
        // Use a traditional for loop to allow await inside
        // eslint-disable-next-line no-await-in-loop, no-restricted-syntax
        for (const subEvent of values.subEvents) {
          // Check if a new file was selected for upload
          const newFile = subEvent.file && subEvent.file.length > 0 && subEvent.file[0].originFileObj;
          // Check if it's an existing file that hasn't been removed (status 'done' and has response data)
          const existingDocumentData =
            subEvent.file &&
            subEvent.file.length > 0 &&
            subEvent.file[0].status === 'done' &&
            subEvent.file[0].response;

          const subEventPayload = {
            serEventTypeId: subEvent.serEventTypeId || null, // 0 for new sub-event, existing ID for update
            txtEventTypeCode: subEvent.txtEventTypeCode,
            txtEventTypeName: subEvent.txtEventTypeName,
            blnIsMainEvent: false, // Always false for sub-events
            parentEventTypeId: savedMainEventId, // Link to the saved main event
            blnIsActive: subEvent.blnIsActive,
            documents: [], // Initialize documents array
          };

          // Populate documents array with ONLY originalName if a file is present (new or existing)
          if (newFile || existingDocumentData) {
            subEventPayload.documents.push({
              originalName: subEvent.file[0].name, // Use the name from the file object
            });
          }
          // If fileList is empty (user removed image or never added), documents array remains empty, which is correct for removal/no file

          console.log(`Sub-Event Payload for ${subEvent.txtEventTypeName} (before JSON.stringify):`, subEventPayload);

          const subEventFormData = new FormData();
          subEventFormData.append('eventTypeData', JSON.stringify(subEventPayload));

          // Append the actual file ONLY if a NEW one was selected
          if (newFile) {
            subEventFormData.append('files', subEvent.file[0].originFileObj, subEvent.file[0].name);
            console.log(`Appending new file for sub-event "${subEvent.txtEventTypeName}": ${subEvent.file[0].name}`);
          } else {
            // Always append 'files' key, even if empty, using new File([], '')
            subEventFormData.append('files', new File([], ''), '');
            console.log(`Appending empty files File object for sub-event "${subEvent.txtEventTypeName}".`);
          }

          logFormData(subEventFormData, `Sub-Event ${subEvent.txtEventTypeName}`); // Log sub-event FormData

          try {
            const subEventResponse = await fetch(`${process.env.REACT_APP_API_URL}eventType/saveEventType`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              body: subEventFormData,
            });

            if (!subEventResponse.ok) {
              const errorText = await subEventResponse.text();
              console.error(`Sub-Event ${subEvent.txtEventTypeName} Error Response Body:`, errorText);
              throw new Error(`HTTP error! status: ${subEventResponse.status} - ${errorText}`);
            }
            const subEventResult = await subEventResponse.json();
            console.log(`Sub-Event ${subEvent.txtEventTypeName} Result:`, subEventResult);

            if (subEventResult.code !== 200 || subEventResult.status !== 'OK') {
              throw new Error(subEventResult.message || 'Failed to save sub-event due to API error.');
            }
            message.success(
              `Sub-Event "${subEvent.txtEventTypeName}" ${subEvent.serEventTypeId ? 'updated' : 'added'}!`,
            );
          } catch (subEventError) {
            console.error(`Failed to save sub-event "${subEvent.txtEventTypeName}":`, subEventError);
            message.warning(
              `Warning: Failed to save sub-event "${subEvent.txtEventTypeName}". Error: ${subEventError.message}`,
            );
          }
        }
      }

      message.destroy(); // Remove the loading message
      onOk(); // Call onOk to close modal and refresh parent data
    } catch (e) {
      message.destroy(); // Remove loading message
      message.error(`Error saving event: ${e.message}`);
      console.error('Overall form submission error:', e);
    }
  };

  return (
    <StyledFullModal
      title={isViewMode ? 'View Event' : isEditMode ? 'Edit Event' : 'Add New Event'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="70vw"
      height="80vh"
    >
      {/* <Main style={{ backgroundColor: 'red' }}> */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          blnIsActive: true,
          subEvents: [],
        }}
      // This prop ensures the submit button is disabled if validation fails
      // onFieldsChange={() => {
      //   // Optional: You can add logic here to manually check form validity
      //   // and update a state to enable/disable the submit button if Ant Design's
      //   // default behavior isn't sufficient for complex scenarios.
      //   // However, htmlType="submit" on the button usually handles this.
      // }}
      >
        {/* Main Event Fields */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtEventTypeCode"
              label="Event Code"
              rules={[{ validator: validateCode(isEditMode, initialData?.txtEventTypeCode, null) }]}
            >
              <Input placeholder="Enter Event Code" prefix={<UilCalendarAlt />} disabled={true} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="txtEventTypeName"
              label="Event Name"
              rules={[{ required: true, message: 'Please enter event name' }]}
            >
              <Input placeholder="Enter Event Name" prefix={<UilCalendarAlt />} disabled={isViewMode} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="blnIsActive" label="Status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" disabled={isViewMode} />
            </Form.Item>
          </Col>
        </Row>

        {/* Sub-Events Section */}
        <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>Sub-Events</h3>
        <Form.List name="subEvents">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const currentSubEvent = form.getFieldValue(['subEvents', name]);
                const isSubEventEditMode = !!currentSubEvent?.serEventTypeId;
                const currentFileList = form.getFieldValue([name, 'file']) || [];
                const subEventCode = form.getFieldValue(['subEvents', name, 'txtEventTypeCode']);

                return (
                  <Row gutter={16} key={key} style={{ marginBottom: 8, alignItems: 'center' }}>
                    {/* <Col xs={24} sm={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'txtEventTypeCode']}
                        rules={[
                          {
                            validator: validateCode(
                              isSubEventEditMode,
                              currentSubEvent?.txtEventTypeCode,
                              currentSubEvent?.serEventTypeId,
                            ),
                          },
                        ]}
                        initialValue={
                          // Generate unique code for new sub-events when added
                          !isSubEventEditMode && !isViewMode && !subEventCode
                            ? generateEventTypeCode()
                            // ? generateUniqueEventCode(allExistingCodes)
                            : undefined
                        }
                      >
                        <Input placeholder="Sub-Event Code" disabled={true} />
                      </Form.Item>
                    </Col> */}
                    <Col xs={24} sm={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'txtEventTypeName']}
                        rules={[{ required: true, message: 'Sub-Event Name is required' }]}
                      >
                        <Input placeholder="Sub-Event Name" disabled={isViewMode} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'blnIsActive']}
                        valuePropName="checked"
                        initialValue={true} // Default new sub-events to active
                      >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" disabled={isViewMode} />
                      </Form.Item>
                    </Col>
                    {/* Image Upload for Sub-Events - only visible in Edit/Add mode */}
                    {!isViewMode && (
                      <Col xs={24} sm={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'file']}
                          valuePropName="fileList"
                          getValueFromEvent={(e) => {
                            if (Array.isArray(e)) return e;
                            return e?.fileList || [];
                          }}
                        >
                          <Upload
                            name="files"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            disabled={isViewMode}
                            onChange={({ fileList }) => {
                              // Set only the last selected file (maxCount: 1)
                              const updated = fileList.slice(-1);
                              const current = form.getFieldValue(name) || {};
                              form.setFieldsValue({
                                [name]: { ...current, file: updated },
                              });
                            }}
                            onRemove={(file) => {
                              const current = form.getFieldValue(name) || {};
                              const currentList = current.file || [];
                              const updatedList = currentList.filter((f) => f.uid !== file.uid);

                              form.setFieldsValue({
                                [name]: { ...current, file: updatedList },
                              });

                              return true;
                            }}
                          >
                            {currentFileList.length === 0 && (
                              <Button icon={<UploadOutlined />} disabled={isViewMode}>
                                Upload Image
                              </Button>
                            )}
                          </Upload>
                        </Form.Item>
                      </Col>
                    )}

                    {/* Minus Button - only visible in Edit/Add mode */}
                    {!isViewMode && (
                      <Col xs={24} sm={4}>
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ fontSize: '20px', color: '#999', cursor: 'pointer' }}
                        />
                      </Col>
                    )}
                  </Row>
                );
              })}
              {/* Add Sub-Event Button - only visible in Edit/Add mode */}
              {!isViewMode && (
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      // Generate a unique code for the new sub-event
                      // const newSubEventCode = generateUniqueEventCode(allExistingCodes);
                      (async () => {
                        const newSubEventCode = await generateEventTypeCode();
                        add({ blnIsActive: true, file: [], txtEventTypeCode: '' });
                      })();
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Sub-Event
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>

        {/* Submit/Cancel Buttons - only visible in Edit/Add mode */}
        {!isViewMode && (
          <Form.Item style={{ marginTop: '30px' }}>
            <Button onClick={onCancel} style={{ marginRight: '5px' }}>Close</Button>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              {isEditMode ? 'Update Event' : 'Add Event'}
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

EventFormModal.propTypes = {
  visible: propTypes.bool.isRequired,
  initialData: propTypes.object,
  onCancel: propTypes.func.isRequired,
  onOk: propTypes.func.isRequired,
  allExistingCodes: propTypes.arrayOf(propTypes.string).isRequired,
  isViewMode: propTypes.bool,
};

export default EventFormModal;

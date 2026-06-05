// src/container/pages/Events.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Tag, Space, message } from 'antd';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import EventFormModal from './EventFormModal';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';
import { useDeleteConfirmation } from '../../components/hooks/useDeleteConfirmation';

function Events() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allExistingCodes, setAllExistingCodes] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false); // State for view mode

  const accessToken = localStorage.getItem('access_token_admin');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}eventType/getAllEventsWithSubEvents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}), // Empty body as per API documentation
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      if (data.code === 200 && data.status === 'OK' && Array.isArray(data.result)) {
        const mainEvents = data.result.filter((event) => event.blnIsMainEvent);
        setEventData(mainEvents);

        // Collect all existing event codes (main and sub-events)
        const codes = new Set();
        data.result.forEach((event) => {
          if (event.txtEventTypeCode) {
            codes.add(event.txtEventTypeCode);
          }
          if (event.subEvents && Array.isArray(event.subEvents)) {
            event.subEvents.forEach((sub) => {
              if (sub.txtEventTypeCode) {
                codes.add(sub.txtEventTypeCode);
              }
            });
          }
        });
        // debugger
        setAllExistingCodes(Array.from(codes));
      } else {
        throw new Error(data.message || 'Invalid data format received');
      }
    } catch (e) {
      setError(e.message);
      message.error(`Failed to load events: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const { showDeleteConfirm } = useDeleteConfirmation(fetchEvents);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const showAddModal = () => {
    setEditingEvent(null);
    setIsViewMode(false); // Ensure not in view mode
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingEvent(record);
    setIsViewMode(false); // Ensure not in view mode
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setEditingEvent(record); // Pass the record to display
    setIsViewMode(true); // Set to view mode
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingEvent(null);
    setIsViewMode(false); // Reset view mode state
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingEvent(null);
    setIsViewMode(false); // Reset view mode state
    fetchEvents(); // Re-fetch events to update the table
  };

  const handleDelete = (record) => {
    showDeleteConfirm({
      name: `${record.txtEventTypeName}`,
      id: record.serEventTypeId,
      endpoint: `${process.env.REACT_APP_API_URL}eventType/deleteById`,
    });
  };

  const columns = [
    {
      title: 'Sr #',
      dataIndex: 'iteration',
      key: 'iteration',
      render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1, // Continuous iteration number across pages
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Event Code',
      dataIndex: 'txtEventTypeCode',
      key: 'txtEventTypeCode',
      sorter: (a, b) => a.txtEventTypeCode.localeCompare(b.txtEventTypeCode),
    },
    {
      title: 'Event Name',
      dataIndex: 'txtEventTypeName',
      key: 'txtEventTypeName',
      sorter: (a, b) => a.txtEventTypeName.localeCompare(b.txtEventTypeName),
    },
    {
      title: 'Status',
      dataIndex: 'blnIsActive',
      key: 'blnIsActive',
      render: (isActive) => (
        <span
          style={{
            backgroundColor: isActive ? '#d4edda' : '#f8d7da',
            color: isActive ? '#155724' : '#721c24',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            display: 'inline-block',
          }}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
      sorter: (a, b) => (a.blnIsActive === b.blnIsActive ? 0 : a.blnIsActive ? -1 : 1),
    },
    {
      title: 'Sub Events',
      dataIndex: 'subEvents',
      key: 'subEventsCount',
      render: (subEvents) => (
        <Space size={[0, 8]} wrap>
          {subEvents && subEvents.length > 0 ? (
            subEvents.map((subEvent) => (
              <Tag key={subEvent.serEventTypeId} color="Green">
                {subEvent.txtEventTypeName}
              </Tag>
            ))
          ) : (
            <Tag color="Red">0 Sub Events</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => showViewModal(record)}
            title="View Details"
          >
            <UilEye />
          </Button>
          <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => showEditModal(record)}
            title="Edit Event"
          >
            <UilEdit />
          </Button>
          {/* <Button
            className="btn-icon"
            type="link"
            style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            onClick={() => handleDelete(record)}
            title="Delete Event"
          >
            <UilTrashAlt />
          </Button> */}
        </Space>
      ),
    },
  ];

  const eventsTableData = eventData.map((event) => ({
    ...event,
    key: event.serEventTypeId, // Ant Design Table requires a unique 'key'
  }));

  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Dashboard',
    },
    {
      path: '',
      breadcrumbName: 'Events',
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          className="ninjadash-page-header-main"
          ghost
          title="Event Types"
          subTitle={
            <>
              <span className="title-counter">{eventData.length} Event Types</span>
            </>
          }
          buttons={[
            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
              + Add Event Type
            </Button>,
          ]}
        />
      </CardToolbox>

      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading events...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={columns}
                  dataSource={eventsTableData}
                  // pagination={{ pageSize: 10 }}
                  pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                      setPagination({ current: page, pageSize });
                    },
                    onShowSizeChange: (current, size) => {
                      setPagination({ current: 1, pageSize: size });
                    },
                  }}
                  scroll={{ x: true }}
                />
              )}
            </Cards>
          </Col>
        </Row>
      </Main>

      {/* The Event Form Modal */}
      <EventFormModal
        visible={isModalVisible}
        initialData={editingEvent}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        allExistingCodes={allExistingCodes}
        isViewMode={isViewMode}
      />
    </>
  );
}

export default Events;

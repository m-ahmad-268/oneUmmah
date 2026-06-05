// src/container/pages/EventStats.js

import React, { lazy, useState, Suspense, useCallback, useEffect } from 'react';
import { Row, Col, Spin, Button, message, Input, Select, Segmented, Tabs, Modal } from 'antd';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ProjectHeader } from '../../layout/Style';
import { Main } from '../styled';
import { PageHeader } from '../../components/page-headers/page-headers';
import EventFormModal from './EventStatFormModal';
import UilListUl from '@iconscout/react-unicons/icons/uil-list-ul';
import UilApps from '@iconscout/react-unicons/icons/uil-apps';
import { searchBykeyword, searchByStatus } from '../../services/commonService';

const EventGrid = lazy(() => import('./EventGrid'));
const EventList = lazy(() => import('./EventList'));

const calculateEventProgress = (event) => {
  // debugger
  let completedSteps = 0;
  const totalSteps = 6;

  // Step 1: Client Details - serCustId must be present
  if (event.serCustId) {
    completedSteps++;
  }

  // Step 2: Event Details - All required fields and running order must be present
  const hasRunningOrder =
    event.dtoEventRunningOrder &&
    event.dtoEventRunningOrder.txtGuestArrival &&
    event.dtoEventRunningOrder.txtBaratArrival &&
    event.dtoEventRunningOrder.txtNikah &&
    event.dtoEventRunningOrder.txtBrideEntrance &&
    event.dtoEventRunningOrder.txtMeal &&
    event.dtoEventRunningOrder.txtEndOfNight;

  if (
    event.txtEventMasterName &&
    event.dteEventDate &&
    event.txtNumberOfGuests &&
    event.numNumberOfTables &&
    (event.txtBrideName || event.txtGroomName) && // At least one name
    event.serEventTypeId &&
    hasRunningOrder
  ) {
    completedSteps++;
  }

  // Step 3: Event Venue - serVenueMasterId and serVenueMasterDetailId must be selected
  if (event.serVenueMasterId && event.dtoEventVenue && event.dtoEventVenue.serVenueMasterDetailId) {
    completedSteps++;
  }

  // Step 4: Decor Selections - dtoEventDecorSelections must be a non-empty array
  if (
    event.dtoEventDecorSelections &&
    Array.isArray(event.dtoEventDecorSelections) &&
    event.dtoEventDecorSelections.length > 0
  ) {
    completedSteps++;
  }

  // Step 5: Food Selections - foodSelections must be a non-empty array
  if (event.foodSelections && Array.isArray(event.foodSelections) && event.foodSelections.length > 0) {
    completedSteps++;
  }

  // Step 6: Vendor - serVendorId must be present
  if (event.serVendorId) {
    completedSteps++;
  }

  const percentage = (completedSteps / totalSteps) * 100;
  return { completedSteps, totalSteps, percentage };
};

function EventStats() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isGridView, setIsGridView] = useState(false);
  const [events, setEvents] = useState([]); // State to hold events data
  const [totalEvents, setTotalEvents] = useState([]); // State to hold events data
  const [isLoadingEvents, setIsLoadingEvents] = useState(true); // Loading state
  const [query, setQuery] = useState(() => localStorage.getItem('eventQuery') || '');
  const [alignValue, setAlignValue] = useState(() => localStorage.getItem('eventStatus') || 'Enquiry');
  const [filter, setFilter] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(() => localStorage.getItem('eventQuery') || '');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('access_token_admin');

  // Function to fetch all events
  const fetchAllEvents = async (statusVal) => {
    try {
      // const response = await fetch(`${process.env.REACT_APP_API_URL}eventMaster/getAllDataAdminPortal `, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      //   body: JSON.stringify({}),
      // });
      let req = {
        "txtBudgetStatus": alignValue,
        'q': debouncedQuery,
        "page": pagination.current - 1,
        "size": pagination.pageSize
      };
      setIsLoadingEvents(true);
      const result = await searchBykeyword(req);
      // const result = await response.json();
      // if (result.code === 200 && result.status === 'OK' && result.result && Array.isArray(result.result)) {
      if (result.code === 200 && result.status === 'OK' && result.result) {
        if (result.result?.content && result.result.content?.length) {
          // Map API response to a consistent structure
          const formattedEvents = result.result.content.map((event) => {
            // const formattedEvents = result.result.map((event) => {
            const { completedSteps, totalSteps, percentage } = calculateEventProgress(event);
            return {
              ...event,
              // id: `event-${event.serEventMasterId}`,
              // clientJourneyStepsCompleted: completedSteps,
              // clientJourneyTotalSteps: totalSteps,
              // eventJourneyProgress: Math.round(percentage),
              // title: event.txtEventMasterName,
              // customerName: event.txtCustName,
              // eventCode: event.txtEventMasterCode,
            };
          });
          setTotalEvents(result.result.totalElements);
          setEvents(formattedEvents);
        } else {
          setEvents([]);
        }
      } else {
        const errorMsg = (result?.message && result.message.length > 70)
          ? result.message.substring(0, 70) + '...'
          : (result?.message || 'server error!');
        message.error(errorMsg);
        setEvents([]);
      }
      setIsLoadingEvents(false);
    } catch (error) {
      console.error('Error fetching events:', error?.message);
      message.error('Network error while fetching events.');
      setEvents([]);
      setIsLoadingEvents(false);
    }
  };
  // }, [accessToken]);


  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem('eventQuery', query);
      setDebouncedQuery(query); // only update after user stops typing for 500ms
    }, 500);

    return () => clearTimeout(handler); // cleanup old timer
  }, [query]);

  useEffect(() => {
    fetchAllEvents();
  }, [debouncedQuery, alignValue, pagination]);

  // New: Function to handle event deletion
  const handleDeleteEvent = useCallback(
    async (eventId, eventName) => {
      try {
        const confirmed = await new Promise((resolve) => {
          Modal.confirm({
            title: 'Are you sure you want to delete this event?',
            content: `This action will delete the event: ${eventName}. This cannot be undone.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk() {
              resolve(true);
            },
            onCancel() {
              resolve(false);
            },
          });
        });

        if (confirmed) {
          const response = await fetch(`${process.env.REACT_APP_API_URL}eventMaster/deleteById`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ id: eventId }),
          });
          const result = await response.json();

          if (result.code === 200 && result.status === 'OK') {
            // message.success(`Event "${eventName}" deleted successfully!`);
            message.success(`${result?.message}`);
            fetchAllEvents();
          } else {
            message.error(`Failed to delete event: ${result.message}`);
          }
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        message.error('Network error while deleting event.');
      }
    },
    [fetchAllEvents, accessToken],
  );

  // New: Function to handle setting the budget
  const handleSetBudget = useCallback((eventId) => {
    // You'll need to implement logic to show your budget modal here
    // For now, it's a placeholder
    // debugger
    message.info(`Setting budget for Event ID: ${eventId}`);
  }, []);

  // New: Function to open the EventFormModal in view mode
  const handleViewEvent = useCallback((event) => {
    setEditingEvent(event);
    setModalVisible(true);
  }, []);

  // New: Function to close the EventFormModal (from view mode)
  const handleEventFormModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingEvent(null);
  }, []);

  // Fetch events on component mount
  // useEffect(() => {
  //   if (filter) {
  //     debugger
  //     // fetchAllEvents();
  //   }
  // }, [filter]);

  const handleCreateNewEvent = useCallback(() => {
    localStorage.setItem('serEventMasterData', '');
    navigate('/event-master/add');
    setEditingEvent(null);
    setModalVisible(true);
  }, []);

  const handleEditEvent = useCallback((event) => {
    setEditingEvent(event);
    setModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingEvent(null);
  }, []);

  const handleModalSave = useCallback(
    (updatedEvent) => {
      console.log('Event Saved/Updated (Final Payload):', updatedEvent);
      setModalVisible(false);
      setEditingEvent(null);
      fetchAllEvents();
    },
    [fetchAllEvents],
  );



  const componentProps = {
    events,
    totalEvents,
    isLoadingEvents,
    onEditEvent: handleEditEvent,
    onDeleteEvent: handleDeleteEvent,
    onSetBudget: handleSetBudget,
    onViewEvent: handleViewEvent,
    onClickPagination: (events) => {
      setPagination(events);
    }
  };

  return (
    <>
      <ProjectHeader>
        <PageHeader
          className="ninjadash-page-header-main"
          ghost
          title="Events"
          // subTitle={<>Diamonds</>}
          subTitle={
            <>
              <span className="title-counter">{totalEvents} Events</span>
            </>
          }
          buttons={[
            <div className="page-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* <Button
                key="2"
                type="default"
                onClick={() => setIsGridView(false)}
                className={!isGridView ? 'active' : ''}
              >
                List View
              </Button>
              <Button key="3" type="default" onClick={() => setIsGridView(true)} className={isGridView ? 'active' : ''}>
                Grid View
              </Button> */}
              <Input placeholder='Search...'
                style={{
                  height: '40px',
                  backgroundColor: false ? "#f5f5f5" : "#ffff",
                  borderColor: "#d9d9d9",
                  boxShadow: "none",
                  // opacity: .6,
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                // onChange={handleChange}
                allowClear
              />
              <Button key="1" type="primary" onClick={handleCreateNewEvent}>
                Create New Event
              </Button>
            </div>,
          ]}
        />
      </ProjectHeader>
      <Main>
        <Row gutter={20} style={{ padding: '10px' }}>
          <Col xs={8}>
            <Tabs
              activeKey={alignValue}
              onChange={(val) => {
                setPagination({
                  current: 1,
                  pageSize: 10,
                });
                localStorage.setItem('eventStatus', val);
                setAlignValue(val);
              }}
              items={[
                { label: "Enquiry", key: "Enquiry" },
                { label: "Quoted", key: "Quoted" },
                { label: "Confirmed", key: "Confirmed" },
              ]}
            />
          </Col>
          {/* <Col xs={8}>
            <Input placeholder='Search...'
              style={{
                backgroundColor: false ? "#f5f5f5" : "#ffff",
                borderColor: "#d9d9d9",
                boxShadow: "none",
                // opacity: .6,
              }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              // onChange={handleChange}
              allowClear
            />
          </Col> */}
          {/* <Col xs={8}>
            <Select
              value={filter}
              onChange={(value) => setFilter(value)}
              style={{ width: '100%' }}
              placeholder="Select filter"
              allowClear
            >
              <Option value="approved">Approved</Option>
              <Option value="pending">Pending</Option>
              <Option value="cancel">Cancel</Option>
            </Select>
          </Col> */}
        </Row>
        <Row gutter={25}>
          <Col xs={24}>
            <div>
              <Suspense
                fallback={
                  <div className="spin">
                    <Spin />
                  </div>
                }
              >
                <Routes>
                  <Route
                    index
                    element={isGridView ? <EventGrid {...componentProps} /> : <EventList {...componentProps} />}
                  />
                  <Route
                    path="grid"
                    element={isGridView ? <EventGrid {...componentProps} /> : <EventList {...componentProps} />}
                  />
                </Routes>
              </Suspense>
            </div>
          </Col>
        </Row>
      </Main>
    </>
  );
}

export default EventStats;

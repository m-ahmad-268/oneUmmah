import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { Row, Col, Pagination, Skeleton, Spin, message, Modal } from 'antd';
import Heading from '../../components/heading/heading';
import { ProjectPagination } from '../../layout/Style';
import { Cards } from '../../components/cards/frame/cards-frame';
import EventBudgetModal from './EventBudgetModal';
import EventFormModal from './EventStatFormModal';

const EventGridCard = lazy(() => import('./EventGridCard'));

// Helper function to calculate event progress (copied for consistency)
const calculateEventProgress = (event) => {
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

function EventGrid({ onEditEvent }) {
  // onEditEvent is still passed from EventStats
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for Budget Modal
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [selectedEventMasterIdForBudget, setSelectedEventMasterIdForBudget] = useState(null);

  // State for Event Form Modal (View Mode)
  const [eventFormModalVisible, setEventFormModalVisible] = useState(false);
  const [selectedEventForView, setSelectedEventForView] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const accessToken = localStorage.getItem('access_token_admin');

  // Function to fetch all events
  // Function to fetch all events
  const fetchAllEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}eventMaster/getAllDataAdminPortal `, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({}),
      });
      const result = await response.json();
      if (result.code === 200 && result.status === 'OK' && Array.isArray(result.result)) {
        // Map API response to the structure expected by EventGridCard
        const formattedEvents = result.result.map((event) => {
          const { completedSteps, totalSteps, percentage } = calculateEventProgress(event);
          return {
            ...event,
            id: `event-${event.serEventMasterId}`, // Ensure unique ID for React keys
            clientJourneyStepsCompleted: completedSteps,
            clientJourneyTotalSteps: totalSteps,
            eventJourneyProgress: Math.round(percentage), // <-- Change made here
            title: event.txtEventMasterName,
            customerName: event.txtCustName,
            eventCode: event.txtEventMasterCode,
          };
        });
        setEvents(formattedEvents);
      } else {
        message.error(`Failed to fetch events: ${result.message}`);
        setEvents([]); // Set to empty array on error
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Network error while fetching events.');
      setEvents([]); // Set to empty array on network error
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  // Function to handle event deletion
  const handleDeleteEvent = useCallback(
    async (eventId, eventName) => {
      try {
        // Show confirmation modal
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
            message.success(`Event "${eventName}" deleted successfully!`);
            fetchAllEvents(); // Re-fetch events to update the grid
          } else {
            message.error(`Failed to delete event: ${result.message}`);
          }
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        message.error('Network error while deleting event.');
      }
    },
    [fetchAllEvents],
  );

  // Function to open the budget modal
  const handleSetBudget = useCallback((eventId) => {
    setSelectedEventMasterIdForBudget(eventId);
    setBudgetModalVisible(true);
  }, []);

  // Function to close the budget modal and refresh events
  const handleBudgetSaved = useCallback(() => {
    setBudgetModalVisible(false);
    setSelectedEventMasterIdForBudget(null);
    fetchAllEvents(); // Refresh event list after budget is saved
  }, [fetchAllEvents]);

  // Function to open the EventFormModal in view mode
  const handleViewEvent = useCallback((event) => {
    setSelectedEventForView(event);
    setIsViewMode(true);
    setEventFormModalVisible(true);
  }, []);

  // Function to close the EventFormModal (from view mode)
  const handleEventFormModalCancel = useCallback(() => {
    setEventFormModalVisible(false);
    setSelectedEventForView(null);
    setIsViewMode(false); // Reset view mode
  }, []);

  // Fetch events on component mount or when refreshKey changes in EventStats
  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const onShowSizeChange = (currentPage, currentPageSize) => {
    setCurrent(currentPage);
    setPageSize(currentPageSize);
  };

  const onHandleChange = (currentPage, currentPageSize) => {
    setCurrent(currentPage);
    setPageSize(currentPageSize);
  };

  const paginatedEvents = events.slice((current - 1) * pageSize, current * pageSize);

  return (
    <>
      {isLoadingEvents ? (
        <div className="spin" style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Loading Events..." />
        </div>
      ) : (
        <Row gutter={25}>
          {paginatedEvents.length ? (
            paginatedEvents.map((value) => {
              return (
                <Col key={value.id} xl={8} md={12} xs={24}>
                  <Suspense
                    fallback={
                      <Cards headless>
                        <Skeleton active />
                      </Cards>
                    }
                  >
                    {/* Pass the onEditEvent, onDelete, onSetBudget, and onView props */}
                    <EventGridCard
                      value={value}
                      onEdit={onEditEvent}
                      onDelete={handleDeleteEvent}
                      onSetBudget={handleSetBudget}
                      onView={handleViewEvent} // Pass the new onView prop
                    />
                  </Suspense>
                </Col>
              );
            })
          ) : (
            <Col md={24}>
              <Cards headless>
                <Heading>No Events Found!</Heading>
              </Cards>
            </Col>
          )}
          <Col xs={24} className="pb-30">
            <ProjectPagination>
              {events.length ? (
                <Pagination
                  onChange={onHandleChange}
                  showSizeChanger
                  onShowSizeChange={onShowSizeChange}
                  pageSize={pageSize}
                  current={current}
                  total={events.length}
                />
              ) : null}
            </ProjectPagination>
          </Col>
        </Row>
      )}

      {/* Event Budget Modal */}
      <EventBudgetModal
        visible={budgetModalVisible}
        onCancel={() => setBudgetModalVisible(false)}
        eventMasterId={selectedEventMasterIdForBudget}
        onBudgetSaved={handleBudgetSaved}
      />

      {/* Event Form Modal for View Mode */}
      <EventFormModal
        visible={eventFormModalVisible}
        onCancel={handleEventFormModalCancel}
        eventData={selectedEventForView}
        isViewMode={isViewMode} // Pass the view mode flag
        onSave={() => {
          /* No save functionality in view mode */
        }}
      />
    </>
  );
}

export default EventGrid;

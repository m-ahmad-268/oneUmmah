import UilCalender from '@iconscout/react-unicons/icons/uil-calender';
import UilClock from '@iconscout/react-unicons/icons/uil-clock';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit-alt';
import UilSubject from '@iconscout/react-unicons/icons/uil-subject';
import UilTrash from '@iconscout/react-unicons/icons/uil-trash-alt';
import UilAngleLeft from '@iconscout/react-unicons/icons/uil-angle-left';
import UilAngleRight from '@iconscout/react-unicons/icons/uil-angle-right';
import UilListUl from '@iconscout/react-unicons/icons/uil-list-ul';
import UilPlus from '@iconscout/react-unicons/icons/uil-plus';
import { Col, message, Modal, notification, Row, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import CalenDar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-cycle
// import EventForm from './overview/EventForm';
import { Aside, CalendarWrapper, EventModalStyleWrap } from './Style';
import { Button } from '../../components/buttons/buttons';
import { Cards } from '../../components/cards/frame/cards-frame';
import { PageHeader } from '../../components/page-headers/page-headers';
import actions from '../../redux/authentication/actions';
// import { addNewEvents, calendarDeleteData } from '../../redux/calendar/actionCreator';
import { Main } from '../styled';
import { getAllListEvent } from '../../services/commonService';

const Localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
export const eventContext = React.createContext();

function Calendars() {

  // const { showLoader, hide } = actions;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { users } = useSelector((state) => {
  //   return {
  //     users: state.auth.loading,
  //   };
  // });
  const PageRoutes = [
    // {
    //   path: '/admin',
    //   breadcrumbName: 'Dashboard',
    // },
    // {
    //   path: '',
    //   breadcrumbName: 'Calendar',
    // },
  ];

  useEffect(() => {
    // dispatch(showLoader());
    console.log('server----------calender');

    getAllEvents();
  }, []);


  const getAllEvents = async () => {
    try {
      setLoading(true);

      const data = await getAllListEvent();
      if (data && data?.code == 200 && data?.result && data.result.length) {
        const modifiedArr = data.result.map(x => {
          return {
            ...x,
            id: x.serEventMasterId,
            title: x?.txtEventMasterCode + ' ' + x.txtEventMasterName,
            // title: x.txtEventMasterName + '(' + x.txtEventTypeName + ')',
            start: x?.dteEventDate && moment(x.dteEventDate, 'DD-MM-YYYY').toDate(),
            end: x?.dteEventDate && moment(x.dteEventDate, 'DD-MM-YYYY').toDate(),
          }
        });
        // console.log('modifiedArr', modifiedArr);

        setTimeout(() => {
          setEvents([...modifiedArr]);
          setLoading(false);
        }, 500);
      } else {
        setLoading(false);
        message.info('Something went wrong')
      }

    } catch (error) {
      console.log('Server Error', error);
      // setLoading(false);


    }
  };


  const [activeEvent, setActiveEvent] = useState([]);
  const [events, setEvents] = useState(
    [
      { id: 1, title: "", start: new Date(), end: new Date() },
      { id: 2, title: "", start: new Date(), end: new Date() },
      // {
      //   id: 3,
      //   title: "Workshop (Sept 6)",
      //   start: moment('08-09-2025', 'DD-MM-YYYY').toDate(), // 2:00 PM
      //   end: moment('08-09-2025', 'DD-MM-YYYY').toDate(),
      // },
      // {
      //   id: 4,
      //   title: "Workshop (Sept 10)",
      //   start: moment('10-09-2025 14:30', 'DD-MM-YYYY HH:mm').toDate(), // 2:00 PM
      //   end: moment('10-09-2025 15:30', 'DD-MM-YYYY HH:mm').toDate(),
      // },
    ],
  );

  // const { events, isVisible } = mockState;

  const mapToRBCFormat = (e) =>
    ({ ...e, start: new Date(e.start), end: new Date(e.end) });

  // const mapToRBCFormat = (event) => {
  //   return {
  //     ...event,
  //     id: event.id ?? Math.random(), // ensure unique id if missing
  //     start: normalizeDate(event.start),
  //     end: normalizeDate(event.end),
  //   };
  // };

  // ✅ Helper to normalize date safely
  const normalizeDate = (dateValue) => {
    if (!dateValue) return new Date();

    if (moment.isMoment(dateValue)) {
      return dateValue.toDate(); // convert moment to JS Date
    }

    if (typeof dateValue === "string") {
      // Try parsing ISO or custom formats
      const parsed = moment(dateValue, [
        moment.ISO_8601,
        "DD-MM-YYYY",
        "YYYY-MM-DD",
        "MM-DD-YYYY",
      ]);
      return parsed.isValid() ? parsed.toDate() : new Date();
    }

    // If already a Date object, return as-is
    if (dateValue instanceof Date) return dateValue;

    return new Date();
  }
  // const { events } = useSelector((state) => {
  //   return {
  //     events: state.Calender.events,
  //     isVisible: state.Calender.eventVisible,
  //   };
  // });

  const [state, setState] = useState({
    date: new Date(),
    selectedEvent: events[0],
    isEventModalVisible: false,
    isFormModalVisible: false,
    modalTitle: 'Update Event',
  });

  const onSelectEvent = (selectedData) => {
    // debugger
    // console.log('onSelectEvent', selectedData.dteEventDate);
    setState({
      ...state,
      isEventModalVisible: true,
      isFormModalVisible: false,
      selectedEvent: selectedData,
    });
  };

  const getActiveArray = useCallback((date) => {
    const now = date;
    const currentDay = now.getDate(); // getMonth() is 0-based
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-based
    const currentYear = now.getFullYear();
    // debugger
    const filteredEvents = events.filter(event => {
      // Split "DD-MM-YYYY"
      if (event?.dteEventDate) {
        const [day, month, year] = event.dteEventDate.split("-").map(Number);
        return day === currentDay && month === currentMonth && year === currentYear;
      }
      return false;
    });

    // debugger
    setActiveEvent([...filteredEvents]);

  }, [events]);



  const onSelectSlot = (date) => {
    // console.log('onSelectSlot', date.start);
    // const date = selectedData?.dteEventDate ? moment(selectedData.dteEventDate, 'DD-MM-YYYY').toDate() : new Date();
    // debugger
    getActiveArray(date.start);
    // setState({
    //   ...state,
    //   isFormModalVisible: true,
    //   selectedEvent: {},
    //   modalTitle: 'Create New Event',
    // });

    // debugger
    // const newEvent = {
    //   id: events.length + 1,
    //   title: `New Event ${events.length + 1}`,
    //   start: date.start,
    //   end: date.end,
    // };

    // setMockState((prev) => ({
    //   ...prev,
    //   events: [...prev.events, newEvent],
    // }));
  };

  const onChange = (date) => {
    console.log('onCHnage', date);

    setState({
      ...state,
      date,
    });
  }

  const onHandleVisible = () => {
    // debugger
    setState({
      ...state,
      isFormModalVisible: true,
      selectedEvent: {},
    });
  };
  const handleCancel = () => {
    // debugger
    setState({
      ...state,
      isFormModalVisible: false,
      isEventModalVisible: false,
    });
  };
  // const eventStyleGetter = (event) => {
  //   return {
  //     className: event.label,
  //   };
  // };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = event.color || "#8231D3"; // fallback to default if no color set

    return {
      className: event.label,
      style: {
        padding: '3px',
        // backgroundColor,
        fontSize: '10px',
        font: 'sans sarif',
        fontWeight: '400',
        border: '1px solid blue',
        // border: '1px solid #8231D3',
        // border: "none",
        color: "white",
        // color: isSelected ? "white" : "#8231D3",
        backgroundColor: false ? "#8231D3" : "blue",
      },
    };
  };

  const { isFormModalVisible, isEventModalVisible, selectedEvent, modalTitle } = state;

  const activateEdit = (selectedData) => {
    // debugger
    setState({
      ...state,
      selectedEvent: selectedData,
      modalTitle: 'Update Event',
      isEventModalVisible: false,
      isFormModalVisible: true,
    });
  };
  const deleteEvent = (id) => {
    const data = events.filter((item) => item.id !== id);
    // debugger
    // dispatch(calendarDeleteData(data));
    setState({
      ...state,
      isEventModalVisible: false,
    });
    notification.open({
      message: 'Selected Event Deleted',
    });
  };
  const addNew = (event) => {
    const arrayData = [];
    events.map((data) => {
      return arrayData.push(data.id);
    });
    const max = Math.max(...arrayData);
    // debugger
    // dispatch(addNewEvents([...events, { ...event, id: max + 1 }]));
    setState({
      ...state,
      isFormModalVisible: false,
    });
    notification.open({
      message: 'New Event Added',
    });
  };

  //  <ul className="event-list">
  //       {events.map((event, index) => {
  //         const { id, title, label } = event;
  //         return (
  //           <li key={id}>
  //             <Link to="#">
  //               {/* <span> {(index + 1) + ')'} </span> */}
  //               <span className={`bullet ${label}`} />
  //               {title}
  //             </Link>

  //           </li>
  //         );
  //       })}
  //     </ul>

  return (
    <>
      {/* <div className="spin" style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading Events..." />
      </div> */}
      {loading && <div style={{ display: 'flex', alignItems: 'center' }}>
        <PageHeader className="ninjadash-page-header-main" title="Calendar" routes={PageRoutes} />
        <Spin size="large" />
      </div>}
      <Main>
        <CalendarWrapper className="ninjadash-calendar-wrap">
          <Row gutter={25} style={{}}>
            {/* <Col xxl={6} xl={9} xs={24}>
              <Aside>
                <Button onClick={onSelectSlot} className="btn-create" size="large" type="primary">
                  <UilPlus /> Create New Event
                </Button>
                <div className="calendar-display">
                  <CalenDar next2Label={null} prev2Label={null} onChange={onChange} value={state.date} />
                </div>
                <br />
                <Cards headless>
                  <h3 className="listHeader">
                    My Calendars
                    <Link onClick={onHandleVisible} className="add-label" to="#">
                      <UilPlus />
                    </Link>
                  </h3>
                  {activeEvent.length ? activeEvent.map((x, index) => {
                    return (
                      <li key={index + 1} href='#' style={{ color: '#8231D3', fontWeight: '400', display: "flex" }}>{x?.title || ''}</li>
                    )
                  }) :
                    <span>No events</span>
                  }

                  event display array
                </Cards>
              </Aside>
            </Col> */}
            <Col xxl={18} xl={15} xs={24}>
              <Modal
                className="ninjadash-event-form"
                footer={null}
                type="primary"
                title={modalTitle}
                visible={isFormModalVisible}
                onCancel={handleCancel}
              >
                {/* <eventContext.Provider value={selectedEvent}>
                  <EventForm eventData={selectedEvent} onHandleAddEvent={addNew} />
                </eventContext.Provider> */}
              </Modal>
              <Modal
                title={selectedEvent.title}
                // className={`ninjadash-event-details-modal ninjadash-event-details-modal-${selectedEvent.label}`}
                className={`customHeader`}
                visible={isEventModalVisible}
                onCancel={handleCancel}
                footer={null}
              >  <EventModalStyleWrap>
                  {/* <div className="ninjadash-event-details-top bg-red-100">
                    <Link to="#" onClick={() => activateEdit(selectedEvent)}>
                      <UilEdit />
                    </Link>
                    <Link to="#" onClick={() => deleteEvent(selectedEvent.id)}>
                      <UilTrash />
                    </Link>
                  </div> */}
                  <div className="ninjadash-event-details">
                    <ul>
                      <li>
                        <UilCalender />
                        <span className="ninjadash-event-label">Date:</span>
                        <span className="ninjadash-event-text">
                          <strong>
                            {moment(selectedEvent.start).format('Do MMMM YYYY')} to{' '}
                            {moment(selectedEvent.end).format('Do MMMM YYYY')}
                          </strong>
                        </span>
                      </li>
                      {/* <li>
                        <UilClock />
                        <span className="ninjadash-event-label">Time:</span>
                        <span className="ninjadash-event-text">
                          <strong>
                            {moment(selectedEvent.start).format('hh:mm:')} - {moment(selectedEvent.end).format('LT')}
                          </strong>
                        </span>
                      </li> */}
                      <li className="ninjadash-event-description">
                        <UilSubject />
                        <span className="ninjadash-event-text">
                          {selectedEvent.txtEventMasterCode || 'N/A'} - {selectedEvent?.txtEventTypeName || 'N/A'}
                        </span>
                      </li>
                      <li className="ninjadash-event-description">
                        <UilSubject />
                        <span className="ninjadash-event-text">
                          Venue: {selectedEvent.txtVenueName || 'N/A'}
                        </span>
                      </li>
                    </ul>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                      <Button type="primary"
                        onClick={() => {
                          localStorage.setItem('serEventMasterData', JSON.stringify(selectedEvent));
                          selectedEvent?.serEventMasterId && navigate('/event-master/' + selectedEvent?.serEventMasterId);
                        }}
                      >
                        View Event
                      </Button>
                    </div>
                  </div>
                </EventModalStyleWrap>
              </Modal>
            </Col>

            <Col style={{ minHeight: "600px", width: '100%' }}>
              <DragAndDropCalendar
                className="ninjadasgcaled"
                selectable
                localizer={Localizer}
                events={events.map(mapToRBCFormat)}
                resizable
                // eslint-disable-next-line no-use-before-define
                components={{ toolbar: CustomToolbar }}
                defaultView="month"
                // defaultDate={moment('08-09-2025', 'DD-MM-YYYY').toDate()}
                defaultDate={new Date()}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                step={60}
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
                eventPropGetter={eventStyleGetter}
              />
            </Col>

          </Row>
        </CalendarWrapper>
      </Main >
    </>
  );
}

export class CustomToolbar extends Toolbar {
  componentDidMount() {
    const toolbarLink = document.querySelectorAll('.calendar-header__right a');
    // eslint-disable-next-line no-plusplus
    for (let i = 0, { length } = toolbarLink; i < length; i++) {
      // eslint-disable-next-line func-names
      toolbarLink[i].onclick = function () {
        // debugger
        const activatedLink = document.querySelector('.calendar-header__right a.active');
        if (activatedLink) activatedLink.classList.remove('active');
        this.classList.add('active');
      };
    }
  }

  render() {
    return (
      <div className="calendar-header">
        <div className="calendar-header__left">
          <button type="button" className="btn-today" onClick={() => this.navigate('TODAY')}>
            today
          </button>
          <div className="calender-head__navigation">
            <button className="btn-navigate" type="button" onClick={() => this.navigate('PREV')} aria-label="Previous">
              <UilAngleLeft />
            </button>
            <span className="date-label">{this.props.label}</span>
            <button className="btn-navigate" type="button" onClick={() => this.navigate('NEXT')} aria-label="Next">
              <UilAngleRight />
            </button>
          </div>
        </div>
        <div className="calendar-header__right">
          <ul>
            <li>
              <Link className="active" to="#" onClick={this.view.bind(null, 'month')}>
                Month
              </Link>
            </li>
            {/* <li>
              <Link to="#" onClick={this.view.bind(null, 'week')}>
                Week
              </Link>
            </li>
            <li>
              <Link to="#" onClick={this.view.bind(null, 'day')}>
                Day
              </Link>
            </li> */}
          </ul>
          {/* <Link to="#" onClick={this.view.bind(null, 'agenda')} className="schedule-list">
            <UilListUl />
            Schedule
          </Link> */}
        </div>
      </div>
    );
  }
}

export default Calendars;

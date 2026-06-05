import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Progress, Pagination, Tag, Space, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import UilEllipsisH from '@iconscout/react-unicons/icons/uil-ellipsis-h';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';
import UilMoneyBill from '@iconscout/react-unicons/icons/uil-money-bill';
import UilGlobe from '@iconscout/react-unicons/icons/uil-globe';
import Heading from '../../components/heading/heading';
import { Cards } from '../../components/cards/frame/cards-frame';
import { ProjectPagination, ProjectListTitle, ProjectList } from '../../layout/Style';
import { Dropdown } from '../../components/dropdown/dropdown';
import { Button } from '../../components/buttons/buttons';
import { useNavigate } from 'react-router-dom';

function EventList({ events, totalEvents, isLoadingEvents, onDeleteEvent, onEditEvent, onSetBudget, onViewEvent, onClickPagination }) {
  const [state, setState] = useState({
    paginatedEvents: [],
    current: 1,
    pageSize: 10,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  useEffect(() => {
    if (events) {
      const currentPage = state.current;
      const pageSize = state.pageSize;
      const paginatedData = events.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      setState((prevState) => ({ ...prevState, paginatedEvents: paginatedData }));
      // const paginatedData = events.slice((state.current - 1) * state.pageSize, state.current * state.pageSize);
      // setState((prevState) => ({ ...prevState, paginatedEvents: paginatedData }));
    }
  }, [state.current, state.pageSize]);
  useEffect(() => {
    if (events) {
      const currentPage = 1;
      const pageSize = 10;
      // const paginatedData = events.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      const paginatedData = events;
      // .slice((currentPage - 1) * pageSize, currentPage * pageSize);
      setState(({
        paginatedEvents: paginatedData,
        current: currentPage,
        pageSize: pageSize,
      }));
      // const paginatedData = events.slice((state.current - 1) * state.pageSize, state.current * state.pageSize);
      // setState((prevState) => ({ ...prevState, paginatedEvents: paginatedData }));
    }
  }, [events]);

  const navigate = useNavigate();

  const onShowSizeChange = (currentPage, newPageSize) => {
    setState((prevState) => ({ ...prevState, pageSize: newPageSize, current: 1 }));
  };

  const onHandleChange = (currentPage, newPageSize) => {
    setState((prevState) => ({ ...prevState, current: currentPage, pageSize: newPageSize }));
  };

  const dataSource = [];
  if (state.paginatedEvents.length) {
    // debugger
    const startIndex = (state.current - 1) * state.pageSize;
    state.paginatedEvents.forEach((event, index) => {
      const {
        serEventMasterId,
        title,
        txtEventMasterCode,
        txtGroomFirstName,
        txtEventTypeName,
        numInfoFilledStatus,
        txtEventMasterName,
        dteEventDate,
      } = event;

      dataSource.push({
        // key: serEventMasterId,
        // srNo: (
        //   <ProjectListTitle>
        //     <Heading as="h5">
        //       <Link to="#">{txtEventMasterCode || ''}</Link>
        //       <p>{startIndex + index + 1}</p>
        //     </Heading>
        //     <p>{txtEventMasterCode}</p>
        //   </ProjectListTitle>
        // ),
        eventCode: (
          <ProjectListTitle>
            <Heading as="h4">
              <Link to="#">{txtEventMasterCode || ''}</Link>
            </Heading>
            {/* <p>{txtEventMasterCode}</p> */}
          </ProjectListTitle>
        ),
        eventTitle: (
          <ProjectListTitle>
            <Heading as="h4">
              {/* This link should probably go to a detailed event page */}
              <Link to="#">{txtEventMasterName || title}</Link>
            </Heading>
            {/* <p>Code: {txtEventMasterCode}</p> */}
          </ProjectListTitle>
        ),
        customer: <span className="date-started">{txtEventTypeName}</span>,
        date: <span className="date-started">{dteEventDate}</span>,
        // Assuming a status from your data
        status: <Tag color={event.blnIsActive ? 'Green' : 'Red'}>{event.blnIsActive ? 'Active' : 'Inactive'}</Tag>,
        completion: (
          <div className="project-list-progress">
            <Progress percent={numInfoFilledStatus} strokeWidth={5} className="progress-primary" />
          </div>
        ),
        actions: (
          <Space size="middle">
            <Button
              className="btn-icon"
              type="link"
              onClick={() => {
                const accessToken = (localStorage.getItem('access_token_admin') || '').trim();
                const refreshToken = (localStorage.getItem('refresh_token_admin') || '').trim();
                const mode = 'edit';
                // const serEventMasterData = JSON.stringify(event);
                const baseUrl = (process.env.REACT_APP_CLIENT_PORTAL_URL || 'http://localhost:5173').trim();
                const url = `${baseUrl}/client-journey?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}&mode=${mode}&event=${encodeURIComponent(event.serEventMasterId)}`;
                window.open(url, '_blank');
              }}
              title="Open Client Portal"
              style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            >
              <UilGlobe />
            </Button>
            <Button
              className="btn-icon"
              type="link"
              onClick={() => {
                localStorage.setItem('serEventMasterData', JSON.stringify(event));
                navigate(`/event-master/view/${serEventMasterId}`);
              }}
              title="View Details"
              style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            >
              <UilEye />
            </Button>
            <Button
              className="btn-icon"
              type="link"
              onClick={() => {
                localStorage.setItem('serEventMasterData', JSON.stringify(event));
                navigate(`/event-master/${serEventMasterId}`);
              }}
              title="Edit Event"
              style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            >
              <UilEdit />
            </Button>
            {/* <Button
              className="btn-icon"
              type="link"
              onClick={() => onDeleteEvent(serEventMasterId, txtEventMasterName)}
              title="Delete Event"
              style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            >
              <UilTrashAlt />
            </Button> */}
            {/* <Button
              className="btn-icon"
              type="link"
              onClick={() => {
                console.log('ID:', serEventMasterId);

                onSetBudget(serEventMasterId)
              }
              }
              title="Set Budget"
              style={{ color: '#a0a0a0', fontSize: '18px', padding: '0 4px', backgroundColor: 'transparent' }}
            >
              <UilMoneyBill />
            </Button> */}
          </Space>
        ),
      });
    });
  }

  const columns = [
    // {
    //   title: 'Sr #',
    //   dataIndex: 'srNo',
    //   key: 'srNo',
    // },
    {
      title: 'Event Code',
      dataIndex: 'eventCode',
      key: 'eventCode',
    },
    {
      title: 'Event Name',
      dataIndex: 'eventTitle',
      key: 'eventTitle',
    },
    {
      title: 'Event Type',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Event Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Completion %',
      dataIndex: 'completion',
      key: 'completion',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
    },
  ];

  return (
    <Row gutter={25}>
      <Col xs={24}>
        <Cards headless>
          <ProjectList>
            <div className="table-responsive">
              <Table
                // pagination={false}
                pagination={{
                  ...pagination,
                  showSizeChanger: false,
                  total: totalEvents,
                  onChange: (page, pageSize) => {
                    setPagination({ current: page, pageSize });
                    onClickPagination({ current: page, pageSize });
                  },
                  onShowSizeChange: (current, size) => {
                    // debugger
                    setPagination({ current: 1, pageSize: size });
                  },
                }}
                dataSource={dataSource}
                columns={columns}
                loading={isLoadingEvents}
                locale={{
                  emptyText: isLoadingEvents ? ' ' : 'No Events Found',
                }}
              />
            </div>
          </ProjectList>
        </Cards>
      </Col>
      {/* <Col xs={24} className="pb-30">
        <ProjectPagination>
          {events.length ? (
            <>
              <Pagination
                onChange={onHandleChange}
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                pageSize={state.pageSize}
                current={state.current}
                total={events.length}
              />
            </>
          ) : null}
        </ProjectPagination>
      </Col> */}
    </Row>
  );
}

export default EventList;

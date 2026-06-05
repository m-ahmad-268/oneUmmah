// src/container/pages/Venues.js

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Tag, Space, message, Modal } from 'antd';
import UilEye from '@iconscout/react-unicons/icons/uil-eye';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';

import VenueFormModal from './VenueFormModal';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, CardToolbox } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';
import { useDeleteConfirmation } from '../../components/hooks/useDeleteConfirmation';

function Venues() {
  const [venueData, setVenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allExistingCodes, setAllExistingCodes] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const accessToken = localStorage.getItem('access_token_admin');

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- Updated API URL to use process.env ---
        const response = await fetch(`${process.env.REACT_APP_API_URL}cityMaster/getAllData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        setCities(data.result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [accessToken]);


  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // --- Updated API URL to use process.env ---
      const response = await fetch(`${process.env.REACT_APP_API_URL}venueMaster/getAllGroupedByCity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.code === 200 && data.status === 'OK' && Array.isArray(data.result)) {
        const flattenedVenues = [];
        const codes = new Set();

        data.result.forEach((cityGroup) => {
          if (cityGroup.venueMasters && Array.isArray(cityGroup.venueMasters)) {
            cityGroup.venueMasters.forEach((venue) => {
              flattenedVenues.push({
                ...venue,
                cityMaster: {
                  serCityId: cityGroup.serCityId,
                  txtCityCode: cityGroup.txtCityCode,
                  txtCityName: cityGroup.txtCityName,
                },
                key: venue.serVenueMasterId,
              });

              if (venue.txtVenueCode) {
                codes.add(venue.txtVenueCode);
              }
              if (venue.venueMasterDetails && Array.isArray(venue.venueMasterDetails)) {
                venue.venueMasterDetails.forEach((hall) => {
                  if (hall.txtHallCode) {
                    codes.add(hall.txtHallCode);
                  }
                });
              }
            });
          }
        });
        setVenueData(flattenedVenues);
        setAllExistingCodes(Array.from(codes));
      } else {
        throw new Error(data.message || 'Invalid data format received');
      }
    } catch (e) {
      setError(e.message);
      message.error(`Failed to load venues: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const { showDeleteConfirm } = useDeleteConfirmation(fetchVenues);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const showAddModal = () => {
    setEditingVenue(null);
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingVenue(record);
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setEditingVenue(record);
    setIsViewMode(true);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingVenue(null);
    setIsViewMode(false);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingVenue(null);
    setIsViewMode(false);
    fetchVenues();
  };

  const handleDelete = (record) => {
    showDeleteConfirm({
      name: `${record.txtVenueName}`,
      id: record.serVenueMasterId,
      // --- Updated API URL to use process.env ---
      endpoint: `${process.env.REACT_APP_API_URL}venueMaster/deleteById`,
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
      title: 'Venue Code',
      dataIndex: 'txtVenueCode',
      key: 'txtVenueCode',
      sorter: (a, b) => a.txtVenueCode.localeCompare(b.txtVenueCode),
    },
    {
      title: 'Venue Name',
      dataIndex: 'txtVenueName',
      key: 'txtVenueName',
      sorter: (a, b) => a.txtVenueName.localeCompare(b.txtVenueName),
    },
    {
      title: 'City',
      dataIndex: ['cityMaster', 'txtCityName'],
      key: 'txtCityName',
      sorter: (a, b) => a.cityMaster.txtCityName.localeCompare(b.cityMaster.txtCityName),
    },
    {
      title: 'Address',
      dataIndex: 'txtAddress',
      key: 'txtAddress',
      render: (text) => (text ? text : 'N/A'),
    },
    {
      title: 'Active',
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
    // {
    //   title: 'Halls',
    //   dataIndex: 'venueMasterDetails',
    //   key: 'halls',
    //   render: (venueMasterDetails) => (
    //     <Space size={[0, 8]} wrap>
    //       {venueMasterDetails && venueMasterDetails.length > 0 ? (
    //         venueMasterDetails.map((hall) => (
    //           <Tag key={hall.serVenueMasterDetailId} color="green">
    //             {hall.txtHallName} ({hall.numCapacity} {hall.txtCapacity || 'Persons'})
    //           </Tag>
    //         ))
    //       ) : (
    //         <Tag color="red">0 Halls</Tag>
    //       )}
    //     </Space>
    //   ),
    // },
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
            title="Edit Venue"
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

  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Dashboard',
    },
    {
      path: '',
      breadcrumbName: 'Venues',
    },
  ];

  return (
    <>
      <CardToolbox>
        <PageHeader
          className="ninjadash-page-header-main"
          ghost
          title="Venues"
          subTitle={
            <>
              <span className="title-counter">{venueData.length} Venues </span>
            </>
          }
          buttons={[
            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={showAddModal}>
              + Add New Venue
            </Button>,
          ]}
        />
      </CardToolbox>

      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              {loading && <p>Loading venues...</p>}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              {!loading && !error && (
                <Table
                  columns={columns}
                  dataSource={venueData}
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

      <VenueFormModal
        visible={isModalVisible}
        initialData={editingVenue}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        cities={cities || []} // You'll need to pass your cities data here, as assumed
        allExistingCodes={allExistingCodes}
        isViewMode={isViewMode}
      />
    </>
  );
}

export default Venues;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Table } from 'antd';
// import topProduct from './table-data.json'; // No longer needed for this specific table
import { Cards } from '../../../components/cards/frame/cards-frame';
import { TopSellerWrap } from '../../../layout/Style';
import { BorderLessHeading, TableDefaultStyle } from '../../styled';
import { InlineWidget } from 'react-calendly';

// Define the columns for the Event Booking table
const eventBookingColumns = [
  {
    title: 'Event Name',
    dataIndex: 'eventName',
    key: 'eventName',
  },
  {
    title: 'Total Booked',
    dataIndex: 'totalBooked',
    key: 'totalBooked',
    sorter: (a, b) => a.totalBooked - b.totalBooked, // Enable sorting by totalBooked
  },
  {
    title: 'Total Revenue',
    dataIndex: 'totalRevenue',
    key: 'totalRevenue',
  },
];


const TopSellingProduct = React.memo(() => {
  // We don't need 'sellingTab' state for this specific table anymore as it's not time-period based
  // const [state, setState] = useState({ sellingTab: 'today' });

  const accessToken = localStorage.getItem('access_token_admin');

  const [eventData, setEventData] = useState([]); // State to hold the processed event data

  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_API_URL}eventMaster/getEventStats`, {
        const response = await fetch(`${process.env.REACT_APP_API_URL}analytics/summary`, {
          method: 'GET', // Assuming POST based on previous API calls
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          // body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiData = await response.json();

        // if (apiData.code === 200 && Array.isArray(apiData.result)) {
        if (!!apiData && Array.isArray(apiData.eventTypeStats)) {
          // Process and sort the data
          const processedData = apiData.eventTypeStats
            .map((event, index) => {
              const data = (Math.random() * 1000) + 500;
              return {
                key: event.eventTypeId || index, // Use event name as key, fallback to index
                eventName: event.eventTypeName,
                totalBooked: event.totalEvents,
                totalRevenue: `£${event.totalSale.toFixed(2)}`, // Random predefined revenue
              }
            })
            .sort((a, b) => b.totalBooked - a.totalBooked); // Sort in descending order by totalBooked

          setEventData(processedData);
        }
      } catch (error) {
        console.error('Failed to fetch event stats:', error);
        // Optionally, set an empty array or show an error state if the fetch fails
        setEventData([]);
      }
    };

    fetchEventStats();
  }, []); // Empty dependency array means this runs once on mount

  // Since we're using API data directly, the 'sellingData' transformation logic
  // based on topSaleProduct and sellingTab is no longer relevant for this component.
  // The 'eventData' state directly serves as the dataSource.

  return (
    <div className="full-width-table">
      <BorderLessHeading>
        {/* <div className="calendly-inline-widget" data-url="https://calendly.com/mnaveed155?hide_landing_page_details=1&hide_gdpr_banner=1" style={{ 'min-width': '320px', height: '700px' }}></div>
        <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script> */}

        {/* <InlineWidget url="https://calendly.com/mnaveed155?hide_landing_page_details=1&hide_gdpr_banner=1" /> */}
        {/* <Row gutter={16} style={{ padding: '15px', backgroundColor: 'aqua' }}>
          <Col span={24}>
            <div style={{ backgroundColor: 'red' }}>
            </div>
          </Col>
        </Row> */}
        <Cards
          // Removed the time period buttons as they are not applicable to this API data
          // If you need them for other tables within the same component, you'd re-introduce them
          // and manage separate state/data for those tables.
          title="Top Events Registered"
          size="large"
        >
          <TableDefaultStyle className="ninjadash-having-header-bg">
            <TopSellerWrap>
              <div className="table-bordered top-seller-table table-responsive">
                {/* Use eventBookingColumns and eventData */}
                <Table columns={eventBookingColumns} dataSource={eventData} pagination={false} />
              </div>
            </TopSellerWrap>
          </TableDefaultStyle>
        </Cards>
      </BorderLessHeading >
    </div >
  );
});

export default TopSellingProduct;

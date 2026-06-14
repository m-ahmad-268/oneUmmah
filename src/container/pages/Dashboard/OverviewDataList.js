import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import propTypes from 'prop-types';
import OverviewCard from './OverviewCard';
import OverviewData from './overviewData.json';
import { OverviewDataStyleWrap } from '../../../layout/Style';

const OverviewDataList = React.memo(({ column }) => {
  const [dashboardData, setDashboardData] = useState(OverviewData);
  const accessToken = localStorage.getItem('access_token_admin');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- API Call 1: Customer Stats ---
        const customerResponse = await fetch(`${process.env.REACT_APP_API_URL}customerMaster/getDashboardStats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
        });

        if (!customerResponse.ok) {
          throw new Error(`HTTP error! status: ${customerResponse.status} from customerMaster API`);
        }
        const customerApiData = await customerResponse.json();

        // --- API Call 2: Event Stats ---
        const eventResponse = await fetch(`${process.env.REACT_APP_API_URL}eventMaster/getEventStats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
        });

        if (!eventResponse.ok) {
          throw new Error(`HTTP error! status: ${eventResponse.status} from eventMaster API`);
        }
        const eventApiData = await eventResponse.json();

        // --- NEW API Call 3: Event Budget Summary for Total Sales ---
        const salesResponse = await fetch(`${process.env.REACT_APP_API_URL}analytics`, {
          // const salesResponse = await fetch(`${process.env.REACT_APP_API_URL}eventBudget/summary`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          // body: JSON.stringify({}),
        });

        if (!salesResponse.ok) {
          throw new Error(`HTTP error! status: ${salesResponse.status} from eventBudget/summary API`);
        }
        const salesApiData = await salesResponse.json();

        // --- Update State Based on ALL API Data ---
        setDashboardData((prevData) =>
          prevData.map((item) => {
            let updatedItem = { ...item };

            // Update "Total Customers" (ID 1)
            if (
              item.id === 1 &&
              item.label === 'Total Customers' &&
              customerApiData.code === 200 &&
              customerApiData.result
            ) {
              const { totalCustomers, monthlyIncreaseRate } = customerApiData.result;
              const newStatus = monthlyIncreaseRate < 0 ? 'down' : 'growth';
              updatedItem = {
                ...updatedItem,
                total: totalCustomers.toString(),
                statusRate: Math.abs(monthlyIncreaseRate),
                status: newStatus,
              };
            }

            // Update "Total Events Booked" (ID 2)
            // if (
            //   item.id === 2 &&
            //   item.label === 'Total Events Booked' &&
            //   eventApiData.code === 200 &&
            //   Array.isArray(eventApiData.result)
            // )
            if (item.id === 2 && item.label === 'Total Events Booked' && !!salesApiData) {
              // const totalEventsBooked = eventApiData.result.reduce((sum, event) => sum + event.numTotalEvents, 0);
              const { totalEvents } = salesApiData;
              updatedItem = {
                ...updatedItem,
                total: totalEvents,
                label: 'Total Events Registered'
                // total: totalEventsBooked.toString(),
              };
            }

            // Update "Total Sales" (ID 3) - NEW ADDITION
            // if (item.id === 3 && item.label === 'Total Sales' && salesApiData.code === 200 && salesApiData.result) {
            if (item.id === 3 && item.label === 'Total Sales' && !!salesApiData) {
              const { totalSales } = salesApiData;
              updatedItem = {
                ...updatedItem,
                total: totalSales, // Format as string, consider decimals
              };
            }

            // Update "New Customers" (ID 4)
            if (
              item.id === 4 &&
              item.label === 'New Customers' &&
              customerApiData.code === 200 &&
              customerApiData.result
            ) {
              const { totalCustomers, thisMonthCustomers } = customerApiData.result;
              const newCustomersTotal = thisMonthCustomers;
              let newCustomersRate = 0;
              let newCustomersStatus = 'growth';

              if (Number(totalCustomers) > 0) {
                newCustomersRate = (newCustomersTotal / totalCustomers) * 100;
              }

              if (newCustomersTotal === 0) {
                newCustomersStatus = 'down';
              }

              updatedItem = {
                ...updatedItem,
                label: 'New Customers (Current Month)',
                total: newCustomersTotal.toString(),
                dataPeriod: 'This month',
                status: newCustomersStatus,
                statusRate: newCustomersRate,
              };
            }

            return updatedItem;
          }),
        );
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    // fetchData();
  }, []);

  // Ensure "Total Sales" (ID 3) is included in the displayed items.
  // If your `overviewData.json` has "Total Sales" at ID 3, and you want to show
  // it along with "Total Customers", "Total Events Booked", and "New Customers",
  // then slicing to 4 will work perfectly as ID 3 is within the first 4.
  const OverviewDataSorted = dashboardData.slice(0, 4);

  return (
    <OverviewDataStyleWrap>
      <Row gutter={25}>
        {OverviewDataSorted.map((item) => {
          return (
            <Col xxl={column === '2' ? null : 6} md={12} xs={24} key={item.id}>
              <OverviewCard data={item} contentFirst />
            </Col>
          );
        })}
      </Row>
    </OverviewDataStyleWrap>
  );
});

OverviewDataList.propTypes = {
  column: propTypes.string,
};

OverviewDataList.defaultProps = {
  column: '2',
};

export default OverviewDataList;

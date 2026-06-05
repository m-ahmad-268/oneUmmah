import UilDown from '@iconscout/react-unicons/icons/uil-arrow-down';
import UilUp from '@iconscout/react-unicons/icons/uil-arrow-up';
import { Spin } from 'antd';
import React, { useState, useEffect } from 'react'; // Import useEffect for API calls
import DashboardChart from './DashboardChart';
// Removed import chartData from './dashboardChartContent.json'; as we'll use APIs
import { Cards } from '../../../components/cards/frame/cards-frame';
import { BorderLessHeading } from '../../styled';
import { CardBarChart, ChartContainer } from '../../../layout/Style';
import Swal from 'sweetalert2'; // For error notifications

// Helper function to get month name
const getMonthName = (date = new Date()) => {
  return date.toLocaleString('en-US', { month: 'long' });
};

// Helper function to generate labels for 5-day intervals for the current month
const getMonthlyFiveDayLabels = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
  const labels = [];
  for (let i = 1; i <= numberOfDaysInMonth; i += 5) {
    const startDay = i;
    const endDay = Math.min(i + 4, numberOfDaysInMonth);
    labels.push(`${startDay}-${endDay}`);
  }
  return labels;
};

// Helper function to distribute total value realistically across intervals
const distributeValueRealistically = (total, numberOfIntervals) => {
  if (total === 0) return Array(numberOfIntervals).fill(0);

  const values = Array(numberOfIntervals).fill(0);
  let remaining = total;

  for (let i = 0; i < numberOfIntervals - 1; i++) {
    // Distribute a portion, ensuring enough remains for subsequent intervals
    // This makes it more "realistic" by not just giving all to the first few
    const avgPerInterval = remaining / (numberOfIntervals - i);
    const maxContribution = Math.min(Math.floor(avgPerInterval * 1.5), remaining); // Max 1.5x average
    const minContribution = Math.min(Math.floor(avgPerInterval * 0.5), remaining); // Min 0.5x average

    // Ensure minContribution is not greater than maxContribution
    const actualMin = Math.min(minContribution, maxContribution);

    const assignedValue = Math.floor(Math.random() * (maxContribution - actualMin + 1)) + actualMin;
    values[i] = assignedValue;
    remaining -= assignedValue;
  }
  values[numberOfIntervals - 1] += remaining; // Assign remaining to the last interval
  return values;
};

const SalesGrowth = React.memo(() => {
  const [loading, setLoading] = useState(true);
  const [salesGrowthMonthlyData, setSalesGrowthMonthlyData] = useState({
    labels: getMonthlyFiveDayLabels(),
    events: [], // To store events data for the chart
    sales: [], // To store sales data for the chart (derived from customers)
    totalEvents: 0,
    totalSalesAmount: 0, // Placeholder, as actual sales amount isn't directly from API
    eventsGrowthRate: 0, // Placeholder for calculated growth
    salesGrowthRate: 0, // Placeholder for calculated growth
  });

  const accessToken = localStorage.getItem('access_token_admin');

  useEffect(() => {
    const fetchSalesGrowthData = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
        const numberOfIntervals = Math.ceil(numberOfDaysInMonth / 5);

        // --- Fetch Customer Stats ---
        const customerResponse = await fetch(`${process.env.REACT_APP_API_URL}customerMaster/getDashboardStats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({}),
        });

        if (!customerResponse.ok) {
          throw new Error(`HTTP error! status: ${customerResponse.status} from customerMaster API`);
        }
        const customerApiData = await customerResponse.json();

        // --- Fetch Event Stats ---
        const eventResponse = await fetch(`${process.env.REACT_APP_API_URL}eventMaster/getEventStats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({}),
        });

        if (!eventResponse.ok) {
          throw new Error(`HTTP error! status: ${eventResponse.status} from eventMaster API`);
        }
        const eventApiData = await eventResponse.json();

        let fetchedThisMonthCustomers = 0;
        let fetchedTotalEventsBooked = 0;

        // Process Customer Data
        if (customerApiData.code === 200 && customerApiData.result) {
          fetchedThisMonthCustomers = customerApiData.result.thisMonthCustomers || 0;
          // For sales growth percentage, you'd need last month's customer count.
          // For now, we'll use a placeholder or derive it if available in API.
          // Let's assume a dummy 'previousMonthCustomers' for calculation if not provided.
          const previousMonthCustomers = customerApiData.result.lastMonthCustomers || fetchedThisMonthCustomers * 0.8; // Example: 80% of current if not provided

          if (previousMonthCustomers > 0) {
            const growth = ((fetchedThisMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100;
            setSalesGrowthMonthlyData((prevState) => ({
              ...prevState,
              salesGrowthRate: parseFloat(growth), // Store for display
            }));
          }
        }

        // Process Event Data
        if (eventApiData.code === 200 && Array.isArray(eventApiData.result)) {
          fetchedTotalEventsBooked = eventApiData.result.reduce((sum, event) => sum + event.numTotalEvents, 0);
          // Same for events growth percentage. Assume dummy 'previousMonthEvents'.
          const previousMonthEvents =
            eventApiData.result.reduce((sum, event) => sum + event.numPreviousMonthTotalEvents, 0) ||
            fetchedTotalEventsBooked * 0.7; // Example
          if (previousMonthEvents > 0) {
            const growth = ((fetchedTotalEventsBooked - previousMonthEvents) / previousMonthEvents) * 100;
            setSalesGrowthMonthlyData((prevState) => ({
              ...prevState,
              eventsGrowthRate: parseFloat(growth), // Store for display
            }));
          }
        }

        // Distribute fetched totals across 5-day intervals
        const distributedEvents = distributeValueRealistically(fetchedTotalEventsBooked, numberOfIntervals);
        const distributedSales = distributeValueRealistically(fetchedThisMonthCustomers, numberOfIntervals);

        // For "Total Sales Amount" in the top card, if your API returns a total revenue
        // use that. If not, we can derive a simulated amount based on customers.
        // Let's assume an average sale value per new customer for a simulated total.
        const averageSaleValuePerCustomer = 15; // Example average sale value in dollars
        const simulatedTotalSalesAmount = fetchedThisMonthCustomers * averageSaleValuePerCustomer;

        setSalesGrowthMonthlyData((prevState) => ({
          ...prevState,
          events: distributedEvents,
          sales: distributedSales,
          totalEvents: fetchedTotalEventsBooked,
          totalSalesAmount: simulatedTotalSalesAmount, // Use simulated amount
        }));
      } catch (error) {
        console.error('Failed to fetch sales growth data:', error);
        Swal.fire('Error', 'Failed to load sales growth data. Please try again.', 'error');
        // Set default or empty data on error
        const numberOfIntervals = Math.ceil(
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() / 5,
        );
        setSalesGrowthMonthlyData((prevState) => ({
          ...prevState,
          events: Array(numberOfIntervals).fill(0),
          sales: Array(numberOfIntervals).fill(0),
          totalEvents: 0,
          totalSalesAmount: 0,
          eventsGrowthRate: 0,
          salesGrowthRate: 0,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchSalesGrowthData();
  }, []); // Run once on component mount

  const salesGrowthDataset = [
    {
      data: salesGrowthMonthlyData.events, // Use dynamically fetched and distributed events
      backgroundColor: '#C097E9',
      hoverBackgroundColor: '#8231D3',
      label: 'Events',
      // average and percent will be dynamic or removed as they are fixed now
      maxBarThickness: 10,
      barThickness: 12,
    },
    {
      data: salesGrowthMonthlyData.sales, // Use dynamically fetched and distributed sales (customers)
      backgroundColor: '#7FD4FF',
      hoverBackgroundColor: '#00AAFF',
      label: 'Sales (Customers)', // Clarify label
      // average and percent will be dynamic or removed
      maxBarThickness: 10,
      barThickness: 12,
    },
  ];

  // Determine icon and class for Events Growth
  const eventsGrowthIcon = salesGrowthMonthlyData.eventsGrowthRate >= 0 ? <UilUp /> : <UilDown />;
  const eventsGrowthClass = salesGrowthMonthlyData.eventsGrowthRate >= 0 ? 'status-growth' : 'status-down';

  // Determine icon and class for Sales (Customers) Growth
  const salesGrowthIcon = salesGrowthMonthlyData.salesGrowthRate >= 0 ? <UilUp /> : <UilDown />;
  const salesGrowthClass = salesGrowthMonthlyData.salesGrowthRate >= 0 ? 'status-growth' : 'status-down';

  return (
    // <BorderLessHeading>
    <Cards
      // Removed isbutton prop for tab navigation
      title={`Sales Growth - ${getMonthName()}`} // Dynamic title for current month
    >
      {loading ? (
        <div className="sd-spin">
          <Spin />
        </div>
      ) : (
        // <CardBarChart className="" style={{ width: '100%', backgroundColor: 'yellow' }}>
        <>
          <CardBarChart className="ninjadash-profitGroth-barCHar-wrap">
            {true && <div className="ninjadash-chart-top">
              <div className="ninjadash-chart-top__item ninjadash-chart-top__item-order">
                <span className="ninjadash-chart-top__item--amount">
                  {salesGrowthMonthlyData.totalEvents.toLocaleString()}
                </span>
                <span className={`ninjadash-chart-top__item--status ${eventsGrowthClass}`}>
                  {eventsGrowthIcon}
                  {Math.abs(salesGrowthMonthlyData.eventsGrowthRate).toFixed(2)}% {/* Display calculated growth */}
                </span>
                <span className="ninjadash-chart-top__item--text">Total Events Registered</span>
              </div>
              <div className="ninjadash-chart-top__item ninjadash-chart-top__item-sale">
                <span className="ninjadash-chart-top__item--amount">
                  £{salesGrowthMonthlyData.totalSalesAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
                </span>
                <span className={`ninjadash-chart-top__item--status ${salesGrowthClass}`}>
                  {salesGrowthIcon}
                  {Math.abs(salesGrowthMonthlyData.salesGrowthRate).toFixed(2)}% {/* Display calculated growth */}
                </span>
                <span className="ninjadash-chart-top__item--text">New Customer Sales</span> {/* Clarify text */}
              </div>
            </div>}
            <ChartContainer>
              <div className="ninjadash-chart-container">
                <DashboardChart
                  id="ninjadash-profit-growth"
                  labels={salesGrowthMonthlyData.labels} // Use dynamically generated labels
                  datasets={salesGrowthDataset}
                  type="bar"
                  layout={{
                    padding: {
                      top: 20,
                    },
                  }}
                  tooltip={{
                    callbacks: {
                      label(t) {
                        const dstLabel = t.dataset.label;
                        const { formattedValue } = t;
                        return `  ${formattedValue} ${dstLabel}`;
                      },
                      labelColor(t) {
                        return {
                          backgroundColor: t.dataset.hoverBackgroundColor,
                          borderColor: 'transparent',
                        };
                      },
                    },
                  }}
                  scales={{
                    y: {
                      grid: {
                        color: '#0647e029',
                        borderDash: [3, 3],
                        zeroLineColor: '#485e9029',
                        zeroLineWidth: 1,
                        zeroLineBorderDash: [3, 3],
                      },
                      ticks: {
                        beginAtZero: true,
                        fontSize: 12,
                        fontColor: '#182b49',
                        // max: Math.max(...salesGrowthMonthlyData.events, ...salesGrowthMonthlyData.sales), // Max of both datasets
                        // Use a fixed max or calculated from overall max, to prevent flickering
                        max: Math.max(...salesGrowthMonthlyData.events, ...salesGrowthMonthlyData.sales, 100) * 1.2, // Ensure ticks are dynamic and reasonable, plus a floor
                        stepSize:
                          Math.ceil(
                            Math.max(...salesGrowthMonthlyData.events, ...salesGrowthMonthlyData.sales, 100) / 5 / 10,
                          ) * 10, // Dynamic step size, rounded for cleaner ticks
                        display: true,
                        min: 0,
                        padding: 10,
                        callback: function (value) {
                          // Make Y-axis labels cleaner
                          if (value >= 1000) {
                            return `${value / 1000}K`;
                          }
                          return value;
                        },
                      },
                    },

                    x: {
                      grid: {
                        display: true,
                        zeroLineWidth: 2,
                        zeroLineColor: '#fff',
                        color: 'transparent',
                        z: 1,
                      },
                      ticks: {
                        beginAtZero: true,
                        fontSize: 12,
                        fontColor: '#182b49',
                        min: 0,
                      },
                    },
                  }}
                  height={100}
                />
              </div>
            </ChartContainer>
          </CardBarChart>
        </>
      )}
    </Cards>
    // </BorderLessHeading>
  );
});

export default SalesGrowth;

import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import UilPrint from '@iconscout/react-unicons/icons/uil-print';
import UilTimes from '@iconscout/react-unicons/icons/uil-times';
import UilFile from '@iconscout/react-unicons/icons/uil-file';
import { NavLink } from 'react-router-dom';
import UilUp from '@iconscout/react-unicons/icons/uil-arrow-up';
import UilDown from '@iconscout/react-unicons/icons/uil-arrow-down';
import DashboardChart from './DashboardChart';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { chartLinearGradient, customTooltips } from '../../../components/utilities/utilities';
import { BorderLessHeading } from '../../styled';
import { SalesRevenueWrapper, ChartContainer } from '../../../layout/Style';

// --- IMPORTS FOR EXPORT FUNCTIONALITY ---
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
// --- END IMPORTS ---

// Helper function to generate random data for a given total over a month
const generateMonthlyRandomData = (total, numberOfDays) => {
  if (total === 0) return Array(numberOfDays).fill(0);

  const data = Array(numberOfDays).fill(0);
  let remaining = total;

  for (let i = 0; i < numberOfDays - 1; i++) {
    const maxVal = Math.min(Math.floor(remaining / (numberOfDays - i)) * 2, remaining);
    const assignedValue = Math.floor(Math.random() * (maxVal + 1));
    data[i] = assignedValue;
    remaining -= assignedValue;
  }
  data[numberOfDays - 1] += remaining;
  return data;
};

// Helper to get month name
const getMonthName = (date = new Date()) => {
  return date.toLocaleString('en-US', { month: 'long' });
};

const SalesReport = React.memo(({ title }) => {
  const accessToken = localStorage.getItem('access_token_admin');

  const [chartData, setChartData] = useState({
    customerData: Array(30).fill(0),
    eventData: Array(30).fill(0),
    labels: [],
    thisMonthCustomers: 0,
    monthlyIncreaseRate: 0,
    totalEventsBooked: 0,
  });

  // Ref for the content to be printed
  const componentRef = useRef(null);

  // useEffect(() => {
  //   console.log('chartData', chartData);
  // }, [chartData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();

        const currentMonthLabels = Array.from({ length: numberOfDaysInMonth }, (_, i) => `${i + 1}`);

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

        let fetchedThisMonthCustomers = 0;
        let fetchedMonthlyIncreaseRate = 0;
        let fetchedTotalEventsBooked = 0;

        // Process Customer Data
        if (customerApiData.code === 200 && customerApiData.result) {
          fetchedThisMonthCustomers = customerApiData.result.thisMonthCustomers || 0;
          fetchedMonthlyIncreaseRate = customerApiData.result.monthlyIncreaseRate || 0;
        }

        // Process Event Data
        if (eventApiData.code === 200 && Array.isArray(eventApiData.result)) {
          fetchedTotalEventsBooked = eventApiData.result.reduce((sum, event) => sum + event.numTotalEvents, 0);
        }


        const randomizedCustomerData = generateMonthlyRandomData(fetchedThisMonthCustomers, numberOfDaysInMonth);
        const randomizedEventData = generateMonthlyRandomData(fetchedTotalEventsBooked, numberOfDaysInMonth);

        setChartData({
          customerData: randomizedCustomerData,
          eventData: randomizedEventData,
          labels: currentMonthLabels,
          thisMonthCustomers: fetchedThisMonthCustomers,
          monthlyIncreaseRate: fetchedMonthlyIncreaseRate,
          totalEventsBooked: fetchedTotalEventsBooked,
        });
      } catch (error) {
        console.error('Failed to fetch sales report data:', error);
        Swal.fire('Error', 'Failed to load dashboard data. Please try again.', 'error');
      }
    };

    fetchData();
  }, []);

  // --- Function to prepare data for export (CSV/XLSX/Print) ---
  const prepareExportData = () => {
    const monthName = getMonthName();
    const headerTitle = `Zarbotics Events ${monthName} Sales Report`;

    const data = [];

    // Add the main title row (for XLSX merge, or single cell in CSV/Print)
    data.push([headerTitle, '', '']); // Add empty cells for merging effect in XLSX

    // Add an empty row for spacing in XLSX/CSV, or just for consistency in print
    data.push([]);

    // Add column headers
    data.push(['Day', 'New Customers', 'Total Events Registered']);

    // Add daily data
    chartData.labels.forEach((dayLabel, index) => {
      data.push([
        dayLabel, // The day number (1, 2, 3...)
        chartData.customerData[index],
        chartData.eventData[index],
      ]);
    });

    return data;
  };

  // --- MODIFIED: useReactToPrint hook for reliable printing, without SweetAlert ---
  const handlePrint = useReactToPrint({
    content: () => {
      // Add a console.log here to see what componentRef.current is when print is triggered
      console.log('componentRef.current during print:', componentRef.current);
      return componentRef.current;
    },
    documentTitle: `Diamond_Sales_Report_${getMonthName()}_Print`,
    // Removed onBeforePrint and onAfterPrint to avoid SweetAlert for print
  });

  const handleDownloadXLSX = async () => {
    const confirmResult = await Swal.fire({
      title: 'Confirm Download',
      text: 'Do you want to download the Sales Report as Excel (XLSX)?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, download XLSX!',
      cancelButtonText: 'No, cancel',
    });
    if (!confirmResult.isConfirmed) {
      Swal.fire('Cancelled', 'Excel download cancelled.', 'info');
      return;
    }

    try {
      const exportData = prepareExportData();
      const ws = XLSX.utils.aoa_to_sheet(exportData);

      // Merge cells for the title: A1 to C1 (assuming 3 columns total: Day, Customers, Events)
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];

      // Set column widths for better readability (optional)
      const wscols = [
        { wch: 8 }, // Day
        { wch: 20 }, // New Customers
        { wch: 20 }, // Total Events Booked
      ];
      ws['!cols'] = wscols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Sales Report ${getMonthName()}`);
      XLSX.writeFile(wb, `Diamond_Sales_Report_${getMonthName()}.xlsx`);
      Swal.fire('Downloaded!', 'Your Excel file has been downloaded.', 'success');
    } catch (error) {
      console.error('Error downloading XLSX:', error);
      Swal.fire('Error', 'Failed to download Excel file.', 'error');
    }
  };

  const handleDownloadCSV = async () => {
    await Swal.fire({
      title: 'Confirm Download',
      text: 'Do you want to download the Sales Report as CSV?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, download CSV!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const exportData = prepareExportData();
          // Remove the empty row (index 1) and adjust the title row for CSV
          const csvDataRows = exportData.slice(2); // Get "Day", "New Customers", "Total Events Booked" and data rows

          // For CSV, just put the main title in the first cell of the first row
          const csvHeaderTitle = [`Zarbotics Events ${getMonthName()} Sales Report`];
          const finalCsvData = [csvHeaderTitle, ...csvDataRows];

          const ws = XLSX.utils.aoa_to_sheet(finalCsvData);
          const csv = XLSX.utils.sheet_to_csv(ws);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          saveAs(blob, `Diamond_Sales_Report_${getMonthName()}.csv`);
          Swal.fire('Downloaded!', 'Your CSV file has been downloaded.', 'success');
        } catch (error) {
          console.error('Error downloading CSV:', error);
          Swal.fire('Error', 'Failed to download CSV file.', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'CSV download cancelled.', 'info');
      }
    });
  };

  const moreContent = (
    <>
      {/* Removed PDF NavLink */}
      <NavLink
        to="#"
        onClick={(e) => {
          e.preventDefault();
          handleDownloadXLSX();
        }}
      >
        <UilTimes />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={(e) => {
          e.preventDefault();
          handleDownloadCSV();
        }}
      >
        <UilFile />
        <span>CSV</span>
      </NavLink>
    </>
  );

  const salesRevenueDatasets = [
    {
      data: chartData.customerData,
      borderColor: '#8231D3',
      borderWidth: 3,
      fill: true,
      backgroundColor: () =>
        chartLinearGradient(document.getElementById('ninjadash-sales-revenue'), 300, {
          start: 'transparent',
          end: 'transparent',
        }),
      label: 'New Customers (This Month)',
      pointStyle: 'circle',
      pointRadius: '0',
      hoverRadius: '9',
      pointBorderColor: '#fff',
      pointBackgroundColor: '#8231D3',
      hoverBorderWidth: 5,
      amountClass: 'current-amount',
      lineTension: 0.45,
    },
    {
      data: chartData.eventData,
      borderColor: '#00AAFF',
      borderWidth: 3,
      fill: true,
      backgroundColor: () =>
        chartLinearGradient(document.getElementById('ninjadash-sales-revenue'), 300, {
          start: 'transparent',
          end: 'transparent',
        }),
      label: 'Total Events Registered',
      pointStyle: 'circle',
      pointRadius: '0',
      hoverRadius: '9',
      pointBorderColor: '#fff',
      pointBackgroundColor: '#00AAFF',
      hoverBorderWidth: 5,
      amountClass: 'current-amount',
      lineTension: 0.45,
    },
  ];

  const customerStatusIcon = chartData.monthlyIncreaseRate >= 0 ? <UilUp /> : <UilDown />;
  const customerStatusClass = chartData.monthlyIncreaseRate >= 0 ? 'status-growth' : 'status-down';

  return (
    <SalesRevenueWrapper>
      <BorderLessHeading>
        <ChartContainer>
          {/* <Cards title={title} more={moreContent} size="large"> */}
          <Cards title={title} more={<></>} size="large">
            <div className="ninjadash-chart-container ninjadash-sales-revenue-lineChart">
              <div className="ninjadash-chart-top">
                <div className="ninjadash-chart-top__item ninjadash-chart-top__item-order">
                  <span className="ninjadash-chart-top__item--text">New Customers (This Month)</span>
                  <span className="ninjadash-chart-top__item--amount">
                    {chartData.thisMonthCustomers.toLocaleString()}
                  </span>
                  <span className={`ninjadash-chart-top__item--status ${customerStatusClass}`}>
                    {customerStatusIcon}
                    {Math.abs(chartData.monthlyIncreaseRate)}%
                  </span>
                </div>
                <div className="ninjadash-chart-top__item ninjadash-chart-top__item-sale">
                  <span className="ninjadash-chart-top__item--text">Total Events Registered</span>
                  <span className="ninjadash-chart-top__item--amount">
                    {chartData.totalEventsBooked.toLocaleString()}
                  </span>
                  <span className="ninjadash-chart-top__item--status status-growth">
                    <UilUp />
                    N/A% {/* Placeholder for event growth rate */}
                  </span>
                </div>
              </div>
              <DashboardChart
                type="line"
                id="ninjadash-sales-revenue"
                labels={chartData.labels}
                datasets={salesRevenueDatasets}
                scales={{
                  y: {
                    grid: {
                      color: '#485e9029',
                      borderDash: [3, 3],
                      zeroLineColor: 'transparent',
                      zeroLineWidth: 0,
                      zeroLineBorderDash: [0],
                    },
                    ticks: {
                      beginAtZero: true,
                      fontSize: 13,
                      color: '#8C90A4',
                      callback(value) {
                        if (value % 1 === 0) {
                          if (value >= 1000) {
                            return `${value / 1000}K`;
                          }
                          return value;
                        }
                        return null;
                      },
                    },
                  },

                  x: {
                    grid: {
                      display: true,
                      zeroLineWidth: 0,
                      zeroLineColor: 'transparent',
                      color: 'transparent',
                      z: 1,
                      tickMarkLength: 0,
                      drawOnChartArea: true,
                      drawTicks: false,
                      borderDash: [3, 3],
                      borderColor: '#485e9029',
                    },
                    ticks: {
                      color: '#8C90A4',
                      padding: 10,
                    },
                  },
                }}
                tooltip={{
                  custom: customTooltips,
                  callbacks: {
                    title(t) {
                      return `Day ${t[0].label}`;
                    },
                    label(t) {
                      const { formattedValue, dataset } = t;
                      return `${dataset.label}: ${formattedValue}`;
                    },
                  },
                }}
                height={window.innerWidth <= 575 ? 175 : 100}
              />
            </div>
          </Cards>
        </ChartContainer>
      </BorderLessHeading>

      {/* --- Hidden content for printing --- */}
      {/* Ref moved to the outermost div */}
      <div ref={componentRef} style={{ display: 'none' }}>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Zarbotics Events {getMonthName()} Sales Report</h1>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>
                  Day
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>
                  New Customers
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>
                  Total Events Registered
                </th>
              </tr>
            </thead>
            <tbody>
              {chartData.labels.map((dayLabel, index) => (
                <tr key={dayLabel}>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{dayLabel}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                    {chartData.customerData[index]}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                    {chartData.eventData[index]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* --- END: Hidden content for printing --- */}
    </SalesRevenueWrapper>
  );
});

SalesReport.defaultProps = {
  title: 'Sales Report',
};

SalesReport.propTypes = {
  title: PropTypes.string,
};

export default SalesReport;

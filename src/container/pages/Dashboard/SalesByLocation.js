import UilBookOpen from '@iconscout/react-unicons/icons/uil-book-open';
import UilFile from '@iconscout/react-unicons/icons/uil-file';
import UilFileAlt from '@iconscout/react-unicons/icons/uil-file-alt';
import UilPrint from '@iconscout/react-unicons/icons/uil-print';
import UilTimes from '@iconscout/react-unicons/icons/uil-times';
import { Col, Row, Table } from 'antd';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Scrollbars } from '@pezhmanparsaee/react-custom-scrollbars';
import { Link, NavLink } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';
// The original table-data.json is not directly used for the table as per your static UK-only requirement.
// import salesLocations from './table-data.json';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { LocationTableWrap, SaleLocationMap } from '../../../layout/Style';

// Point this to your local UK GeoJSON file
// Make sure to save the large JSON content you provided into this file:
// e.g., src/components/utilities/table/uk-counties.json
const ukGeoUrl = require('./uk-countries.json'); // Adjust path as necessary

const moreContent = (
  <>
    <NavLink to="#">
      <UilPrint />
      <span>Printer</span>
    </NavLink>
    <NavLink to="#">
      <UilBookOpen />
      <span>PDF</span>
    </NavLink>
    <NavLink to="#">
      <UilFileAlt />
      <span>Google Sheets</span>
    </NavLink>
    <NavLink to="#">
      <UilTimes />
      <span>Excel (XLSX)</span>
    </NavLink>
    <NavLink to="#">
      <UilFile />
      <span>CSV</span>
    </NavLink>
  </>
);

const regionColumns = [
  {
    title: 'Top Region',
    dataIndex: 'region',
    key: 'region',
  },
  {
    title: 'Booked Events',
    dataIndex: 'order',
    key: 'order',
  },
  {
    title: 'Revenue',
    dataIndex: 'revenue',
    key: 'revenue',
  },
];

// Static Data for UK Sales Locations
const staticUKSalesData = {
  today: [
    { key: '1', region: 'Glasgow (near Hilton)', order: '85', revenue: '$7,200' },
    { key: '2', region: 'Ayr (near Racecourse)', order: '60', revenue: '$5,800' },
    { key: '3', region: 'Edinburgh', order: '50', revenue: '$4,500' },
    { key: '4', region: 'Manchester', order: '45', revenue: '$3,900' },
    { key: '5', region: 'London', order: '70', revenue: '$6,100' },
    { key: '6', region: 'Birmingham', order: '30', revenue: '$2,700' },
  ],
  week: [
    { key: '1', region: 'Glasgow (near Hilton)', order: '280', revenue: '$25,000' },
    { key: '2', region: 'Ayr (near Racecourse)', order: '200', revenue: '$18,000' },
    { key: '3', region: 'London', order: '250', revenue: '$22,000' },
    { key: '4', region: 'Edinburgh', order: '180', revenue: '$16,000' },
    { key: '5', region: 'Manchester', order: '150', revenue: '$13,500' },
    { key: '6', region: 'Liverpool', order: '120', revenue: '$10,000' },
  ],
  month: [
    { key: '1', region: 'Glasgow (near Hilton)', order: '1000', revenue: '$90,000' },
    { key: '2', region: 'Ayr (near Racecourse)', order: '750', revenue: '$65,000' },
    { key: '3', region: 'London', order: '900', revenue: '$78,000' },
    { key: '4', region: 'Birmingham', order: '600', revenue: '$52,000' },
    { key: '5', region: 'Edinburgh', order: '550', revenue: '$48,000' },
    { key: '6', region: 'Bristol', order: '400', revenue: '$35,000' },
  ],
};

// Coordinates for key UK locations where you have halls or sales concentrated
const ukHallLocations = [
  { name: 'Ayr Racecourse', coordinates: [-4.636, 55.459] }, // Ayr, Scotland (approximate)
  { name: 'Hilton Glasgow', coordinates: [-4.263, 55.86] }, // Glasgow, Scotland (approximate)
  { name: 'Edinburgh', coordinates: [-3.188, 55.953] },
  { name: 'London', coordinates: [-0.127, 51.507] },
  { name: 'Manchester', coordinates: [-2.242, 53.48] },
  { name: 'Birmingham', coordinates: [-1.89, 52.486] },
];

const SaleByLocation = React.memo(() => {
  const [state, setState] = useState({
    locationTab: 'today',
  });
  const [mapContent, setMapContent] = useState(''); // Renamed from 'content' to avoid conflict
  const { locationTab } = state;

  // Rebuild ReactTooltip on content change
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [mapContent]);

  const handleChangeLocation = (value, event) => {
    event.preventDefault();
    setState({
      ...state,
      locationTab: value,
    });
  };

  // Directly use staticUKSalesData for the table
  const saleLocationData = staticUKSalesData[locationTab];

  function renderThumb({ style }) {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: '#E3E6EF',
      height: '220px',
    };
    return <div style={{ ...style, ...thumbStyle }} />;
  }

  renderThumb.propTypes = {
    style: PropTypes.shape(PropTypes.object).isRequired,
  };

  // Map Configuration for UK
  const [position, setPosition] = useState({ coordinates: [-2, 55], zoom: 6 }); // Centered on UK, adjusted zoom

  const handleZoomIn = () => {
    if (position.zoom >= 10) return; // Increased max zoom for UK
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.2 })); // Smaller zoom step for finer control
  };

  const handleZoomOut = () => {
    if (position.zoom <= 2) return; // Decreased min zoom for UK
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.2 })); // Smaller zoom step
  };

  const handleMoveEnd = (newPosition) => {
    setPosition(newPosition);
  };

  return (
    <Cards
      isbutton={
        <div className="ninjadash-card-nav">
          <ul>
            <li className={locationTab === 'today' ? 'ninjadash-active' : 'ninjadash-year'}>
              <Link onClick={(event) => handleChangeLocation('today', event)} to="#">
                Today
              </Link>
            </li>
            <li className={locationTab === 'week' ? 'ninjadash-active' : 'ninjadash-week'}>
              <Link onClick={(event) => handleChangeLocation('week', event)} to="#">
                Week
              </Link>
            </li>
            <li className={locationTab === 'month' ? 'ninjadash-active' : 'ninjadash-month'}>
              <Link onClick={(event) => handleChangeLocation('month', event)} to="#">
                Month
              </Link>
            </li>
          </ul>
        </div>
      }
      title="Sales by Location (UK Only)"
      size="large"
      more={moreContent}
    >
      <Row>
        <Col xxl={12} md={11} xs={24}>
          <LocationTableWrap>
            <Scrollbars
              autoHeight
              autoHeightMin={280}
              autoHide
              renderTrackVertical={(props) => <div {...props} className="ninjadash-track-vertical" />}
            >
              <Table columns={regionColumns} dataSource={saleLocationData} pagination={false} />
            </Scrollbars>
          </LocationTableWrap>
        </Col>
        <Col xxl={12} md={13} xs={24}>
          <SaleLocationMap>
            <div>
              <ReactTooltip>{mapContent}</ReactTooltip>
              <ComposableMap
                data-tip=""
                data-html
                projection="geoMercator"
                projectionConfig={{
                  scale: 3000, // Adjusted scale for UK map, you might need to fine-tune
                  center: [-2, 55], // Initial center for UK
                }}
              >
                <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd}>
                  <Geographies geography={ukGeoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => {
                            const { name } = geo.properties;
                            setMapContent(`${name}`);
                          }}
                          onMouseLeave={() => {
                            setMapContent('');
                          }}
                          fill="#DBE1E8"
                          stroke="#FFF"
                          strokeWidth={0.5}
                          style={{
                            default: {
                              fill: '#DBE1E8',
                              outline: 'none',
                            },
                            hover: {
                              fill: '#5F63F2',
                              outline: 'none',
                            },
                            pressed: {
                              fill: '#5F63F2',
                              outline: 'none',
                            },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {/* Add Markers for UK Hall Locations */}
                  {ukHallLocations.map(({ name, coordinates }) => (
                    <Marker key={name} coordinates={coordinates}>
                      <circle r={5} fill="#F00" stroke="#fff" strokeWidth={1} />
                      <text
                        textAnchor="middle"
                        y={-10}
                        style={{ fontFamily: 'system-ui', fill: '#5D5A6D', fontSize: '8px', fontWeight: 'bold' }}
                      >
                        {name}
                      </text>
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>

              <div className="controls">
                <button type="button" onClick={handleZoomIn} aria-label="Zoom In">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <button type="button" onClick={handleZoomOut} aria-label="Zoom Out">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </SaleLocationMap>
        </Col>
      </Row>
    </Cards>
  );
});

export default SaleByLocation;

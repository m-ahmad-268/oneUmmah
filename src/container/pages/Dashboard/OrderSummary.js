// src/views/ecommerce/overview/Ordersummary.js (or wherever your original Ordersummary.js file is located)
import React from 'react';
import { Row, Col } from 'antd';
import { Cards } from '../../../components/cards/frame/cards-frame'; // Assuming this path is correct for your template
import Heading from '../../../components/heading/heading'; // Assuming this path is correct for your template
import { Button } from '../../../components/buttons/buttons'; // Assuming this path is correct for your template
import { OrderSummary as OrderSummaryStyled } from '../../../layout/Style'; // Renaming to avoid conflict with the component name, assuming this is your styled-component
import FeatherIcon from 'feather-icons-react'; // Make sure 'feather-icons-react' is installed: npm install feather-icons-react

function Ordersummary() {
  // --- Static Data as per your request ---
  const eventsSummaryValue = 150; // Example static value for events
  const subTotalValue = 1200;
  const averagePricingValue = 50; // Example static value for average pricing

  // Calculate Total based on the new fields
  const totalValue = subTotalValue + averagePricingValue;

  return (
    <Cards
      bodyStyle={{
        borderRadius: '20px',
        padding: '20px', // Ensure consistent padding inside the card
      }}
      className="ninjadash-order-summery"
      headless // As per your original component, it uses headless Cards
    >
      <OrderSummaryStyled>
        {' '}
        {/* Using the renamed styled component from your template */}
        <Heading className="summary-table-title" as="h4" style={{ marginBottom: '20px' }}>
          Events Summary {/* Changed title as requested */}
        </Heading>
        <div className="order-summary-inner">
          <ul className="summary-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '16px' }}>
              <span className="summary-list-title">Total Events :</span>
              <span className="summary-list-text" style={{ fontWeight: 'bold' }}>
                {eventsSummaryValue}
              </span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '16px' }}>
              <span className="summary-list-title">Average Pricing :</span>
              <span className="summary-list-text" style={{ fontWeight: 'bold' }}>{`$${
                subTotalValue}`}</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '16px' }}>
              <span className="summary-list-title">Average Discounts :</span>
              <span className="summary-list-text" style={{ fontWeight: 'bold' }}>{`$${
                averagePricingValue}`}</span>
            </li>
            {/* Discount and Shipping Charge removed as per your request */}
          </ul>

          {/* Promo Code and Coupon sections are entirely removed as per your request */}

          <Heading
            className="summary-total"
            as="h4"
            style={{
              borderTop: '1px dashed #e8e8e8',
              paddingTop: '20px',
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="summary-total-label" style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Total :{' '}
            </span>
            <span
              className="summary-total-amount"
              style={{ fontSize: '28px', fontWeight: 'bold', color: '#6a11cb' }}
            >{`$${totalValue}`}</span>
          </Heading>

          {/* Changed button to "Export Sheet" with download icon */}
          <Button
            className="btn-export-sheet"
            type="primary"
            size="large"
            block
            style={{
              marginTop: '20px',
              borderRadius: '6px',
              background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
              border: 'none',
            }}
          >
            Export Sheet <FeatherIcon icon="download" size={14} style={{ marginLeft: '8px' }} />
          </Button>
        </div>
      </OrderSummaryStyled>
    </Cards>
  );
}

export default Ordersummary;

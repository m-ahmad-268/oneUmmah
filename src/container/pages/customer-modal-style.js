// src/container/pages/customer-modal-style.js

import styled from 'styled-components';
import { Modal } from 'antd';

const StyledFullModal = styled(Modal)`
  .ant-modal {
    /* New dimensions */
    width: 80vw !important; /* Set width to 80% of viewport width */
    height: 90vh !important; /* Set height to 90% of viewport height */

    /* Centering the modal */
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important; /* Center both horizontally and vertically */

    /* Keep some of the previous overrides for appearance */
    margin: 0 !important; /* Remove default margins */
    padding: 0 !important; /* Remove default padding */
    border-radius: 0 !important; /* Remove default border radius on the outer modal element */
  }

  .ant-modal-content {
    height: 100% !important; /* Content fills the new 90vh modal height */
    border-radius: 8px !important; /* Apply border radius to the content box */
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Hide overflow if content is larger than modal */
  }

  .ant-modal-header {
  // background-color: #8231D3 !important;
    border-bottom: 1px solid #f0f0f0; /* Add a subtle separator */
    padding: 16px 24px;
    color: #ffffff;
    border-radius: 8px 8px 0 0 !important; /* Match content top radius */
  }

  .ant-modal-close {
  //  color:white;
    top: 5px; /* Adjust close button position */
    right: 24px;
  }

  .ant-modal-body {
    flex-grow: 1; /* Allow body to take remaining space */
    padding: 24px;
    overflow-y: auto; /* Ensure scrolling if content overflows */
  }

  /* Adjust Ant Design form item margins for better spacing */
  .ant-form-item {
    margin-bottom: 16px !important;
  }
`;

export { StyledFullModal };

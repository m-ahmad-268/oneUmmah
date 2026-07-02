import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ItineraryAssignment from '../../container/pages/ItineraryAssignment';

// Campaign screens
const CampaignsList = lazy(() => import('../../container/pages/Campaigns/index'));
const CampaignForm = lazy(() => import('../../container/pages/Campaigns/CampaignForm'));
const CampaignDetail = lazy(() => import('../../container/pages/Campaigns/CampaignDetail'));

// QR Code screens
const QRCodes = lazy(() => import('../../container/pages/QRCodes/index'));
const QRCodeForm = lazy(() => import('../../container/pages/QRCodes/QRCodeForm'));

// Donor screens
const DonorsList = lazy(() => import('../../container/pages/Donors/index'));
const DonorProfile = lazy(() => import('../../container/pages/Donors/DonorProfile'));

// Broadcast screens
const BroadcastsList = lazy(() => import('../../container/pages/Broadcasts/index'));
const BroadcastForm = lazy(() => import('../../container/pages/Broadcasts/BroadcastForm'));
const BroadcastStats = lazy(() => import('../../container/pages/Broadcasts/BroadcastStats'));

// Analytics screens
const ConversionFunnel = lazy(() => import('../../container/pages/Analytics/ConversionFunnel'));
const DonorInsights = lazy(() => import('../../container/pages/Analytics/DonorInsights'));

// Core screens
const DashboardPage = lazy(() => import('../../container/pages/Dashboard/index'));
const SignIn = lazy(() => import('../../container/pages/SignIn'));

function PagesRoute() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />

      {/* Campaigns */}
      <Route path="campaigns" element={<CampaignsList />} />
      <Route path="campaigns/new" element={<CampaignForm />} />
      <Route path="campaigns/:id" element={<CampaignDetail />} />
      <Route path="campaigns/:id/edit" element={<CampaignForm />} />

      {/* QR Codes */}
      <Route path="qr-codes" element={<QRCodes />} />
      <Route path="qr-codes/new" element={<QRCodeForm />} />
      <Route path="qr-codes/:qrId/edit" element={<QRCodeForm />} />

      {/* Donors */}
      <Route path="donors" element={<DonorsList />} />
      <Route path="donors/:id" element={<DonorProfile />} />

      {/* Broadcasts */}
      <Route path="broadcasts" element={<BroadcastsList />} />
      <Route path="broadcasts/new" element={<BroadcastForm />} />
      <Route path="broadcasts/:id/stats" element={<BroadcastStats />} />

      {/* Analytics */}
      <Route path="analytics/funnel" element={<ConversionFunnel />} />
      <Route path="analytics/donors" element={<DonorInsights />} />

      {/* Auth */}
      <Route path="sign-in" element={<SignIn />} />

      {/* Legacy event-management routes — preserved but unlisted in nav */}
      <Route path="itinerary-assignment" element={<ItineraryAssignment />} />
    </Routes>
  );
}

export default PagesRoute;

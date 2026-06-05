import React, { lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Calendars from '../../container/calendar/Calendar';
import ItineraryAssignment from '../../container/pages/ItineraryAssignment';
import PriceManagement from '../../container/pages/PriceManagement';
import PriceAssignmentForm from '../../container/pages/PriceAssignmentForm';
import PriceAssignment from '../../container/pages/PriceAssignment';

const DashboardPage = lazy(() => import('../../container/pages/Dashboard/index'));
const CustomersPage = lazy(() => import('../../container/pages/Customers'));
const Events = lazy(() => import('../../container/pages/Events'));
const BookedCaterings = lazy(() => import('../../container/pages/BookedCatering'));
const Caterings = lazy(() => import('../../container/pages/Caterings'));
const MenuManagement = lazy(() => import('../../container/pages/menuManagement'));
const MenuCategory = lazy(() => import('../../container/pages/menuCategory'));
const ItineraryType = lazy(() => import('../../container/pages/ItineraryType'));
const ItineraryItem = lazy(() => import('../../container/pages/ItineraryItem'));
const MenuComposition = lazy(() => import('../../container/pages/menuComposition'));
const Vendors = lazy(() => import('../../container/pages/Vendors'));
const Demo2 = lazy(() => import('../../container/pages/Dashboard/Demo2'));
const Analysis = lazy(() => import('../../container/pages/Dashboard/Analysis'));
const EventStats = lazy(() => import('../../container/pages/EventStats'));
const Venues = lazy(() => import('../../container/pages/Venues'));
const Decors = lazy(() => import('../../container/pages/Decors'));
const SignIn = lazy(() => import('../../container/pages/SignIn'));
const Register = lazy(() => import('../../container/pages/Register'));
const DecorProperties = lazy(() => import('../../container/pages/DecorProperties'));
const DecirPropertyValues = lazy(() => import('../../container/pages/DecirPropertyValues'));
const DecorExtras = lazy(() => import('../../container/pages/DecorExtras'));
const DecorServices = lazy(() => import('../../container/pages/DecorServices'));
const EventMasterForm = lazy(() => import('../../container/pages/EventStatFormModal'));

function PagesRoute() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      {/* <Route path="customers" element={<h1>Hello</h1>} /> */}
      <Route path="calender-schedule" element={<Calendars />} />
      <Route path="customers" element={<CustomersPage />} />
      <Route path="customers/:id" element={<CustomersPage />} />
      <Route path="events" element={<Events />} />
      <Route path="caterings" element={<BookedCaterings />} />
      <Route path="menu-management" element={<MenuManagement />} />
      <Route path="menu-category" element={<MenuCategory />} />
      <Route path="itinerary-type" element={<ItineraryType />} />
      <Route path="itinerary-item" element={<ItineraryItem />} />
      <Route path="itinerary-assignment" element={<ItineraryAssignment />} />
      {/* 
      <Route path="price-setup" element={<PriceManagement />} />
      <Route path="price-assignment" element={<PriceAssignment />} />
      <Route path="price-assignment/:id" element={<PriceAssignmentForm />} />
      <Route path="price-assignment/add" element={<PriceAssignmentForm />} /> */}
      <Route path="menu-composition" element={<MenuComposition />} />
      <Route path="food-menu" element={<Caterings />} />
      <Route path="vendors" element={<Vendors />} />
      <Route path="demo-2" element={<Demo2 />} />
      <Route path="campaign-analysis" element={<Analysis />} />
      <Route path="event-stats" element={<EventStats />} />
      <Route path="venues" element={<Venues />} />
      <Route path="decor" element={<Decors />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="register" element={<Register />} />
      <Route path="decor-properties" element={<DecorProperties />} />
      <Route path="decor-property-values" element={<DecirPropertyValues />} />
      <Route path="decor-extras" element={<DecorExtras />} />
      <Route path="decor-services" element={<DecorServices />} />
      <Route path="event-master/:eventId" element={<EventMasterForm />} />
      <Route path="event-master/add" element={<EventMasterForm />} />
      <Route path="event-master/view/:eventId" element={<EventMasterForm />} />
    </Routes>
  );
}

export default PagesRoute;

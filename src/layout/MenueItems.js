// src/layout/MenueItems.js

import {
  UilUsersAlt,
  UilCreateDashboard,
  UilCalendarAlt,
  UilUtensils,
  UilTruck,
  UilBuilding,
  UilPalette,
  UilStar,
  UilAlignCenter,
  UilTagAlt,
} from '@iconscout/react-unicons';

import { Calendar, Menu } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import UilEllipsisV from '@iconscout/react-unicons/icons/uil-ellipsis-v';
import propTypes from 'prop-types';

function MenuItems({ toggleCollapsed }) {
  const { t } = useTranslation();

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const { topMenu } = useSelector((state) => {
    return {
      topMenu: state.ChangeLayoutMode.topMenu,
    };
  });

  const path = '';
  const pathName = window.location.pathname;
  const pathArray = pathName && pathName !== '/' ? pathName.split(path) : [];
  const mainPath = pathArray.length > 1 ? pathArray[1] : '';
  const mainPathSplit = mainPath.split('/');

  const [openKeys, setOpenKeys] = React.useState(
    !topMenu ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : 'dashboard'}`] : [],
  );

  const onOpenChange = (keys) => {
    setOpenKeys(keys[keys.length - 1] !== 'recharts' ? [keys.length && keys[keys.length - 1]] : keys);
  };

  const onClick = (item) => {
    if (item.keyPath.length === 1) setOpenKeys([]);
  };

  const items = [
    getItem(t('dashboard'), 'dashboard', !topMenu && <UilCreateDashboard />, [
      getItem(
        <NavLink onClick={toggleCollapsed} to={path}>
          Statistics
        </NavLink>,
        'demo-1',
        null,
      ),
    ]),
    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/event-stats`}>
        Events
      </NavLink>,
      'event-stats',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/events`}>
          <UilCalendarAlt />
        </NavLink>
      ),
    ),
    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/events`}>
        Event Types
      </NavLink>,
      'events',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/events`}>
          <UilCalendarAlt />
        </NavLink>
      ),
    ),
    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/calender-schedule`}>
        Calender
      </NavLink>,
      'Calender',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/calender-schedule`}>
          <UilCalendarAlt />
        </NavLink>
      ),
    ),
    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/customers`}>
        Customers
      </NavLink>,
      'customers',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/customers`}>
          <UilUsersAlt />
        </NavLink>
      ),
    ),
    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/caterings`}>
        Catering
      </NavLink>,
      'caterings',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/caterings`}>
          <UilUtensils />
        </NavLink>
      ),
    ),
    getItem('Menu Management', 'menu-dropdown', !topMenu && <UilUtensils />, [
      // getItem(
      //   <NavLink onClick={toggleCollapsed} to={`${path}/menu-category`}>
      //     Item Category
      //   </NavLink>,
      //   'menu-category',
      // ),
      getItem(
        <NavLink onClick={toggleCollapsed} to={`${path}/menu-management`}>
          Menu Item
        </NavLink>,
        'foodItems',
        // !topMenu && <UilAlignCenter />,
      ),
      getItem(
        <NavLink onClick={toggleCollapsed} to={`${path}/menu-composition`}>
          Menu Composition
        </NavLink>,
        'menu-composition',
      ),
      getItem(
        <NavLink onClick={toggleCollapsed} to={`${path}/itinerary-type`}>
          Itinerary Type
        </NavLink>,
        'itinerary-type',
        // !topMenu && (
        //   <NavLink className="menuItem-iocn" to={`${path}/itinerary-type`}>
        //     <UilUtensils />
        //   </NavLink>
        // ),
      ),
      getItem(
        <NavLink onClick={toggleCollapsed} to={`${path}/itinerary-item`}>
          Itinerary Item
        </NavLink>,
        'itinerary-item',
        // !topMenu && (
        //   <NavLink className="menuItem-iocn" to={`${path}/itinerary-item`}>
        //     <UilUtensils />
        //   </NavLink>
        // ),
      ),
      getItem(
        <NavLink onClick={toggleCollapsed} to={`${path}/itinerary-assignment`}>
          Itinerary Assignment
        </NavLink>,
        'itinerary-assignment',
        // !topMenu && (
        //   <NavLink className="menuItem-iocn" to={`${path}/itinerary-assignment`}>
        //     <UilUtensils />
        //   </NavLink>
        // ),
      ),
      // getItem(
      //   <NavLink onClick={toggleCollapsed} to={`${path}/price-setup`}>
      //     Price Version
      //   </NavLink>,
      //   'price-setup',
      //   !topMenu && (
      //     <NavLink className="menuItem-iocn" to={`${path}/price-setup`}>
      //       <UilCalendarAlt />
      //     </NavLink>
      //   ),
      // ),
      // getItem(
      //   <NavLink onClick={toggleCollapsed} to={`${path}/price-assignment`}>
      //     Price Assignment
      //   </NavLink>,
      //   'price-assignment',
      //   // !topMenu && (
      //   //   <NavLink className="menuItem-iocn" to={`${path}/price-setup`}>
      //   //     <UilCalendarAlt />
      //   //   </NavLink>
      //   // ),
      // ),
    ]),
    // getItem(
    //   <NavLink onClick={toggleCollapsed} to={`${path}/menu-management`}>
    //     Menu Management
    //   </NavLink>,
    //   'MenuManagement',
    //   !topMenu && (
    //     <NavLink className="menuItem-iocn" to={`${path}/menu-management`}>
    //       <UilUtensils />
    //     </NavLink>
    //   ),
    // ),
    // getItem(
    //   <NavLink onClick={toggleCollapsed} to={`${path}/food-menu`}>
    //     Food Menu
    //   </NavLink>,
    //   'foodMenu',
    //   !topMenu && (
    //     <NavLink className="menuItem-iocn" to={`${path}/food-menu`}>
    //       <UilUtensils />
    //     </NavLink>
    //   ),
    // ),
    // --- Services item ---
    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/decor-services`}>
        Service
      </NavLink>,
      'decor-services',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/decor-services`}>
          <UilUtensils />
        </NavLink>
      ),
    ),
    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/vendors`}>
        Vendors
      </NavLink>,
      'vendors',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/vendors`}>
          <UilTruck />
        </NavLink>
      ),
    ),
    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/venues`}>
        Venues
      </NavLink>,
      'venues',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/venues`}>
          <UilBuilding />
        </NavLink>
      ),
    ),
    // --- The new Decor Dropdown ---
    getItem('Decor', 'decor-dropdown', !topMenu && <UilPalette />, [
      getItem(
        <NavLink onClick={toggleCollapsed} to={`${path}/decor`}>
          Categories
        </NavLink>,
        'decor',
        // !topMenu && <UilAlignCenter />,
      ),
      getItem(
        <NavLink onClick={toggleCollapsed} to={`${path}/decor-properties`}>
          {/* Properties */}
          Decor Items
        </NavLink>,
        'decor-properties',
        // !topMenu && <UilTagAlt />,
      ),
      getItem(
        <NavLink onClick={toggleCollapsed} to={`${path}/decor-property-values`}>
          Item Values
        </NavLink>,
        'decor-property-values',
        // !topMenu && <UilPalette />,
      ),
    ]),
    // --- The Extras item with its own icon ---
    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/decor-extras`}>
        Extras
      </NavLink>,
      'decor-extras',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/decor-extras`}>
          <UilStar />
        </NavLink>
      ),
    ),
  ];

  return (
    <Menu
      onOpenChange={onOpenChange}
      onClick={onClick}
      mode={!topMenu || window.innerWidth <= 991 ? 'inline' : 'horizontal'}
      // eslint-disable-next-line no-nested-ternary
      defaultSelectedKeys={
        !topMenu
          ? [
            `${mainPathSplit.length === 1 ? 'home' : mainPathSplit.length === 2 ? mainPathSplit[1] : mainPathSplit[2]
            }`,
          ]
          : []
      }
      defaultOpenKeys={!topMenu ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : 'dashboard'}`] : []}
      overflowedIndicator={<UilEllipsisV />}
      openKeys={openKeys}
      items={items}
    />
  );
}

MenuItems.propTypes = {
  toggleCollapsed: propTypes.func,
};

export default MenuItems;
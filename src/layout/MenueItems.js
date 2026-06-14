import {
  UilCreateDashboard,
  UilChart,
  UilQrcodeScan,
  UilUserCircle,
  UilMessage,
  UilAnalysis,
} from '@iconscout/react-unicons';

import { Menu } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import UilEllipsisV from '@iconscout/react-unicons/icons/uil-ellipsis-v';
import propTypes from 'prop-types';

function MenuItems({ toggleCollapsed }) {
  const { t } = useTranslation();

  function getItem(label, key, icon, children, type) {
    return { key, icon, children, label, type };
  }

  const { topMenu } = useSelector((state) => ({
    topMenu: state.ChangeLayoutMode.topMenu,
  }));

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
      <NavLink onClick={toggleCollapsed} to={`${path}/campaigns`}>
        Campaigns
      </NavLink>,
      'campaigns',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/campaigns`}>
          <UilChart />
        </NavLink>
      ),
    ),

    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/qr-codes`}>
        QR Codes
      </NavLink>,
      'qr-codes',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/qr-codes`}>
          <UilQrcodeScan />
        </NavLink>
      ),
    ),

    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/donors`}>
        Donors
      </NavLink>,
      'donors',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/donors`}>
          <UilUserCircle />
        </NavLink>
      ),
    ),

    getItem(
      <NavLink onClick={toggleCollapsed} to={`${path}/broadcasts`}>
        Broadcasts
      </NavLink>,
      'broadcasts',
      !topMenu && (
        <NavLink className="menuItem-iocn" to={`${path}/broadcasts`}>
          <UilMessage />
        </NavLink>
      ),
    ),

    getItem(
      'Analytics',
      'analytics',
      !topMenu && <UilAnalysis />,
      [
        getItem(
          <NavLink onClick={toggleCollapsed} to={`${path}/analytics/funnel`}>
            Conversion Funnel
          </NavLink>,
          'analytics-funnel',
          null,
        ),
        getItem(
          <NavLink onClick={toggleCollapsed} to={`${path}/analytics/donors`}>
            Donor Insights
          </NavLink>,
          'analytics-donors',
          null,
        ),
      ],
    ),
  ];

  return (
    <Menu
      onOpenChange={onOpenChange}
      onClick={onClick}
      mode={!topMenu || window.innerWidth <= 991 ? 'inline' : 'horizontal'}
      defaultSelectedKeys={
        !topMenu
          ? [`${mainPathSplit.length === 1 ? 'home' : mainPathSplit.length === 2 ? mainPathSplit[1] : mainPathSplit[2]}`]
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

import UilHdd from '@iconscout/react-unicons/icons/uil-hdd';
import UilUpload from '@iconscout/react-unicons/icons/uil-upload';
import { Badge, Spin } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import { Scrollbars } from '@pezhmanparsaee/react-custom-scrollbars';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { UserActionDropDown } from './auth-info-style';
import Heading from '../../heading/heading';
import { Popover } from '../../popup/popup';
import { getUnreadNotification } from '../../../services/commonService';

const NotificationBox = React.memo(() => {
  const { rtl } = useSelector((state) => ({
    rtl: state.ChangeLayoutMode.rtlData,
  }));

  const accessToken = localStorage.getItem('access_token_admin');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false); // 👈 control Popover

  // const fetchNotifications = useCallback(async () => {

  // }, [accessToken]);

  const getAllNotification = async () => {
    try {
      // setLoading(true);
      // const response = await fetch(`${process.env.REACT_APP_API_URL}notifications/unread`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      //   body: JSON.stringify({}),
      // });
      const data = await getUnreadNotification();
      if (data.code === 200 && data?.result && data.result.length) {
        setNotifications(data.result || []);
        setUnreadCount((data.result || []).filter((n) => !n.blnIsRead).length);
      }
      // setLoading(false);

      // console.diamond/oauth2//googleerror('Error fetching user:', error.message);
      // const data = await response.json();

    } catch (err) {
      setLoading(false);
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (notification) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}notifications/markAsRead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ notificationId: notification.id }),
      });

      // Optimistic update
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, blnIsRead: true } : n)));
      setUnreadCount((prev) => Math.max(prev - 1, 0));

      // 🔥 Close dropdown
      setOpen(false);

      // 🔥 Navigate based on message content
      if (notification.txtMessage.includes('Event With Code')) {
        navigate('/event-stats');
      } else if (notification.txtMessage.includes('New Customer With Name')) {
        navigate('/customers');
      } else {
        console.log('No navigation rule for:', notification.txtMessage);
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  useEffect(() => {
    // fetchNotifications();
    let intervalId;
    if (accessToken) {
      intervalId = setInterval(getAllNotification, 15000);

    }


    // const interval = setInterval(getAllNotification, 30000); // every 10s
    // return () => clearInterval(interval);


    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

  }, [accessToken]);

  function renderThumb({ style }) {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: '#F1F2F6',
    };
    return <div style={{ ...style, ...thumbStyle }} />;
  }

  const renderTrackVertical = () => {
    const thumbStyle = {
      position: 'absolute',
      width: '6px',
      transition: 'opacity 200ms ease 0s',
      opacity: 0,
      [rtl ? 'left' : 'right']: '2px',
      bottom: '2px',
      top: '2px',
      borderRadius: '3px',
    };
    return <div style={thumbStyle} />;
  };

  function renderView({ style }) {
    const customStyle = {
      marginRight: rtl && 'auto',
      [rtl ? 'marginLeft' : 'marginRight']: '-17px',
    };
    return <div style={{ ...style, ...customStyle }} />;
  }

  renderThumb.propTypes = {
    style: PropTypes.shape(PropTypes.object),
  };

  renderView.propTypes = {
    style: PropTypes.shape(PropTypes.object),
  };

  const content = (
    <UserActionDropDown className="ninjadash-top-dropdown" style={{ padding: '8px' }}>
      <Heading as="h5" className="ninjadash-top-dropdown__title">
        <span className="title-text">Notifications</span>
        <Badge className="badge-success" count={unreadCount} />
      </Heading>
      <Scrollbars
        autoHeight
        autoHide
        renderThumbVertical={renderThumb}
        renderView={renderView}
        renderTrackVertical={renderTrackVertical}
        renderTrackHorizontal={(props) => <div {...props} style={{ display: 'none' }} className="track-horizontal" />}
      >
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Spin />
          </div>
        ) : (
          <ul className="ninjadash-top-dropdown__nav notification-list"
            // style={{ backgroundColor: 'red' }}
          >
            {notifications.length === 0 ? (
              <li style={{ padding: '10px', textAlign: 'center', listStyle: 'none' }}>No notifications</li>
            ) : (
              notifications.map((item) => (
                <li key={item.id} onClick={() => markAsRead(item)}
                  style={{ listStyle: 'none' }}
                >
                  <div className="ninjadash-top-dropdown__content notifications" style={{ cursor: 'pointer' }}>
                    <div className={`notification-icon ${item.blnIsRead ? 'bg-secondary' : 'bg-primary'}`}>
                      {item.txtType === 'CUSTOMER_REGISTERED' ? <UilHdd /> : <UilUpload />}
                    </div>
                    <div className="notification-content d-flex">
                      <div className="notification-text">
                        <Heading as="h5">{item.txtMessage}</Heading>
                        <p>{item.createdAt}</p>
                      </div>
                      <div className="notification-status">{!item.blnIsRead && <Badge dot />}</div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </Scrollbars>
      {/* <Link className="btn-seeAll" to="/notifications">
        See all incoming activity
      </Link> */}
    </UserActionDropDown>
  );

  return (
    <div className="ninjadash-nav-actions__item ninjadash-nav-actions__notification">
      <Popover
        placement="bottomLeft"
        content={content}
        action="click"
        open={open}
        onOpenChange={setOpen} // 👈 control Popover visibility
      >
        <Badge dot={unreadCount > 0} offset={[-8, -5]}>
          <Link to="#" className="ninjadash-nav-action-link">
            <ReactSVG src={require('../../../static/img/icon/bell.svg').default} />
          </Link>
        </Badge>
      </Popover>
    </div>
  );
});

export default NotificationBox;

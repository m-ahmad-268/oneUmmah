import UilAngleDown from '@iconscout/react-unicons/icons/uil-angle-down';
// import UilDollarSign from '@iconscout/react-unicons/icons/uil-dollar-sign';
import UilSignout from '@iconscout/react-unicons/icons/uil-signout';
import { UilUsersAlt, UilUser, UilDollarSign } from '@iconscout/react-unicons';
import { Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { InfoWraper, NavAuth, UserDropDwon } from './auth-info-style';
import Message from './Message';
import Notification from './Notification';
import Search from './Search';
import Settings from './settings';
import { logOut } from '../../../redux/authentication/actionCreator';

import { Dropdown } from '../../dropdown/dropdown';
import Heading from '../../heading/heading';
import { Popover } from '../../popup/popup';
import axios from 'axios';
import { getLoggedOut } from '../../../services/commonService';

const AuthInfo = React.memo(() => {
  const dispatch = useDispatch();

  const accessToken = localStorage.getItem('access_token_admin');

  const [userStatusData, setUserStatusData] = useState(null);

  useEffect(() => {
    const getUserStatus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}auth/status`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserStatusData(response.data);
      } catch (e) {
        console.log('Error:', e);
      }
    };

    getUserStatus();
  }, []);

  useEffect(() => {
    console.log('User Status Data:', userStatusData);
  }, [userStatusData]);

  const [state, setState] = useState({
    flag: 'en',
  });
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const SignOut = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token_admin');
    if (!accessToken) {
      navigate('/sign-in');
      return;
    }
    try {

      const refresh_token_admin = localStorage.getItem('refresh_token_admin');
      if (refresh_token_admin)
        // getLoggedOut({ refreshToken: refresh_token_admin });

        dispatch(logOut()).then(() => {
          localStorage.removeItem('access_token_admin');
          localStorage.removeItem('refresh_token_admin');
        });
      navigate('/sign-in');

      // await axios.get(`${process.env.REACT_APP_API_URL}auth/logout`, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
    } catch (e) {
      console.log('Error:', e);
    }
  };

  const userContent = (
    <UserDropDwon>
      <div className="user-dropdwon">
        {/* <figure className="user-dropdwon__info" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={userStatusData?.txtPictureUrl} alt="" style={{ borderRadius: '100%', maxWidth: '50px' }} />
          <figcaption>
            <Heading as="h5">{userStatusData?.txtName || 'Admin'}</Heading>
          </figcaption>
        </figure> */}
        <ul className="" style={{ listStyleType: 'none', padding: 0 }}>
          {/* <li>
            <Link style={{ display: 'flex', alignItems: 'center', gap: '8px' }} to="/">
              <UilUser size={20} /> Profile
            </Link>
          </li> */}
          {/* <li>
            <Link style={{ display: 'flex', alignItems: 'center', gap: '8px' }} to="#">
              <UilDollarSign size={20} /> Billing
            </Link>
          </li> */}
          <li>
            <Link style={{ display: 'flex', alignItems: 'center', gap: '8px' }} to="/event-stats">
              <UilUsersAlt size={20} /> User Events
            </Link>
          </li>
          {/* <li> */}
          <Link onClick={SignOut} style={{ display: 'flex', alignItems: 'center', gap: '8px' }} >
            <div style={{ height: "20px", width: '22px' }} >
              <UilSignout />
            </div>
            Sign Out
          </Link>
          {/* </li> */}
          {/* <li>
            <Link
              onClick={SignOut}
              to="#"
              style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', gap: '8px' }}
            >
              <UilSignout size={20} />
              Sign Out
            </Link>
          </li> */}
        </ul>
      </div>
    </UserDropDwon >
  );

  const onFlagChangeHandle = (value, e) => {
    e.preventDefault();
    setState({
      ...state,
      flag: value,
    });
    i18n.changeLanguage(value);
  };

  return (
    (
      false ? <></> :
        <InfoWraper>
          <Notification />
          <div className="ninjadash-nav-actions__item ninjadash-nav-actions__author">
            <Popover placement="bottomRight" content={userContent} action="click" autoAdjustOverflow={false}>
              <Link to="#" className="ninjadash-nav-action-link"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Avatar src={userStatusData?.txtPictureUrl} />
                <span className="ninjadash-nav-actions__author--name">{userStatusData?.txtName || 'Anonymous User'}</span>
                <UilAngleDown />
              </Link>
            </Popover>
          </div>

        </InfoWraper>


    )


  );
});

export default AuthInfo;

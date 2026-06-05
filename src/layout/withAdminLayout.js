/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import UilEllipsisV from '@iconscout/react-unicons/icons/uil-ellipsis-v';
import { Button, Col, Layout, Row, Spin, message } from 'antd';
import propTypes from 'prop-types';
import { Scrollbars } from '@pezhmanparsaee/react-custom-scrollbars';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import MenueItems from './MenueItems';
import { FooterStyle, LayoutContainer, SmallScreenAuthInfo, TopMenuSearch } from './Style';
import TopMenu from './TopMenu';
import Search from '../components/utilities/auth-info/Search';
import AuthInfo from '../components/utilities/auth-info/info';

const { theme } = require('../config/theme/themeVariables');
const { Header, Sider, Content } = Layout;

const ThemeLayout = (WrappedComponent) => {
  function LayoutComponent({ layoutMode, rtl, topMenu }) {
    const [collapsed, setCollapsed] = useState(false);
    const [hide, setHide] = useState(true);
    const [loading, setLoading] = useState(true);

    // Handle resizing
    useEffect(() => {
      const updateDimensions = () => {
        setCollapsed(window.innerWidth <= 1200);
      };
      window.addEventListener('resize', updateDimensions);
      updateDimensions();
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Refresh access token on mount
    useEffect(() => {
      const refreshAccessToken = async () => {
        try {
          const storedRefresh = localStorage.getItem('refresh_token_admin');
          const storedAccess = localStorage.getItem('access_token_admin');
          if (!storedRefresh || !storedAccess) return;
          const response = await fetch(`${process.env.REACT_APP_API_URL}auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedAccess}`,
            },
            body: JSON.stringify({ refreshToken: storedRefresh }),
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          const data = await response.json();
          if (data.accessToken) {
            localStorage.setItem('access_token_admin', data.accessToken);
            console.log('✅ Access token refreshed');
          }
        } catch (error) {
          console.error('⚠ Failed to refresh token:', error);
          window.location.href = `${process.env.REACT_APP_URL}sign-in?error=token-expired`;
          localStorage.clear();
        } finally {
          setLoading(false);
        }
      };

      refreshAccessToken();
    }, []);

    const toggleCollapsed = () => setCollapsed(!collapsed);
    const toggleCollapsedMobile = () => {
      if (window.innerWidth <= 990) setCollapsed(!collapsed);
    };
    const onShowHide = () => {
      setHide(!hide);
    };

    const left = !rtl ? 'left' : 'right';
    const SideBarStyle = {
      margin: '63px 0 0 0',
      padding: `${!rtl ? '20px 20px 55px 0' : '20px 0 55px 20px'}`,
      overflowY: 'auto',
      height: '100vh',
      position: 'fixed',
      [left]: 0,
      zIndex: 988,
    };

    const renderView = ({ style }) => {
      const customStyle = {
        marginRight: 'auto',
        [rtl ? 'marginLeft' : 'marginRight']: '-17px',
      };
      return <div style={{ ...style, ...customStyle }} />;
    };

    const renderThumbVertical = ({ style }) => {
      const thumbStyle = {
        borderRadius: 6,
        backgroundColor: layoutMode === 'lightMode' ? '#F1F2F6' : '#ffffff16',
        [left]: '2px',
      };
      return <div style={{ ...style, ...thumbStyle }} />;
    };

    const renderThumbHorizontal = ({ style }) => {
      const thumbStyle = {
        borderRadius: 6,
        backgroundColor: layoutMode === 'lightMode' ? '#F1F2F6' : '#ffffff16',
      };
      return <div style={{ ...style, ...thumbStyle }} />;
    };

    return (loading) ? (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    ) : (
      <LayoutContainer>
        <Layout className="layout">
          <Header
            style={{
              position: 'fixed',
              width: '100%',
              top: 0,
              [!rtl ? 'left' : 'right']: 0,
            }}
          >
            <div className="ninjadash-header-content d-flex">
              <div className="ninjadash-header-content__left">
                <div className="navbar-brand align-cener-v">
                  <Link
                    className={topMenu && window.innerWidth > 991 ? 'ninjadash-logo top-menu' : 'ninjadash-logo'}
                    to="/"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/logo.png`}
                      alt="Zarbotics"
                      style={{ height: '42px', width: 'auto', maxWidth: '180px', objectFit: 'contain' }}
                    />
                    {/* Zarbotics Events */}
                  </Link>
                  <>
                    <div className="ninjadash-header-content__right d-flex">
                      <div className="ninjadash-navbar-menu d-flex align-center-v">
                        {topMenu && window.innerWidth > 991 ? <TopMenu /> : ''}
                      </div>
                      <div className="ninjadash-nav-actions">
                        {topMenu && window.innerWidth > 991 ? (
                          <TopMenuSearch>
                            <div className="top-right-wrap d-flex">
                              <AuthInfo />
                            </div>
                          </TopMenuSearch>
                        ) : (
                          <AuthInfo />
                        )}
                      </div>
                    </div>
                    {!topMenu || window.innerWidth <= 991 ? (
                      <Button type="link" onClick={toggleCollapsed} style={{ color: layoutMode === 'lightMode' ? '#ffffff' : undefined }}>
                        <img
                          src={require(`../static/img/icon/${collapsed ? 'left-bar.svg' : 'left-bar.svg'}`)}
                          alt="menu"
                          style={{ filter: layoutMode === 'lightMode' ? 'brightness(0) invert(1)' : undefined }}
                        />
                      </Button>
                    ) : null}
                  </>
                </div>
              </div>
              <div className="ninjadash-header-content__mobile">
                <div className="ninjadash-mobile-action">
                  <div className="btn-search" to="#">
                    <Search />
                  </div>
                  <Link className="btn-auth" onClick={onShowHide} to="#">
                    <UilEllipsisV />
                  </Link>
                </div>
              </div>
            </div>
          </Header>
          <div className="ninjadash-header-more">
            <Row>
              <Col md={0} sm={24} xs={24}>
                <div className="ninjadash-header-more-inner">
                  <SmallScreenAuthInfo hide={hide}>
                    <AuthInfo rtl={rtl} />
                  </SmallScreenAuthInfo>
                </div>
              </Col>
            </Row>
          </div>
          <Layout>
            {!topMenu || window.innerWidth <= 991 ? (
              <ThemeProvider theme={theme}>
                <Sider
                  width={280}
                  style={SideBarStyle}
                  collapsed={collapsed}
                  theme={layoutMode === 'lightMode' ? 'light' : 'dark'}
                >
                  <Scrollbars
                    className="custom-scrollbar"
                    autoHide
                    autoHideTimeout={500}
                    autoHideDuration={200}
                    renderThumbHorizontal={renderThumbHorizontal}
                    renderThumbVertical={renderThumbVertical}
                    renderView={renderView}
                    renderTrackVertical={(props) => <div {...props} className="ninjadash-track-vertical" />}
                  >
                    <MenueItems topMenu={topMenu} toggleCollapsed={toggleCollapsedMobile} />
                  </Scrollbars>
                </Sider>
              </ThemeProvider>
            ) : null}
            <Layout className="atbd-main-layout" style={{ minHeight: 'calc(100vh - 74px)', display: 'flex', flexDirection: 'column' }}>
              <Content style={{ flex: 1, overflow: 'visible' }}>
                <WrappedComponent />
              </Content>
              <FooterStyle className="admin-footer">
                <Row>
                  <Col md={24} xs={24}>
                    <span className="admin-footer__copyright">
                      © 2026 - <Link to="#">Zarbotics</Link>
                    </span>
                  </Col>
                </Row>
              </FooterStyle>
            </Layout>
          </Layout>
        </Layout>
        {window.innerWidth <= 991 ? (
          <span className={collapsed ? 'ninjadash-shade' : 'ninjadash-shade show'} onClick={toggleCollapsed} />
        ) : (
          ''
        )}
      </LayoutContainer>
    );
  }

  LayoutComponent.propTypes = {
    layoutMode: propTypes.string,
    rtl: propTypes.bool,
    topMenu: propTypes.bool,
  };

  const mapStateToProps = (state) => ({
    layoutMode: state.ChangeLayoutMode.mode,
    rtl: state.ChangeLayoutMode.rtlData,
    topMenu: state.ChangeLayoutMode.topMenu,
  });

  return connect(mapStateToProps)(LayoutComponent);
};

export default ThemeLayout;

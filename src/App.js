import { ConfigProvider } from 'antd';
import 'antd/dist/antd.less';
import React, { lazy } from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import config from './config/config';
import store from './redux/store';

import Admin from './routes/admin';
import SignIn from './container/pages/SignIn';
import ProtectedRoute from './components/utilities/protectedRoute';
import Register from './container/pages/Register';

const NotFound = lazy(() => import('./container/pages/404'));
const { themeColor } = config;

function AppThemeProvider({ children }) {
  // Grab layout-related settings from Redux
  const { rtl, topMenu, mainContent } = useSelector((state) => ({
    rtl: state.ChangeLayoutMode.rtlData,
    topMenu: state.ChangeLayoutMode.topMenu,
    mainContent: state.ChangeLayoutMode.mode,
  }));

  return (
    <ConfigProvider direction={rtl ? 'rtl' : 'ltr'}>
      <ThemeProvider theme={{ ...themeColor, rtl, topMenu, mainContent }}>{children}</ThemeProvider>
    </ConfigProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AppThemeProvider>
    </Provider>
  );
}

export default App;

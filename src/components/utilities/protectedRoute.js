import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import propTypes from 'prop-types';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isReady, setIsReady] = useState(false); // Prevent render until check done

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlAccessToken = params.get('accessToken');
    const urlRefreshToken = params.get('refreshToken');

    const storedAccessToken = localStorage.getItem('access_token_admin');
    const storedRefreshToken = localStorage.getItem('refresh_token_admin');

    if (urlAccessToken && urlRefreshToken) {
      // Store tokens from URL
      localStorage.setItem('access_token_admin', urlAccessToken);
      localStorage.setItem('refresh_token_admin', urlRefreshToken);

      // Remove tokens from URL
      params.delete('accessToken');
      params.delete('refreshToken');
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });

      setIsReady(true);
      return;
    }

    if (storedAccessToken && storedRefreshToken) {
      console.log('Access and Refresh Token Found');
      console.log(`Access Token: ${storedAccessToken} | Refresh Token: ${storedRefreshToken}`);

      setIsReady(true);
    } else {
      navigate('/sign-in', { replace: true });
    }
  }, [navigate, location]);

  const refreshAccessToken = async () => {
    try {
      const storedRefresh = localStorage.getItem('refresh_token_admin');
      const storedAccess = localStorage.getItem('access_token_admin');
      if (!storedRefresh || !storedAccess) return;

      console.log('Attempting to Refresh Token');

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
    }
  };

  // Refresh token every 14 minutes
  useEffect(() => {
    if (localStorage.getItem('access_token_admin') && localStorage.getItem('refresh_token_admin')) {
      const interval = setInterval(refreshAccessToken, 100000);
      return () => clearInterval(interval);
    }
  }, []);

  if (!isReady) return null; // Wait until token check is done

  return children;
}

ProtectedRoute.propTypes = {
  children: propTypes.node.isRequired,
};

export default ProtectedRoute;

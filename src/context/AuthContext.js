import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import instance from '../API/axiosInstance';

const AuthContext = createContext(null);

const ALL_PERMISSIONS = [
  'CAMPAIGN_VIEW', 'CAMPAIGN_CREATE', 'CAMPAIGN_EDIT', 'CAMPAIGN_DELETE', 'CAMPAIGN_LAUNCH',
  'DONOR_VIEW', 'DONOR_EXPORT', 'DONOR_EDIT', 'DONOR_OPT_OUT',
  'BROADCAST_VIEW', 'BROADCAST_CREATE', 'BROADCAST_SEND',
  'QR_VIEW', 'QR_CREATE', 'QR_MANAGE',
  'ANALYTICS_VIEW', 'ANALYTICS_EXPORT',
  'USER_MANAGE', 'SYSTEM_CONFIGURE',
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  const loadUserProfile = useCallback(async () => {
    const token = localStorage.getItem('access_token_admin');
    if (!token) {
      setAuthLoading(false);
      return;
    }

    // Use cached user data written at login time — avoids an extra round-trip on every page load
    const cached = localStorage.getItem('user_data');
    if (cached) {
      try {
        const userData = JSON.parse(cached);
        setUser(userData);
        setRole(userData.roles?.[0] ?? userData.role ?? null);
        setPermissions(userData.permissions ?? ALL_PERMISSIONS);
        setAuthLoading(false);
        return;
      } catch {
        // Corrupted cache — fall through to API
      }
    }

    // Fallback: fetch from API (handles page loads where cache is absent)
    // try {
    //   const res = await instance.get('api/v1/auth/me').catch(() => instance.get('auth/status'));
    //   const data = res.data?.data ?? res.data;
    //   setUser(data);
    //   setRole(data?.roles?.[0] ?? data?.role ?? data?.txtRole ?? null);
    //   const perms = data?.permissions ?? data?.authorities ?? ALL_PERMISSIONS;
    //   setPermissions(perms);
    // } catch {
    //   setPermissions(ALL_PERMISSIONS);
    // } finally {
    //   setAuthLoading(false);
    // }
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const setAuth = useCallback(({ user: u, role: r, permissions: p }) => {
    setUser(u);
    setRole(r);
    setPermissions(p ?? ALL_PERMISSIONS);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setRole(null);
    setPermissions([]);
    localStorage.removeItem('access_token_admin');
    localStorage.removeItem('refresh_token_admin');
    localStorage.removeItem('user_data');
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, permissions, authLoading, setAuth, clearAuth, reload: loadUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: propTypes.node.isRequired,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;

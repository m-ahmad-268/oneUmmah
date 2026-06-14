import instance from '../API/axiosInstance';

export const getDashboardAnalytics = (params = {}) =>
  instance.get('/analytics/dashboard', { params }).then((r) => r.data);

export const getFunnelAnalytics = (params = {}) =>
  instance.get('/analytics/funnel', { params }).then((r) => r.data);

export const getDonorInsights = (params = {}) =>
  instance.get('/analytics/donors', { params }).then((r) => r.data);

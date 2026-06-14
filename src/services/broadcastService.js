import instance from '../API/axiosInstance';

const BASE = '/broadcasts';

export const getBroadcasts = (params = {}) =>
  instance.get(BASE, { params }).then((r) => r.data);

export const createBroadcast = (data) =>
  instance.post(BASE, data).then((r) => r.data);

export const getBroadcastStats = (id) =>
  instance.get(`${BASE}/${id}/stats`).then((r) => r.data);

export const sendBroadcast = (id) =>
  instance.post(`${BASE}/${id}/send`).then((r) => r.data);

export const cancelBroadcast = (id) =>
  instance.post(`${BASE}/${id}/cancel`).then((r) => r.data);

import instance from '../API/axiosInstance';

const BASE = '/donors';

export const getDonors = (params = {}) =>
  instance.get(BASE, { params }).then((r) => r.data);

export const getDonorById = (id) =>
  instance.get(`${BASE}/${id}`).then((r) => r.data);

export const patchDonorOptOut = (id, optedOut) =>
  instance.patch(`${BASE}/${id}/opt-out`, { optedOut }).then((r) => r.data);

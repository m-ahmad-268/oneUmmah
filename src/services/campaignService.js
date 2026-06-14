import instance from '../API/axiosInstance';

const BASE = '/campaigns';

export const getCampaigns = (params = {}) =>
  instance.get(BASE, { params }).then((r) => r.data);

export const getCampaignById = (id) =>
  instance.get(`${BASE}/${id}`).then((r) => r.data);

export const createCampaign = (data) =>
  instance.post(BASE, data).then((r) => r.data);

export const updateCampaign = (id, data) =>
  instance.put(`${BASE}/${id}`, data).then((r) => r.data);

export const deleteCampaign = (id) =>
  instance.delete(`${BASE}/${id}`).then((r) => r.data);

export const patchCampaignStatus = (id, status) =>
  instance.patch(`${BASE}/${id}/status`, { status }).then((r) => r.data);

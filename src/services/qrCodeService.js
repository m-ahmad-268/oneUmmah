import instance from '../API/axiosInstance';

const BASE = '/qr-codes';

export const getQrCodes = (params = {}) =>
  instance.get(BASE, { params }).then((r) => r.data);

export const getQrStats = (id) =>
  instance.get(`${BASE}/${id}/stats`).then((r) => r.data);

export const getQrCodeById = (id) =>
  instance.get(`${BASE}/${id}`).then((r) => r.data);

export const createQrCode = (data) =>
  instance.post(BASE, data).then((r) => r.data);

export const updateQrCode = (id, data) =>
  instance.put(`${BASE}/${id}`, data).then((r) => r.data);

export const patchQrStatus = (id, status) =>
  instance.patch(`${BASE}/${id}/status`, { status }).then((r) => r.data);

export const getGeoCountries = () =>
  instance.get('/geo/countries').then((r) => r.data);

export const getGeoCities = (isoCode) =>
  instance.get(`/geo/countries/${isoCode}/cities`).then((r) => r.data);

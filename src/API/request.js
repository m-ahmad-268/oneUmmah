import axios from './axiosInstance';

export const getApiRequest = (async (url, data, params) => {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            data: data || {},
            params: { ...params } || {},
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
});

export const postApiRequest = (async (url, data, params) => {
    try {
        const response = await axios({
            method: 'post',
            url: url,
            data: data,
            params: { ...params } || {},
            headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
});

export const deleteApiRequest = (async (url, data, params) => {
    try {
        const response = await axios({
            method: 'delete',
            url: url,
            data: data,
            params: { ...params } || {},
        });
        return response.data;
    } catch (error) {
        throw error;
    }
});
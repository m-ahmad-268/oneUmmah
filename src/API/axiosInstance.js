import axios from 'axios';
// import store from '../store';
// import { hideLoader, showLoader } from '../slices/commonSlice';
// import { reestData } from '../slices/authSlice';

// const baseURL = process.env.REACT_APP_API_URL;
const baseURL = process.env.REACT_APP_API_URL;

const instance = axios.create({
    // baseURL: import.meta.env.VITE_API_BASE_URL, // set in `.env`
    baseURL: baseURL, // set in `.env`
    // baseURL: baseURL, // set in `.env`
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
instance.interceptors.request.use(
    (config) => {
        // store.dispatch(showLoader());
        const token = localStorage.getItem('access_token_admin');
        // debugger
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // store.dispatch(hideLoader());
        return Promise.reject(error);
    }
);

// Response Interceptor
instance.interceptors.response.use(
    (response) => {
        // store.dispatch(hideLoader());
        // debugger
        return response;
    },
    (error) => {
        // store.dispatch(hideLoader());
        // store.dispatch(reestData());
        // debugger
        console.error('API error:', error || error.message);
        return Promise.reject(error);
    }
);

export default instance;

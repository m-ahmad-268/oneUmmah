import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

const instance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor — attach current access token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token_admin');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 401 refresh-and-retry logic
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

function onRefreshed(token) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

// Response Interceptor — transparently refresh on 401 and replay the original request
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 || error.response?.status === 403 && !original._retry) {
            original._retry = true;

            // If a refresh is already in flight, queue this request
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        original.headers.Authorization = `Bearer ${token}`;
                        resolve(instance(original));
                    });
                });
            }

            isRefreshing = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token_admin');
                const res = await fetch(`${baseURL}auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });

                if (!res.ok) throw new Error('refresh_failed');

                const data = await res.json();
                const newToken = data.accessToken ?? data.data?.accessToken;
                localStorage.setItem('access_token_admin', newToken);

                onRefreshed(newToken);
                original.headers.Authorization = `Bearer ${newToken}`;
                return instance(original);
            } catch {
                // Refresh failed — clear session and send to login
                localStorage.removeItem('access_token_admin');
                localStorage.removeItem('refresh_token_admin');
                localStorage.removeItem('user_data');
                window.location.href = `${process.env.REACT_APP_URL}sign-in?error=token-expired`;
                localStorage.clear();
                // window.location.href = 'admin/sign-in';
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;

import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_ROOT
});

api.interceptors.request.use((config) => {
    config.headers.Accept = 'application/json';

    // Get token from localStorage where it's stored by the auth store
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
        }
    }

    return config;
});

export { api };

export const generateUrl = (root: string, params: Record<string, string | number | boolean>): string => {
    let url = root;
    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
    }

    return url;
};


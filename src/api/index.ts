import axios from 'axios'

import {useUserStore} from "@/stores"
import { getActivePinia } from 'pinia';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_ROOT
});

const userStore = useUserStore();

api.interceptors.request.use((config) => {
    config.headers.Accept = 'application/json';

    const pinia = getActivePinia();
  if (pinia) {
    const userStore = useUserStore();
    const token = userStore.getAccessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

    const token = userStore.getAccessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;

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


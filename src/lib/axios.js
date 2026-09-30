import axios from 'axios';

import { CONFIG } from 'src/global-config';

import { JWT_STORAGE_KEY } from 'src/auth/context/jwt/constant';

import { LMS_SANCTUM_TOKEN_KEY } from './lms-api-auth-keys';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (
    typeof FormData !== 'undefined' &&
    config.data instanceof FormData
  ) {
    const headers = config.headers;
    /* Let the runtime set multipart boundary—default `application/json` breaks file uploads */
    if (headers && typeof headers.delete === 'function') {
      headers.delete('Content-Type');
    } else if (headers) {
      delete headers['Content-Type'];
      delete headers['content-type'];
    }
  }

  if (typeof sessionStorage === 'undefined') {
    return config;
  }
  const sanctum = sessionStorage.getItem(LMS_SANCTUM_TOKEN_KEY);
  const jwt = sessionStorage.getItem(JWT_STORAGE_KEY);
  const token = sanctum || jwt;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data;
    let message = data?.message || error?.message || 'Something went wrong!';

    if (data?.errors && typeof data.errors === 'object') {
      const msgs = Object.values(data.errors).flat().filter(Boolean);
      if (msgs.length) {
        message = msgs.join(' ');
      }
    }

    console.error('Axios error:', message);
    const wrapped = new Error(message);
    wrapped.response = error?.response;
    wrapped.status = error?.response?.status;
    return Promise.reject(wrapped);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants';
import { ApiError } from '../types';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - attach auth token and check expiry
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;
        const username = parsed?.state?.username;
        const loginAt = parsed?.state?.loginAt;
        const expiresIn = parsed?.state?.expiresIn; // seconds

        if (token) {
          // Check if token has expired before attaching it
          if (loginAt && expiresIn && Date.now() > loginAt + expiresIn * 1000) {
            localStorage.removeItem('auth-storage');
            window.location.href = '/login';
            return Promise.reject(new Error('Session expired. Please log in again.'));
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (username && config.url?.includes('/me')) {
          config.headers['X-Username'] = username;
        }
      } catch {
        // ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and parse errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Clear auth store and redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }

    // Transform error to a more usable format
    const apiError = error.response?.data;
    if (apiError) {
      const message =
        apiError.fieldErrors?.length
          ? apiError.fieldErrors.map((fe) => `${fe.field}: ${fe.message}`).join('; ')
          : apiError.message || 'An error occurred';
      return Promise.reject(new Error(message));
    }

    return Promise.reject(new Error(error.message || 'Network error'));
  }
);

export default axiosInstance;

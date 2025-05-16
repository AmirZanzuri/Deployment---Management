// src/api/client.jsx
import axios from 'axios';

// Get the base URL from environment variables, or use a default
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      // Network or connection error
      console.error('API Connection Error:', {
        message: error.message,
        code: error.code,
        baseURL: api.defaults.baseURL
      });
      return Promise.reject(new Error('Unable to connect to the API. Please check your connection and try again.'));
    }

    if (error.response.status === 401) {
      localStorage.removeItem('authToken');
    }

    return Promise.reject(error);
  }
);

export { api };
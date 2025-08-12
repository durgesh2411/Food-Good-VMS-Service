import axios from 'axios';
import { backendUrl } from './constant.js';

// Configure axios defaults
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;

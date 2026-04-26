import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send HTTP-only cookies
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — unwrap data or throw normalized error
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default api;

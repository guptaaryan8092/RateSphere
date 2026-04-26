import api from './api';

export const getDashboard  = ()        => api.get('/admin/dashboard');
export const listUsers     = (params)  => api.get('/admin/users', { params });
export const createUser    = (data)    => api.post('/admin/users', data);
export const listStores    = (params)  => api.get('/admin/stores', { params });
export const createStore   = (data)    => api.post('/admin/stores', data);

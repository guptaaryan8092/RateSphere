import api from './api';

export const signup   = (data)           => api.post('/auth/signup', data);
export const login    = (data)           => api.post('/auth/login', data);
export const logout   = ()               => api.post('/auth/logout');
export const getMe    = ()               => api.get('/auth/me');
export const changePassword = (data)     => api.patch('/auth/password', data);

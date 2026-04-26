import api from './api';

export const getOwnerDashboard = (params) => api.get('/owner/dashboard', { params });

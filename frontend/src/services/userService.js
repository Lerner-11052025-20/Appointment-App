import api from './api';

export const getProviders = () => api.get('/users/providers').then(r => r.data);
export const getOrganiserStats = () => api.get('/users/organiser-stats').then(r => r.data);
export const getAdminStats = () => api.get('/users/admin-stats').then(r => r.data);
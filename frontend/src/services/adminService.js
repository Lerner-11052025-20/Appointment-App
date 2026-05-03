import api from './api';

export const getAdminDashboard = () => api.get('/admin/dashboard').then(r => r.data);
export const getAllUsers = (params) => api.get('/admin/users', { params }).then(r => r.data);
export const getUserById = (id) => api.get(`/admin/users/${id}`).then(r => r.data);
export const updateUserStatus = (id, isActive) => api.patch(`/admin/users/${id}/status`, { isActive }).then(r => r.data);
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role }).then(r => r.data);
export const getProviders = () => api.get('/admin/providers').then(r => r.data);
export const getPlatformActivity = () => api.get('/admin/activity').then(r => r.data);

import api from './api';

export const createResource = (data) => api.post('/resources', data).then(r => r.data);
export const getResources = () => api.get('/resources').then(r => r.data);
export const getResourceById = (id) => api.get(`/resources/${id}`).then(r => r.data);
export const updateResource = (id, data) => api.put(`/resources/${id}`, data).then(r => r.data);
export const deleteResource = (id) => api.delete(`/resources/${id}`).then(r => r.data);
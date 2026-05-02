import api from './api';

export const createAppointment = (data) => api.post('/appointments', data).then(r => r.data);
export const getAppointments = (params) => api.get('/appointments', { params }).then(r => r.data);
export const getPublishedAppointments = (params) => api.get('/appointments/published', { params }).then(r => r.data);
export const getPublishedAppointmentById = (id) => api.get(`/appointments/published/${id}`).then(r => r.data);
export const getAppointmentById = (id) => api.get(`/appointments/${id}`).then(r => r.data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data).then(r => r.data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`).then(r => r.data);
export const publishAppointment = (id) => api.patch(`/appointments/${id}/publish`).then(r => r.data);
export const unpublishAppointment = (id) => api.patch(`/appointments/${id}/unpublish`).then(r => r.data);
export const generateShareLink = (id) => api.post(`/appointments/${id}/share`).then(r => r.data);
export const getAppointmentMeetings = (id) => api.get(`/appointments/${id}/meetings`).then(r => r.data);
export const getAppointmentByShareToken = (token) => api.get(`/appointments/public/${token}`).then(r => r.data);
import api from './api';

export const getReportOverview = (params) => api.get('/reports/overview', { params }).then(r => r.data);
export const getPeakBookingHours = (params) => api.get('/reports/peak-hours', { params }).then(r => r.data);
export const getProviderUtilization = (params) => api.get('/reports/provider-utilization', { params }).then(r => r.data);
export const getResourceUtilization = (params) => api.get('/reports/resource-utilization', { params }).then(r => r.data);
export const getBookingTrends = (params) => api.get('/reports/trends', { params }).then(r => r.data);
export const getAppointmentPerformance = (params) => api.get('/reports/appointment-performance', { params }).then(r => r.data);

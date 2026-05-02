import api from './api';

export const getAvailability = (appointmentId, params) =>
  api.get(`/availability/${appointmentId}`, { params }).then(r => r.data);
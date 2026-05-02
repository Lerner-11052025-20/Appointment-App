import api from './api';

export const createBooking = (data) => api.post('/bookings', data).then(r => r.data);
export const getMyBookings = () => api.get('/bookings/my').then(r => r.data);
export const getBookingById = (id) => api.get(`/bookings/${id}`).then(r => r.data);
export const cancelBooking = (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }).then(r => r.data);
export const rescheduleBooking = (id, data) => api.patch(`/bookings/${id}/reschedule`, data).then(r => r.data);
export const mockPayment = (id) => api.patch(`/bookings/${id}/mock-payment`).then(r => r.data);
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status }).then(r => r.data);
import api from './api';

export const getMyProfile = () => api.get('/profile/me');
export const updateMyProfile = (data) => api.put('/profile/me', data);
export const getMyProfileAppointments = () => api.get('/profile/appointments');
export const getMyProfileAppointmentDetails = (bookingId) => api.get(`/profile/appointments/${bookingId}`);

const profileService = {
  getMyProfile,
  updateMyProfile,
  getMyProfileAppointments,
  getMyProfileAppointmentDetails,
};

export default profileService;
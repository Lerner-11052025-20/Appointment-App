export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const ROLES = {
  CUSTOMER: 'customer',
  ORGANISER: 'organiser',
  ADMIN: 'admin',
};

export const ROLE_DASHBOARD_PATHS = {
  customer: '/customer/dashboard',
  organiser: '/organiser/dashboard',
  admin: '/admin/dashboard',
};

export const MOCK_OTP = '123456';

export const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /\d/.test(p) },
  { label: 'One special character', test: (p) => /[@$!%*?&#]/.test(p) },
];
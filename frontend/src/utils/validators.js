export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return re.test(password);
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&#]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
  if (score <= 3) return { score, label: 'Medium', color: '#f59e0b' };
  if (score <= 4) return { score, label: 'Strong', color: '#10b981' };
  return { score, label: 'Very Strong', color: '#6650fa' };
};

export const validateSignup = (data) => {
  const errors = {};
  if (!data.fullName?.trim()) errors.fullName = 'Full name is required';
  if (!data.email?.trim()) errors.email = 'Email is required';
  else if (!validateEmail(data.email)) errors.email = 'Invalid email format';
  if (!data.password) errors.password = 'Password is required';
  else if (!validatePassword(data.password))
    errors.password = 'Password does not meet requirements';
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  if (!data.role) errors.role = 'Please select a role';
  return errors;
};

export const validateLogin = (data) => {
  const errors = {};
  if (!data.email?.trim()) errors.email = 'Email is required';
  else if (!validateEmail(data.email)) errors.email = 'Invalid email format';
  if (!data.password) errors.password = 'Password is required';
  return errors;
};
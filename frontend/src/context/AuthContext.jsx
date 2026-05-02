import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import { ROLE_DASHBOARD_PATHS } from '../utils/constants';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('slotiq_token'));
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        setUser(res.data);
      } catch {
        localStorage.removeItem('slotiq_token');
        localStorage.removeItem('slotiq_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const register = async (data) => {
    const res = await authService.registerUser(data);
    showToast(res.message, 'success');
    return res;
  };

  const verifyOtp = async (data) => {
    const res = await authService.verifyOtp(data);

    const { user: userData, token: newToken } = res.data;
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('slotiq_token', newToken);
    localStorage.setItem('slotiq_user', JSON.stringify(userData));
    showToast('Welcome to SlotIQ, ' + userData.fullName + '!', 'success');
    const path = ROLE_DASHBOARD_PATHS[userData.role] || '/login';
    navigate(path);
    return res;
  };

  const login = async (data) => {
    const res = await authService.loginUser(data);
    const { user: userData, token: newToken } = res.data;
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('slotiq_token', newToken);
    localStorage.setItem('slotiq_user', JSON.stringify(userData));
    showToast('Welcome back, ' + userData.fullName + '!', 'success');

    const path = ROLE_DASHBOARD_PATHS[userData.role] || '/login';
    navigate(path);
    return res;
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('slotiq_token');
    localStorage.removeItem('slotiq_user');
    navigate('/login');
    showToast('Logged out successfully.', 'success');
  }, [navigate, showToast]);

  const value = {
    user,
    token,
    loading,
    toast,
    showToast,
    isAuthenticated: !!user && !!token,
    register,
    verifyOtp,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
import api from './api';

// Register user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return { user: response.data }; // UPDATED
};

// Login user - UPDATED
export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return { user: response.data }; // UPDATED
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
};

// Get user from localStorage
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Get user profile
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await api.get('/auth/users');
  return response.data;
};
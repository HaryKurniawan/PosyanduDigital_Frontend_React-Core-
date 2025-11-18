import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
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
  const user = getCurrentUser();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  };
  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

// Get all users (Admin only)
export const getAllUsers = async () => {
  const user = getCurrentUser();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  };
  const response = await axios.get(`${API_URL}/users`, config);
  return response.data;
};
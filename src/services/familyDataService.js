import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/family';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`
    }
  };
};

export const checkProfileStatus = async () => {
  const response = await axios.get(`${API_URL}/profile-status`, getAuthHeader());
  return response.data;
};

export const getFamilyData = async () => {
  const response = await axios.get(`${API_URL}/family-data`, getAuthHeader());
  return response.data;
};

export const saveMotherData = async (data) => {
  const response = await axios.post(`${API_URL}/mother-data`, data, getAuthHeader());
  return response.data;
};

export const saveSpouseData = async (data) => {
  const response = await axios.post(`${API_URL}/spouse-data`, data, getAuthHeader());
  return response.data;
};

export const saveChildData = async (data) => {
  const response = await axios.post(`${API_URL}/child-data`, data, getAuthHeader());
  return response.data;
};

export const completeProfile = async () => {
  const response = await axios.post(`${API_URL}/complete-profile`, {}, getAuthHeader());
  return response.data;
};

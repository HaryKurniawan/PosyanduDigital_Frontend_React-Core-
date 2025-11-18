import api from './api';

export const checkProfileStatus = async () => {
  const response = await api.get('/family/profile-status');
  return response.data;
};

export const getFamilyData = async () => {
  const response = await api.get('/family/family-data');
  return response.data;
};

export const saveMotherData = async (data) => {
  const response = await api.post('/family/mother-data', data);
  return response.data;
};

export const saveSpouseData = async (data) => {
  const response = await api.post('/family/spouse-data', data);
  return response.data;
};

export const saveChildData = async (data) => {
  const response = await api.post('/family/child-data', data);
  return response.data;
};

export const completeProfile = async () => {
  const response = await api.post('/family/complete-profile', {});
  return response.data;
};

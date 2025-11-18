import api from './api';

// Get all children
export const getAllChildren = async () => {
  const response = await api.get('/admin/children');
  return response.data;
};

// Get family data by child ID
export const getFamilyDataByChildId = async (childId) => {
  const response = await api.get(`/admin/child/${childId}/family-data`);
  return response.data;
};

// Get all families
export const getAllFamilies = async () => {
  const response = await api.get('/admin/families');
  return response.data;
};
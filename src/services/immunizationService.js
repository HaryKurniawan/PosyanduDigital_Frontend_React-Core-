import api from './api';

// Get all immunization templates
export const getAllImmunizationTemplates = async () => {
  try {
    const response = await api.get('/posyandu/immunization/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching immunization templates:', error);
    throw error;
  }
};

// Get child immunizations
export const getChildImmunizations = async (childId) => {
  try {
    const response = await api.get(`/posyandu/child/${childId}/immunizations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching child immunizations:', error);
    throw error;
  }
};

// Get child immunization roadmap
export const getChildImmunizationRoadmap = async (childId) => {
  try {
    const response = await api.get(`/posyandu/child/${childId}/immunization-roadmap`);
    return response.data;
  } catch (error) {
    console.error('Error fetching immunization roadmap:', error);
    throw error;
  }
};

// Record child immunization (Admin only)
export const recordChildImmunization = async (immunizationData) => {
  try {
    const response = await api.post('/posyandu/child/immunization', immunizationData);
    return response.data;
  } catch (error) {
    console.error('Error recording immunization:', error);
    throw error;
  }
};

// Update immunization record
export const updateChildImmunization = async (immunizationId, updateData) => {
  try {
    const response = await api.put(`/posyandu/immunization/${immunizationId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating immunization:', error);
    throw error;
  }
};

// Delete immunization record
export const deleteChildImmunization = async (immunizationId) => {
  try {
    const response = await api.delete(`/posyandu/immunization/${immunizationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting immunization:', error);
    throw error;
  }
};
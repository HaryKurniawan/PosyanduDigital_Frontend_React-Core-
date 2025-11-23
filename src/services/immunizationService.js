// services/immunizationService.js
import api from './api';

// ============================================
// IMMUNIZATION TEMPLATE FUNCTIONS
// ============================================

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

// Create immunization template (Admin only)
export const createImmunizationTemplate = async (templateData) => {
  try {
    const response = await api.post('/posyandu/immunization/template', templateData);
    return response.data;
  } catch (error) {
    console.error('Error creating immunization template:', error);
    throw error;
  }
};

// Update immunization template (Admin only) - ✅ TAMBAHAN BARU
export const updateImmunizationTemplate = async (templateId, templateData) => {
  try {
    const response = await api.put(
      `/posyandu/immunization/template/${templateId}`,
      templateData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating immunization template:', error);
    throw error;
  }
};

// Delete immunization template (Admin only) - ✅ TAMBAHAN BARU
export const deleteImmunizationTemplate = async (templateId) => {
  try {
    const response = await api.delete(
      `/posyandu/immunization/template/${templateId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting immunization template:', error);
    throw error;
  }
};

// ============================================
// CHILD IMMUNIZATION FUNCTIONS
// ============================================

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
    const response = await api.get(
      `/posyandu/child/${childId}/immunization-roadmap`
    );
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

// ============================================
// ADMIN STATUS FUNCTIONS
// ============================================

// Get all children immunization status (Admin only)
export const getAllChildrenImmunizationStatus = async () => {
  try {
    const response = await api.get('/posyandu/immunization/status/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching immunization status:', error);
    throw error;
  }
};
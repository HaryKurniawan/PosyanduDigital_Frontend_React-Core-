import api from './api';

// ============================================
// USER ENDPOINTS
// ============================================

// Get user's children for KPSP
export const getMyChildren = async () => {
  const response = await api.get('/kpsp/my-children');
  return response.data;
};

// Get all KPSP categories with questions
export const getKPSPCategories = async () => {
  const response = await api.get('/kpsp/categories');
  return response.data;
};

// Get KPSP category by code
export const getKPSPCategoryByCode = async (code) => {
  const response = await api.get(`/kpsp/categories/${code}`);
  return response.data;
};

// Submit KPSP screening
export const submitKPSPScreening = async (screeningData) => {
  const response = await api.post('/kpsp/screenings', screeningData);
  return response.data;
};

// Get screening history for a child
export const getChildScreeningHistory = async (childId) => {
  const response = await api.get(`/kpsp/screenings/child/${childId}`);
  return response.data;
};

// Get single screening detail
export const getScreeningDetail = async (screeningId) => {
  const response = await api.get(`/kpsp/screenings/${screeningId}`);
  return response.data;
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Get all screenings (with filters)
export const getAllScreenings = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/kpsp/admin/screenings?${params}`);
  return response.data;
};

// Get KPSP statistics
export const getKPSPStatistics = async () => {
  const response = await api.get('/kpsp/admin/statistics');
  return response.data;
};

// Create KPSP category
export const createKPSPCategory = async (categoryData) => {
  const response = await api.post('/kpsp/admin/categories', categoryData);
  return response.data;
};

// Create KPSP question
export const createKPSPQuestion = async (questionData) => {
  const response = await api.post('/kpsp/admin/questions', questionData);
  return response.data;
};

// Update KPSP category
export const updateKPSPCategory = async (id, categoryData) => {
  const response = await api.put(`/kpsp/admin/categories/${id}`, categoryData);
  return response.data;
};

// Delete KPSP category
export const deleteKPSPCategory = async (id) => {
  const response = await api.delete(`/kpsp/admin/categories/${id}`);
  return response.data;
};
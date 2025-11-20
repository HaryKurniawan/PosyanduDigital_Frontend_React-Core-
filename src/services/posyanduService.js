import api from './api';

// ============================================
// ADMIN SERVICES - SCHEDULE MANAGEMENT
// ============================================

export const createSchedule = async (data) => {
  const response = await api.post('/posyandu/schedule', data);
  return response.data;
};

export const getAllSchedules = async () => {
  const response = await api.get('/posyandu/schedules');
  return response.data;
};

export const getScheduleDetail = async (scheduleId) => {
  const response = await api.get(`/posyandu/schedule/${scheduleId}`);
  return response.data;
};

// ============================================
// ADMIN SERVICES - CHILDREN MANAGEMENT
// ============================================

export const getAllChildren = async () => {
  const response = await api.get('/admin/children');
  return response.data;
};

export const searchChildByNIK = async (nik) => {
  const response = await api.get(`/posyandu/search-child/${nik}`);
  return response.data;
};

// ============================================
// ADMIN SERVICES - EXAMINATION MANAGEMENT
// ============================================

export const createExamination = async (data) => {
  const response = await api.post('/posyandu/examination', data);
  return response.data;
};

export const getExaminationsBySchedule = async (scheduleId) => {
  const response = await api.get(`/posyandu/schedule/${scheduleId}/examinations`);
  return response.data;
};

// ============================================
// IMMUNIZATION SERVICES - TEMPLATE MANAGEMENT
// ============================================

/**
 * Get all immunization templates
 * @returns {Promise} Array of templates with vaccines
 */
export const getAllImmunizationTemplates = async () => {
  const response = await api.get('/posyandu/immunization/templates');
  return response.data;
};

/**
 * Create new immunization template (Admin only)
 * @param {Object} data - Template data
 * @returns {Promise} Created template
 */
export const createImmunizationTemplate = async (data) => {
  const response = await api.post('/posyandu/immunization/template', data);
  return response.data;
};

// ============================================
// IMMUNIZATION SERVICES - CHILD RECORDS
// ============================================

/**
 * Get child immunization records
 * @param {String} childId - Child ID
 * @returns {Promise} Array of immunization records
 */
export const getChildImmunizations = async (childId) => {
  const response = await api.get(`/posyandu/child/${childId}/immunizations`);
  return response.data;
};

/**
 * Record/Add immunization for child (Admin only)
 * @param {String} childId - Child ID
 * @param {Object} data - Immunization data
 * @returns {Promise} Created immunization record
 */
export const recordChildImmunization = async (childId, data) => {
  const response = await api.post(`/posyandu/child/${childId}/immunization`, data);
  return response.data;
};

/**
 * Update immunization record (Admin only)
 * @param {String} immunizationId - Immunization record ID
 * @param {Object} data - Updated data
 * @returns {Promise} Updated immunization record
 */
export const updateChildImmunization = async (immunizationId, data) => {
  const response = await api.put(`/posyandu/immunization/${immunizationId}`, data);
  return response.data;
};

/**
 * Delete immunization record (Admin only)
 * @param {String} immunizationId - Immunization record ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteChildImmunization = async (immunizationId) => {
  const response = await api.delete(`/posyandu/immunization/${immunizationId}`);
  return response.data;
};

// ============================================
// IMMUNIZATION SERVICES - ROADMAP & PROGRESS
// ============================================

/**
 * Get child immunization roadmap with progress
 * @param {String} childId - Child ID
 * @returns {Promise} Complete roadmap with progress data
 */
export const getChildImmunizationRoadmap = async (childId) => {
  const response = await api.get(`/posyandu/child/${childId}/immunization-roadmap`);
  return response.data;
};

/**
 * Get all children immunization status (Admin only)
 * @returns {Promise} Array of children with immunization status
 */
export const getAllChildrenImmunizationStatus = async () => {
  const response = await api.get('/posyandu/immunization/status/all');
  return response.data;
};

// ============================================
// USER SERVICES - POSYANDU REGISTRATION
// ============================================

export const getUpcomingSchedules = async () => {
  const response = await api.get('/posyandu/upcoming-schedules');
  return response.data;
};

export const registerForPosyandu = async (data) => {
  const response = await api.post('/posyandu/register', data);
  return response.data;
};

export const cancelRegistration = async (registrationId) => {
  const response = await api.delete(`/posyandu/registration/${registrationId}`);
  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await api.get('/posyandu/my-registrations');
  return response.data;
};

// ============================================
// USER SERVICES - EXAMINATION & IMMUNIZATION
// ============================================

export const getMyChildrenExaminations = async () => {
  const response = await api.get('/posyandu/my-examinations');
  return response.data;
};

export const getLatestExaminations = async () => {
  const response = await api.get('/posyandu/latest-examinations');
  return response.data;
};

/**
 * Get my children immunization records (User)
 * @param {String} childId - Child ID
 * @returns {Promise} Child immunization records
 */
export const getMyChildImmunizations = async (childId) => {
  const response = await api.get(`/posyandu/child/${childId}/immunizations`);
  return response.data;
};

/**
 * Get my children immunization roadmap (User)
 * @param {String} childId - Child ID
 * @returns {Promise} Child immunization roadmap with progress
 */
export const getMyChildImmunizationRoadmap = async (childId) => {
  const response = await api.get(`/posyandu/child/${childId}/immunization-roadmap`);
  return response.data;
};
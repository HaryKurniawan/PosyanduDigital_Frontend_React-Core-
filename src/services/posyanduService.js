import api from './api';

// ============================================
// ADMIN SERVICES
// ============================================

// Schedule Management
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

// Children Management
export const getAllChildren = async () => {
  const response = await api.get('/admin/children');
  return response.data;
};

export const searchChildByNIK = async (nik) => {
  const response = await api.get(`/posyandu/search-child/${nik}`);
  return response.data;
};

// Examination Management
export const createExamination = async (data) => {
  const response = await api.post('/posyandu/examination', data);
  return response.data;
};

export const getExaminationsBySchedule = async (scheduleId) => {
  const response = await api.get(`/posyandu/schedule/${scheduleId}/examinations`);
  return response.data;
};

// ============================================
// USER SERVICES
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

export const getMyChildrenExaminations = async () => {
  const response = await api.get('/posyandu/my-examinations');
  return response.data;
};

export const getLatestExaminations = async () => {
  const response = await api.get('/posyandu/latest-examinations');
  return response.data;
};
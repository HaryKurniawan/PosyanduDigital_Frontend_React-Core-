import api from './api';

// ============ ADMIN FUNCTIONS ============

export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post('/posyandu/schedule', scheduleData);
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

export const getAllSchedules = async () => {
  try {
    const response = await api.get('/posyandu/schedules');
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

export const getScheduleDetail = async (scheduleId) => {
  try {
    const response = await api.get(`/posyandu/schedule/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule detail:', error);
    throw error;
  }
};

export const searchChildByNIK = async (nik) => {
  try {
    const response = await api.get(`/posyandu/search-child/${nik}`);
    return response.data;
  } catch (error) {
    console.error('Error searching child:', error);
    throw error;
  }
};

export const getAllChildren = async () => {
  try {
    const response = await api.get('/admin/children');
    return response.data;
  } catch (error) {
    console.error('Error fetching all children:', error);
    throw error;
  }
};

// ✅ UPDATED - Support vaccineIds array
export const createExamination = async (examinationData) => {
  try {
    const response = await api.post('/posyandu/examination', examinationData);
    return response.data;
  } catch (error) {
    console.error('Error creating examination:', error);
    throw error;
  }
};

export const getExaminationsBySchedule = async (scheduleId) => {
  try {
    const response = await api.get(`/posyandu/schedule/${scheduleId}/examinations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching examinations:', error);
    throw error;
  }
};

// ✅ NEW - Get examination detail with vaccines
export const getExaminationDetail = async (examinationId) => {
  try {
    const response = await api.get(`/posyandu/examination/${examinationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching examination detail:', error);
    throw error;
  }
};

// ============ USER FUNCTIONS ============

export const getUpcomingSchedules = async () => {
  try {
    const response = await api.get('/posyandu/upcoming-schedules');
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming schedules:', error);
    throw error;
  }
};

export const registerForPosyandu = async (registrationData) => {
  try {
    const response = await api.post('/posyandu/register', registrationData);
    return response.data;
  } catch (error) {
    console.error('Error registering for posyandu:', error);
    throw error;
  }
};

export const cancelRegistration = async (registrationId) => {
  try {
    const response = await api.delete(`/posyandu/registration/${registrationId}`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling registration:', error);
    throw error;
  }
};

export const getMyRegistrations = async () => {
  try {
    const response = await api.get('/posyandu/my-registrations');
    return response.data;
  } catch (error) {
    console.error('Error fetching my registrations:', error);
    throw error;
  }
};

export const getMyChildrenExaminations = async () => {
  try {
    const response = await api.get('/posyandu/my-examinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching examinations:', error);
    throw error;
  }
};

export const getLatestExaminations = async () => {
  try {
    const response = await api.get('/posyandu/latest-examinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest examinations:', error);
    throw error;
  }
};

// ============ IMMUNIZATION FUNCTIONS ============

export const getAllImmunizationTemplates = async () => {
  try {
    const response = await api.get('/posyandu/immunization/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching immunization templates:', error);
    throw error;
  }
};

export const createImmunizationTemplate = async (templateData) => {
  try {
    const response = await api.post('/posyandu/immunization/template', templateData);
    return response.data;
  } catch (error) {
    console.error('Error creating immunization template:', error);
    throw error;
  }
};
import api from './api';

// ============ GROWTH ANALYSIS FUNCTIONS ============

/**
 * Get growth status semua anak user
 */
export const getMyChildrenGrowthStatus = async () => {
    try {
        const response = await api.get('/growth/my-children');
        return response.data;
    } catch (error) {
        console.error('Error fetching children growth status:', error);
        throw error;
    }
};

/**
 * Get growth analysis untuk satu anak
 */
export const getChildGrowthAnalysis = async (childId) => {
    try {
        const response = await api.get(`/growth/child/${childId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching child growth analysis:', error);
        throw error;
    }
};

/**
 * Get growth history untuk grafik
 */
export const getGrowthHistory = async (childId) => {
    try {
        const response = await api.get(`/growth/history/${childId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching growth history:', error);
        throw error;
    }
};

/**
 * Update gender anak
 */
export const updateChildGender = async (childId, gender) => {
    try {
        const response = await api.put(`/growth/child/${childId}/gender`, { gender });
        return response.data;
    } catch (error) {
        console.error('Error updating child gender:', error);
        throw error;
    }
};

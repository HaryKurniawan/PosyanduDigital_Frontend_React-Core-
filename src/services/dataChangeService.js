import api from './api';

/**
 * Submit a data change request
 */
export const submitChangeRequest = async (targetType, targetId, newData) => {
    try {
        const response = await api.post('/data-change', {
            targetType,
            targetId,
            newData
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting change request:', error);
        throw error;
    }
};

/**
 * Get my change requests
 */
export const getMyChangeRequests = async () => {
    try {
        const response = await api.get('/data-change/my-requests');
        return response.data;
    } catch (error) {
        console.error('Error getting my change requests:', error);
        throw error;
    }
};

/**
 * Get pending change requests (Admin)
 */
export const getPendingRequests = async () => {
    try {
        const response = await api.get('/data-change/pending');
        return response.data;
    } catch (error) {
        console.error('Error getting pending requests:', error);
        throw error;
    }
};

/**
 * Get all change requests (Admin)
 */
export const getAllChangeRequests = async () => {
    try {
        const response = await api.get('/data-change/all');
        return response.data;
    } catch (error) {
        console.error('Error getting all requests:', error);
        throw error;
    }
};

/**
 * Approve change request (Admin)
 */
export const approveChangeRequest = async (requestId, reviewNotes = '') => {
    try {
        const response = await api.put(`/data-change/${requestId}/approve`, { reviewNotes });
        return response.data;
    } catch (error) {
        console.error('Error approving request:', error);
        throw error;
    }
};

/**
 * Reject change request (Admin)
 */
export const rejectChangeRequest = async (requestId, reviewNotes = '') => {
    try {
        const response = await api.put(`/data-change/${requestId}/reject`, { reviewNotes });
        return response.data;
    } catch (error) {
        console.error('Error rejecting request:', error);
        throw error;
    }
};

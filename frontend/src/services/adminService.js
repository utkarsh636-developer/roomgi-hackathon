import api from './api';

// ==================== DASHBOARD & ANALYTICS ====================

export const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
};

export const getUserAnalytics = async () => {
    const response = await api.get('/admin/analytics/users');
    return response.data;
};

export const getPropertyAnalytics = async () => {
    const response = await api.get('/admin/analytics/properties');
    return response.data;
};

export const getReportAnalytics = async () => {
    const response = await api.get('/admin/analytics/reports');
    return response.data;
};

// ==================== USER MANAGEMENT ====================

export const getAllUsers = async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
};

export const getUserById = async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
};

export const getPendingUserVerifications = async () => {
    const response = await api.get('/admin/users/pending-verifications');
    return response.data;
};

export const toggleBlockUser = async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/block`);
    return response.data;
};

export const verifyUser = async (userId, status, rejectionReason = '') => {
    const response = await api.patch(`/admin/users/${userId}/verify`, {
        status,
        rejectionReason
    });
    return response.data;
};

// ==================== PROPERTY MANAGEMENT ====================

export const getAllProperties = async (params = {}) => {
    const response = await api.get('/admin/properties', { params });
    return response.data;
};

export const getPropertyById = async (propertyId) => {
    const response = await api.get(`/admin/properties/${propertyId}`);
    return response.data;
};

export const getPendingPropertyVerifications = async () => {
    const response = await api.get('/admin/properties/pending-verifications');
    return response.data;
};

export const toggleBlockProperty = async (propertyId) => {
    const response = await api.patch(`/admin/properties/${propertyId}/block`);
    return response.data;
};

export const verifyProperty = async (propertyId, status, rejectionReason = '') => {
    const response = await api.patch(`/admin/properties/${propertyId}/verify`, {
        status,
        rejectionReason
    });
    return response.data;
};

// ==================== REPORT MANAGEMENT ====================

export const getAllReports = async (params = {}) => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
};

export const getReportById = async (reportId) => {
    const response = await api.get(`/admin/reports/${reportId}`);
    return response.data;
};

export const updateReportStatus = async (reportId, status) => {
    const response = await api.patch(`/admin/reports/${reportId}/status`, { status });
    return response.data;
};

export const getUsersReportStats = async () => {
    const response = await api.get('/admin/stats/reports/users');
    return response.data;
};

export const getPropertiesReportStats = async () => {
    const response = await api.get('/admin/stats/reports/properties');
    return response.data;
};

export default {
    // Dashboard & Analytics
    getDashboardStats,
    getUserAnalytics,
    getPropertyAnalytics,
    getReportAnalytics,

    // User Management
    getAllUsers,
    getUserById,
    getPendingUserVerifications,
    toggleBlockUser,
    verifyUser,

    // Property Management
    getAllProperties,
    getPropertyById,
    getPendingPropertyVerifications,
    toggleBlockProperty,
    verifyProperty,

    // Report Management
    getAllReports,
    getReportById,
    updateReportStatus,
    getUsersReportStats,
    getPropertiesReportStats
};

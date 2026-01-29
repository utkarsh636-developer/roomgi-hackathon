import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

const createReview = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/reviews/add`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const getUserReviews = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/reviews/user/${userId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const updateReview = async (reviewId, formData) => {
    try {
        const response = await axios.patch(`${API_URL}/reviews/${reviewId}`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const deleteReview = async (reviewId) => {
    try {
        const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const reviewService = {
    createReview,
    getUserReviews,
    updateReview,
    deleteReview
};

export default reviewService;

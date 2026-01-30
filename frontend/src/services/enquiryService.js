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

const createEnquiry = async (enquiryData) => {
    try {
        const response = await axios.post(`${API_URL}/enquiries/create`, enquiryData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const getEnquiriesByOwner = async () => {
    try {
        const response = await axios.get(`${API_URL}/enquiries/owner`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const getEnquiriesByTenant = async () => {
    try {
        const response = await axios.get(`${API_URL}/enquiries/tenant`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const updateEnquiry = async (enquiryId, data) => {
    try {
        const response = await axios.patch(`${API_URL}/enquiries/${enquiryId}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const deleteEnquiry = async (enquiryId) => {
    try {
        const response = await axios.delete(`${API_URL}/enquiries/${enquiryId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const respondToEnquiry = async (enquiryId, reply) => {
    try {
        const response = await axios.patch(`${API_URL}/enquiries/${enquiryId}/accept`,
            { reply },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const enquiryService = {
    createEnquiry,
    getEnquiriesByOwner,
    getEnquiriesByTenant,
    updateEnquiry,
    deleteEnquiry,
    respondToEnquiry
};

export default enquiryService;

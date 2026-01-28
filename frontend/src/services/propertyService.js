import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

const addProperty = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/properties/add`, formData, {
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

const getAllProperties = async (queryParams = {}) => {
    try {
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `${API_URL}/properties/search?${queryString}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        // If 404, it might mean no properties found matching criteria, return empty list or throw depending on API behavior
        // For search usually it returns empty list but let's handle error generically
        throw error.response?.data || error.message;
    }
};

const getPropertyById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/properties/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}


const getOwnerProperties = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/owner/properties`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const propertyService = {
    addProperty,
    getAllProperties,
    getPropertyById,
    getOwnerProperties
};

export default propertyService;

import api from './api';
import axios from 'axios';

const authService = {
    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        if (response.data?.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/users/login', credentials);
        if (response.data?.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/users/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        }
    },

    verifyRequest: async (formData) => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(`${api.defaults.baseURL}/users/verify-request`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                // Axios will automatically set Content-Type to multipart/form-data with boundary
            },
        });
        return response.data;
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    fetchCurrentUser: async () => {
        const response = await api.get('/users/current-user');
        // Update local storage to keep it in sync
        if (response.data && response.data.data) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    updateProfile: async (formData) => {
        const response = await api.patch('/users/update-profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // Update local storage with new user data
        if (response.data && response.data.data) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    getFavorites: async () => {
        const response = await api.get('/users/tenant/favourites');
        return response.data;
    },

    toggleFavorite: async (propertyId) => {
        const response = await api.post(`/users/favorites/${propertyId}`);
        // Update local storage
        if (response.data && response.data.data) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                user.favorites = response.data.data;
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
        return response.data;
    }
};

export default authService;

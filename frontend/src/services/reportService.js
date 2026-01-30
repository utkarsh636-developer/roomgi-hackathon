import api from './api';

const createReport = async (data) => {
    const response = await api.post('/reports/create', data);
    return response.data;
};

const getMyReports = async () => {
    const response = await api.get('/reports/my-reports');
    return response.data;
};

export default {
    createReport,
    getMyReports
};

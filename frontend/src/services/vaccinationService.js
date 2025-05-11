import api from './api';

const vaccinationService = {
    // Vaccination Drives
    getDrives: async (page = 1, perPage = 10, status = '') => {
        const response = await api.get('/drives', {
            params: { page, per_page: perPage, status },
        });
        return response.data;
    },

    getDrive: async (id) => {
        const response = await api.get(`/drives/${id}`);
        return response.data;
    },

    createDrive: async (driveData) => {
        const response = await api.post('/drives', driveData);
        return response.data;
    },

    updateDrive: async (id, driveData) => {
        const response = await api.put(`/drives/${id}`, driveData);
        return response.data;
    },

    deleteDrive: async (id) => {
        const response = await api.delete(`/drives/${id}`);
        return response.data;
    },

    // Vaccination Records
    recordVaccination: async (vaccinationData) => {
        const response = await api.post('/vaccinations', vaccinationData);
        return response.data;
    },

    getVaccinationRecords: async (studentId = null, driveId = null) => {
        const params = {};
        if (studentId) params.student_id = studentId;
        if (driveId) params.drive_id = driveId;

        const response = await api.get('/vaccinations', { params });
        return response.data;
    },

    deleteVaccinationRecord: async (id) => {
        const response = await api.delete(`/vaccinations/${id}`);
        return response.data;
    },
};

export default vaccinationService;
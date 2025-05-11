import api from './api';

const reportService = {
    getVaccinationReport: async (filters = {}) => {
        const response = await api.get('/reports/vaccinations', { params: filters });
        return response.data;
    },

    downloadVaccinationReport: async (filters = {}) => {
        const response = await api.get('/reports/vaccinations', {
            params: { ...filters, download: true },
            responseType: 'blob',
        });

        // Create a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'vaccination_report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    getVaccinesList: async () => {
        const response = await api.get('/reports/vaccines');
        return response.data;
    },

    getClassesList: async () => {
        const response = await api.get('/reports/classes');
        return response.data;
    },
};

export default reportService;
import api from './api';

const studentService = {
    getStudents: async (page = 1, perPage = 10, search = '') => {
        const response = await api.get('/students', {
            params: { page, per_page: perPage, search },
        });
        return response.data;
    },

    getStudent: async (id) => {
        const response = await api.get(`/students/${id}`);
        return response.data;
    },

    createStudent: async (studentData) => {
        const response = await api.post('/students', studentData);
        return response.data;
    },

    updateStudent: async (id, studentData) => {
        const response = await api.put(`/students/${id}`, studentData);
        return response.data;
    },

    deleteStudent: async (id) => {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    },

    bulkImport: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/students/bulk', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default studentService;
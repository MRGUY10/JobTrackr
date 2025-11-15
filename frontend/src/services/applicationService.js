import api from './api';

const applicationService = {
  // Get all applications with optional filters
  getApplications: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.company) params.append('company', filters.company);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.order) params.append('order', filters.order);
    if (filters.page) params.append('page', filters.page);
    
    const response = await api.get(`/applications?${params.toString()}`);
    return response.data;
  },

  // Get a single application
  getApplication: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Create a new application
  createApplication: async (data) => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  // Update an application
  updateApplication: async (id, data) => {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  },

  // Delete an application
  deleteApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};

export default applicationService;

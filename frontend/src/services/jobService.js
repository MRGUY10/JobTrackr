import api from './api';

const jobService = {
  // Admin: Get all job postings
  getJobPostings: async () => {
    const response = await api.get('/admin/job-postings');
    return response.data;
  },

  // Admin: Create job posting
  createJobPosting: async (jobData) => {
    const response = await api.post('/admin/job-postings', jobData);
    return response.data;
  },

  // Admin: Update job posting
  updateJobPosting: async (id, jobData) => {
    const response = await api.put(`/admin/job-postings/${id}`, jobData);
    return response.data;
  },

  // Admin: Delete job posting
  deleteJobPosting: async (id) => {
    const response = await api.delete(`/admin/job-postings/${id}`);
    return response.data;
  },
};

export default jobService;

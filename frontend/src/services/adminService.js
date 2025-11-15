import api from './api';

/**
 * Get admin dashboard statistics
 * @returns {Promise} Admin dashboard data
 */
export const getDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

/**
 * Get all users (admin only)
 * @returns {Promise} List of all users
 */
export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

/**
 * Get all applications (admin only)
 * @returns {Promise} List of all applications
 */
export const getApplications = async () => {
  const response = await api.get('/admin/applications');
  return response.data;
};

export default {
  getDashboard,
  getUsers,
  getApplications,
};

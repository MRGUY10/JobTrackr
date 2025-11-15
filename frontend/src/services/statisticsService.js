import api from './api';

/**
 * Get overview statistics
 * @returns {Promise} Overview stats
 */
export const getOverview = async () => {
  const response = await api.get('/stats/overview');
  return response.data;
};

/**
 * Get monthly statistics
 * @param {number} year - The year to filter by
 * @returns {Promise} Monthly stats
 */
export const getMonthly = async (year = new Date().getFullYear()) => {
  const response = await api.get('/stats/monthly', {
    params: { year }
  });
  return response.data;
};

/**
 * Get statistics by status
 * @returns {Promise} Status breakdown
 */
export const getByStatus = async () => {
  const response = await api.get('/stats/by-status');
  return response.data;
};

/**
 * Get top companies
 * @param {number} limit - Number of companies to return
 * @returns {Promise} Top companies list
 */
export const getTopCompanies = async (limit = 10) => {
  const response = await api.get('/stats/top-companies', {
    params: { limit }
  });
  return response.data;
};

/**
 * Get recent activity
 * @param {number} days - Number of days to look back
 * @returns {Promise} Recent activity data
 */
export const getRecentActivity = async (days = 30) => {
  const response = await api.get('/stats/recent-activity', {
    params: { days }
  });
  return response.data;
};

export default {
  getOverview,
  getMonthly,
  getByStatus,
  getTopCompanies,
  getRecentActivity,
};

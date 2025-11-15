import api from './api';

const authService = {
  // Get CSRF token (required for Sanctum)
  async getCsrfToken() {
    try {
      // CSRF cookie endpoint is on the main domain, not /api
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  },

  // Login
  async login(credentials) {
    await this.getCsrfToken();
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
      remember: credentials.remember,
    });
    return response.data;
  },

  // Register
  async register(userData) {
    await this.getCsrfToken();
    const response = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password_confirmation,
    });
    return response.data;
  },

  // Logout
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  async getUser() {
    const response = await api.get('/auth/user');
    return response.data;
  },

  // Forgot password
  async forgotPassword(email) {
    await this.getCsrfToken();
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  async resetPassword(data) {
    await this.getCsrfToken();
    const response = await api.post('/auth/reset-password', {
      token: data.token,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
    return response.data;
  },
};

export default authService;

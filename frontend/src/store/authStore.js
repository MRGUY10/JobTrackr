import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(credentials);
      
      // Backend returns access_token, not token
      const token = data.access_token || data.token;
      
      // Store token and user
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({
        user: data.user,
        token: token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(userData);
      
      // Check if email verification is required
      if (data.requires_verification) {
        set({ isLoading: false });
        return { success: true, data };
      }
      
      // Backend returns access_token, not token
      const token = data.access_token || data.token;
      
      // Store token and user
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({
        user: data.user,
        token: token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Logout action
  logout: async () => {
    try {
      // Only call API if we have a token
      const token = localStorage.getItem('auth_token');
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout API error (continuing anyway):', error);
      // Continue with logout even if API call fails
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Fetch current user
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const data = await authService.getUser();
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      // If fetch fails, clear auth state
      get().logout();
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;

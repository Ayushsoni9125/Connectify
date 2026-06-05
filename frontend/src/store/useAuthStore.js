import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoading: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      // Try getting current user from the search endpoint with empty query
      // We store user in localStorage as a fallback
      const stored = localStorage.getItem('connectify_user');
      if (stored) {
        set({ authUser: JSON.parse(stored), isCheckingAuth: false });
      } else {
        set({ authUser: null, isCheckingAuth: false });
      }
    } catch {
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  register: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axios.post('/api/auth/register', formData, { withCredentials: true });
      const user = res.data.user;
      localStorage.setItem('connectify_user', JSON.stringify(user));
      set({ authUser: user, isLoading: false });
      toast.success('Welcome to Connectify! 🎉');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      set({ isLoading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
      const user = res.data.user;
      localStorage.setItem('connectify_user', JSON.stringify(user));
      set({ authUser: user, isLoading: false });
      toast.success(`Welcome back, ${user.fullname}! 👋`);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch {}
    localStorage.removeItem('connectify_user');
    set({ authUser: null });
    toast.success('Logged out successfully');
  },
}));

export default useAuthStore;

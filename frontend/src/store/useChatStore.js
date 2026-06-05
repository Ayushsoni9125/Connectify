import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const isProd = import.meta.env.PROD;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const api = (path) => (isProd ? `${BACKEND_URL}${path}` : path);

const useChatStore = create((set, get) => ({
  selectedUser: null,
  messages: [],
  users: [],
  chatters: [],
  isLoadingMessages: false,
  isLoadingUsers: false,
  isSending: false,
  searchQuery: '',

  setSelectedUser: (user) => set({ selectedUser: user, messages: [] }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  searchUsers: async (query) => {
    set({ isLoadingUsers: true });
    try {
      const res = await axios.get(api(`/api/user/search?search=${query}`), { withCredentials: true });
      set({ users: res.data, isLoadingUsers: false });
    } catch {
      set({ isLoadingUsers: false });
    }
  },

  fetchChatters: async () => {
    try {
      const res = await axios.get(api('/api/user/currentchatters'), { withCredentials: true });
      set({ chatters: res.data });
    } catch {}
  },

  fetchMessages: async (receiverId) => {
    set({ isLoadingMessages: true });
    try {
      const res = await axios.get(api(`/api/message/${receiverId}`), { withCredentials: true });
      set({ messages: res.data, isLoadingMessages: false });
    } catch {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (receiverId, message) => {
    set({ isSending: true });
    try {
      const res = await axios.post(
        api(`/api/message/send/${receiverId}`),
        { message },
        { withCredentials: true }
      );
      set((state) => ({
        messages: [...state.messages, res.data],
        isSending: false,
      }));
      get().fetchChatters();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message';
      toast.error(msg);
      set({ isSending: false });
      return false;
    }
  },
}));

export default useChatStore;

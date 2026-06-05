import { create } from 'zustand';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: (userId) => {
    if (get().socket?.connected) return;

    const socket = io(BACKEND_URL, {
      query: { userId },
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
    }
    set({ socket: null, onlineUsers: [] });
  },
}));

export default useSocketStore;

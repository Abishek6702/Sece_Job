import { io } from "socket.io-client";

export const initSocket = (userId) => {
  const socket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
    query: { userId },
    reconnection: true,
    reconnectionDelay: 1000,
  });
  
  return socket;
};

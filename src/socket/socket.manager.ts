// socket.service.ts
import { createSocket } from './socket.instance';

export const initSocket = () => {
  const socket = createSocket();
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  const socket = createSocket();
  socket.disconnect();
};

export const getSocket = () => createSocket();

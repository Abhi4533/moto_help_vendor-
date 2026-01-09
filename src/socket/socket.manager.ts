import { createSocket } from './socket.instance';

export const initSocket = (VendorID: string) => {
  const socket = createSocket();
  // socket.auth = { VendorID };
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  const socket = createSocket();
  socket.disconnect();
};

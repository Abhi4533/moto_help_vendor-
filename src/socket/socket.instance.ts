// socket.instance.ts
import { ENV } from '@config/env';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const createSocket = () => {
  if (!socket) {
    socket = io(ENV.SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      autoConnect: false,
    });

    socket.on('connect', () => console.log('🔗 Connected:', socket?.id));
    socket.on('disconnect', r => console.log('❌ Disconnected:', r));
    socket.on('connect_error', e =>
      console.log('⚠️ Connect error:', e.message),
    );
    socket.on('reconnect_attempt', a =>
      console.log('♻️ Reconnect attempt:', a),
    );
  }

  return socket;
};

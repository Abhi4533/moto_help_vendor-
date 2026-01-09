import { SOCKET_EVENTS } from './socket.events';
import { getSocket } from './socket.service';

export const emitJoinVendor = (payload: string) => {
  const socket = getSocket();
  console.log({ socket });
  if (!socket.connected) return;
  console.log({
    userId: payload,
    role: 'vendor',
  });
  socket.emit(SOCKET_EVENTS.JOIN, {
    userId: payload,
    role: 'vendor',
  });
};

export const emitVenderIdDriverId = (payload: any) => {
  const socket = getSocket();
  if (!socket.connected) return;

  socket.emit(SOCKET_EVENTS.DRIVER_LP_DETAILS, payload);
};

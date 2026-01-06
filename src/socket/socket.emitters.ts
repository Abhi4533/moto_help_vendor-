import { SOCKET_EVENTS } from './socket.events';
import { getSocket } from './socket.service';

// export const emitDriverLocation = (payload: any) => {
//   const socket = getSocket();
//   console.log({ socket, payload });
//   if (!socket.connected) return;

//   socket.emit(SOCKET_EVENTS.DRIVER_LOCATION, payload);
// };

export const emitVenderIdDriverId = (payload: any) => {
  const socket = getSocket();
  console.log({ socket, payload });
  if (!socket.connected) return;

  socket.emit(SOCKET_EVENTS.DRIVER_LP_DETAILS, payload);
};

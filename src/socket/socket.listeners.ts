import { SOCKET_EVENTS } from './socket.events';
import { getSocket } from './socket.service';

let registered = false;

export const registerSocketListeners = () => {
  if (registered) return;
  registered = true;

  const socket = getSocket();

  socket.on(SOCKET_EVENTS.DRIVERS_LIVE_LOCATION, status => {
    console.log('🟢 Driver Live Status:', status);
    // store.dispatch(setTripStatus(status?.Driver_LPStatus?.Driver_LPStatus));
  });
};

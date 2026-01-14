// socket.listeners.ts
import { SOCKET_EVENTS } from './socket.events';
import { getSocket } from './socket.service';

let attached = false;

export const registerSocketListeners = () => {
  if (attached) return;
  const socket = getSocket();

  const handler = () => {
    if (attached) return;
    attached = true;

    console.log('🟢 Listeners attached');

    socket.on(SOCKET_EVENTS.DRIVER_LOCATION, loads => {
      console.log('📦 DRIVER_LOCATION:', loads);
      // store.dispatch(setCustomerLocations(loads));
    });

    socket.on(SOCKET_EVENTS.DRIVER_STATUS, loads => {
      console.log('📦 DRIVER_STATUS:', loads);
      // store.dispatch(setCustomerLocations(loads));
    });
    socket.on(SOCKET_EVENTS.GET_DRIVERS, loads => {
      console.log('📦 GET_DRIVERS:', loads);
      // store.dispatch(setCustomerLocations(loads));
    });
    socket.on(SOCKET_EVENTS.NEARBY_LOADS, loads => {
      console.log('📦 NEARBY_LOADS:', loads);
      // store.dispatch(setCustomerLocations(loads));
    });
    socket.on(SOCKET_EVENTS.DRIVER_ASSIGNED, loads => {
      console.log('📦 DRIVER_ASSIGNED:', loads);
      // store.dispatch(setCustomerLocations(loads));
    });
    // socket.on(SOCKET_EVENTS.NEW_LOAD, load => {
    //   console.log('🆕 New Load:', load);
    //   store.dispatch(setCustomerLocations([load]));
    // });
  };

  socket.connected ? handler() : socket.once('connect', handler);
};

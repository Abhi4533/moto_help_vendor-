// socket.listeners.ts
import { store } from '@store/index';
import { SOCKET_EVENTS } from './socket.events';
import { getSocket } from './socket.service';
import { setDestinationLocation, setDriverLocations, setLiveDriverLocation } from '@store/slices/mapSlice';

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
      store.dispatch(setLiveDriverLocation(loads));
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

    socket.on(SOCKET_EVENTS.DRIVER_LIST, loads => {
      console.log('📦 DRIVER_LIST:', loads);

      store.dispatch(setDriverLocations(loads));
    });

    socket.on(SOCKET_EVENTS.DRIVER_LP_UPDATE, loads => {loads

      console.log('📦 DRIVER_LP_UPDATE:', loads);
      // store.dispatch(setCustomerLocations(loads));
    });

      socket.on("vendor:selectd_driver_loads", loads => {

      console.log('📦 selected drivers loads:', loads);
      // store.dispatch(setCustomerLocations(loads));
    });
    // socket.on(SOCKET_EVENTS.NEW_LOAD, load => {
    //   console.log('🆕 New Load:', load);
    //   store.dispatch(setCustomerLocations([load]));
    // });
  };

  socket.connected ? handler() : socket.once('connect', handler);
};

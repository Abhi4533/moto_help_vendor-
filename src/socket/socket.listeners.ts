// socket.listeners.ts
import { store } from '@store/index';
import { setCustomerLods, setLiveDriverLocation } from '@store/slices/mapSlice';
import { getBearing } from '@utils/locationUtils';
import { SOCKET_EVENTS } from './socket.events';
import { getSocket } from './socket.service';

let attached = false;
const ICON_FIX = 180;
let prevLocation: any = { latitude: 0, longitude: 0 };
export const registerSocketListeners = () => {
  if (attached) return;
  const socket = getSocket();

  const handler = () => {
    if (attached) return;
    attached = true;

    console.log('🟢 Listeners attached');

    socket.on(SOCKET_EVENTS.DRIVER_LOCATION, drivers => {
      // let direction = 0;
      // console.log('📦 DRIVER_LOCATION:', drivers);

      // if (prevLocation) {
      //   direction = getBearing(
      //     prevLocation.latitude,
      //     prevLocation.longitude,
      //     Number(drivers?.lat),
      //     Number(drivers?.lng),
      //   );
      // }

      // prevLocation = {
      //   latitude: Number(drivers?.lat),
      //   longitude: Number(drivers?.lng),
      // };

      // store.dispatch(
      //   setLiveDriverLocation({
      //     latitude: Number(drivers?.lat),
      //     longitude: Number(drivers?.lng),
      //     rotation: (direction + ICON_FIX) % 360,
      //   }),
      // );
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
      store.dispatch(setCustomerLods(loads));
    });
    socket.on(SOCKET_EVENTS.DRIVER_ASSIGNED, loads => {
      console.log('📦 DRIVER_ASSIGNED:', loads);
      // store.dispatch(setCustomerLocations(loads));
    });

    socket.on(SOCKET_EVENTS.DRIVER_LIST, loads => {
      console.log('📦 DRIVER_LIST:', loads);
      // store.dispatch(setDriverLocations(loads));
    });

    socket.on(SOCKET_EVENTS.DRIVER_LP_UPDATE, loads => {
      console.log('📦 DRIVER_LP_UPDATE:', loads);
      // store.dispatch(setCustomerLocations(loads));
    });

    socket.on(SOCKET_EVENTS.SELECTED_DRIVER_NEARBY_LOADS, loads => {
      console.log('📦 SELECTED_DRIVER_NEARBY_LOADS', loads);
      store.dispatch(setCustomerLods(loads?.loads));
    });
    socket.on('vendor:driver_live_location', data => {
    let direction = 0;
    console.log('📦 vendor:driver_live_location:', data);

    if (prevLocation) {
      direction = getBearing(
        prevLocation.latitude,
        prevLocation.longitude,
        Number(data?.lat),
        Number(data?.lng),
      );
    }

    prevLocation = {
      latitude: Number(data?.lat),
      longitude: Number(data?.lng),
    };

    store.dispatch(
      setLiveDriverLocation({
        latitude: Number(data?.lat),
        longitude: Number(data?.lng),
        rotation: (direction + ICON_FIX) % 360,
      }),
    );
    console.log('🚚 Driver Live Location:', data);

    /*
    {
      DriverID,
      lat,
      lng,
      Status
    }
  */

    // map.updateMarker(data.DriverID, data.lat, data.lng)
  });
  };

  socket.connected ? handler() : socket.once('connect', handler);
};

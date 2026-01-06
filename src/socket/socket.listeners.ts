// import { store } from '@store/index';
// import { setTripStatus } from '@store/slices/authSlice';
// import { SOCKET_EVENTS } from './socket.events';
// import { getSocket } from './socket.service';

// let registered = false;

// export const registerSocketListeners = () => {
//   if (registered) return;
//   registered = true;

//   const socket = getSocket();

//   socket.on(SOCKET_EVENTS.DRIVER_LP_STATUS, status => {
//     console.log('🟢 Driver LP Status:', status);
//     store.dispatch(setTripStatus(status?.Driver_LPStatus?.Driver_LPStatus));
//   });
// };

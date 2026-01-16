// socket.emitters.ts
import { SOCKET_EVENTS } from './socket.events';
import { getSocket } from './socket.service';

export const emitVendorJoin = (vendorId: string) => {
  const socket = getSocket();
  const emit = () => socket.emit(SOCKET_EVENTS.JOIN, { VendorID: vendorId });

  socket.connected ? emit() : socket.once('connect', emit);
};

export const emitGetVendorLocations = (payload: {
  VendorID: string;
  lat: number;
  lng: number;
}) => {
  console.log({ payload });
  const socket = getSocket();
  const emit = () => socket.emit(SOCKET_EVENTS.GET_LIVE_DRIVERS, payload);

  socket.connected ? emit() : socket.once('connect', emit);
};

export const emitDriverLoadPost = (payload: {
  VendorID: string;
  DriverID: string;
  Driver_LPStatus: string;
}) => {
  const socket = getSocket();
  const emit = () => socket.emit(SOCKET_EVENTS.UPDATE_LP_STATUS, payload);

  socket.connected ? emit() : socket.once('connect', emit);
};

export const emitDriverSelect = (payload: {
 
  DriverID: string;
 
}) => {
  console.log({payload})
  const socket = getSocket();
  const emit = () => socket.emit(SOCKET_EVENTS.SELECT_DRIVER, payload);

  socket.connected ? emit() : socket.once('connect', emit);
};

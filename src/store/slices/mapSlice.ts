// src/store/slices/mapSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapState {
  vendorLocation: Coordinate | null;
  pickupLocation: Coordinate | null;
  destinationLocation: Coordinate | null;
  liveDriverLocation: Coordinate | null;
  routePath: Coordinate[];
  driverLocations: Coordinate[];
  customerLocations: Coordinate[];
}

const initialState: MapState = {
  vendorLocation: null,
  pickupLocation: null,
  destinationLocation: null,
  liveDriverLocation: null,
  driverLocations: [],
  customerLocations: [],
  routePath: [],
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setVendorLocation(state, action: PayloadAction<Coordinate>) {
      state.vendorLocation = action.payload;
    },
    setDriverLocations(state, action: PayloadAction<Coordinate[]>) {
      state.driverLocations = action.payload;
    },
    setCustomerLocations(state, action: PayloadAction<Coordinate[]>) {
      state.customerLocations = action.payload;
    },
    setPickupLocation(state, action: PayloadAction<Coordinate>) {
      state.pickupLocation = action.payload;
    },
    setDestinationLocation(state, action: PayloadAction<Coordinate>) {
      state.destinationLocation = action.payload;
    },
    setRoutePath(state, action: PayloadAction<Coordinate[]>) {
      state.routePath = action.payload;
    },
    setLiveDriverLocation(state, action: PayloadAction<Coordinate>) {
      state.liveDriverLocation = action.payload;
    },

    setVenderAndNerbyDrivers(
      state,
      action: PayloadAction<{ vender: Coordinate; drivers: Coordinate[] }>,
    ) {
      state.vendorLocation = action.payload.vender;
      state.driverLocations = action.payload.drivers;
    },
    setDriverAndCustomerLocations(
      state,
      action: PayloadAction<{ driver: Coordinate; customers: Coordinate[] }>,
    ) {
      state.liveDriverLocation = action.payload.driver;
      state.customerLocations = action.payload.customers;
    },
    setDriverAndPickupLocations(
      state,
      action: PayloadAction<{ driver: Coordinate; pickup: Coordinate }>,
    ) {
      state.liveDriverLocation = action.payload.driver;
      state.pickupLocation = action.payload.pickup;
    },
    setDriverPickupAndDestinationLocations(
      state,
      action: PayloadAction<{
        driver: Coordinate;
        pickup: Coordinate;
        destination: Coordinate;
      }>,
    ) {
      state.liveDriverLocation = action.payload.driver;
      state.pickupLocation = action.payload.pickup;
      state.destinationLocation = action.payload.destination;
    },

    clearMapData(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setVendorLocation,
  setDriverLocations,
  setCustomerLocations,
  setPickupLocation,
  setDestinationLocation,
  setRoutePath,
  clearMapData,
  setLiveDriverLocation,
  setVenderAndNerbyDrivers,
  setDriverAndCustomerLocations,
  setDriverAndPickupLocations,
  setDriverPickupAndDestinationLocations,
} = mapSlice.actions;

export default mapSlice.reducer;

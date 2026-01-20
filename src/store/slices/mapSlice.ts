// src/store/slices/mapSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Coordinate {
  latitude: number;
  longitude: number;
  rotation: number;
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

// const initialState: MapState = {
//   vendorLocation: {
//     latitude: 19.076, // Mumbai
//     longitude: 72.8777,
//     rotation: 0,
//   },

//   pickupLocation: {
//     latitude: 19.0825, // Andheri East
//     longitude: 72.8811,
//     rotation: 0,
//   },

//   destinationLocation: {
//     latitude: 19.2183, // Borivali
//     longitude: 72.9781,
//     rotation: 0,
//   },

//   liveDriverLocation: {
//     latitude: 19.0902, // Near Bandra
//     longitude: 72.8687,
//     rotation: 45,
//   },

//   driverLocations: [
//     {
//       latitude: 19.088,
//       longitude: 72.8679,
//       rotation: 0,
//     },
//     {
//       latitude: 19.0925,
//       longitude: 72.8702,
//       rotation: 90,
//     },
//   ],

//   customerLocations: [
//     {
//       latitude: 19.085,
//       longitude: 72.88,
//       rotation: 0,
//     },
//     {
//       latitude: 19.095,
//       longitude: 72.875,
//       rotation: 0,
//     },
//   ],

//   routePath: [
//     {
//       latitude: 19.076,
//       longitude: 72.8777,
//       rotation: 0,
//     },
//     {
//       latitude: 19.0825,
//       longitude: 72.8811,
//       rotation: 0,
//     },
//     {
//       latitude: 19.0902,
//       longitude: 72.8687,
//       rotation: 0,
//     },
//     {
//       latitude: 19.2183,
//       longitude: 72.9781,
//       rotation: 0,
//     },
//   ],
// };

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setVendorLocation(state, action: PayloadAction<Coordinate>) {
      state.vendorLocation = action.payload;
    },
    setDriverLocations(state, action: PayloadAction<any[]>) {
      state.driverLocations = action.payload?.map(Item => {
        return {
          latitude: Number(Item?.lat),
          longitude: Number(Item?.lng),
          rotation: 0,
        };
      });
    },
    setCustomerLocations(state, action: PayloadAction<Coordinate[]>) {
      state.customerLocations = action.payload;
    },
    setCustomerLods(state, action: PayloadAction<any[]>) {
      state.customerLocations = action.payload?.map(item => {
        return {
          latitude: Number(item?.lat),
          longitude: Number(item?.lng),
          rotation: 0,
        };
      });
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
      state = initialState;
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
  setCustomerLods,
} = mapSlice.actions;

export default mapSlice.reducer;

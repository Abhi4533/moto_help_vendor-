// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import api from '../api/hooks_api';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import driverReducer from './slices/driverSlice';
import kycReducer from './slices/kycSlice';
import mapReducer from './slices/mapSlice';
import tripReducer from './slices/tripSlice';
import validatedVehiclesReducer from './slices/validatedVehiclesSlice';
import vehicleReducer from './slices/vehicleSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  vehicle: vehicleReducer,
  driver: driverReducer,
  trip: tripReducer,
  app: appReducer,
  kyc: kycReducer,
  map: mapReducer,
  validatedVehicles: validatedVehiclesReducer,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;

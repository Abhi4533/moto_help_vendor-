import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VehicleState {
  vehicles: any[];
  selectedVehicle: any | null;
}

const initialState: VehicleState = {
  vehicles: [],
  selectedVehicle: null,
};

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<any[]>) => {
      state.vehicles = action.payload;
    },
    setSelectedVehicle: (state, action: PayloadAction<any>) => {
      state.selectedVehicle = action.payload;
    },
  },
});

export const { setVehicles, setSelectedVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;

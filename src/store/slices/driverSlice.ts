import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DriverState {
  drivers: any[];
}

const initialState: DriverState = {
  drivers: [],
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setDrivers: (state, action: PayloadAction<any[]>) => {
      state.drivers = action.payload;
    },
  },
});

export const { setDrivers } = driverSlice.actions;
export default driverSlice.reducer;

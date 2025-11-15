import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TripState {
  trips: any[];
}

const initialState: TripState = {
  trips: [],
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTrips: (state, action: PayloadAction<any[]>) => {
      state.trips = action.payload;
    },
  },
});

export const { setTrips } = tripSlice.actions;
export default tripSlice.reducer;

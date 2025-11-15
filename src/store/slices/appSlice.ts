import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  loading: boolean;
  networkConnected: boolean;
}

const initialState: AppState = {
  loading: false,
  networkConnected: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setNetworkState: (state, action: PayloadAction<boolean>) => {
      state.networkConnected = action.payload;
    },
  },
});

export const { setLoading, setNetworkState } = appSlice.actions;
export default appSlice.reducer;

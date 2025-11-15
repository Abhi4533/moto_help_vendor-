import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  kycStatus: 'PENDING' | 'COMPLETED';
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  kycStatus: 'PENDING',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.kycStatus = 'PENDING';
    },
    setKycStatus(state, action: PayloadAction<'PENDING' | 'COMPLETED'>) {
      state.kycStatus = action.payload;
    },
  },
});

export const { loginSuccess, logout, setKycStatus } = authSlice.actions;
export default authSlice.reducer;

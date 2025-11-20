// store/slices/validatedVehiclesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ValidationStatus = 'pending' | 'success' | 'failed';
export type FailureReason =
  | 'invalid_rc_number'
  | 'vehicle_type_not_supported'
  | 'unknown_error'
  | null;

export interface ValidationResult {
  vehicleNumber: string;
  status: ValidationStatus;
  failureReason?: FailureReason;
  validatedAt?: string;
}

interface ValidatedState {
  validationResults: ValidationResult[];
}

const initialState: ValidatedState = {
  validationResults: [],
};

const validatedVehiclesSlice = createSlice({
  name: 'validatedVehicles',
  initialState,
  reducers: {
    updateValidationStatus: (
      state,
      action: PayloadAction<{
        vehicleNumber: string;
        status: ValidationStatus;
        failureReason?: FailureReason;
      }>,
    ) => {
      const existingIndex = state.validationResults.findIndex(
        item => item.vehicleNumber === action.payload.vehicleNumber,
      );

      if (existingIndex >= 0) {
        state.validationResults[existingIndex] = {
          ...state.validationResults[existingIndex],
          ...action.payload,
          validatedAt:
            action.payload.status === 'success'
              ? new Date().toISOString()
              : undefined,
        };
      } else {
        state.validationResults.push({
          vehicleNumber: action.payload.vehicleNumber,
          status: action.payload.status,
          failureReason: action.payload.failureReason,
          validatedAt:
            action.payload.status === 'success'
              ? new Date().toISOString()
              : undefined,
        });
      }
    },
    resetValidated: state => {
      state.validationResults = [];
    },
  },
});

export const { updateValidationStatus, resetValidated } =
  validatedVehiclesSlice.actions;
export default validatedVehiclesSlice.reducer;

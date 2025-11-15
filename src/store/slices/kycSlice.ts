// slices/kycSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type KycStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'REJECTED'
  | 'APPROVED';

interface DocumentInfo {
  type: string;
  number: string;
  frontImage: string | null;
  backImage?: string | null;
}

interface KycState {
  status: KycStatus;
  personalDetails: {
    name: string;
    dob: string;
    gender: string;
    address: string;
    pincode: string;
  };
  documents: DocumentInfo[];
  isSubmitting: boolean;
}

const initialState: KycState = {
  status: 'NOT_STARTED',
  personalDetails: {
    name: '',
    dob: '',
    gender: '',
    address: '',
    pincode: '',
  },
  documents: [],
  isSubmitting: false,
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setKycStatus: (state, action: PayloadAction<KycStatus>) => {
      state.status = action.payload;
    },

    updatePersonalDetails: (
      state,
      action: PayloadAction<Partial<KycState['personalDetails']>>,
    ) => {
      state.personalDetails = { ...state.personalDetails, ...action.payload };
    },

    addDocument: (state, action: PayloadAction<DocumentInfo>) => {
      state.documents.push(action.payload);
    },

    updateDocument: (state, action: PayloadAction<DocumentInfo>) => {
      const index = state.documents.findIndex(
        d => d.type === action.payload.type,
      );
      if (index !== -1) {
        state.documents[index] = action.payload;
      }
    },

    removeDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(
        doc => doc.type !== action.payload,
      );
    },

    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },

    resetKyc: () => initialState,
  },
});

export const {
  setKycStatus,
  updatePersonalDetails,
  addDocument,
  updateDocument,
  removeDocument,
  setSubmitting,
  resetKyc,
} = kycSlice.actions;

export default kycSlice.reducer;

// src/api/endpoints/auth.api.ts
import apiClient from '../base';
import {
  ApiResponse,
  LoginRequest,
  ValidateOtpRequest,
  ValidateOtpResponse,
  VendorRegistrationRequest,
  VendorRegistrationResponse,
} from '../types/auth.types';

export const login = async (payload: LoginRequest): Promise<ApiResponse> => {
  const response = await apiClient.post('/sendOTP', payload);
  return response.data;
};

export const verifyOTP = async (
  payload: ValidateOtpRequest,
): Promise<ValidateOtpResponse> => {
  const response = await apiClient.post(`/validateOTP`, payload);
  return response.data;
};

export const register = async (
  payload: VendorRegistrationRequest,
): Promise<VendorRegistrationResponse> => {
  const response = await apiClient.post('/VendorOnboarding', payload);
  console.log({ response });
  return response.data;
};

// src/api/types/auth.types.ts

export enum ApiStatus {
  SUCCESS = '00',
  FAILURE = '01',
  UNAUTHORIZED = '02',
}
export interface ApiResponse {
  status: ApiStatus;
  message: string;
}

export interface LoginRequest {
  mobile_number: string;
}

export type ValidateOtpRequest = {
  mobile_number: string;
  otp: string;
};

export interface UserState {
  vendorid: string;
  companyType: string;
  companyName: string;
  owner_name: string;
  mobileNo: string;
  address1: string;
  address2: string;
  landMark: string;
  pincode: string;
  state: string;
  Tahsil: string;
  role: string;
  status: string;
  vendor_onboarded: boolean;
  kyc_verify: boolean;
  flag: string;
  isLogin?: boolean;
  token?: string | boolean;
}

export interface ValidateOtpResponse extends ApiResponse {
  userDetails: UserState;
}

export interface VendorDetails {
  companyType: string;
  companyName: string;
  owner_name: string;
  address1: string;
  address2: string;
  landMark: string;
  mobileNo: string;
  pincode: string;
  destination: string;
  Tahsil: string;
  state: string;
  City: string;
  vehicle_count: string;
  employee_count: string;
}

export interface VendorEmployeeDetails {
  full_name: string;
  designation: string;
  contact_No: string;
  alternate_No: string;
  emailAddress: string;
  website: string;
  username: string;
  password: string;
  customDesignation?: string;
}

export interface VehicleDetails {
  vehicle_number: string;
}

export interface KycDetails {
  gstNo: string;
  cinNo: string;
  panNo: string;
  aadharNo: string;
}

export interface VendorRegistrationRequest {
  VendorDetails: VendorDetails;
  VendorEmployeeDetails: VendorEmployeeDetails[];
  VehicleDetails: VehicleDetails[];
  kycDetails: KycDetails;
}

export interface VendorRegistrationResponse extends ApiResponse {
  userDetails: UserState;
}

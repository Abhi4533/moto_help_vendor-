import { ApiResponse } from './auth.types';

export interface PincodeData {
  Name: string;
  Description: string | null;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
}

export interface PincodeResponse extends ApiResponse {
  data: PincodeData;
}

export interface PincodeRequest {
  pincode: string;
}

export interface StateData {
  state: string;
}

export interface StateResponse extends ApiResponse {
  data: StateData[];
}

export interface DistrictData {
  district: string;
}

export interface DistrictResponse extends ApiResponse {
  data: DistrictData[];
}
export interface DistrictRequest {
  state: string;
}

export interface GSTVerificationRequest {
  gstin_number: string;
}
export interface Address {
  bnm: string;
  st: string;
  loc: string;
  bno: string;
  dst: string;
  lt: string;
  locality: string;
  pncd: string;
  landMark: string;
  stcd: string;
  geocodelvl: string;
  flno: string;
  lg: string;
}

export interface PrincipalAddress {
  addr: Address;
  ntr: string;
}

export interface GSTData {
  stjCd: string;
  stj: string;
  lgnm: string;
  dty: string;
  adadr: any[];
  cxdt: string;
  gstin: string;
  nba: string[];
  lstupdt: string;
  rgdt: string;
  ctb: string;
  pradr: PrincipalAddress;
  sts: string;
  ctjCd: string;
  tradeNam: string;
  ctj: string;
  einvoiceStatus: string;
}

export interface GSTVerificationResponse extends ApiResponse {
  data: GSTData;
}

// verify pan
interface NameInformation {
  pan_name_cleaned: string;
}

export interface PANData {
  '@entity': string;
  pan: string;
  full_name: string;
  status: string;
  category: string;
  name_information: NameInformation;
}

export interface PANVerificationResponse extends ApiResponse {
  data: PANData;
}
export interface PANVerificationRequest {
  pan_number: string;
}

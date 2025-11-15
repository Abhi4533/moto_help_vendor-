import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '../config/env';
import {
  DistrictRequest,
  DistrictResponse,
  GSTVerificationRequest,
  GSTVerificationResponse,
  PANVerificationRequest,
  PANVerificationResponse,
  PincodeRequest,
  PincodeResponse,
  StateResponse,
} from './types/hooks.type';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_URL,
  }),
  endpoints: builder => ({
    getAddressByPin: builder.mutation<PincodeResponse, PincodeRequest>({
      query: queryArg => ({
        url: `/pincode`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    getState: builder.query<StateResponse, void>({
      query: () => ({
        url: '/get_state_region_district',
        method: 'POST',
        // body: queryArg,
      }),
    }),
    getDistrict: builder.query<DistrictResponse, DistrictRequest>({
      query: queryArg => ({
        url: '/get_state_district_block',
        method: 'POST',
        body: queryArg,
      }),
    }),
    getTaluka: builder.query<any, any>({
      query: body => ({
        url: '/get_state_district_block',
        method: 'POST',
        body,
      }),
    }),
    verifyGST: builder.mutation<
      GSTVerificationResponse,
      GSTVerificationRequest
    >({
      query: queryArg => ({
        url: '/GST',
        method: 'POST',
        body: queryArg,
      }),
    }),
    verifyPAN: builder.mutation<
      PANVerificationResponse,
      PANVerificationRequest
    >({
      query: queryArg => ({
        url: '/pancard',
        method: 'POST',
        body: queryArg,
      }),
    }),
  }),
});

export const {
  useGetAddressByPinMutation,
  useGetDistrictQuery,
  useGetStateQuery,
  useGetTalukaQuery,
  useVerifyGSTMutation,
  useVerifyPANMutation,
} = api;

export default api;

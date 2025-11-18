import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '../config/env';
import {
  DistrictData,
  DistrictRequest,
  GSTVerificationRequest,
  GSTVerificationResponse,
  PANVerificationRequest,
  PANVerificationResponse,
  PincodeRequest,
  PincodeResponse,
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
    getState: builder.query<
      {
        status: string;
        message: string;
        data: { label: string; value: string }[];
      },
      void
    >({
      query: () => ({
        url: '/get_state_region_district',
        method: 'POST',
      }),
      transformResponse: (response: {
        status: string;
        message: string;
        data: { state: string }[];
      }) => {
        return {
          ...response,
          data: response.data
            .filter(item => item.state && item.state !== 'NA') // optional: remove invalid entries
            .map(item => ({
              label: item.state.trim(),
              value: item.state.trim(), // or use a code if you have one later
            })),
        };
      },
    }),
    getDistrict: builder.query<
      {
        status: string;
        message: string;
        data: { label: string; value: string }[];
      },
      DistrictRequest
    >({
      query: queryArg => ({
        url: '/get_state_district_block',
        method: 'POST',
        body: queryArg,
      }),
      transformResponse: (response: {
        status: string;
        message: string;
        data: DistrictData[];
      }) => {
        return {
          ...response,
          data: response.data
            .filter(item => item?.district && item?.district !== 'NA') // optional: remove invalid entries
            .map(item => ({
              label: item?.district?.trim(),
              value: item?.district?.trim(), // or use a code if you have one later
            })),
        };
      },
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

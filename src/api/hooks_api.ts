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
    getDesignationList: builder.query<any, void>({
      query: queryArg => ({
        url: '/Designations',
        method: 'POST',
        body: queryArg,
      }),
      transformResponse: (response: {
        status: string;
        message: string;
        data: any[];
      }) => {
        return {
          ...response,
          data: response.data
            .filter(item => item?.Designation && item?.Designation !== 'NA') // optional: remove invalid entries
            .map(item => ({
              label: item?.Designation?.trim(),
              value: item?.Designation?.trim(), // or use a code if you have one later
            })),
        };
      },
    }),
    checkAlreadyExists: builder.mutation<
      any,
      {
        vendorid?: string;
        gstNo?: string;
        panNo?: string;
        aadharNo?: string;
        driving_license_no?: string;
        registration_no?: string;
      }
    >({
      query: queryArg => ({
        url: `/Vendor_KYC_Check`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    validateVehicle: builder.mutation<
      any,
      {
        rc_number: string;
      }
    >({
      query: queryArg => ({
        url: `/Vehicle`,
        method: 'POST',
        body: queryArg,
      }),
      transformResponse: (response: {
        status: string;
        message: string;
        data: any;
      }) => {
        const item = response?.data ?? {};

        return {
          ...response,
          data: {
            vendorid: '',
            vehicleid: '',
            vehicleDetails: {
              registrationNo: item?.rc_number || '',
              registrationDate: item?.registration_date || '',
              registeredAt: item?.registered_at || '',
              rcStatus: item?.rc_status || '',
              ownerName: item?.owner_name || '',
              fatherName: item?.father_name || '',
              presentAddress: item?.present_address || '',
              permanentAddress: item?.permanent_address || '',
              mobileNumber: item?.mobile_number || '',
              vehicleCategory: item?.vehicle_category || '',
              vehicleCategoryDescription:
                item?.vehicle_category_description || '',
              vehicleManufacturer: item?.maker_description || '',
              makerModel: item?.maker_model || '',
              bodyType: item?.body_type || '',
              fuelType: item?.fuel_type || '',
              manufacturingDate: item?.manufacturing_date || '',
              chassisNumber: item?.vehicle_chasi_number || '',
              engineNumber: item?.vehicle_engine_number || '',
              cubicCapacity: item?.cubic_capacity || 0,
              vehicleGrossWeight: item?.vehicle_gross_weight || 0,
              unladenWeight: item?.unladen_weight || 0,
              noCylinders: item?.no_cylinders || 0,
              seatCapacity: item?.seat_capacity || 0,
              fitUpto: item?.fit_up_to || '',
              insuranceUpto: item?.insurance_upto || '',
              taxUpto: item?.tax_upto || '',
              taxPaidUpto: item?.tax_paid_upto || '',
              puccNumber: item?.pucc_number || '',
              puccUpto: item?.pucc_upto || '',
              permitNumber: item?.permit_number || '',
              permitType: item?.permit_type || '',
              permitValidFrom: item?.permit_valid_from || '',
              permitValidUpto: item?.permit_valid_upto || '',
            },
            VehicleTypesDetails: {
              vehicleCategory: item?.vehicle_category_description || '',
              vehicleType: item?.vehicle_category || '',
              emptyVehicleWeight: parseFloat(item?.unladen_weight) || 0,
              loadingCapacityGVW: parseFloat(item?.vehicle_gross_weight) || 0,
              loadingCapacityCubic: item?.cubic_capacity || '',
              topRemovable: false,
            },
            vehiclePhotos: {
              photo_url: '',
            },
          },
        };
      },
    }),
    validateLicence: builder.mutation<any, any>({
      query: queryArg => ({
        url: '/DrivingLicense',
        method: 'POST',
        body: queryArg,
      }),
    }),
    validateBank: builder.mutation<any, any>({
      query: queryArg => ({
        url: '/vendor_Bank_kyc',
        method: 'POST',
        body: queryArg,
      }),
    }),
    nearestCustomerPosts: builder.mutation<
      any,
      {
        VendorID: string;
        vendorLat: number;
        vendorLng: number;
        radius: number;
      }
    >({
      query: queryArg => ({
        url: '/vendor_nearest_customer_postcard',
        method: 'POST',
        body: queryArg,
      }),
    }),
    getAssignedVehicles: builder.mutation<
      any,
      {
        VendorID: string;
        verify_flag?: 'Y' | 'N' | undefined;
      }
    >({
      query: queryArg => ({
        url: `/get_Driver_Vehicle_Assign`,
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
  useGetDesignationListQuery,
  useCheckAlreadyExistsMutation,
  useValidateVehicleMutation,
  useValidateLicenceMutation,
  useValidateBankMutation,
  useNearestCustomerPostsMutation,
  useGetAssignedVehiclesMutation,
} = api;

export default api;

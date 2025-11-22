import apiClient from '@api/base';

export const getVendorDetails = async (payload: {
  vendorid: any;
}): Promise<any> => {
  const response = await apiClient.post('/get_Vendor_Details', payload);
  return response.data;
};

export const postUpdateVendorDetails = async (payload: any): Promise<any> => {
  const response = await apiClient.post('/update_Vendor_Details', payload);
  return response.data;
};

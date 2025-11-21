import apiClient from '@api/base';

export const getVendorDetails = async (payload: {
  vendorid: any;
}): Promise<any> => {
  const response = await apiClient.post('/get_Vendor_Details', payload);
  return response.data;
};

import apiClient from '@api/base';

export const getNearbyCustomerPosts = async (payload: any): Promise<any> => {
  const response = await apiClient.post(
    '/vendor_nearest_customer_post',
    payload,
  );
  return response.data;
};

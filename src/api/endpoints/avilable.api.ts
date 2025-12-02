import apiClient from '@api/base';

export const avialbleVehicle = async (payload: any): Promise<any> => {
  const response = await apiClient.post('/Insert_driver_load_post', payload);
  return response.data;
};

export const getDriverInfoByMobile = async (payload: {
  MobileNo: String;
}): Promise<any> => {
  const response = await apiClient.post('/driver_location_by_mobile', payload);
  return response.data;
};

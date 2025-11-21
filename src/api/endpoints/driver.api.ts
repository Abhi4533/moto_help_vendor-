// src/api/endpoints/driver.api.ts
import apiClient from '../base';

export const getDrivers = async (payload: {
  vendorid: string;
}): Promise<any> => {
  const response = await apiClient.post('/get_DriverDetails', payload);
  return response.data;
};

export const addDriver = async (payload: any): Promise<any> => {
  const response = await apiClient.post('/Insert_Driver', payload);
  return response.data;
};

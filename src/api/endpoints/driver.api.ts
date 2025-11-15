// src/api/endpoints/driver.api.ts
import apiClient from '../base';

export const getDrivers = async () => {
  const response = await apiClient.get('/drivers');
  return response.data;
};

export const getDriverDetails = async (driverId: string) => {
  const response = await apiClient.get(`/drivers/${driverId}`);
  return response.data;
};

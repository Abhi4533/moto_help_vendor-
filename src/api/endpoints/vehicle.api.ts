// src/api/endpoints/vehicle.api.ts
import apiClient from '../base';

export const getVehicles = async (payload: {
  vendorid: string;
}): Promise<any> => {
  const response = await apiClient.post('/get_vehicles', payload);
  return response.data;
};

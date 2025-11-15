// src/api/endpoints/vehicle.api.ts
import apiClient from '../base';

export const getVehicles = async () => {
  const response = await apiClient.get('/vehicles');
  return response.data;
};

export const addVehicle = async (payload: any) => {
  const response = await apiClient.post('/vehicles', payload);
  return response.data;
};

export const getVehicleDetails = async (vehicleId: string) => {
  const response = await apiClient.get(`/vehicles/${vehicleId}`);
  return response.data;
};

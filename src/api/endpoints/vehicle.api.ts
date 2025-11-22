// src/api/endpoints/vehicle.api.ts
import apiClient from '../base';

export const getVehicles = async (payload: {
  vendorid: string;
}): Promise<any> => {
  const response = await apiClient.post('/get_vehicles', payload);
  return response.data;
};

export const getRegisterdVehicles = async (payload: {
  vendorid: string;
}): Promise<any> => {
  const response = await apiClient.post('/Vehicle_Verification', payload);
  return response.data;
};

export const postRegisterVehicles = async (payload: any): Promise<any> => {
  const response = await apiClient.post('/Insert_Vehicle', payload);
  return response.data;
};

export const getAvailableVehicles = async (payload: {
  vendorid: string;
}): Promise<any> => {
  const response = await apiClient.post('/get_vehicle_available', payload);
  return response.data;
};

export const getActiveVehicles = async (payload: {
  vendorid: string;
}): Promise<any> => {
  const response = await apiClient.post('/get_vehicle_active', payload);
  return response.data;
};

export const getProcessVehicles = async (payload: {
  vendorid: string;
}): Promise<any> => {
  const response = await apiClient.post('/get_vehicle_process', payload);
  return response.data;
};

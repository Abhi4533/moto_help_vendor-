// src/api/endpoints/tracking.api.ts
import apiClient from '../base';

export const getLiveTracking = async (vehicleId: string) => {
  const response = await apiClient.get(`/tracking/live/${vehicleId}`);
  return response.data;
};

export const getNearbyCustomers = async (location: {
  lat: number;
  lng: number;
}) => {
  const response = await apiClient.get('/tracking/nearby', {
    params: location,
  });
  return response.data;
};

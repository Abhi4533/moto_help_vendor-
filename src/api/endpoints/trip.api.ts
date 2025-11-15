// src/api/endpoints/trip.api.ts
import apiClient from '../base';

export const assignTrip = async (payload: any) => {
  const response = await apiClient.post('/trips/assign', payload);
  return response.data;
};

export const getTrips = async () => {
  const response = await apiClient.get('/trips');
  return response.data;
};

export const getTripDetails = async (tripId: string) => {
  const response = await apiClient.get(`/trips/${tripId}`);
  return response.data;
};

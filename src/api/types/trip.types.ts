// src/api/types/trip.types.ts
export interface TripItem {
  id: string;
  vehicleId: string;
  driverId: string;
  pickupLocation: string;
  dropLocation: string;
  status: 'pending' | 'ongoing' | 'completed';
}

export interface AssignTripRequest {
  vehicleId: string;
  driverId: string;
  pickupLocation: string;
  dropLocation: string;
}

export interface TripDetails extends TripItem {
  startedAt: string;
  completedAt?: string;
}

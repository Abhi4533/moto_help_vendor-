// src/api/types/tracking.types.ts
export interface LiveTrackingData {
  vehicleId: string;
  lat: number;
  lng: number;
  speed: number;
  lastUpdated: string;
}

export interface NearbyCustomerItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

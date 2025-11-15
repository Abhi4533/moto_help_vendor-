// src/api/types/vehicle.types.ts
export interface VehicleItem {
  id: string;
  registrationNo: string;
  type: string;
  capacityTon: number;
  status: 'available' | 'assigned' | 'inactive';
}

export interface AddVehicleRequest {
  registrationNo: string;
  type: string;
  model: string;
  capacityTon: number;
}

export interface VehicleDetails extends VehicleItem {
  model: string;
  manufacturer: string;
  fitnessExpiry: string;
}

// types/Vehicle.ts
export interface VehicleDetails {
  registration_no: string;
  registration_date: string;
  registered_at: string;
  rc_status: string;
  owner_name: string;
  father_name: string;
  present_address: string;
  permanent_address: string;
  mobile_number: string;
  vehiclecategory: string;
  vehicle_category_description: string;
  vehicle_manufacturer: string;
  maker_model: string;
  body_type: string;
  fuel_type: string;
  manufacturing_date: string;
  chassis_number: string;
  engine_number: string;
  cubic_capacity: number;
  vehicle_gross_weight: number;
  unladen_weight: number;
  no_cylinders: number;
  seat_capacity: number;
  fit_upto: string;
  insurance_upto: string;
  tax_upto: string;
  tax_paid_upto: string;
  pucc_number: string;
  pucc_upto: string;
  permit_number: string;
  permit_type: string;
  permit_valid_from: string;
  permit_valid_upto: string;
  loadingCapacityGVW: number;
  emptyVehicleWeight: number;
  loadingCapacityCubic: number;
  vehicleType: string;
  vehicle_Category: string;
  topRemovable: boolean;
  verify_flag: string;
  insert_date: string;
  update_date: string;
}

export interface Vehicle {
  vendorid: string;
  vehicleId: string;
  vehicleDetails: VehicleDetails;
  VehicleTypesDetails: any;
  vehiclePhotos: any;
}

export type VehicleStatus = 'all' | 'active' | 'inactive' | 'expired';

export interface VehiclePhoto {
  id: string;
  base64: string;
  uri: string;
  fileName?: string;
  type?: string;
  uploadedAt?: string;
}

// Add photo action types
export interface AddPhotoAction {
  vehicleId: string;
  photos: VehiclePhoto[];
}

export interface RemovePhotoAction {
  vehicleId: string;
  photoId: string;
}

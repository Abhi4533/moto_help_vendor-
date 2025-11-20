import { ValidationResult } from '@store/slices/validatedVehiclesSlice';

// types/vehicle.ts
export interface VehicleItem {
  VendorID: string;
  VehicleNumber: string;
  verify_flag: 'Y' | 'N';
  validationStatus?: ValidationResult;
}

export interface VehicleValidationResponse {
  status: string;
  message: string;
  data: {
    rc_number: string;
    registration_date: string;
    owner_name: string;
    father_name: string;
    present_address: string;
    permanent_address: string;
    mobile_number: string;
    vehicle_category: string;
    vehicle_chasi_number: string;
    vehicle_engine_number: string;
    maker_description: string;
    maker_model: string;
    body_type: string;
    fuel_type: string;
    fit_up_to: string;
    insurance_upto: string;
    manufacturing_date: string;
    registered_at: string;
    tax_upto: string | null;
    tax_paid_upto: string;
    cubic_capacity: string;
    vehicle_gross_weight: string;
    no_cylinders: string;
    seat_capacity: string;
    unladen_weight: string;
    vehicle_category_description: string;
    pucc_number: string;
    pucc_upto: string;
    permit_number: string;
    permit_valid_from: string | null;
    permit_valid_upto: string | null;
    permit_type: string;
    rc_status: string;
  };
}

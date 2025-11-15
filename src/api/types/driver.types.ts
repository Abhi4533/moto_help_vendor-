// src/api/types/driver.types.ts
export interface DriverItem {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  status: 'active' | 'inactive';
}

export interface DriverDetails extends DriverItem {
  address: string;
  experienceYears: number;
}

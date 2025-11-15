// types/DashboardTypes.ts
export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  documentStatus: DocumentStatus;
  assignedVehicleId?: string;
  joinDate: Date;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  capacity: string;
  status: 'active' | 'maintenance' | 'inactive';
  documentStatus: DocumentStatus;
  assignedDriverId?: string;
  lastServiceDate: Date;
}

export interface Trip {
  id: string;
  tripId: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  startLocation: string;
  endLocation: string;
  status: TripStatus;
  amount: number;
  startDate: Date;
  endDate?: Date;
  distance: number;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  tripId: string;
  amount: number;
  status: PaymentStatus;
  dueDate: Date;
  paidDate?: Date;
  customerName: string;
}

export type DocumentStatus = 'valid' | 'expired' | 'pending' | 'rejected';
export type TripStatus = 'active' | 'delivered' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'failed';

import {
  Driver,
  Payment,
  PaymentStatus,
  Trip,
  TripStatus,
  Vehicle,
} from './types';

export const generateMockData = () => {
  const drivers: Driver[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      status: 'active',
      documentStatus: 'valid',
      assignedVehicleId: '1',
      joinDate: new Date('2023-01-15'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      status: 'active',
      documentStatus: 'valid',
      assignedVehicleId: '2',
      joinDate: new Date('2023-02-20'),
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1234567892',
      status: 'active',
      documentStatus: 'expired',
      joinDate: new Date('2023-03-10'),
    },
  ];

  const vehicles: Vehicle[] = [
    {
      id: '1',
      licensePlate: 'ABC123',
      model: 'Ford Transit',
      capacity: '1500 kg',
      status: 'active',
      documentStatus: 'valid',
      assignedDriverId: '1',
      lastServiceDate: new Date('2024-01-10'),
    },
    {
      id: '2',
      licensePlate: 'XYZ789',
      model: 'Mercedes Sprinter',
      capacity: '2000 kg',
      status: 'active',
      documentStatus: 'pending',
      assignedDriverId: '2',
      lastServiceDate: new Date('2024-01-15'),
    },
    {
      id: '3',
      licensePlate: 'DEF456',
      model: 'Volvo Truck',
      capacity: '5000 kg',
      status: 'maintenance',
      documentStatus: 'valid',
      lastServiceDate: new Date('2024-01-05'),
    },
  ];

  const trips: Trip[] = [
    {
      id: '1',
      tripId: 'TRIP001',
      driverId: '1',
      driverName: 'John Doe',
      vehicleId: '1',
      startLocation: 'New York',
      endLocation: 'Boston',
      status: 'delivered',
      amount: 1200,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-21'),
      distance: 215,
    },
    {
      id: '2',
      tripId: 'TRIP002',
      driverId: '2',
      driverName: 'Jane Smith',
      vehicleId: '2',
      startLocation: 'Chicago',
      endLocation: 'Detroit',
      status: 'active',
      amount: 800,
      startDate: new Date('2024-01-22'),
      distance: 282,
    },
  ];

  const payments: Payment[] = [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      tripId: 'TRIP001',
      amount: 1200,
      status: 'paid',
      dueDate: new Date('2024-02-01'),
      paidDate: new Date('2024-01-25'),
      customerName: 'Global Logistics Inc.',
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      tripId: 'TRIP002',
      amount: 800,
      status: 'pending',
      dueDate: new Date('2024-02-05'),
      customerName: 'Quick Transport Co.',
    },
  ];

  return { drivers, vehicles, trips, payments };
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'paid':
      return '#4CAF50';
    case 'pending':
      return '#FF9800';
    case 'overdue':
      return '#f44336';
    case 'failed':
      return '#9C27B0';
    default:
      return '#757575';
  }
};

export const getTripStatusColor = (status: TripStatus): string => {
  switch (status) {
    case 'active':
      return '#2196F3';
    case 'delivered':
      return '#4CAF50';
    case 'completed':
      return '#FF9800';
    case 'cancelled':
      return '#f44336';
    default:
      return '#757575';
  }
};

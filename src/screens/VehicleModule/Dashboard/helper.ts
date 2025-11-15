import { routeName } from '@utils/navigationHelpers';
import { Vehicle } from './type';

export const getStatusConfig = (vehicle: Vehicle) => {
  const currentDate = new Date();
  const isExpired =
    new Date(vehicle.vehicleDetails.fit_upto) < currentDate ||
    new Date(vehicle.vehicleDetails.insurance_upto) < currentDate ||
    new Date(vehicle.vehicleDetails.tax_upto) < currentDate;

  if (isExpired)
    return {
      color: '#FF6B6B',
      label: 'Expired',
      icon: 'alert-circle',
      bgColor: '#FFF5F5',
    };
  if (vehicle.vehicleDetails.rc_status === 'ACTIVE')
    return {
      color: '#10B981',
      label: 'Active',
      icon: 'check-circle',
      bgColor: '#F0FDF4',
    };
  return {
    color: '#F59E0B',
    label: 'Inactive',
    icon: 'pause-circle',
    bgColor: '#FFFBEB',
  };
};

export const getVehicleIcon = (vehicleType: string) => {
  switch (vehicleType.toLowerCase()) {
    case 'multi axle':
    case 'hvg':
      return 'truck';
    case 'light motor vehicle':
    case 'lmv':
      return 'van-utility';
    case 'motor car':
    case 'mc':
      return 'car-sedan';
    case 'passenger vehicle':
      return 'bus';
    default:
      return 'truck';
  }
};

export const getDaysRemaining = (dateString: string) => {
  const targetDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = targetDate.getTime() - currentDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getExpiryProgress = (dateString: string) => {
  const daysRemaining = getDaysRemaining(dateString);
  if (daysRemaining < 0) return 0;
  if (daysRemaining > 365) return 1;
  return daysRemaining / 365;
};

export const getExpiryStatus = (date: string) => {
  const daysRemaining = getDaysRemaining(date);

  if (daysRemaining < 0) return { color: '#EF4444', label: 'Expired' };
  if (daysRemaining <= 30) return { color: '#F59E0B', label: 'Critical' };
  if (daysRemaining <= 90) return { color: '#FBBF24', label: 'Warning' };
  return { color: '#10B981', label: 'Safe' };
};

export const quickActionsData = [
  {
    key: '1',
    icon: 'plus-circle',
    label: 'Register',
    color: '#2563EB',
    naviagate: routeName.VEHICLE_REGISTER,
  },
  { key: '2', icon: 'chart-box', label: 'MIS Report', color: '#7C3AED' },
  { key: '3', icon: 'check-circle', label: 'Active', color: '#10B981' },
  { key: '4', icon: 'wrench', label: 'Maintenance', color: '#F59E0B' },
  { key: '5', icon: 'cash', label: 'Expenses', color: '#EF4444' },
  {
    key: '6',
    icon: 'alert-circle',
    label: 'Expiry Alerts',
    color: '#DC2626',
  },
  { key: '7', icon: 'file-document', label: 'Documents', color: '#6366F1' },
];

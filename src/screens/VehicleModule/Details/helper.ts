export const getStatusConfig = (vehicle: any) => {
  const currentDate = new Date();
  const isExpired =
    new Date(vehicle?.vehicleDetails?.fit_upto) < currentDate ||
    new Date(vehicle?.vehicleDetails?.insurance_upto) < currentDate ||
    new Date(vehicle?.vehicleDetails?.tax_upto) < currentDate;

  if (isExpired)
    return {
      color: '#EF4444',
      label: 'Expired',
      icon: 'alert-circle',
      bgColor: '#FEF2F2',
    };
  if (vehicle?.vehicleDetails?.rc_status === 'ACTIVE')
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

export const getVehicleIcon = (vehicle: any) => {
  switch (vehicle?.vehicleDetails?.vehicleType?.toLowerCase()) {
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
  const diffTime = targetDate?.getTime() - currentDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getExpiryStatus = (date: string) => {
  const daysRemaining = getDaysRemaining(date);

  if (daysRemaining < 0)
    return { color: '#EF4444', label: 'Expired', progress: 0 };
  if (daysRemaining <= 30)
    return { color: '#F59E0B', label: 'Critical', progress: 0.2 };
  if (daysRemaining <= 90)
    return { color: '#FBBF24', label: 'Warning', progress: 0.5 };
  return { color: '#10B981', label: 'Safe', progress: 1 };
};

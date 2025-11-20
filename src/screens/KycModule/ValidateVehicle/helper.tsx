// helper.ts
import { ValidationResult } from '@store/slices/validatedVehiclesSlice';

export const getStatusConfig = (validationStatus?: ValidationResult) => {
  if (!validationStatus) {
    return {
      icon: 'clock-alert' as const,
      color: '#e67e22',
      backgroundColor: '#fff4e6',
      text: 'Pending Verification',
      description: 'Vehicle needs to be validated',
    };
  }

  if (validationStatus.status === 'success') {
    return {
      icon: 'check-circle' as const,
      color: '#2ecc71',
      backgroundColor: '#e8f5e8',
      text: 'Verified',
      description: validationStatus.validatedAt
        ? `Validated on ${new Date(
            validationStatus.validatedAt,
          ).toLocaleDateString()}`
        : 'Vehicle verified successfully',
    };
  }

  if (validationStatus.status === 'failed') {
    const failureReasons = {
      invalid_rc_number: {
        icon: 'alert-circle' as const,
        text: 'Invalid RC Number',
        description: 'The RC number could not be verified',
      },
      vehicle_type_not_supported: {
        icon: 'car-off' as const,
        text: 'Vehicle Type Not Supported',
        description: 'This vehicle type is not suitable for carrier services',
      },
      unknown_error: {
        icon: 'alert-circle-outline' as const,
        text: 'Invalid RC Number',
        description: 'Please try again later',
      },
    };

    const reasonConfig =
      failureReasons[validationStatus.failureReason!] ||
      failureReasons.unknown_error;

    return {
      ...reasonConfig,
      color: '#e74c3c',
      backgroundColor: '#ffeaea',
    };
  }

  if (validationStatus.status === 'pending') {
    return {
      icon: 'loading' as const,
      color: '#3498db',
      backgroundColor: '#e3f2fd',
      text: 'Validating...',
      description: 'Vehicle validation in progress',
    };
  }

  // Default pending verification
  return {
    icon: 'clock-alert' as const,
    color: '#e67e22',
    backgroundColor: '#fff4e6',
    text: 'Pending Verification',
    description: 'Vehicle needs to be validated',
  };
};

import { TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { styles } from '../style';

// Types
interface Vehicle {
  id: string;
  registrationNo: string;
  status: 'pending' | 'validating' | 'validated' | 'submitted' | 'error';
  lastValidated: string | null;
  message: string | null;
  isExisting: boolean;
}

const STATUS_CONFIG = {
  submitted: { color: '#10B981', icon: 'check-circle', text: 'Registered' },
  validated: { color: '#10B981', icon: 'check-circle', text: 'Validated' },
  validating: { color: '#F59E0B', icon: 'clock', text: 'Validating...' },
  error: { color: '#EF4444', icon: 'alert-circle', text: 'Failed' },
  pending: { color: '#6B7280', icon: 'help-circle', text: 'Validate' },
} as const;
const VehicleHeader: React.FC<{
  vehicle: Vehicle;
  onValidate: (vehicle: Vehicle) => void;
  validatingVehicleId: string | null;
  getButtonText: (vehicle: Vehicle) => string;
}> = ({ vehicle, onValidate, validatingVehicleId, getButtonText }) => {
  const statusConfig = STATUS_CONFIG[vehicle.status];
  const isDisabled =
    vehicle.status === 'submitted' ||
    vehicle.isExisting ||
    vehicle.status === 'validating' ||
    validatingVehicleId === vehicle.id;

  return (
    <View style={styles.vehicleHeader}>
      <View style={styles.vehicleInfo}>
        <IconButton
          icon="car"
          size={24}
          iconColor="#374151"
          style={styles.vehicleIcon}
        />
        <View style={styles.vehicleTextContainer}>
          <Text style={styles.registrationNo}>{vehicle.registrationNo}</Text>
          <View style={styles.statusContainer}>
            <IconButton
              icon={statusConfig.icon}
              size={16}
              iconColor={statusConfig.color}
              style={styles.statusIcon}
            />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
          {vehicle.lastValidated && (
            <Text style={styles.lastValidated}>
              Last action: {vehicle.lastValidated}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.validateButton,
          (vehicle.status === 'submitted' || vehicle.isExisting) &&
            styles.submittedButton,
          (vehicle.status === 'validating' ||
            validatingVehicleId === vehicle.id) &&
            styles.validatingButton,
          vehicle.status === 'error' && styles.errorButton,
        ]}
        onPress={() => onValidate(vehicle)}
        disabled={isDisabled}
      >
        {vehicle.status === 'validating' ||
        validatingVehicleId === vehicle.id ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <View style={styles.buttonContent}>
            <IconButton
              icon={
                vehicle.status === 'submitted' || vehicle.isExisting
                  ? 'check'
                  : vehicle.status === 'error'
                    ? 'refresh'
                    : 'shield-check'
              }
              size={16}
              iconColor="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.validateButtonText}>
              {getButtonText(vehicle)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VehicleHeader;

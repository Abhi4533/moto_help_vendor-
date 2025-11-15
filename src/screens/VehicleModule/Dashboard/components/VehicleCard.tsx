import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
import { getStatusConfig, getVehicleIcon } from '../helper';
import { styles } from '../styles';
import { Vehicle, VehicleDetails } from '../type';

interface VehicleCardProps {
  vehicle: Vehicle;
  onVerify?: (vehicleId: string) => void;
  onAddPhoto?: (vehicleId: string) => void;
  onViewDetails?: (vehicle: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onVerify,
  onAddPhoto,
  onViewDetails,
  onEdit,
}) => {
  const statusConfig = getStatusConfig(vehicle);

  // Check KYC verification status based on verify_flag
  const isKYCVerified =
    vehicle.vehicleDetails.verify_flag === 'verified' ||
    vehicle.vehicleDetails.verify_flag === 'Y';
  const isKYCRejected =
    vehicle.vehicleDetails.verify_flag === 'rejected' ||
    vehicle.vehicleDetails.verify_flag === 'N';

  // Check if vehicle has photos and count them
  const hasPhotos =
    vehicle.vehiclePhotos && Object.keys(vehicle.vehiclePhotos).length > 0;
  const photoCount = vehicle.vehiclePhotos
    ? Object.keys(vehicle.vehiclePhotos).length
    : 0;

  const handleVerifyPress = () => {
    if (onVerify && !isKYCVerified) {
      onVerify(vehicle.vehicleId);
    }
  };

  const handleAddPhoto = () => {
    if (onAddPhoto) {
      onAddPhoto(vehicle.vehicleId);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(vehicle);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(vehicle);
    }
  };

  // Helper to get vehicle display name
  const getVehicleDisplayName = (details: VehicleDetails): string => {
    return `${details.vehicle_manufacturer} ${details.maker_model}`.trim();
  };

  // Helper to get vehicle specifications
  const getVehicleSpecs = (details: VehicleDetails): string => {
    const specs = [];
    if (details.vehicle_Category) specs.push(details.vehicle_Category);
    if (details.fuel_type) specs.push(details.fuel_type);
    if (details.loadingCapacityGVW)
      specs.push(`${details.loadingCapacityGVW}kg`);

    return specs.join(' • ');
  };

  // Get next expiry date
  const getNextExpiry = (
    details: VehicleDetails,
  ): { label: string; date: string; color: string } => {
    const today = new Date();
    const expiryFields = [
      { field: details.fit_upto, label: 'Fitness' },
      { field: details.insurance_upto, label: 'Insurance' },
      { field: details.tax_upto, label: 'Tax' },
      { field: details.permit_valid_upto, label: 'Permit' },
      { field: details.pucc_upto, label: 'PUCC' },
    ];

    let nextExpiry = null;
    for (const { field, label } of expiryFields) {
      if (field) {
        const expiryDate = new Date(field);
        if (!nextExpiry || expiryDate < nextExpiry.date) {
          nextExpiry = { label, date: expiryDate, field };
        }
      }
    }

    if (!nextExpiry) return { label: 'No Expiry', date: '', color: '#666' };

    const daysUntilExpiry = Math.ceil(
      (nextExpiry.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiry < 0) {
      return {
        label: nextExpiry.label,
        date: nextExpiry.field,
        color: '#F44336',
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        label: nextExpiry.label,
        date: nextExpiry.field,
        color: '#FF9800',
      };
    } else {
      return {
        label: nextExpiry.label,
        date: nextExpiry.field,
        color: '#4CAF50',
      };
    }
  };

  const expiryInfo = getNextExpiry(vehicle.vehicleDetails);

  return (
    <TouchableOpacity onPress={handleViewDetails}>
      <Card style={styles.vehicleCard}>
        <Card.Content style={styles.cardContent}>
          {/* Header Section */}
          <View style={styles.cardHeader}>
            <View style={styles.vehicleMainInfo}>
              <View style={styles.avatarContainer}>
                <Avatar.Icon
                  size={50}
                  icon={getVehicleIcon(vehicle.vehicleDetails.vehicleType)}
                  style={[
                    styles.avatar,
                    { backgroundColor: statusConfig.color },
                  ]}
                />
                {hasPhotos && (
                  <View style={styles.photoBadge}>
                    <Text style={styles.photoBadgeText}>{photoCount}</Text>
                  </View>
                )}
              </View>

              <View style={styles.vehicleInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.registrationNo}>
                    {vehicle.vehicleDetails.registration_no}
                  </Text>
                </View>

                <Text style={styles.vehicleModel} numberOfLines={1}>
                  {getVehicleDisplayName(vehicle.vehicleDetails)}
                </Text>

                <Text style={styles.vehicleDetails} numberOfLines={1}>
                  {getVehicleSpecs(vehicle.vehicleDetails)}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {/* <View style={styles.actionRow}>
          <Button
            mode={isKYCRejected ? 'contained' : 'outlined'}
            onPress={handleVerifyPress}
            style={styles.verifyButton}
            labelStyle={styles.verifyButtonLabel}
            icon={isKYCRejected ? 'refresh' : 'shield-check'}
            compact
          >
            {isKYCRejected ? 'Resubmit' : 'Verify Now'}
          </Button>

          <Button
            mode="outlined"
            onPress={handleAddPhoto}
            style={styles.photoButton}
            labelStyle={styles.photoButtonLabel}
            icon={hasPhotos ? 'camera' : 'camera-plus'}
            compact
          >
            {hasPhotos ? `Photos (${photoCount})` : 'Add Photo'}
          </Button>
        </View> */}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default VehicleCard;

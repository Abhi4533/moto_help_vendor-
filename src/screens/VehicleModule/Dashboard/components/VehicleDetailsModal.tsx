import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { getStatusConfig, getVehicleIcon } from '../helper';
import { styles } from '../styles';
import { Vehicle } from '../type';

// VehicleDetailsModal Component
const VehicleDetailsModal: React.FC<{
  visible: boolean;
  vehicle: Vehicle | null;
  onDismiss: () => void;
  onEdit?: (vehicle: Vehicle) => void;
  onAddPhoto?: (vehicleId: string) => void;
}> = ({ visible, vehicle, onDismiss, onEdit, onAddPhoto }) => {
  if (!vehicle) return null;

  const statusConfig = getStatusConfig(vehicle);
  const isKYCVerified = vehicle.vehicleDetails.verify_flag === 'Y';

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toDateString();
  };

  const isExpired = (dateString: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Vehicle Details</Text>
          <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Basic Information Card */}
          <Card style={styles.detailCard}>
            <Card.Content>
              <View style={styles.vehicleHeader}>
                <Avatar.Icon
                  size={60}
                  icon={getVehicleIcon(vehicle.vehicleDetails.vehicleType)}
                  style={[
                    styles.avatar,
                    { backgroundColor: statusConfig.color },
                  ]}
                />
                <View style={styles.vehicleTitle}>
                  <Text style={styles.registrationNo}>
                    {vehicle.vehicleDetails.registration_no}
                  </Text>
                  <Text style={styles.vehicleModel}>
                    {vehicle.vehicleDetails.vehicle_manufacturer}{' '}
                    {vehicle.vehicleDetails.maker_model}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusConfig.color },
                    ]}
                  >
                    <Text style={styles.statusText}>{statusConfig.label}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Owner Name:</Text>
                <Text style={styles.detailValue}>
                  {vehicle.vehicleDetails.owner_name}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Chassis Number:</Text>
                <Text style={styles.detailValue}>
                  {vehicle.vehicleDetails.chassis_number}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Engine Number:</Text>
                <Text style={styles.detailValue}>
                  {vehicle.vehicleDetails.engine_number}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Vehicle Category:</Text>
                <Text style={styles.detailValue}>
                  {vehicle.vehicleDetails.vehicle_Category}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fuel Type:</Text>
                <Text style={styles.detailValue}>
                  {vehicle.vehicleDetails.fuel_type}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>KYC Status:</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: isKYCVerified ? '#4CAF50' : '#FF9800' },
                  ]}
                >
                  {isKYCVerified ? 'Verified' : 'Pending'}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Expiry Dates Card */}
          <Card style={styles.detailCard}>
            <Card.Content>
              <Text style={styles.cardSectionTitle}>Expiry Dates</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fitness Certificate:</Text>
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: isExpired(vehicle.vehicleDetails.fit_upto)
                        ? '#F44336'
                        : '#4CAF50',
                    },
                  ]}
                >
                  {formatDate(vehicle.vehicleDetails.fit_upto)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Insurance:</Text>
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: isExpired(vehicle.vehicleDetails.insurance_upto)
                        ? '#F44336'
                        : '#4CAF50',
                    },
                  ]}
                >
                  {formatDate(vehicle.vehicleDetails.insurance_upto)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tax:</Text>
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: isExpired(vehicle.vehicleDetails.tax_upto)
                        ? '#F44336'
                        : '#4CAF50',
                    },
                  ]}
                >
                  {formatDate(vehicle.vehicleDetails.tax_upto)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Permit:</Text>
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: isExpired(vehicle.vehicleDetails.permit_valid_upto)
                        ? '#F44336'
                        : '#4CAF50',
                    },
                  ]}
                >
                  {formatDate(vehicle.vehicleDetails.permit_valid_upto)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>PUCC:</Text>
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: isExpired(vehicle.vehicleDetails.pucc_upto)
                        ? '#F44336'
                        : '#4CAF50',
                    },
                  ]}
                >
                  {formatDate(vehicle.vehicleDetails.pucc_upto)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Specifications Card */}
          <Card style={styles.detailCard}>
            <Card.Content>
              <Text style={styles.cardSectionTitle}>Specifications</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gross Weight:</Text>
                <Text style={styles.detailValue}>
                  {vehicle.vehicleDetails.vehicle_gross_weight} kg
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Unladen Weight:</Text>
                <Text style={styles.detailValue}>
                  {vehicle.vehicleDetails.unladen_weight} kg
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cubic Capacity:</Text>
                <Text style={styles.detailValue}>
                  {vehicle.vehicleDetails.cubic_capacity} cc
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Seat Capacity:</Text>
                <Text style={styles.detailValue}>
                  {vehicle.vehicleDetails.seat_capacity}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Body Type:</Text>
                <Text style={styles.detailValue}>
                  {vehicle.vehicleDetails.body_type}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.modalActions}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={styles.modalButton}
          >
            Close
          </Button>
          <Button
            mode="contained"
            onPress={() => onAddPhoto && onAddPhoto(vehicle.vehicleId)}
            style={styles.modalButton}
          >
            Add Photo
          </Button>
          {/* {onEdit && (
            <Button
              mode="contained"
              onPress={() => onEdit(vehicle)}
              style={styles.modalButton}
            >
              Edit Vehicle
            </Button>
          )} */}
        </View>
      </View>
    </Modal>
  );
};

export default VehicleDetailsModal;

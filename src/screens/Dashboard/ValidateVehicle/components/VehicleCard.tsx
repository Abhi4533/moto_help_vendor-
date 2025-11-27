// VehicleCard.tsx
import Icon from '@react-native-vector-icons/material-design-icons';
import { ValidationResult } from '@store/slices/validatedVehiclesSlice';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { getStatusConfig } from '../helper';
import { VehicleItem } from '../type';

interface VehicleCardProps {
  item: VehicleItem;
  validatingId: string | null;
  handleValidate: (vehicle: VehicleItem) => void;
  validationStatus?: ValidationResult;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  item,
  validatingId,
  handleValidate,
  validationStatus,
}) => {
  const statusConfig = getStatusConfig(validationStatus);
  const isVerified = validationStatus?.status === 'success';
  const isFailed = validationStatus?.status === 'failed';
  const isPendingValidation = validationStatus?.status === 'pending';
  const isCurrentlyValidating = validatingId === item.VehicleNumber;

  // Only show validate button for vehicles that haven't been validated yet
  // (no validation status or pending status)
  const canValidate =
    !validationStatus || validationStatus.status === 'pending';

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content>
        <View style={styles.cardContent}>
          <View style={styles.vehicleMainInfo}>
            <Text style={styles.vehicleNo}>{item.VehicleNumber}</Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusConfig.backgroundColor },
              ]}
            >
              <Icon
                name={statusConfig.icon}
                size={16}
                color={statusConfig.color}
              />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.text}
              </Text>
            </View>

            {statusConfig.description && (
              <Text style={styles.statusDescription}>
                {statusConfig.description}
              </Text>
            )}
          </View>

          {canValidate && !isCurrentlyValidating ? (
            <Button
              mode="contained"
              onPress={() => handleValidate(item)}
              style={styles.validateButton}
              labelStyle={styles.validateButtonText}
              icon="check-decagram"
            >
              Validate
            </Button>
          ) : (
            <View style={styles.statusIndicator}>
              {isCurrentlyValidating ? (
                <Button
                  mode="outlined"
                  style={styles.validatingButton}
                  labelStyle={styles.validatingButtonText}
                  icon="loading"
                  disabled
                >
                  Validating...
                </Button>
              ) : (
                <View style={styles.verifiedBadge}>
                  <Icon
                    name={
                      isVerified
                        ? 'check-circle'
                        : isFailed
                        ? 'alert-circle'
                        : 'clock-alert'
                    }
                    size={24}
                    color={
                      isVerified ? '#2ecc71' : isFailed ? '#e74c3c' : '#e67e22'
                    }
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  vehicleNo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusDescription: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 2,
  },
  validateButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    minWidth: 100,
  },
  validatingButton: {
    borderColor: '#3498db',
    minWidth: 120,
  },
  validatingButtonText: {
    fontSize: 12,
    color: '#3498db',
  },
  validateButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    padding: 4,
  },
});

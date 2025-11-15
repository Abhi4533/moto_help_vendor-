import React from 'react';
import { Text, View } from 'react-native';
import { Avatar, Card, Chip, IconButton } from 'react-native-paper';
import { getStatusConfig, getVehicleIcon } from '../helper';
import { styles } from '../style';

interface VehicleHeaderProps {
  vehicle: any;
}

const VehicleHeader = ({ vehicle }: VehicleHeaderProps) => {
  const statusConfig = getStatusConfig(vehicle);
  return (
    <Card style={styles.vehicleHeaderCard}>
      <Card.Content>
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleAvatar}>
            <Avatar.Icon
              size={60}
              icon={getVehicleIcon(vehicle)}
              style={[styles.avatar, { backgroundColor: statusConfig.color }]}
            />
            <View style={styles.statusIndicator}>
              <IconButton
                icon={statusConfig.icon}
                size={16}
                iconColor="#fff"
                style={{ margin: -4 }}
              />
            </View>
          </View>

          <View style={styles.vehicleMainInfo}>
            <Text style={styles.registrationNo}>
              {vehicle.vehicleDetails.registration_no}
            </Text>
            <Text style={styles.vehicleName}>
              {vehicle.vehicleDetails.vehicle_manufacturer}{' '}
              {vehicle.vehicleDetails.maker_model}
            </Text>
            <Text style={styles.vehicleCategory}>
              {vehicle.vehicleDetails.vehicle_Category} •{' '}
              {vehicle.vehicleDetails.fuel_type}
            </Text>
          </View>
        </View>

        {/* Quick Status */}
        <View style={styles.quickStatus}>
          <Chip
            icon={statusConfig.icon}
            style={[
              styles.statusChip,
              { backgroundColor: statusConfig.bgColor },
            ]}
            textStyle={{ color: statusConfig.color }}
          >
            {statusConfig.label}
          </Chip>
          <Chip
            icon="shield-check"
            style={styles.verifiedChip}
            textStyle={{ color: '#10B981' }}
          >
            {vehicle.vehicleDetails.verify_flag === 'Y'
              ? 'Verified'
              : 'Unverified'}
          </Chip>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}></View>
      </Card.Content>
    </Card>
  );
};

export default VehicleHeader;

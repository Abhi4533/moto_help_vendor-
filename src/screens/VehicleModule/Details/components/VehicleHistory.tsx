import React from 'react';
import { Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { styles } from '../style';
import InfoSection from './InfoSection';
interface VehicleHistoryProps {
  vehicle: any;
}
const VehicleHistory = ({ vehicle }: VehicleHistoryProps) => {
  return (
    <InfoSection title="Vehicle History" icon="history">
      <View style={styles.historyItem}>
        <View style={styles.historyIcon}>
          <IconButton icon="calendar" size={20} iconColor="#6366F1" />
        </View>
        <View style={styles.historyContent}>
          <Text style={styles.historyTitle}>Registration Date</Text>
          <Text style={styles.historyDate}>
            {new Date(
              vehicle.vehicleDetails.registration_date,
            ).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.historyItem}>
        <View style={styles.historyIcon}>
          <IconButton icon="factory" size={20} iconColor="#6366F1" />
        </View>
        <View style={styles.historyContent}>
          <Text style={styles.historyTitle}>Manufacturing Date</Text>
          <Text style={styles.historyDate}>
            {vehicle.vehicleDetails.manufacturing_date}
          </Text>
        </View>
      </View>

      <View style={styles.historyItem}>
        <View style={styles.historyIcon}>
          <IconButton icon="update" size={20} iconColor="#6366F1" />
        </View>
        <View style={styles.historyContent}>
          <Text style={styles.historyTitle}>Last Updated</Text>
          <Text style={styles.historyDate}>
            {vehicle.vehicleDetails.update_date
              ? new Date(
                  vehicle.vehicleDetails.update_date,
                ).toLocaleDateString()
              : 'Never'}
          </Text>
        </View>
      </View>
    </InfoSection>
  );
};

export default VehicleHistory;

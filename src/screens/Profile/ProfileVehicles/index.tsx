// ProfileVehicles.tsx
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, Chip, Surface, Text } from 'react-native-paper';
import ProfileLayout from '../Layout';

interface Props {
  onTabChange?: (tab: string) => void;
}

const ProfileVehicles: React.FC<Props> = ({ onTabChange }) => {
  const vehicles = [
    { id: 1, number: 'ABC-1234', type: 'Delivery Van', status: 'Active' },
    { id: 2, number: 'XYZ-5678', type: 'Pickup Truck', status: 'Maintenance' },
    { id: 3, number: 'DEF-9012', type: 'Cargo Truck', status: 'Active' },
  ];

  return (
    <ProfileLayout
      activeTab="Vehicles"
      onTabChange={onTabChange}
      onEditPress={() => console.log('Edit vehicles pressed')}
    >
      <Card style={styles.contentCard}>
        <Card.Content style={styles.cardContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Vehicle Fleet
                </Text>
                <Chip mode="outlined" style={styles.countChip}>
                  {vehicles.length} vehicles
                </Chip>
              </View>

              <View style={styles.vehicleList}>
                {vehicles.map(vehicle => (
                  <Surface
                    key={vehicle.id}
                    style={styles.vehicleCard}
                    elevation={1}
                  >
                    <View style={styles.vehicleInfo}>
                      <Avatar.Icon
                        size={50}
                        icon="truck"
                        style={styles.vehicleIcon}
                      />
                      <View style={styles.vehicleDetails}>
                        <Text variant="bodyLarge" style={styles.vehicleNumber}>
                          {vehicle.number}
                        </Text>
                        <Text variant="bodyMedium" style={styles.vehicleType}>
                          {vehicle.type}
                        </Text>
                      </View>
                      <Chip
                        mode="outlined"
                        style={
                          vehicle.status === 'Active'
                            ? styles.activeChip
                            : styles.maintenanceChip
                        }
                        textStyle={styles.chipText}
                      >
                        {vehicle.status}
                      </Chip>
                    </View>
                  </Surface>
                ))}
              </View>
            </View>
          </ScrollView>
        </Card.Content>
      </Card>
    </ProfileLayout>
  );
};

export default ProfileVehicles;

const styles = StyleSheet.create({
  contentCard: {
    flex: 1,
    margin: 12,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 0,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1F2937',
    fontSize: 16,
  },
  countChip: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  vehicleList: {
    gap: 12,
  },
  vehicleCard: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    backgroundColor: '#6366F1',
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleNumber: {
    fontWeight: '600',
    color: '#1F2937',
  },
  vehicleType: {
    color: '#6B7280',
    marginTop: 2,
  },
  activeChip: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  maintenanceChip: {
    backgroundColor: '#FEF3F2',
    borderColor: '#F04444',
  },
  chipText: {
    fontSize: 12,
  },
});

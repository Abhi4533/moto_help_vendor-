import { SummaryData } from '@api/api.type';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import { styles } from '../style';

interface VehicleStatusProps {
  countData: SummaryData;
}

const VehicleStatus: FC<VehicleStatusProps> = ({ countData }) => {
  const vehicleSummary = countData?.VehicleSummary || {};

  const fuelTypes = [
    { type: 'Diesel', count: vehicleSummary.DieselVehicles, color: '#795548' },
    { type: 'Petrol', count: vehicleSummary.PetrolVehicles, color: '#FF5722' },
    { type: 'CNG', count: vehicleSummary.CNGVehicles, color: '#607D8B' },
    {
      type: 'Electric',
      count: vehicleSummary.ElectricVehicles,
      color: '#4CAF50',
    },
  ];

  const vehicleTypes = [
    { type: 'Truck', count: vehicleSummary.TruckCount, icon: '🚛' },
    { type: 'Tanker', count: vehicleSummary.TankerCount, icon: '⛽' },
    { type: 'Pickup', count: vehicleSummary.PickupCount, icon: '🛻' },
  ];

  return (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Vehicle Overview</Title>

        {/* Fuel Type Distribution */}
        <View style={styles.subSection}>
          <Paragraph style={styles.subSectionTitle}>Fuel Types</Paragraph>
          <View style={styles.chipContainer}>
            {fuelTypes.map((fuel, index) => (
              <View key={index} style={styles.chip}>
                <Paragraph style={[styles.chipText, { color: fuel.color }]}>
                  {fuel.type}: {fuel.count}
                </Paragraph>
              </View>
            ))}
          </View>
        </View>

        {/* Vehicle Type Distribution */}
        <View style={styles.subSection}>
          <Paragraph style={styles.subSectionTitle}>Vehicle Types</Paragraph>
          <View style={styles.chipContainer}>
            {vehicleTypes.map((vehicle, index) => (
              <View key={index} style={styles.chip}>
                <Paragraph style={styles.chipText}>
                  {vehicle.icon} {vehicle.type}: {vehicle.count}
                </Paragraph>
              </View>
            ))}
          </View>
        </View>

        {/* Registration Status */}
        <View style={styles.statsRow}>
          <View style={styles.miniStat}>
            <Paragraph style={styles.miniStatCount}>
              {vehicleSummary.RecentRegistered}
            </Paragraph>
            <Paragraph style={styles.miniStatLabel}>New Vehicles</Paragraph>
          </View>
          <View style={styles.miniStat}>
            <Paragraph style={styles.miniStatCount}>
              {vehicleSummary.OldVehicles}
            </Paragraph>
            <Paragraph style={styles.miniStatLabel}>Old Vehicles</Paragraph>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default VehicleStatus;

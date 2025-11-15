import { SummaryData } from '@api/api.type';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { View } from 'react-native';
import { styles } from '../style';
import StatCard from './StatCard';

interface QuickStatsGridProps {
  countData: SummaryData;
}

const QuickStatsGrid: FC<QuickStatsGridProps> = ({ countData }) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.statsGrid}>
      <StatCard
        title="Total Drivers"
        count={countData?.DriverSummary?.Total}
        subtitle={`${countData?.DriverSummary?.Active} Active • ${countData?.DriverSummary?.Inactive} Inactive`}
        icon="👨‍✈️"
        color="#4CAF50"
        onPress={() => navigation.navigate('Drivers' as never)}
      />
      <StatCard
        title="Total Vehicles"
        count={countData?.VehicleSummary?.TotalVehicles}
        subtitle={`${countData?.VehicleSummary?.Verified} Verified • ${countData?.VehicleSummary?.Unverified} Unverified`}
        icon="🚚"
        color="#2196F3"
        onPress={() => navigation.navigate('Vehicles' as never)}
      />
      <StatCard
        title="Unassigned"
        count={countData?.VehicleSummary?.UnassignedDriver}
        subtitle="Vehicles Available"
        icon="⚠️"
        color="#FF9800"
        onPress={() => navigation.navigate('Vehicles' as never)}
      />
      <StatCard
        title="Active Trips"
        count={countData?.TripSummary?.Active}
        subtitle={`${countData?.TripSummary?.Progress} In Progress`}
        icon="🛣️"
        color="#9C27B0"
        onPress={() => navigation.navigate('Trips' as never)}
      />
    </View>
  );
};

export default QuickStatsGrid;

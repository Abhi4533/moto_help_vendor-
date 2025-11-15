import { SummaryData } from '@api/api.type';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { Button, Card, Chip, DataTable, Title } from 'react-native-paper';
import { generateMockData, getTripStatusColor } from '../helper';
import { styles } from '../style';
interface QuickStatsGridProps {
  countData: SummaryData;
}
const RecentTrips: FC<QuickStatsGridProps> = () => {
  const navigation = useNavigation();
  const { trips } = useMemo(() => generateMockData(), []);
  return (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Recent Trips</Title>
          <Button
            mode="text"
            compact
            onPress={() => navigation.navigate('Trips' as never)}
          >
            View All
          </Button>
        </View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Trip ID</DataTable.Title>
            <DataTable.Title>Driver</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title numeric>Amount</DataTable.Title>
          </DataTable.Header>

          {trips.slice(0, 3).map(trip => (
            <DataTable.Row key={trip.id}>
              <DataTable.Cell>{trip.tripId}</DataTable.Cell>
              <DataTable.Cell>{trip.driverName}</DataTable.Cell>
              <DataTable.Cell>
                <Chip
                  mode="outlined"
                  textStyle={{
                    color: getTripStatusColor(trip.status),
                    fontSize: 12,
                  }}
                >
                  {trip.status}
                </Chip>
              </DataTable.Cell>
              <DataTable.Cell numeric>${trip.amount}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card.Content>
    </Card>
  );
};

export default RecentTrips;

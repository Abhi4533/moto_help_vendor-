import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
import { emitDriverSelect } from '@socket/socket.emitters';
import { clearMapData } from '@store/slices/mapSlice';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Appbar,
  Badge,
  Card,
  Chip,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';

// Safe number formatting utility
const safeToFixed = (
  value: number | undefined | null,
  decimals: number = 1,
): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.0';
  }
  return value.toFixed(decimals);
};

const IdleDriversModal = () => {
  const {
    idleModalVisible: visible,
    setIdleModalVisible: onDismiss,
    avilableData: rawData,
  } = useDashboard();

  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  // Calculate driver stats directly from raw data
  const driversWithStats = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return [];

    return rawData.map(driver => {
      const loads = driver.loads || [];

      return {
        ...driver,
        totalLoads: loads.length,
      };
    });
  }, [rawData]);

  const filteredData = driversWithStats.filter(driver => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      driver.driver_id.toLowerCase().includes(query) ||
      driver.Driver_Name.toLowerCase().includes(query) ||
      driver.vehicle_No.toLowerCase().includes(query) ||
      driver.vehicleType.toLowerCase().includes(query)
    );
  });

  const handleDriverPress = (driver: any) => {
    dispatch(clearMapData());
    emitDriverSelect({ DriverID: driver?.driver_id });
    onDismiss(false);
  };

  const renderDriverItem = ({
    item,
  }: {
    item: any & {
      totalLoads: number;
      availableLoads: number;
      totalDistance: number;
      averageDistance: number;
    };
  }) => (
    <TouchableOpacity
      onPress={() => handleDriverPress(item)}
      style={[styles.driverItem]}
    >
      <Card style={styles.driverCard}>
        <Card.Content>
          <View style={styles.driverHeader}>
            <View style={styles.driverInfo}>
              <View style={styles.nameRow}>
                <Text variant="titleMedium" style={styles.driverName}>
                  {item.Driver_Name || 'Unknown Driver'}
                </Text>
                <Chip
                  mode="flat"
                  textStyle={styles.statusChipText}
                  style={styles.availableChip}
                >
                  AVAILABLE
                </Chip>
              </View>
              <Text variant="bodyMedium" style={styles.driverId}>
                🆔 {item.driver_id} • 🚛 {item.vehicle_No}
              </Text>

              <View style={{ flexDirection: 'row', gap: 15 }}>
                <Text variant="bodySmall" style={styles.vehicleType}>
                  {item.vehicleType}
                </Text>
                <Text variant="titleSmall" style={styles.driverId}>
                  Available Loads: {item.availableLoads}
                </Text>
              </View>

              {item.Driver_Latitude !== 0 && item.Driver_Longitude !== 0 && (
                <Text variant="bodySmall" style={styles.location}>
                  📍 {safeToFixed(item.Driver_Latitude, 4)},{' '}
                  {safeToFixed(item.Driver_Longitude, 4)}
                </Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconButton
        icon="truck-check"
        size={64}
        iconColor={theme.colors.outline}
      />
      <Text variant="titleMedium" style={styles.emptyStateText}>
        No Available Drivers
      </Text>
      <Text variant="bodyMedium" style={styles.emptyStateSubtext}>
        All drivers are currently assigned to trips
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onDismiss={() => onDismiss(false)}
    >
      <View style={styles.modalContainer}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => onDismiss(false)} />
          <Appbar.Content
            title="Available Drivers"
            subtitle={`${filteredData.length} driver${
              filteredData.length !== 1 ? 's' : ''
            } available`}
          />
          <Badge
            size={24}
            style={[styles.badge, { backgroundColor: '#4CAF50' }]}
          >
            {filteredData.length}
          </Badge>
        </Appbar.Header>

        <Searchbar
          placeholder="Search drivers, vehicles..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          icon="magnify"
        />

        <FlatList
          data={filteredData}
          renderItem={renderDriverItem}
          keyExtractor={item => item.driver_id}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            filteredData.length === 0
              ? styles.emptyListContainer
              : styles.driverList
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  driverList: {
    padding: 16,
    paddingTop: 8,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  driverItem: {
    marginBottom: 16,
  },
  selectedDriverItem: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    borderRadius: 12,
  },
  driverCard: {
    elevation: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  driverInfo: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  driverName: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
    fontSize: 18,
    color: '#1a237e',
  },
  availableChip: {
    backgroundColor: '#4CAF50',
  },
  statusChipText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  driverId: {
    color: '#455a64',
    marginBottom: 4,
    fontWeight: '500',
  },
  vehicleType: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  location: {
    color: '#78909c',
    fontSize: 12,
  },
  loadsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a237e',
  },
  loadItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 6,
  },
  loadInfo: {
    flex: 1,
  },
  loadId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  loadRoute: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
  },
  loadDistance: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: '500',
  },
  moreLoads: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1a237e',
    marginBottom: 2,
  },
  statLabel: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e0e0e0',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  emptyStateSubtext: {
    textAlign: 'center',
    color: '#999',
    lineHeight: 20,
  },
  badge: {
    marginRight: 16,
  },
});

export default IdleDriversModal;

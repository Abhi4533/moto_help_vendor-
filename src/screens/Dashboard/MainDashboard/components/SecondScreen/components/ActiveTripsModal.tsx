import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
import { emitDriverSelect } from '@socket/socket.emitters';
import {
  clearMapData,
  setDriverPickupAndDestinationLocations,
} from '@store/slices/mapSlice';
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

const ActiveTripsModal = () => {
  const {
    activeModalVisible: visible,
    setActiveModalVisible: onDismiss,
    activeData: rawData,
  } = useDashboard();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  // Use raw data directly without transformation
  const filteredData = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return [];

    let data = rawData;

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = rawData.filter(
        driver =>
          driver.driver_id?.toLowerCase().includes(query) ||
          driver.Driver_Name?.toLowerCase().includes(query) ||
          driver.vehicle_No?.toLowerCase().includes(query) ||
          driver.LoadPostID?.toLowerCase().includes(query),
      );
    }

    return data;
  }, [rawData, searchQuery]);

  const handleDriverPress = (driver: any) => {
    dispatch(clearMapData());
    dispatch(
      setDriverPickupAndDestinationLocations({
        driver: {
          latitude: driver?.Driver_Latitude,
          longitude: driver?.dropoff_Longitude,
          rotation: 0,
        },
        destination: {
          latitude: driver?.dropoff_Latitude,
          longitude: driver?.dropoff_Longitude,
          rotation: 0,
        },
        pickup: {
          latitude: driver?.pickup_Latitude,
          longitude: driver?.pickup_Longitude,
          rotation: 0,
        },
      }),
    );
    emitDriverSelect({
      DriverID: driver?.driver_id,
      lat: driver?.Driver_Latitude,
      lng: driver?.dropoff_Longitude,
      LPStatus: driver?.Driver_LPStatus,
      VendorID: driver?.VendorID,
    });
    onDismiss(false);
  };

  const renderDriverItem = ({ item }: { item: any }) => (
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
                  {item.Driver_Name}
                </Text>
                <Chip
                  mode="flat"
                  textStyle={styles.statusChipText}
                  style={[
                    styles.activeChip,
                    item.Trip_Status === 'Active'
                      ? styles.activeChip
                      : item.Trip_Status === 'Progress'
                      ? styles.progressChip
                      : styles.completedChip,
                  ]}
                >
                  {item.Trip_Status?.toUpperCase() || 'ACTIVE'}
                </Chip>
              </View>
              <Text variant="bodyMedium" style={styles.driverId}>
                🆔 {item.driver_id} • 🚛 {item.vehicle_No}
              </Text>
              <Text variant="bodySmall" style={styles.vehicleType}>
                {item.vehicleType} • {item.Trip_Status || 'En Route'}
              </Text>
              {item.Driver_Latitude !== 0 && item.Driver_Longitude !== 0 && (
                <Text variant="bodySmall" style={styles.location}>
                  📍 Live: {item.Driver_Latitude.toFixed(4)},{' '}
                  {item.Driver_Longitude.toFixed(4)}
                </Text>
              )}
            </View>
            <IconButton icon="map-marker-path" size={20} iconColor="#2196F3" />
          </View>

          {/* Trip Details */}
          <View style={styles.tripSection}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Trip Details
            </Text>
            <View style={styles.tripItem}>
              <View style={styles.tripInfo}>
                <Text variant="bodySmall" style={styles.loadId}>
                  Load ID: {item.LoadPostID}
                </Text>
                <Text variant="bodySmall" style={styles.tripRoute}>
                  🛣️ Total Route: {item.OriginToDestinationKm?.toFixed(1)} km
                </Text>
                <Text variant="bodySmall" style={styles.distanceInfo}>
                  Driver to Origin: {item.DriverToOriginKm?.toFixed(1)} km
                </Text>
                {item.pickup_Latitude !== 0 && item.pickup_Longitude !== 0 && (
                  <Text variant="bodySmall" style={styles.coordinates}>
                    📍 Pickup: {item.pickup_Latitude.toFixed(4)},{' '}
                    {item.pickup_Longitude.toFixed(4)}
                  </Text>
                )}
                {item.dropoff_Latitude !== 0 &&
                  item.dropoff_Longitude !== 0 && (
                    <Text variant="bodySmall" style={styles.coordinates}>
                      🎯 Dropoff: {item.dropoff_Latitude.toFixed(4)},{' '}
                      {item.dropoff_Longitude.toFixed(4)}
                    </Text>
                  )}
              </View>
              <View style={styles.progressContainer}>
                <Text variant="labelSmall" style={styles.progressPercent}>
                  {getProgressPercentage(item.Trip_Status)}%
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${getProgressPercentage(item.Trip_Status)}%` },
                    ]}
                  />
                </View>
                <Text variant="labelSmall" style={styles.eta}>
                  ⏱️ ETA: {calculateETA(item.OriginToDestinationKm)}
                </Text>
              </View>
            </View>
          </View>

          {/* Trip Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <IconButton icon="speedometer" size={16} iconColor="#2196F3" />
              <Text variant="labelSmall" style={styles.statLabel}>
                {item.Trip_Status}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="titleSmall" style={styles.statValue}>
                {item.OriginToDestinationKm?.toFixed(0) || '0'}
              </Text>
              <Text variant="labelSmall" style={styles.statLabel}>
                Total Km
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="titleSmall" style={styles.statValue}>
                {item.DriverToOriginKm?.toFixed(0) || '0'}
              </Text>
              <Text variant="labelSmall" style={styles.statLabel}>
                To Origin
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  // Helper function to calculate progress percentage based on status
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'Active':
        return 65;
      case 'Progress':
        return 50;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };

  // Helper function to calculate ETA based on distance
  const calculateETA = (distance: number) => {
    if (!distance) return 'N/A';
    const hours = distance / 60; // Assuming 60 km/h average speed
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${Math.round(hours)}h ${Math.round((hours % 1) * 60)}m`;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconButton
        icon="map-marker-path"
        size={64}
        iconColor={theme.colors.outline}
      />
      <Text variant="titleMedium" style={styles.emptyStateText}>
        No Active Trips
      </Text>
      <Text variant="bodyMedium" style={styles.emptyStateSubtext}>
        No drivers are currently on active trips
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
            title="Active Trips"
            subtitle={`${filteredData.length} active trip${
              filteredData.length !== 1 ? 's' : ''
            }`}
          />
          <Badge
            size={24}
            style={[styles.badge, { backgroundColor: '#2196F3' }]}
          >
            {filteredData.length}
          </Badge>
        </Appbar.Header>

        <Searchbar
          placeholder="Search by driver, vehicle, or load ID..."
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
    borderColor: '#2196F3',
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
  activeChip: {
    backgroundColor: '#2196F3',
  },
  progressChip: {
    backgroundColor: '#FF9800',
  },
  completedChip: {
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
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '500',
  },
  tripSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a237e',
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  tripInfo: {
    flex: 1,
    marginRight: 12,
  },
  loadId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 4,
    fontWeight: '500',
  },
  tripRoute: {
    fontSize: 11,
    color: '#2196F3',
    fontWeight: '500',
    marginBottom: 2,
  },
  distanceInfo: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  coordinates: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  progressContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  progressPercent: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#BBDEFB',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#2196F3',
    borderRadius: 3,
  },
  eta: {
    color: '#FF9800',
    fontSize: 10,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
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
    backgroundColor: '#BBDEFB',
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

export default ActiveTripsModal;

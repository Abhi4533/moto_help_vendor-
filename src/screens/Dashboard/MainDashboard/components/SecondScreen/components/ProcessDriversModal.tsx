import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
import { emitDriverSelect } from '@socket/socket.emitters';
import {
  clearMapData,
  setDriverAndPickupLocations,
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

const ProcessDriversModal = () => {
  const {
    setProcessModalVisible: onDismiss,
    processModalVisible: visible,
    processData: rawData,
  } = useDashboard();

  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return rawData;

    return rawData.filter(
      driver =>
        driver.Driver_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.driver_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.vehicle_No?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.LoadPostID?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [rawData, searchQuery]);

  const handleDriverPress = (driver: any) => {
    dispatch(clearMapData());
    dispatch(
      setDriverAndPickupLocations({
        driver: {
          latitude: driver?.Driver_Latitude,
          longitude: driver?.Driver_Longitude,
        },
        pickup: {
          latitude: driver?.pickup_Latitude,
          longitude: driver?.pickup_Longitude,
        },
      }),
    );
    emitDriverSelect({ DriverID: driver?.driver_id });
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
                  🚛 {item.vehicle_No}
                </Text>
                <Chip
                  mode="flat"
                  textStyle={styles.statusChipText}
                  style={[
                    styles.processChip,
                    item.Trip_Status === 'Progress'
                      ? styles.progressChip
                      : item.Trip_Status === 'Completed'
                      ? styles.completedChip
                      : styles.pendingChip,
                  ]}
                >
                  {item.Trip_Status?.toUpperCase() || 'IN PROCESS'}
                </Chip>
              </View>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Text variant="bodyMedium" style={styles.driverId}>
                  {item.Driver_Name}
                </Text>
                <Text variant="bodySmall" style={styles.vehicleType}>
                  {item.vehicleType} • {item.Trip_Status || 'Processing'}
                </Text>
              </View>
            </View>
          </View>

          {/* Load Information */}
          <View style={styles.activitySection}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Load Details
            </Text>
            <View style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <Text variant="bodySmall" style={styles.loadId}>
                  {item.LoadPostID}
                </Text>
                <Text variant="bodySmall" style={styles.activityStatus}>
                  🔄 {item.Trip_Status} •{' '}
                  {item.OriginToDestinationKm?.toFixed(1)} km
                </Text>
                <Text variant="bodySmall" style={styles.distanceText}>
                  Driver to Origin: {item.DriverToOriginKm?.toFixed(1)} km
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconButton
        icon="package-variant"
        size={64}
        iconColor={theme.colors.outline}
      />
      <Text variant="titleMedium" style={styles.emptyStateText}>
        No Drivers in Process
      </Text>
      <Text variant="bodyMedium" style={styles.emptyStateSubtext}>
        No drivers are currently loading or unloading
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
            title="Drivers in Process"
            subtitle={`${filteredData.length} driver${
              filteredData.length !== 1 ? 's' : ''
            } processing`}
          />
          <Badge
            size={24}
            style={[styles.badge, { backgroundColor: '#FF9800' }]}
          >
            {filteredData.length}
          </Badge>
        </Appbar.Header>

        <Searchbar
          placeholder="Search processing drivers..."
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
    borderColor: '#FF9800',
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
  processChip: {
    backgroundColor: '#FF9800',
  },
  progressChip: {
    backgroundColor: '#FF9800',
  },
  completedChip: {
    backgroundColor: '#4CAF50',
  },
  pendingChip: {
    backgroundColor: '#9E9E9E',
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
  },
  activitySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a237e',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    marginBottom: 6,
  },
  activityInfo: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
  },
  loadId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  activityStatus: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: '500',
    marginBottom: 2,
  },
  distanceText: {
    fontSize: 10,
    color: '#666',
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

export default ProcessDriversModal;

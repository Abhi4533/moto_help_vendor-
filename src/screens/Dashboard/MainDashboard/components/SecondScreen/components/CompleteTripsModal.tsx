import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
import React, { useState } from 'react';
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

const CompleteTripsModal = () => {
  let rawData: any = [];
  const { setCompleteModalVisible: onDismiss, completeModalVisible: visible } =
    useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  const filteredData = rawData?.filter((driver: any) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      driver.driverId.toLowerCase().includes(query) ||
      driver.driverName.toLowerCase().includes(query) ||
      driver.vehiclePlate.toLowerCase().includes(query)
    );
  });

  const handleDriverPress = () => {
    onDismiss(false);
  };

  const renderDriverItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleDriverPress()}
      style={[styles.driverItem]}
    >
      <Card style={styles.driverCard}>
        <Card.Content>
          <View style={styles.driverHeader}>
            <View style={styles.driverInfo}>
              <View style={styles.nameRow}>
                <Text variant="titleMedium" style={styles.driverName}>
                  {item.driverName}
                </Text>
                <Chip
                  mode="flat"
                  textStyle={styles.statusChipText}
                  style={styles.completeChip}
                >
                  COMPLETED
                </Chip>
              </View>
              <Text variant="bodyMedium" style={styles.driverId}>
                🆔 {item.driverId} • 🚛 {item.vehiclePlate}
              </Text>
              <Text variant="bodySmall" style={styles.vehicleType}>
                {item.vehicleType} • Trip Completed
              </Text>
              <Text variant="bodySmall" style={styles.completionTime}>
                ✅ Completed 2 hours ago
              </Text>
            </View>
            <IconButton icon="check-circle" size={20} iconColor="#4CAF50" />
          </View>

          {/* Completed Trip Summary */}
          <View style={styles.summarySection}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Trip Summary
            </Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Total Distance
                </Text>
                <Text variant="bodyMedium" style={styles.summaryValue}>
                  {item.totalDistance.toFixed(0)} km
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Loads Delivered
                </Text>
                <Text variant="bodyMedium" style={styles.summaryValue}>
                  {item.loads?.length || 0}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Avg Distance
                </Text>
                <Text variant="bodyMedium" style={styles.summaryValue}>
                  {item.averageDistance.toFixed(0)} km
                </Text>
              </View>
            </View>
          </View>

          {/* Recent Completed Loads */}
          {item.loads && item.loads.length > 0 && (
            <View style={styles.loadsSection}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Recently Completed
              </Text>
              {item.loads.slice(0, 2).map((load: any) => (
                <View key={load.LoadPostID} style={styles.completedLoad}>
                  <View style={styles.loadInfo}>
                    <Text variant="bodySmall" style={styles.loadId}>
                      {load.LoadPostID}
                    </Text>
                    <Text variant="bodySmall" style={styles.loadDistance}>
                      🛣️ {load.OriginToDestinationKm.toFixed(1)} km
                    </Text>
                  </View>
                  <IconButton
                    icon="check-circle"
                    size={16}
                    iconColor="#4CAF50"
                  />
                </View>
              ))}
            </View>
          )}

          {/* Performance Metrics */}
          <View style={styles.performanceSection}>
            <View style={styles.performanceItem}>
              <Text variant="bodySmall" style={styles.performanceLabel}>
                Performance:
              </Text>
              <Text variant="bodySmall" style={styles.performanceValue}>
                Excellent ★★★★☆
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconButton
        icon="check-circle"
        size={64}
        iconColor={theme.colors.outline}
      />
      <Text variant="titleMedium" style={styles.emptyStateText}>
        No Completed Trips
      </Text>
      <Text variant="bodyMedium" style={styles.emptyStateSubtext}>
        No trips have been completed recently
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
            title="Completed Trips"
            subtitle={`${filteredData.length} trip${
              filteredData.length !== 1 ? 's' : ''
            } completed`}
          />
          <Badge
            size={24}
            style={[styles.badge, { backgroundColor: '#4CAF50' }]}
          >
            {filteredData.length}
          </Badge>
        </Appbar.Header>

        <Searchbar
          placeholder="Search completed trips..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          icon="magnify"
        />

        <FlatList
          data={filteredData}
          renderItem={renderDriverItem}
          keyExtractor={item => item.id}
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
  completeChip: {
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
  completionTime: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  summarySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a237e',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 12,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 10,
    marginBottom: 4,
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#1a237e',
    fontSize: 14,
  },
  loadsSection: {
    marginBottom: 16,
  },
  completedLoad: {
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
  loadDistance: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
  },
  performanceSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  performanceLabel: {
    color: '#666',
  },
  performanceValue: {
    color: '#4CAF50',
    fontWeight: '500',
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

export default CompleteTripsModal;

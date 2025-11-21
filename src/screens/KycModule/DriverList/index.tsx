// DriverList.tsx
import { getDrivers } from '@api/endpoints/driver.api';
import Icon from '@react-native-vector-icons/material-design-icons';
import { RootState } from '@store/index';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import TemporaryDashboardLayout from '../Layout/Layout';
import AddDriverModal from './components/AddDriverModal';
import DriverCard from './components/DriverCard';
import { styles } from './styles';

const DriverList = () => {
  const [driverData, setDriverData] = useState<any[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const vendorId = useSelector((state: RootState) => state?.auth?.token);

  // Fetch Drivers
  const fetchData = useCallback(
    async (isRefresh = false) => {
      try {
        if (!vendorId) return;
        isRefresh ? setRefreshing(true) : setLoading(true);
        const response = await getDrivers({ vendorid: vendorId });
        if (response?.status === '00') {
          const drivers = response?.data || [];
          setDriverData(drivers);
          setFilteredDrivers(drivers);
        }
      } catch (err) {
        console.log('Driver fetch error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [vendorId],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDrivers(driverData);
    } else {
      const filtered = driverData.filter(driver => {
        const details = driver?.DriverDetails;
        const searchLower = searchQuery.toLowerCase();
        return (
          details?.full_name?.toLowerCase().includes(searchLower) ||
          details?.Phone?.includes(searchQuery) ||
          details?.driving_license_no?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredDrivers(filtered);
    }
  }, [searchQuery, driverData]);

  const onRefresh = () => {
    fetchData(true);
  };

  return (
    <TemporaryDashboardLayout title="Driver List">
      <View style={styles.container}>
        {/* Header with Add Button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Registered Drivers</Text>
          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={styles.addButton}
            icon="plus"
            compact
          >
            Add Driver
          </Button>
        </View>

        {/* Search Field */}
        <View style={styles.searchContainer}>
          <TextInput
            mode="outlined"
            placeholder="Search by name, phone or license..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            left={<TextInput.Icon icon="magnify" />}
            right={
              searchQuery ? (
                <TextInput.Icon
                  icon="close"
                  onPress={() => setSearchQuery('')}
                />
              ) : null
            }
            outlineColor="#e0e0e0"
            activeOutlineColor="#3498db"
          />
        </View>

        {/* Search Results Info */}
        {searchQuery && (
          <View style={styles.searchInfo}>
            <Text style={styles.searchInfoText}>
              {filteredDrivers.length} driver
              {filteredDrivers.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading drivers...</Text>
          </View>
        ) : filteredDrivers.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon
              name={searchQuery ? 'magnify-close' : 'account-group'}
              size={64}
              color="#bdc3c7"
            />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No Drivers Found' : 'No Drivers'}
            </Text>
            <Text style={styles.emptyDescription}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first driver'}
            </Text>
            {!searchQuery && (
              <Button
                mode="contained"
                onPress={() => setModalVisible(true)}
                style={styles.emptyButton}
                icon="account-plus"
              >
                Add First Driver
              </Button>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredDrivers}
            keyExtractor={item => item.driver_id}
            renderItem={({ item }) => <DriverCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#3498db']}
                tintColor="#3498db"
              />
            }
          />
        )}

        {/* Add Driver Modal */}
        <AddDriverModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onDriverAdded={() => fetchData()}
        />
      </View>
    </TemporaryDashboardLayout>
  );
};

export default DriverList;

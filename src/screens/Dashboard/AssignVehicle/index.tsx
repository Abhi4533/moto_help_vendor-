import EmptyState from '@components/common/EmptyState';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Appbar, Button, FAB } from 'react-native-paper';

import {
  getAssignableDriver,
  getAssignableVehicle,
  postAssignVehicle,
  updateAssignVehicle,
} from '@api/endpoints/assign.api';
import { useGetAssignedVehiclesMutation } from '@api/hooks_api';
import Dropdown from '@components/common/Dropdown';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@store/index';
import { formatDate } from '@utils/dateUtils';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import AssignedCard from './components/AsignedCard';
import SearchSection from './components/SearchSection';
import TabBar from './components/TabBar';

interface Assignment {
  AssignID: string;
  [key: string]: any;
}

interface Driver {
  driver_id: string;
  DriverName: string;
  MobileNo: string;
  expiry_date?: string;
}

interface Vehicle {
  vehicleid: string;
  VehicleNumber: string;
}

const VehicleAssignment: React.FC = () => {
  const navigation = useNavigation();
  const vendorId = useSelector((state: RootState) => state?.auth?.token);
  const [getDriverAssignments, { isLoading }] =
    useGetAssignedVehiclesMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [activeTab, setActiveTab] = useState<'Y' | 'N' | undefined>(undefined);

  // Filter assignments based on search query and active tab
  const filteredAssignments = useMemo(() => {
    let filtered = assignments;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        item =>
          item.VehicleNumber?.toLowerCase().includes(
            searchQuery.toLowerCase(),
          ) ||
          item.DriverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.MobileNo?.includes(searchQuery),
      );
    }

    return filtered;
  }, [assignments, searchQuery]);

  const fetchAssignments = useCallback(async () => {
    if (!vendorId) return;

    try {
      const assignmentResponse = await getDriverAssignments({
        VendorID: vendorId,
        verify_flag: activeTab,
      }).unwrap();

      if (assignmentResponse.status === '00' && assignmentResponse.data) {
        setAssignments(assignmentResponse.data);
      } else {
        setAssignments([]);
        if (assignmentResponse.message) {
          Toast.show({ type: 'info', text1: assignmentResponse.message });
        }
      }
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch assignments',
        text2: error.message || 'Please try again',
      });
    }
  }, [vendorId, activeTab, getDriverAssignments]);

  const fetchAssignableData = useCallback(async () => {
    if (!vendorId) return;

    try {
      const [vehiclesResponse, driversResponse] = await Promise.all([
        getAssignableVehicle({ vendorId: vendorId }),
        getAssignableDriver({ vendorId: vendorId }),
      ]);

      if (vehiclesResponse?.status === '00') {
        setVehicles(vehiclesResponse.data || []);
      }

      if (driversResponse?.status === '00') {
        setDrivers(driversResponse.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching assignable data:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to load assignable data',
        text2: error.message || 'Please try again',
      });
    }
  }, [vendorId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchAssignments(), fetchAssignableData()]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchAssignments, fetchAssignableData]);

  const handleAssignVehicle = async () => {
    if (!selectedVehicleId || !selectedDriverId) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select both vehicle and driver',
      });
      return;
    }

    if (!vendorId) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'Vendor ID not found',
      });
      return;
    }

    try {
      const response = await postAssignVehicle({
        DriverID: selectedDriverId,
        VendorID: vendorId,
        VehicleID: selectedVehicleId,
      });

      if (response.status === '00') {
        Toast.show({ type: 'success', text1: 'Vehicle assigned successfully' });
        setShowModal(false);
        resetModal();
        await fetchAssignments();
      } else {
        Toast.show({
          type: 'error',
          text1: response?.message || 'Assignment failed',
        });
      }
    } catch (error: any) {
      console.error('Error assigning vehicle:', error);
      Toast.show({
        type: 'error',
        text1: 'Assignment failed',
        text2: error.message || 'Please try again',
      });
    }
  };

  const handleDeleteAssignment = async (assignId: string) => {
    if (!vendorId) return;

    try {
      const response = await updateAssignVehicle({
        AssignID: assignId,
        VendorID: vendorId,
        isDelete: true, // Assuming API supports this flag for deletion
      });

      if (response.status === '00') {
        Toast.show({
          type: 'success',
          text1: 'Assignment deleted successfully',
        });
        await fetchAssignments();
        await fetchAssignableData();
      } else {
        Toast.show({
          type: 'error',
          text1: response?.message || 'Deletion failed',
        });
      }
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      Toast.show({
        type: 'error',
        text1: 'Deletion failed',
        text2: error.message || 'Please try again',
      });
    }
  };

  const resetModal = () => {
    setSelectedVehicleId('');
    setSelectedDriverId('');
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetModal();
  };

  const driverData = useMemo(() => {
    return drivers.map(driver => ({
      value: driver.driver_id,
      label: `${driver.DriverName} - ${driver.MobileNo} - ${
        driver.expiry_date ? formatDate(driver.expiry_date) : 'No expiry'
      }`,
    }));
  }, [drivers]);

  const vehicleData = useMemo(() => {
    return vehicles.map(vehicle => ({
      value: vehicle.vehicleid,
      label: vehicle.VehicleNumber,
    }));
  }, [vehicles]);

  useLayoutEffect(() => {
    if (vendorId) {
      fetchAssignments();
      fetchAssignableData();
    }
  }, [vendorId, fetchAssignments, fetchAssignableData]);

  // Refresh data when tab changes
  useLayoutEffect(() => {
    if (vendorId) {
      fetchAssignments();
    }
  }, [activeTab, vendorId, fetchAssignments]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Assign Vehicle"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <TabBar setActiveTab={setActiveTab} activeTab={activeTab} />

      {/* List */}
      <FlatList
        data={filteredAssignments}
        keyExtractor={item => item.AssignID}
        renderItem={({ item }) => (
          <AssignedCard item={item} onDelete={handleDeleteAssignment} />
        )}
        ListEmptyComponent={
          <EmptyState title={isLoading ? 'Loading...' : 'No Data Found'} />
        }
        contentContainerStyle={[
          styles.listContent,
          filteredAssignments.length === 0 && {
            flex: 1,
            justifyContent: 'center',
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <FAB
        icon="plus"
        onPress={() => setShowModal(true)}
        style={styles.fab}
        color="#fff"
      />

      {/* Assignment Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <Pressable style={styles.backdrop} onPress={handleModalClose} />

        <View style={styles.bottomModal}>
          <View style={styles.modalHandle} />

          <Dropdown
            label="Vehicle Number"
            data={vehicleData}
            onChange={(text: any) => setSelectedVehicleId(text)}
            value={selectedVehicleId}
            placeholder="Select a vehicle"
          />

          <View style={styles.spacer} />

          <Dropdown
            label="Driver Number"
            data={driverData}
            onChange={(text: any) => setSelectedDriverId(text)}
            value={selectedDriverId}
            placeholder="Select a driver"
          />

          <View style={styles.spacer} />

          <Button
            mode="contained"
            onPress={handleAssignVehicle}
            style={styles.btn}
            buttonColor="#6366F1"
            disabled={!selectedVehicleId || !selectedDriverId}
          >
            Assign Vehicle
          </Button>

          <Button mode="text" onPress={handleModalClose} textColor="#6B7280">
            Cancel
          </Button>
        </View>
      </Modal>
    </View>
  );
};

export default VehicleAssignment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 18,
  },
  listContent: {
    padding: 12,
    paddingBottom: 120,
  },
  separator: {
    height: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6366F1',
    borderRadius: 28,
  },
  spacer: {
    height: 16,
  },

  /* Modal */
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomModal: {
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 60,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    marginBottom: 20,
  },
  btn: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 8,
  },
});

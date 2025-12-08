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
import { Appbar, Button, Dialog, FAB, Portal, Text } from 'react-native-paper';

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

  /** CONFIRMATION DIALOG STATES */
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openConfirm = (id: string) => {
    setPendingDeleteId(id);
    setConfirmVisible(true);
  };

  const closeConfirm = () => {
    setConfirmVisible(false);
    setPendingDeleteId(null);
  };

  const filteredAssignments = useMemo(() => {
    let filtered = assignments;

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

      if (assignmentResponse.status === '00') {
        setAssignments(assignmentResponse.data || []);
      } else {
        setAssignments([]);
        Toast.show({ type: 'info', text1: assignmentResponse.message });
      }
    } catch (error: any) {
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
        getAssignableVehicle({ vendorId }),
        getAssignableDriver({ vendorId }),
      ]);

      if (vehiclesResponse?.status === '00') {
        setVehicles(vehiclesResponse.data || []);
      }

      if (driversResponse?.status === '00') {
        setDrivers(driversResponse.data || []);
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load assignable data',
        text2: error.message || 'Please try again',
      });
    }
  }, [vendorId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchAssignments(), fetchAssignableData()]);
    setRefreshing(false);
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
        await fetchAssignableData();
      } else {
        Toast.show({ type: 'error', text1: response?.message });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Assignment failed',
        text2: error.message || 'Please try again',
      });
    }
  };

  const handleDeleteAssignment = async (assignId: string) => {
    try {
      const response = await updateAssignVehicle({
        AssignID: assignId,
        VendorID: vendorId,
        isDelete: true,
      });

      if (response.status === '00') {
        Toast.show({
          type: 'success',
          text1: 'Assignment released successfully',
        });
        await fetchAssignments();
        await fetchAssignableData();
      } else {
        Toast.show({ type: 'error', text1: response?.message });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Release failed',
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

  const driverData = useMemo(
    () =>
      drivers.map(driver => ({
        value: driver.driver_id,
        label: `${driver.DriverName} - ${driver.MobileNo} - ${
          driver.expiry_date ? formatDate(driver.expiry_date) : 'No expiry'
        }`,
      })),
    [drivers],
  );

  const vehicleData = useMemo(
    () =>
      vehicles.map(vehicle => ({
        value: vehicle.vehicleid,
        label: vehicle.VehicleNumber,
      })),
    [vehicles],
  );

  useLayoutEffect(() => {
    if (vendorId) {
      fetchAssignments();
      fetchAssignableData();
    }
  }, [vendorId]);

  useLayoutEffect(() => {
    if (vendorId) fetchAssignments();
  }, [activeTab]);

  return (
    <View style={styles.container}>
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

      <FlatList
        data={filteredAssignments}
        keyExtractor={item => item.AssignID}
        renderItem={({ item }) => (
          <AssignedCard item={item} onDelete={id => openConfirm(id)} />
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

      <FAB
        icon="plus"
        onPress={() => setShowModal(true)}
        style={styles.fab}
        color="#fff"
      />

      {/* ASSIGN VEHICLE BOTTOM MODAL */}
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

      {/* ⚠️ CONFIRMATION DIALOG */}
      <Portal>
        <Dialog visible={confirmVisible} onDismiss={closeConfirm}>
          <Dialog.Title style={{ fontWeight: '700' }}>
            Confirm Release
          </Dialog.Title>

          <Dialog.Content>
            <Text>
              Are you sure you want to release this vehicle assignment?
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={closeConfirm}>Cancel</Button>

            <Button
              onPress={async () => {
                if (pendingDeleteId) {
                  await handleDeleteAssignment(pendingDeleteId);
                }
                closeConfirm();
              }}
            >
              Release
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default VehicleAssignment;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#fff', elevation: 2 },
  headerTitle: { fontWeight: '700', fontSize: 18 },
  listContent: { padding: 12, paddingBottom: 120 },
  separator: { height: 8 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6366F1',
    borderRadius: 28,
  },
  spacer: { height: 16 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
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
  btn: { marginTop: 8, marginBottom: 12, borderRadius: 8 },
});

// ValidateVehicle.tsx
import Icon from '@react-native-vector-icons/material-design-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
  getRegisterdVehicles,
  postRegisterVehicles,
} from '@api/endpoints/vehicle.api';
import { useValidateVehicleMutation } from '@api/hooks_api';
import EmptyState from '@components/common/EmptyState';
import Loader from '@components/common/Loader';
import { RootState } from '@store/index';
import {
  updateValidationStatus,
  ValidationResult,
} from '@store/slices/validatedVehiclesSlice';
import Toast from 'react-native-toast-message';
import TemporaryDashboardLayout from '../Layout/Layout';
import { VehicleCard } from './components/VehicleCard';
import { VehicleItem } from './type';

const ValidateVehicle = () => {
  const dispatch = useDispatch();
  const vendorId = useSelector((state: RootState) => state.auth.token);
  const validationResults = useSelector(
    (state: RootState) => state.validatedVehicles.validationResults,
  );

  const [validateVehicle] = useValidateVehicleMutation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Filter vehicles based on search
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.VehicleNumber.toLowerCase().includes(search.toLowerCase()),
  );

  // Get validation status for a vehicle
  const getVehicleValidationStatus = useCallback(
    (vehicleNumber: string): ValidationResult | undefined => {
      return validationResults?.find(
        item => item.vehicleNumber === vehicleNumber,
      );
    },
    [validationResults],
  );

  // API fetch
  const fetchVehicles = useCallback(
    async (isRefresh = false) => {
      try {
        if (!vendorId) {
          setError('Vendor ID not found');
          setLoading(false);
          return;
        }

        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);
        const response = await getRegisterdVehicles({ vendorid: vendorId });

        if (response?.status === '00') {
          let incoming: VehicleItem[] = response?.data || [];

          // Map vehicles with their validation status
          incoming = incoming.map((vehicle: VehicleItem) => {
            const validationStatus = getVehicleValidationStatus(
              vehicle.VehicleNumber,
            );
            return {
              ...vehicle,
              validationStatus,
            };
          });
          setVehicles(incoming);
        } else {
          setError(response?.message || 'Failed to fetch vehicles');
        }
      } catch (err: any) {
        setError(err?.message || 'An error occurred while fetching vehicles');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [vendorId, getVehicleValidationStatus],
  );

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Handle validation
  const handleValidate = async (vehicle: VehicleItem) => {
    setValidatingId(vehicle.VehicleNumber);

    try {
      // Set as pending first
      dispatch(
        updateValidationStatus({
          vehicleNumber: vehicle.VehicleNumber,
          status: 'pending',
        }),
      );

      const response = await validateVehicle({
        rc_number: vehicle.VehicleNumber,
      }).unwrap();

      // Check if response indicates internal server error (invalid vehicle)
      if (response?.message === 'Internal server error') {
        dispatch(
          updateValidationStatus({
            vehicleNumber: vehicle.VehicleNumber,
            status: 'failed',
            failureReason: 'invalid_rc_number',
          }),
        );
        return;
      }

      // Check if vehicle validation was successful
      if (response?.status === '00' && response?.data) {
        const vehicleData = response.data;
        console.log({ vehicleData });
        // Check if vehicle type is supported (Goods Carrier)
        if (
          vehicleData?.VehicleTypesDetails?.vehicleCategory !==
          'Goods Carrier(HGV)'
        ) {
          dispatch(
            updateValidationStatus({
              vehicleNumber: vehicle.VehicleNumber,
              status: 'failed',
              failureReason: 'vehicle_type_not_supported',
            }),
          );
        } else {
          // Vehicle is valid and supported
          const response = await postRegisterVehicles({
            ...vehicleData,
            vendorid: vendorId,
          });
          if (response?.status === '00') {
            dispatch(
              updateValidationStatus({
                vehicleNumber: vehicle.VehicleNumber,
                status: 'success',
              }),
            );
          } else {
            Toast.show({
              type: 'error',
              text1: response?.message || 'Somthing went Wrong Please Try agin',
            });
          }
        }
      } else {
        // API returned non-00 status
        dispatch(
          updateValidationStatus({
            vehicleNumber: vehicle.VehicleNumber,
            status: 'failed',
            failureReason: 'invalid_rc_number',
          }),
        );
      }
    } catch (err: any) {
      dispatch(
        updateValidationStatus({
          vehicleNumber: vehicle.VehicleNumber,
          status: 'failed',
          failureReason: 'unknown_error',
        }),
      );
    } finally {
      setValidatingId(null);
      fetchVehicles(true);
    }
  };

  const onRefresh = () => {
    fetchVehicles(true);
  };

  return (
    <TemporaryDashboardLayout title="Validate Vehicles">
      <View style={styles.container}>
        <Loader visible={loading && !refreshing} />

        {/* Search Box */}
        <TextInput
          mode="outlined"
          placeholder="Search by vehicle number..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchBox}
          autoCapitalize="characters"
          left={<TextInput.Icon icon="magnify" />}
          right={
            search ? (
              <TextInput.Icon icon="close" onPress={() => setSearch('')} />
            ) : null
          }
          outlineColor="#e0e0e0"
          activeOutlineColor="#3498db"
        />

        {/* Error */}
        {!loading && error && (
          <View style={styles.centerContent}>
            <Icon name="alert-circle-outline" size={64} color="#e74c3c" />
            <Text style={styles.error}>{error}</Text>

            <Button
              mode="contained"
              onPress={() => fetchVehicles()}
              style={styles.retryButton}
            >
              Try Again
            </Button>
          </View>
        )}

        {/* No Data / No Results */}
        {!loading && !error && filteredVehicles.length === 0 && (
          <EmptyState
            title={
              vehicles.length === 0
                ? 'No Vehicles Found'
                : 'No Matching Vehicles'
            }
            description={
              vehicles.length === 0
                ? "You haven't registered any vehicles yet."
                : 'Try adjusting your search terms.'
            }
          />
        )}

        {/* List */}
        {!loading && !error && filteredVehicles.length > 0 && (
          <FlatList
            data={filteredVehicles}
            keyExtractor={(item, index) => `${item.VehicleNumber}-${index}`}
            renderItem={({ item }) => (
              <VehicleCard
                item={item}
                validatingId={validatingId}
                handleValidate={handleValidate}
                validationStatus={getVehicleValidationStatus(
                  item.VehicleNumber,
                )}
              />
            )}
            contentContainerStyle={styles.listContent}
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
      </View>
    </TemporaryDashboardLayout>
  );
};

export default ValidateVehicle;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  searchBox: { margin: 16, backgroundColor: '#fff' },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  error: {
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: { backgroundColor: '#3498db' },
  listContent: { padding: 16 },
});

// VehicleListScreen.tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Card, Searchbar } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

// API hooks
import {
  useGetVehiclesMutation,
  useInsertVehicleMutation,
  useLazyGetVehicleNumbersQuery,
  useValidateVehicleMutation,
} from '@api/hooks_api';
import EmptyState from './component/EmptyState';
import StatsFooter from './component/StatsFooter';
import StatusMessage from './component/StatusMessage';
import VehicleHeader from './component/VehicleHeader';
import { createVehiclePayload } from './helper';
import { styles } from './style';

// Types
interface Vehicle {
  id: string;
  registrationNo: string;
  status: 'pending' | 'validating' | 'validated' | 'submitted' | 'error';
  lastValidated: string | null;
  message: string | null;
  isExisting: boolean;
}

interface VehicleStats {
  registered: number;
  pending: number;
  total: number;
}

const VehicleListScreen: React.FC = () => {
  const token = useSelector((state: any) => state?.auth);

  // State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [validatingVehicleId, setValidatingVehicleId] = useState<string | null>(
    null,
  );
  const [initialLoad, setInitialLoad] = useState(true);

  // API Hooks
  const [
    getVehicleDetails,
    { data: vehicleDetails, isLoading: isDetailsLoading, error: detailsError },
  ] = useGetVehiclesMutation<any>();

  const [
    getVehicleNumber,
    { data: vehicleData, isLoading: isLoadingVehicles, error: vehiclesError },
  ] = useLazyGetVehicleNumbersQuery();

  const [validateVehicle, { isLoading: isValidating }] =
    useValidateVehicleMutation();
  const [insertVehicle] = useInsertVehicleMutation();

  // Memoized computed values with proper sorting
  const filteredAndSortedVehicles = useMemo(() => {
    const filtered = vehicles.filter(vehicle =>
      vehicle.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Sort: non-validated vehicles first, then validated vehicles
    return filtered.sort((a, b) => {
      const aIsValidated =
        a.status === 'submitted' || a.status === 'validated' || a.isExisting;
      const bIsValidated =
        b.status === 'submitted' || b.status === 'validated' || b.isExisting;

      if (aIsValidated && !bIsValidated) {
        return 1; // a (validated) should come after b (not validated)
      }
      if (!aIsValidated && bIsValidated) {
        return -1; // a (not validated) should come before b (validated)
      }

      // If both have same validation status, maintain original order
      return 0;
    });
  }, [vehicles, searchQuery]);

  const stats = useMemo((): VehicleStats => {
    const registered = vehicles.filter(
      v => v.status === 'submitted' || v.isExisting,
    ).length;
    const pending = vehicles.filter(v => v.status === 'pending').length;
    return { registered, pending, total: vehicles.length };
  }, [vehicles]);

  // Data initialization with proper vehicle categorization
  const initializeVehicles = useCallback(() => {
    let vehicleList: Vehicle[] = [];

    // Primary source - vehicle numbers API (non-validated vehicles)
    if (vehicleData?.status === '00' && Array.isArray(vehicleData.data)) {
      vehicleList = vehicleData.data.map((vehicle: any) => ({
        id:
          vehicle.VehicleID ||
          vehicle.VehicleNumber ||
          Math.random().toString(),
        registrationNo: vehicle.VehicleNumber,
        status: 'pending',
        lastValidated: null,
        message: null,
        isExisting: false,
      }));
    }

    // Secondary source - vehicle details API (validated/registered vehicles)
    if (vehicleDetails?.status === '00' && Array.isArray(vehicleDetails.data)) {
      vehicleDetails.data.forEach((detailedVehicle: any) => {
        const registrationNo = detailedVehicle.vehicleDetails?.registration_no;
        if (!registrationNo) return;

        const existingIndex = vehicleList.findIndex(
          v => v.registrationNo === registrationNo,
        );

        if (existingIndex >= 0) {
          // Update existing vehicle to validated status
          vehicleList[existingIndex] = {
            ...vehicleList[existingIndex],
            status: 'submitted',
            message: 'Vehicle already registered in system',
            isExisting: true,
          };
        } else {
          // Add new validated vehicle
          vehicleList.push({
            id: detailedVehicle.vehicleId || Math.random().toString(),
            registrationNo,
            status: 'submitted',
            lastValidated: new Date().toLocaleString(),
            message: 'Vehicle already registered in system',
            isExisting: true,
          });
        }
      });
    }

    setVehicles(vehicleList);
    if (initialLoad && vehicleList.length > 0) {
      setInitialLoad(false);
    }
  }, [vehicleData, vehicleDetails, initialLoad]);

  // API calls
  const fetchVehicleDetails = async () => {
    try {
      const response = await getVehicleDetails({
        vendorid: token?.vendorid,
      }).unwrap();
      console.log({ response });
      return response;
    } catch (error) {
      console.log('Vehicle details API not available');
      return null;
    }
  };

  const loadVehicleNumbers = async () => {
    try {
      return await getVehicleNumber({ vendorid: token.vendorid }).unwrap();
    } catch (error: any) {
      console.error('Error loading vehicle numbers:', error);
      if (vehicles.length === 0) {
        Alert.alert(
          'Service Temporarily Unavailable',
          'Unable to load vehicle list. Please pull down to refresh.',
          [{ text: 'OK' }],
        );
      }
      throw error;
    }
  };

  const loadInitialData = async () => {
    try {
      setInitialLoad(true);
      await Promise.all([loadVehicleNumbers(), fetchVehicleDetails()]);
    } catch (error) {
      console.log('Initial load completed with partial success');
    } finally {
      setInitialLoad(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadVehicleNumbers(), fetchVehicleDetails()]);
    } catch (error) {
      console.log('Refresh completed with partial success');
    } finally {
      setRefreshing(false);
    }
  };

  // Vehicle validation and submission

  const submitVehicleData = async (payload: any): Promise<boolean> => {
    try {
      const response = await insertVehicle(payload).unwrap();
      console.log({ response });
      if (response?.status === '00') {
        Toast.show({ type: 'success', text1: 'Vehicle created successfully!' });
        return response?.message;
      } else {
        Toast.show({
          type: 'error',
          text1: response?.message || 'Failed to create vehicle',
        });
        return response?.message;
      }
    } catch (error: any) {
      console.log({ error });
      let errorMessage = 'Failed to create vehicle. Please try again.';

      if (error?.status === 'FETCH_ERROR') {
        errorMessage =
          'Registration service temporarily unavailable. Please try again.';
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      Toast.show({ type: 'error', text1: errorMessage });
      return false;
    }
  };

  const handleValidate = async (vehicle: Vehicle) => {
    if (vehicle.status === 'submitted' || vehicle.isExisting) {
      Alert.alert('Info', 'This vehicle is already registered in the system.');
      return;
    }

    setValidatingVehicleId(vehicle.id);

    // Optimistic update
    setVehicles(prev =>
      prev.map(v =>
        v.id === vehicle.id ? { ...v, status: 'validating', message: null } : v,
      ),
    );

    try {
      const response = await validateVehicle({
        rc_number: vehicle.registrationNo,
      }).unwrap();

      if (response.status === '00') {
        const payload = createVehiclePayload(
          response,
          vehicle.registrationNo,
          token,
        );
        console.log({ payload });
        const submissionSuccess: any = await submitVehicleData(payload);

        setVehicles(prev =>
          prev.map(v =>
            v.id === vehicle.id
              ? {
                  ...v,
                  status: submissionSuccess ? 'submitted' : 'validated',
                  lastValidated: new Date().toLocaleString(),
                  message: submissionSuccess,
                  isExisting: submissionSuccess,
                }
              : v,
          ),
        );

        if (submissionSuccess) {
          setTimeout(() => fetchVehicleDetails(), 1000);
        }
      } else {
        throw new Error(response.message || 'Vehicle validation failed');
      }
    } catch (error: any) {
      const errorMessage =
        error?.status === 'FETCH_ERROR'
          ? 'Validation service temporarily unavailable. Please try again later.'
          : error?.data?.message ||
            error?.message ||
            'Validation failed. Please try again.';

      setVehicles(prev =>
        prev.map(v =>
          v.id === vehicle.id
            ? {
                ...v,
                status: 'error',
                lastValidated: new Date().toLocaleString(),
                message: errorMessage,
              }
            : v,
        ),
      );

      Alert.alert('Validation Error', errorMessage);
    } finally {
      setValidatingVehicleId(null);
    }
  };

  // Effects
  useEffect(() => {
    initializeVehicles();
  }, [initializeVehicles]);

  useEffect(() => {
    if (token?.vendorid) {
      loadInitialData();
    }
  }, [token?.vendorid]);

  useFocusEffect(
    useCallback(() => {
      if (token?.vendorid && !initialLoad) {
        onRefresh();
      }
    }, [token?.vendorid, initialLoad]),
  );

  // Render helpers
  const getButtonText = (vehicle: Vehicle) => {
    if (vehicle.status === 'submitted' || vehicle.isExisting)
      return 'Registered';
    if (vehicle.status === 'validating' || validatingVehicleId === vehicle.id)
      return 'Validating...';
    if (vehicle.status === 'error') return 'Try Again';
    return 'Validate';
  };

  const renderVehicleCard = (vehicle: Vehicle) => (
    <Card key={vehicle.id} style={styles.vehicleCard}>
      <Card.Content style={styles.cardContent}>
        <VehicleHeader
          vehicle={vehicle}
          onValidate={handleValidate}
          validatingVehicleId={validatingVehicleId}
          getButtonText={getButtonText}
        />

        {vehicle.message && <StatusMessage vehicle={vehicle} />}
      </Card.Content>
    </Card>
  );

  // Loading state
  if (initialLoad && vehicles.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading vehicles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search vehicles by registration number..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#6B7280"
        />
      </View>

      {/* Vehicle List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredAndSortedVehicles.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          filteredAndSortedVehicles.map(renderVehicleCard)
        )}
      </ScrollView>

      {/* Footer Stats */}
      {vehicles.length > 0 && <StatsFooter stats={stats} />}
    </View>
  );
};

// Styles

export default VehicleListScreen;

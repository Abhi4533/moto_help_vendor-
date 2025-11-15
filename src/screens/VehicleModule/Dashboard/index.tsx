import { useGetVehiclesMutation } from '@api/hooks_api';
import { useFocusEffect } from '@react-navigation/native';
import { RootState } from '@store/index';
import { PhotoResult, PhotoService } from '@utils/photoUtils';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StatusBar, View } from 'react-native';
import { useSelector } from 'react-redux';
import EmptyState from './components/EmptyState';
import Header from './components/Header';
import PhotoSelectionModal from './components/PhotoSelectionModal';
import QuickActions from './components/QuickActions';
import SearchFilter from './components/SearchFilter';
import VehicleCard from './components/VehicleCard';
import VehicleDetailsModal from './components/VehicleDetailsModal';
import { getStatusConfig } from './helper';
import { styles } from './styles';
import { Vehicle, VehiclePhoto, VehicleStatus } from './type';

const VehiclesDashboard: React.FC = () => {
  const data = useSelector((state: RootState) => state?.auth);
  const [getVehicleDetails, { data: vehicleDetails, isLoading }] =
    useGetVehiclesMutation<any>();

  console.log({ vehicleDetails });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<VehicleStatus>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Photo management state
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Details modal state
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Update vehicles when data comes from API
  React.useEffect(() => {
    if (vehicleDetails?.data) {
      setVehicles(vehicleDetails.data);
    }
  }, [vehicleDetails]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle: any) => {
      const matchesSearch =
        vehicle.vehicleDetails.registration_no
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vehicle.vehicleDetails.vehicle_manufacturer
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vehicle.vehicleDetails.maker_model
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vehicle.vehicleDetails.owner_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vehicle.vehicleDetails.chassis_number
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const currentDate = new Date();
      const isExpired =
        (vehicle.vehicleDetails.fit_upto &&
          new Date(vehicle.vehicleDetails.fit_upto) < currentDate) ||
        (vehicle.vehicleDetails.insurance_upto &&
          new Date(vehicle.vehicleDetails.insurance_upto) < currentDate) ||
        (vehicle.vehicleDetails.tax_upto &&
          new Date(vehicle.vehicleDetails.tax_upto) < currentDate);

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' &&
          vehicle.vehicleDetails.rc_status === 'ACTIVE' &&
          !isExpired) ||
        (selectedStatus === 'inactive' &&
          vehicle.vehicleDetails.rc_status === 'INACTIVE') ||
        (selectedStatus === 'expired' && isExpired);

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus, vehicles]);

  const filterOptions = useMemo(
    () => [
      {
        key: 'all',
        label: `All (${vehicles.length})`,
        status: 'all' as VehicleStatus,
      },
      {
        key: 'active',
        label: `Active (${vehicles.filter((v: any) => getStatusConfig(v).label === 'Active').length})`,
        status: 'active' as VehicleStatus,
      },
      {
        key: 'inactive',
        label: `Inactive (${vehicles.filter((v: any) => getStatusConfig(v).label === 'Inactive').length})`,
        status: 'inactive' as VehicleStatus,
      },
      {
        key: 'expired',
        label: `Expired (${vehicles.filter((v: any) => getStatusConfig(v).label === 'Expired').length})`,
        status: 'expired' as VehicleStatus,
      },
    ],
    [vehicles],
  );

  const fetchData = async () => {
    try {
      setRefreshing(true);
      await getVehicleDetails({
        vendorid: data?.vendorid,
      });
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (data?.vendorid) {
        fetchData();
      }
    }, [data?.vendorid]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Photo Management Functions
  const handleAddPhotoPress = (vehicleId: string) => {
    console.log('Add photo pressed for vehicle:', vehicleId);
    setSelectedVehicleId(vehicleId);
    setPhotoModalVisible(true);
  };

  const handleTakePhoto = async () => {
    console.log('Taking photo...');
    if (!selectedVehicleId) {
      Alert.alert('Error', 'No vehicle selected');
      return;
    }

    try {
      const photo = await PhotoService.takePhoto();
      console.log('Photo taken:', photo ? 'success' : 'cancelled');

      if (photo && photo.base64) {
        await addPhotoToVehicle(selectedVehicleId, photo);
        Alert.alert('Success', 'Photo added successfully!');
      } else if (photo === null) {
        // User cancelled, do nothing
        console.log('User cancelled photo capture');
      } else {
        Alert.alert('Error', 'Failed to capture photo');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please check permissions.');
    } finally {
      setPhotoModalVisible(false);
    }
  };

  const handlePickFromGallery = async () => {
    console.log('Picking from gallery...');
    if (!selectedVehicleId) {
      Alert.alert('Error', 'No vehicle selected');
      return;
    }

    try {
      const photo = await PhotoService.pickFromGallery();
      console.log('Photo picked:', photo ? 'success' : 'cancelled');

      if (photo && photo.base64) {
        await addPhotoToVehicle(selectedVehicleId, photo);
        Alert.alert('Success', 'Photo added successfully!');
      } else if (photo === null) {
        // User cancelled, do nothing
        console.log('User cancelled gallery selection');
      } else {
        Alert.alert('Error', 'Failed to select photo');
      }
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Alert.alert(
        'Error',
        'Failed to pick photo from gallery. Please check permissions.',
      );
    } finally {
      setPhotoModalVisible(false);
    }
  };

  const addPhotoToVehicle = async (
    vehicleId: string,
    photoData: PhotoResult,
  ) => {
    console.log('Adding photo to vehicle:', vehicleId);

    setVehicles(prevVehicles =>
      prevVehicles.map(vehicle => {
        if (vehicle.vehicleId === vehicleId) {
          const currentPhotos = vehicle.vehiclePhotos || {};
          const photoCount = Object.keys(currentPhotos).length;

          if (photoCount >= 5) {
            Alert.alert(
              'Limit Reached',
              'Maximum 5 photos allowed per vehicle',
            );
            return vehicle;
          }

          const newPhoto: VehiclePhoto = {
            id: PhotoService.generatePhotoId(),
            base64: photoData.base64,
            uri: photoData.uri,
            fileName: photoData.fileName || `photo_${Date.now()}.jpg`,
            type: photoData.type || 'image/jpeg',
            uploadedAt: new Date().toISOString(),
          };

          console.log('New photo added:', newPhoto.id);

          return {
            ...vehicle,
            vehiclePhotos: {
              ...currentPhotos,
              [newPhoto.id]: newPhoto,
            },
          };
        }
        return vehicle;
      }),
    );
  };

  const getCurrentPhotoCount = (): number => {
    if (!selectedVehicleId) return 0;
    const vehicle = vehicles.find(v => v.vehicleId === selectedVehicleId);
    return vehicle?.vehiclePhotos
      ? Object.keys(vehicle.vehiclePhotos).length
      : 0;
  };

  // Handle verify action
  const handleVerifyVehicle = (vehicleId: string) => {
    console.log('Verify vehicle:', vehicleId);
    // Add your verification logic here
    Alert.alert('Verify Vehicle', `Verify vehicle ${vehicleId}?`);
  };

  // Handle view details action - Now opens modal
  const handleViewDetails = (vehicle: Vehicle) => {
    console.log('View details for vehicle:', vehicle.vehicleId);
    setSelectedVehicle(vehicle);
    setDetailsModalVisible(true);
  };

  // Handle edit action
  const handleEditVehicle = (vehicle: Vehicle) => {
    console.log('Edit vehicle:', vehicle.vehicleId);
    // Navigate to edit screen
    Alert.alert(
      'Edit Vehicle',
      `Edit vehicle ${vehicle.vehicleDetails.registration_no}`,
    );
  };

  // Handle modal close
  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false);
    setSelectedVehicle(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />

      <Header dummyVehicles={vehicles} filteredVehicles={filteredVehicles} />

      <QuickActions />

      <SearchFilter
        filterOptions={filterOptions}
        searchQuery={searchQuery}
        selectedStatus={selectedStatus}
        setSearchQuery={setSearchQuery}
        setSelectedStatus={setSelectedStatus}
      />

      <FlatList
        data={filteredVehicles}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onAddPhoto={handleAddPhotoPress}
            onVerify={handleVerifyVehicle}
            onViewDetails={handleViewDetails}
            onEdit={handleEditVehicle}
          />
        )}
        keyExtractor={item => item.vehicleId}
        showsVerticalScrollIndicator={false}
        style={styles.vehiclesList}
        contentContainerStyle={[
          styles.listContent,
          filteredVehicles.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <EmptyState
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSelectedStatus={setSelectedStatus}
          />
        }
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* Photo Selection Modal */}
      <PhotoSelectionModal
        visible={photoModalVisible}
        onDismiss={() => setPhotoModalVisible(false)}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        currentPhotoCount={getCurrentPhotoCount()}
        maxPhotos={5}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        visible={detailsModalVisible}
        vehicle={selectedVehicle}
        onDismiss={handleCloseDetailsModal}
        onEdit={handleEditVehicle}
        onAddPhoto={handleAddPhotoPress}
      />
    </View>
  );
};

export default VehiclesDashboard;

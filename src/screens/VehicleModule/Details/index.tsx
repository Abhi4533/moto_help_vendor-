// components/VehicleDetailsScreen.tsx
import { useDeleteVehiclesMutation } from '@api/hooks_api';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { Button, Card, IconButton, Snackbar, Text } from 'react-native-paper';
import { Vehicle } from '../type';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import VehicleDetails from './components/VehicleDetails';
import VehicleDocument from './components/VehicleDocument';
import VehicleHeader from './components/VehicleHeader';
import VehicleHistory from './components/VehicleHistory';
import VehicleModal from './components/VehicleModal';
import { styles } from './style';

interface RouteParams {
  vehicle: Vehicle;
}

const VehicleDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { vehicle } = route.params as RouteParams;
  const [deleteVehicle] = useDeleteVehiclesMutation();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [activeTab, setActiveTab] = useState<
    'details' | 'documents' | 'history'
  >('details');

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    // API call to delete vehicle would go here
    const payload: any = {
      vehicleid: vehicle?.vehicleId,
      vendorid: vehicle?.vendorid,
      registration_no: vehicle?.vehicleDetails?.registration_no,
    };

    try {
      const response: any = await deleteVehicle(payload);

      if (response?.data?.status === '00') {
        setDeleteModalVisible(false);
        setSnackbarMessage('Vehicle deleted successfully');
        setSnackbarVisible(true);
        setTimeout(() => navigation.goBack(), 1000);
      }
    } catch (error) {
      setDeleteModalVisible(false);
      setSnackbarMessage('Failed to delete vehicle');
      setSnackbarVisible(true);
      console.error('Delete Vehicle Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />

      {/* Header */}
      <Header handleDelete={handleDelete} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Vehicle Header */}
        <VehicleHeader vehicle={vehicle} />

        {/* Navigation Tabs */}
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Details Tab */}
        {activeTab === 'details' && (
          <VehicleDetails
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarVisible={setSnackbarVisible}
            vehicle={vehicle}
          />
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && <VehicleDocument vehicle={vehicle} />}

        {/* History Tab */}
        {activeTab === 'history' && <VehicleHistory vehicle={vehicle} />}

        {/* Danger Zone */}
        <Card style={styles.dangerZoneCard}>
          <Card.Content>
            <View style={styles.dangerZoneHeader}>
              <IconButton icon="alert" size={24} iconColor="#EF4444" />
              <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
            </View>
            <Text style={styles.dangerZoneText}>
              Once you delete this vehicle, all associated data will be
              permanently removed. This action cannot be undone.
            </Text>
            <Button
              mode="contained"
              icon="delete"
              onPress={handleDelete}
              style={styles.deleteButton}
              labelStyle={styles.deleteButtonLabel}
            >
              Delete Vehicle
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Edit Modal */}
      <VehicleModal
        confirmDelete={confirmDelete}
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        vehicle={vehicle}
      />

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default VehicleDetailsScreen;

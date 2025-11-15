import React from 'react';
import { Text, View } from 'react-native';
import { Button, IconButton, Modal, Portal } from 'react-native-paper';
import { styles } from '../style';

interface VehicleModalProps {
  deleteModalVisible: any;
  setDeleteModalVisible: any;
  vehicle: any;
  confirmDelete: any;
}

const VehicleModal = ({
  deleteModalVisible,
  setDeleteModalVisible,
  vehicle,
  confirmDelete,
}: VehicleModalProps) => {
  return (
    <Portal>
      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        onDismiss={() => setDeleteModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.deleteModalContent}>
          <IconButton icon="alert" size={48} iconColor="#EF4444" />
          <Text style={styles.modalTitle}>Delete Vehicle?</Text>
          <Text style={styles.deleteText}>
            Are you sure you want to delete vehicle{' '}
            {vehicle.vehicleDetails.registration_no}? This action cannot be
            undone and all vehicle data will be permanently lost.
          </Text>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setDeleteModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={confirmDelete}
              style={[styles.modalButton, { backgroundColor: '#EF4444' }]}
            >
              Delete Vehicle
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default VehicleModal;

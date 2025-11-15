import React from 'react';
import { Alert, Modal, View } from 'react-native';
import { Button, Card, Portal, Text } from 'react-native-paper';
import { styles } from '../styles';

interface PhotoSelectionModalProps {
  visible: boolean;
  onDismiss: () => void;
  onTakePhoto: () => void;
  onPickFromGallery: () => void;
  currentPhotoCount: number;
  maxPhotos: number;
}

const PhotoSelectionModal: React.FC<PhotoSelectionModalProps> = ({
  visible,
  onDismiss,
  onTakePhoto,
  onPickFromGallery,
  currentPhotoCount,
  maxPhotos,
}) => {
  const handleAction = (action: () => void) => {
    if (currentPhotoCount >= maxPhotos) {
      Alert.alert(
        'Maximum Photos Reached',
        `You can only add up to ${maxPhotos} photos. Please remove some existing photos to add new ones.`,
      );
      return;
    }
    action();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onDismiss}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.photoModalCard}>
            <Card.Content>
              <Text style={styles.modalTitle}>Add Vehicle Photo</Text>
              <Text style={styles.modalSubtitle}>
                Photos: {currentPhotoCount}/{maxPhotos}
              </Text>

              <View style={styles.modalButtons}>
                <Button
                  mode="contained"
                  onPress={() => handleAction(onTakePhoto)}
                  style={styles.modalButton}
                  icon="camera"
                  contentStyle={styles.modalButtonContent}
                >
                  Take Photo
                </Button>

                <Button
                  mode="contained"
                  onPress={() => handleAction(onPickFromGallery)}
                  style={[styles.modalButton, { backgroundColor: '#6B7280' }]}
                  icon="image"
                  contentStyle={styles.modalButtonContent}
                >
                  Choose from Gallery
                </Button>

                <Button
                  mode="outlined"
                  onPress={onDismiss}
                  style={styles.modalCancelButton}
                  contentStyle={styles.modalButtonContent}
                >
                  Cancel
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </Modal>
    </Portal>
  );
};

export default PhotoSelectionModal;

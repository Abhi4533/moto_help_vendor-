import { PhotoService } from '@utils/photoUtils';
import React from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { styles } from '../styles';
import { VehiclePhoto } from '../type';

interface VehiclePhotoGalleryProps {
  photos: VehiclePhoto[];
  onRemovePhoto: (photoId: string) => void;
  onAddPhoto: () => void;
  maxPhotos: number;
}

const VehiclePhotoGallery: React.FC<VehiclePhotoGalleryProps> = ({
  photos,
  onRemovePhoto,
  onAddPhoto,
  maxPhotos,
}) => {
  const handleRemovePhoto = (photoId: string, fileName: string = 'photo') => {
    Alert.alert(
      'Remove Photo',
      `Are you sure you want to remove ${fileName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemovePhoto(photoId),
        },
      ],
    );
  };

  return (
    <View style={styles.photoGalleryContainer}>
      <View style={styles.photoGalleryHeader}>
        <Text style={styles.photoGalleryTitle}>
          Vehicle Photos ({photos.length}/{maxPhotos})
        </Text>
        {photos.length < maxPhotos && (
          <IconButton
            icon="plus"
            size={20}
            onPress={onAddPhoto}
            style={styles.addPhotoButton}
          />
        )}
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyPhotosContainer}>
          <Text style={styles.emptyPhotosText}>No photos added yet</Text>
          <IconButton
            icon="camera-plus"
            size={24}
            onPress={onAddPhoto}
            style={styles.emptyAddPhotoButton}
          />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoScrollContent}
        >
          {photos.map((photo, index) => (
            <View key={photo.id} style={styles.photoItem}>
              <Image
                source={{
                  uri: PhotoService.getBase64DataUrl(photo.base64, photo.type),
                }}
                style={styles.photoImage}
                resizeMode="cover"
              />
              <View style={styles.photoOverlay}>
                <Text style={styles.photoIndex}>{index + 1}</Text>
                <IconButton
                  icon="close"
                  size={16}
                  iconColor="#fff"
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(photo.id, photo.fileName)}
                />
              </View>
            </View>
          ))}

          {photos.length < maxPhotos && (
            <TouchableOpacity style={styles.addPhotoItem} onPress={onAddPhoto}>
              <View style={styles.addPhotoIcon}>
                <Text style={styles.addPhotoText}>+</Text>
              </View>
              <Text style={styles.addPhotoLabel}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default VehiclePhotoGallery;

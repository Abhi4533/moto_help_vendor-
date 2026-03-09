import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import PhotoSelectionModal from '@screens/VehicleModule/Dashboard/components/PhotoSelectionModal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function DriverDocument() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [images, setImages] = useState({
    aadharFront: '',
    aadharBack: '',
    licenseFront: '',
    licenseBack: '',
  });

  const openModal = (field: string) => {
    setActiveField(field);
    setModalVisible(true);
  };

  const saveImage = (base64: string) => {
    setImages(prev => ({ ...prev, [activeField]: base64 }));
    setModalVisible(false);
  };
  const takephoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result.assets?.length) {
      saveImage(result.assets[0].base64 || '');
    }
  };
  const removeImage = (field: string) => {
    setImages(prev => ({
      ...prev,
      [field]: '',
    }));
  };
  const pickFromGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result.assets?.length) {
      saveImage(result.assets[0].base64 || '');
    }
  };

  const renderImage = (base64: string) => {
    if (!base64) {
      return require('../../../../assets/images/aadharfront.jpeg');
    }

    return { uri: `data:image/jpeg;base64,${base64}` };
  };

  return (
    <View style={styles.container}>
      {/* Row 1 */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>Aadhaar Card (Front)</Text>

          <TouchableOpacity
            style={styles.imageBox}
            onPress={() => openModal('aadharFront')}
          >
            <Image
              source={renderImage(images.aadharFront)}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Aadhaar Card (Back)</Text>

          <TouchableOpacity
            style={styles.imageBox}
            onPress={() => openModal('aadharBack')}
          >
            <Image
              source={renderImage(images.aadharBack)}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>Drivers License (Front)</Text>

          <TouchableOpacity
            style={styles.imageBox}
            onPress={() => openModal('licenseFront')}
          >
            <Image
              source={renderImage(images.licenseFront)}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Drivers License (Back)</Text>

          <TouchableOpacity
            style={styles.imageBox}
            onPress={() => openModal('licenseBack')}
          >
            <Image
              source={renderImage(images.licenseBack)}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
      </View>
      <PhotoSelectionModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onTakePhoto={takephoto}
        onPickFromGallery={pickFromGallery}
        currentPhotoCount={1}
        maxPhotos={1}
      />
      {/* Button */}
      {/* <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Validate Driver</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  card: {
    width: '48%',
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },

  imageBox: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 90,
  },

  button: {
    marginTop: 20,
    backgroundColor: '#1C4FA3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

import { Platform } from 'react-native';
import {
  check,
  Permission,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

export type AppPermission =
  | 'camera'
  | 'gallery'
  | 'storage'
  | 'location'
  | 'background-location'
  | 'contacts'
  | 'microphone'
  | 'bluetooth';

const permissionMap: Record<AppPermission, Permission[]> = {
  camera: [
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  ],

  gallery: [
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : Number(Platform.Version) >= 33
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ],

  storage: [
    Number(Platform.Version) >= 33
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ],

  location: [
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ],

  'background-location': [
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_ALWAYS
      : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  ],

  contacts: [
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CONTACTS
      : PERMISSIONS.ANDROID.READ_CONTACTS,
  ],

  microphone: [
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO,
  ],

  bluetooth: [
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.BLUETOOTH
      : PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  ],
};

export const requestPermission = async (type: AppPermission) => {
  const permissions = permissionMap[type];

  for (const perm of permissions) {
    const result = await request(perm);
    if (result !== RESULTS.GRANTED) return false;
  }

  return true;
};

export const checkPermission = async (type: AppPermission) => {
  const permissions = permissionMap[type];

  for (const perm of permissions) {
    const result = await check(perm);
    if (result === RESULTS.GRANTED) return true;
  }

  return false;
};

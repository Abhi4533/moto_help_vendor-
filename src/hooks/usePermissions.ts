// src/hooks/usePermissions.ts
import { useEffect, useState } from 'react';
import { Permission, PermissionsAndroid, Platform } from 'react-native';

export const usePermissions = (permissions: Permission[]) => {
  const [granted, setGranted] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.requestMultiple(permissions);
      const allGranted = Object.values(result).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED,
      );
      setGranted(allGranted);
    } else {
      setGranted(true);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return granted;
};

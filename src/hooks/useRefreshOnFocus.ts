// src/hooks/useRefreshOnFocus.ts
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export const useRefreshOnFocus = (callback: () => void) => {
  useFocusEffect(
    useCallback(() => {
      callback();
    }, [callback]),
  );
};

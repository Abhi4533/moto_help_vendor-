// utils/device.ts
import { Dimensions, Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';
export const screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
export const isSmallDevice = screen.height < 700;

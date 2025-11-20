// persistConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistConfig } from 'redux-persist';

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'app', 'kyc', 'validatedVehicles'], // add slices you want
};

export default persistConfig;

// KycNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BankVerification from '@screens/KycModule/BankVerification';
import TemporaryDashboard from '@screens/KycModule/Dashboard';
import DriverList from '@screens/KycModule/DriverList';
import ValidateVehicle from '@screens/KycModule/ValidateVehicle';
import React from 'react';

export type KycStackParamList = {
  TemporaryDashboard: undefined;
  ValidateVehicle: undefined;
  DriverList: undefined;
  BankVerification: undefined;
};

const Stack = createNativeStackNavigator<KycStackParamList>();

const KycNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TemporaryDashboard" component={TemporaryDashboard} />
    <Stack.Screen name="ValidateVehicle" component={ValidateVehicle} />
    <Stack.Screen name="DriverList" component={DriverList} />
    <Stack.Screen name="BankVerification" component={BankVerification} />
  </Stack.Navigator>
);

export default KycNavigator;

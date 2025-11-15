import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
// import AddressVerification from '../screens/KycModule/AddressVerification';
// import BankVerification from '../screens/KycModule/BankVerification';
// import PanVerification from '../screens/KycModule/PanVerification';
import TemporaryDashboard from '../screens/KycModule/TemporaryDashboard';
// import UploadDocuments from '../screens/KycModule/UploadDocuments';

export type KycStackParamList = {
  TemporaryDashboard: undefined;
  UploadDocuments: undefined;
  PanVerification: undefined;
  BankVerification: undefined;
  AddressVerification: undefined;
};

const Stack = createNativeStackNavigator<KycStackParamList>();

const KycNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TemporaryDashboard" component={TemporaryDashboard} />
    {/* <Stack.Screen name="UploadDocuments" component={UploadDocuments} />
    <Stack.Screen name="PanVerification" component={PanVerification} />
    <Stack.Screen name="BankVerification" component={BankVerification} />
    <Stack.Screen name="AddressVerification" component={AddressVerification} /> */}
  </Stack.Navigator>
);

export default KycNavigator;

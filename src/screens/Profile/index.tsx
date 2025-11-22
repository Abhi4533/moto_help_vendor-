// ProfileNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ProfileCompanyInfo from './ProfileCompanyInfo';
import ProfileDocuments from './ProfileDocuments';
import ProfileEmployee from './ProfileEmployee';
import ProfileVehicles from './ProfileVehicles';

export type ProfileStackParamList = {
  ProfileCompanyInfo: undefined;
  ProfileDocuments: undefined;
  ProfileEmployee: undefined;
  ProfileVehicles: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProfileCompanyInfo" component={ProfileCompanyInfo} />
      <Stack.Screen name="ProfileEmployee" component={ProfileEmployee} />
      <Stack.Screen name="ProfileVehicles" component={ProfileVehicles} />
      <Stack.Screen name="ProfileDocuments" component={ProfileDocuments} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;

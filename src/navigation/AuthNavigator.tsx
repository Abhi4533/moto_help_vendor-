import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MobileNumberScreen from '../screens/AuthModule/Login';
import OTPVerify from '../screens/AuthModule/OTPVerify';
import Register from '../screens/AuthModule/Register';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerify: { phoneNumber: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={MobileNumberScreen} />
    <Stack.Screen name="OTPVerify" component={OTPVerify} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

export default AuthNavigator;

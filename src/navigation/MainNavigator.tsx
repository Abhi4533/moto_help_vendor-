import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MainDashboard from '../screens/Dashboard/MainDashboard';
// import MainDashboard from '../screens/Dashboard/MainDashboard';
// import DriverList from '../screens/DriverModule/DriverList';
// import LiveTracking from '../screens/MapModule/LiveTracking';
// import TripAssign from '../screens/TripModule/TripAssign';
// import VehicleList from '../screens/VehicleModule/VehicleList';

export type MainStackParamList = {
  Dashboard: undefined;
  Vehicles: undefined;
  Drivers: undefined;
  Assign: undefined;
  Available: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={MainDashboard} />
    <Stack.Screen name="Vehicles" component={MainDashboard} />
    <Stack.Screen name="Drivers" component={MainDashboard} />
    <Stack.Screen name="Assign" component={MainDashboard} />
    <Stack.Screen name="Available" component={MainDashboard} />
  </Stack.Navigator>
);

export default MainNavigator;

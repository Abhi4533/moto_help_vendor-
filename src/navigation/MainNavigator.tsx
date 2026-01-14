import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VehicleAssignment from '@screens/Dashboard/AssignVehicle';
import AvailabileVehicle from '@screens/Dashboard/AvailabileVehicle';
import DriverList from '@screens/Dashboard/DriverList';
import ValidateVehicle from '@screens/Dashboard/ValidateVehicle';
import ProfileNavigator from '@screens/Profile';
import { emitVendorJoin } from '@socket/socket.emitters';
import { registerSocketListeners } from '@socket/socket.listeners';
import { RootState } from '@store/index';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  ProfileNavigator: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) return;
    registerSocketListeners();
    emitVendorJoin(token);
  }, [token]);
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={MainDashboard} />
      <Stack.Screen name="Vehicles" component={ValidateVehicle} />
      <Stack.Screen name="Drivers" component={DriverList} />
      <Stack.Screen name="Assign" component={VehicleAssignment} />
      <Stack.Screen name="Available" component={AvailabileVehicle} />
      <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

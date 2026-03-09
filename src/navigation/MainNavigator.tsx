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
import DriverScan from '@screens/Dashboard/MainDashboard/DriverOnboarding/DriverScan';
import DriverDocument from '@screens/Dashboard/MainDashboard/DriverOnboarding/DriverDocument';
import DriverOnboard from '@screens/Dashboard/MainDashboard/DriverOnboarding/DriverOnboard';
import DriverRegister from '@screens/Dashboard/MainDashboard/DriverOnboarding/DriverRegister';
import Index from '@screens/Dashboard/MainDashboard/DriverOnboarding/Index';
import DriverDiscontinue from '@screens/Dashboard/MainDashboard/DriverOnboarding/DriverDiscontinue';
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
  DriverScan: undefined;
  DriverRegister: undefined;
  DriverOnboard: undefined;
  DriverDocument: undefined;
  DriverIndex: undefined;
  DriverDiscontinue: undefined;
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
      <Stack.Screen name="DriverScan" component={DriverScan} />
      <Stack.Screen name="DriverRegister" component={DriverRegister} />
      <Stack.Screen name="DriverOnboard" component={DriverOnboard} />
      <Stack.Screen name="DriverDocument" component={DriverDocument} />
      <Stack.Screen name="DriverIndex" component={Index} />
      <Stack.Screen name="DriverDiscontinue" component={DriverDiscontinue} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import MainDashboard from '../screens/Dashboard/MainDashboard';
// import MainDashboard from '../screens/Dashboard/MainDashboard';
// import DriverList from '../screens/DriverModule/DriverList';
// import LiveTracking from '../screens/MapModule/LiveTracking';
// import TripAssign from '../screens/TripModule/TripAssign';
// import VehicleList from '../screens/VehicleModule/VehicleList';

export type MainTabParamList = {
  Dashboard: undefined;
  Vehicles: undefined;
  Drivers: undefined;
  Trips: undefined;
  Tracking: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Dashboard" component={MainDashboard} />
    {/* <Tab.Screen name="Dashboard" component={MainDashboard} />
    <Tab.Screen name="Vehicles" component={VehicleList} />
    <Tab.Screen name="Drivers" component={DriverList} />
    <Tab.Screen name="Trips" component={TripAssign} />
    <Tab.Screen name="Tracking" component={LiveTracking} /> */}
  </Tab.Navigator>
);

export default MainNavigator;

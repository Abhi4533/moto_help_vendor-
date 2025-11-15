// BottomTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

// import AssignScreen from '../screens/Dashboard/Assign/AssignScreen';
// import AvailableScreen from '../screens/Dashboard/Available/AvailableScreen';
// import DriverScreen from '../screens/Dashboard/Driver/DriverScreen';
// import HomeScreen from '../screens/Dashboard/Home/HomeScreen';
// import VehicleScreen from '../screens/Dashboard/Vehicle/VehicleScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      // tabBar={({ state, navigation }) => (
      //   <View style={styles.tabBar}>
      //     {state.routes.map((route, index) => (
      //       <TouchableOpacity
      //         key={route.key}
      //         style={styles.tabItem}
      //         onPress={() => navigation.navigate(route.name)}
      //       >
      //         <Text>{route.name}</Text>
      //       </TouchableOpacity>
      //     ))}
      //   </View>
      // )}
    >
      {/* <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Vehicle" component={VehicleScreen} />
      <Tab.Screen name="Driver" component={DriverScreen} />
      <Tab.Screen name="Assign" component={AssignScreen} />
      <Tab.Screen name="Available" component={AvailableScreen} /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

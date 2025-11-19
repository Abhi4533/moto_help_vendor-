// CustomDrawer.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Drawer, Text } from 'react-native-paper';

export type DrawerKey =
  | 'dashboard'
  | 'vehicles'
  | 'drivers'
  | 'ekyc'
  | 'logout';

interface Props {
  visible: boolean;
  active: DrawerKey;
  onSelect: (key: DrawerKey) => void;
}

const CustomDrawer: React.FC<Props> = ({ visible, active, onSelect }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Drawer ALWAYS stays on the LEFT */}
      <View style={styles.drawer}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <Avatar.Image
            size={60}
            source={{
              uri: 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg',
            }}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john@example.com</Text>
        </View>

        <Drawer.Section style={styles.menuSection}>
          <Drawer.Item
            label="Dashboard"
            icon="view-dashboard"
            active={active === 'dashboard'}
            onPress={() => onSelect('dashboard')}
          />
          <Drawer.Item
            label="Vehicles"
            icon="truck"
            active={active === 'vehicles'}
            onPress={() => onSelect('vehicles')}
          />
          <Drawer.Item
            label="Drivers"
            icon="account-group"
            active={active === 'drivers'}
            onPress={() => onSelect('drivers')}
          />
          <Drawer.Item
            label="eKYC"
            icon="shield-account"
            active={active === 'ekyc'}
            onPress={() => onSelect('ekyc')}
          />
        </Drawer.Section>

        <Drawer.Section>
          <Drawer.Item
            label="Logout"
            icon="logout"
            onPress={() => onSelect('logout')}
          />
        </Drawer.Section>
      </View>

      {/* Dark Background on right side */}
      <TouchableOpacity
        style={styles.background}
        onPress={() => onSelect(active)}
      />
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row', // LEFT -> RIGHT
  },

  drawer: {
    width: 280,
    backgroundColor: '#fff',
    elevation: 12,
    paddingTop: 40,
    height: '100%',
  },

  background: {
    flex: 1,
    backgroundColor: '#00000066',
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    color: '#777',
    marginTop: 4,
  },
  menuSection: {
    marginTop: 20,
  },
});

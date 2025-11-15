import React from 'react';
import { Appbar } from 'react-native-paper';
import { getStatusConfig } from '../helper';
import { styles } from '../styles';

interface HeaderProps {
  filteredVehicles: any;
  dummyVehicles: any;
}

const Header = ({ filteredVehicles, dummyVehicles }: HeaderProps) => {
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action
        icon="menu"
        // onPress={() => navigation.openDrawer()}
        color="#fff"
      />
      <Appbar.Content
        title="Vehicle Management"
        titleStyle={styles.headerTitle}
        subtitle={`${filteredVehicles.length} vehicles • ${dummyVehicles.filter((v: any) => getStatusConfig(v).label === 'Active').length} active`}
      />
      <Appbar.Action icon="bell-outline" color="#fff" onPress={() => {}} />
      <Appbar.Action icon="account-circle" color="#fff" onPress={() => {}} />
    </Appbar.Header>
  );
};

export default Header;

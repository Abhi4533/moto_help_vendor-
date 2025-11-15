import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Appbar, Divider, Menu } from 'react-native-paper';
import { styles } from '../style';

interface HeaderProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
}

const Header: FC<HeaderProps> = ({ menuVisible, setMenuVisible }) => {
  const navigation = useNavigation<any>();
  return (
    <Appbar.Header style={{ backgroundColor: '#6366F1' }}>
      <Appbar.Action
        icon="menu"
        color="#fff"
        onPress={() => navigation.toggleDrawer()}
      />
      <Appbar.Content
        title="Dashboard"
        color="#fff"
        titleStyle={styles.appbarTitle}
      />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action
            color="#fff"
            icon="dots-vertical"
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        <Menu.Item onPress={() => {}} title="Refresh Data" />
        <Menu.Item onPress={() => {}} title="Export Report" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Settings" />
      </Menu>
    </Appbar.Header>
  );
};

export default Header;

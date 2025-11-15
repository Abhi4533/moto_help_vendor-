import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Appbar } from 'react-native-paper';

interface HeaderProps {
  setModalVisible: (visible: boolean) => void;
}
const Header: FC<HeaderProps> = ({ setModalVisible }) => {
  const navigation = useNavigation<any>();
  return (
    <Appbar.Header style={{ backgroundColor: '#6366F1' }}>
      <Appbar.Action
        icon="menu"
        onPress={() => navigation.openDrawer()}
        color="#fff"
      />
      <Appbar.Content
        title="Dashboard"
        titleStyle={{
          fontSize: 20,
          fontWeight: 'bold',
        }}
        color="#fff"
      />
      <Appbar.Action
        icon="view-list"
        onPress={() => setModalVisible(true)}
        color="#fff"
      />
      <Appbar.Action icon="bell" onPress={() => {}} color="#fff" />
    </Appbar.Header>
  );
};

export default Header;

import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Appbar, Divider, Menu } from 'react-native-paper';
import { styles } from '../style';

interface HeaderProps {
  handleDelete: any;
}

const Header = ({ handleDelete }: HeaderProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<any>();
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
      <Appbar.Content title="Vehicle Details" titleStyle={styles.headerTitle} />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            color="#fff"
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        {/* <Menu.Item
          onPress={() => {}}
          title="Edit Vehicle"
          leadingIcon="pencil"
        /> */}
        <Menu.Item
          onPress={() => {}}
          title="Service History"
          leadingIcon="history"
        />
        <Menu.Item
          onPress={() => {}}
          title="Documents"
          leadingIcon="file-document"
        />
        <Divider />
        <Menu.Item
          onPress={handleDelete}
          title="Delete Vehicle"
          leadingIcon="delete"
          titleStyle={{ color: '#EF4444' }}
        />
      </Menu>
    </Appbar.Header>
  );
};

export default Header;

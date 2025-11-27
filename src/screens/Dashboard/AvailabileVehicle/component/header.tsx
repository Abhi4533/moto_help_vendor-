import React from 'react';
import { Appbar } from 'react-native-paper';
import { styles } from '../style';

interface HeaderProps {
  isEditMode: any;
  navigation: any;
}

const Header = ({ isEditMode, navigation }: HeaderProps) => {
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
      <Appbar.Content
        title={isEditMode ? 'Edit Availability' : 'New Availability'}
        titleStyle={styles.headerTitle}
      />
    </Appbar.Header>
  );
};

export default Header;

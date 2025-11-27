import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';

const AvailabileVehicle = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Appbar.Header
        style={{
          backgroundColor: '#fff',
          elevation: 2,
        }}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Availabile Vehicle"
          titleStyle={{
            fontWeight: '700',
            fontSize: 18,
          }}
        />
      </Appbar.Header>
    </View>
  );
};

export default AvailabileVehicle;

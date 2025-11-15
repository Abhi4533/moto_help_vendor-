import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { KycStackParamList } from '../../navigation/KycNavigator';
import { setKycStatus } from '../../store/slices/authSlice';

type TempDashNavProp = NativeStackNavigationProp<
  KycStackParamList,
  'TemporaryDashboard'
>;

const TemporaryDashboard = () => {
  const navigation = useNavigation<TempDashNavProp>();
  const dispatch = useDispatch();

  const completeKyc = () => {
    dispatch(setKycStatus('COMPLETED'));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Temporary Dashboard - Complete KYC</Text>
      <Button
        title="Upload Documents"
        onPress={() => navigation.navigate('UploadDocuments')}
      />
      <Button title="Complete KYC (Demo)" onPress={completeKyc} />
    </View>
  );
};

export default TemporaryDashboard;

import Icon from '@react-native-vector-icons/material-design-icons';
import React, { useLayoutEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import { requestPermission } from '@utils/permissions';
import { Button, Text, TextInput } from 'react-native-paper';
import TemporaryDashboardLayout from '../Layout/Layout';
import { accountTypes, BankSchema, INITIAL_VALUE } from './helper';
import { styles } from './styles';
import { BankDetailsType } from './types';

import { getVendorDetails } from '@api/endpoints/profile.api';
import { useValidateBankMutation } from '@api/hooks_api';
import Input from '@components/common/Input';
import Loader from '@components/common/Loader';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@store/index';
import { setKycStatus } from '@store/slices/authSlice';
import { convertToBase64 } from '@utils/formatter';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

const BankVerification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [conpanyInfo, setCompanyInfo] = useState({ companyName: '' });
  const [showConfirmAcc, setShowConfirmAcc] = useState(false);
  const vendorId = useSelector((state: RootState) => state?.auth?.token);
  const [validateBank, { isLoading }] = useValidateBankMutation();
  const [passbookImage, setPassbookImage] = useState<Asset | null>(null);

  const openCamera = async () => {
    const granted = await requestPermission('camera');
    if (!granted) {
      Alert.alert('Permission Required', 'Camera permission is required.');
      return;
    }

    const response = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert(
        'Camera Error',
        response.errorMessage || 'Unable to open camera.',
      );
      return;
    }

    if (response.assets) setPassbookImage(response.assets[0]);
  };

  const openGallery = async () => {
    const granted = await requestPermission('gallery');
    if (!granted) {
      Alert.alert('Permission Required', 'Gallery permission is required.');
      return;
    }

    const response = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert(
        'Gallery Error',
        response.errorMessage || 'Unable to open gallery.',
      );
      return;
    }

    if (response.assets) setPassbookImage(response.assets[0]);
  };

  const showPickerOptions = () => {
    Alert.alert(
      'Upload Passbook',
      'Choose an option',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const handleFinalSubmit = async (values: BankDetailsType) => {
    try {
      if (!conpanyInfo?.companyName) return;

      const base64Img = await convertToBase64(passbookImage?.uri!);
      const resp = await validateBank({
        ...values,
        cheque_img: base64Img,
        vendorid: vendorId,
      }).unwrap();
      if (resp?.status === '00') {
        dispatch(setKycStatus('COMPLETED'));
        navigation.navigate('Dashboard');
      } else {
        Toast.show({ type: 'error', text1: resp?.message });
      }
    } catch (error) {}
  };

  const getVenderDetails = async () => {
    try {
      const resp = await getVendorDetails({ vendorid: vendorId });
      if (resp?.status === '00') {
        setCompanyInfo(resp?.data?.Vendor_Details?.[0]);
      } else {
        Toast.show({ type: 'error', text1: resp?.message });
      }
    } catch (error) {}
  };

  useLayoutEffect(() => {
    getVenderDetails();
  }, []);

  return (
    <TemporaryDashboardLayout title="Bank Details">
      <Loader visible={isLoading} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        >
          <Formik
            initialValues={INITIAL_VALUE}
            validationSchema={BankSchema}
            onSubmit={handleFinalSubmit}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              setFieldValue,
            }) => (
              <View style={styles.container}>
                {/* IMAGE UPLOAD */}
                <View style={styles.uploadSection}>
                  <Text style={styles.label}>Passbook / Cheque Photo *</Text>

                  {passbookImage?.uri ? (
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: passbookImage.uri }}
                        style={styles.previewImage}
                      />

                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => setPassbookImage(null)}
                      >
                        <Icon name="close" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Button
                      icon="camera"
                      mode="outlined"
                      onPress={showPickerOptions}
                      style={styles.uploadButton}
                    >
                      Upload Passbook Image
                    </Button>
                  )}
                </View>

                <Input
                  label="Account Holder Name *"
                  mode="outlined"
                  value={values.bank_ac_holder_name}
                  onChangeText={t => setFieldValue('bank_ac_holder_name', t)}
                  autoCapitalize="characters"
                  error={errors.bank_ac_holder_name}
                />

                <Text style={styles.label}>Account Type *</Text>
                <View style={styles.accountTypeRow}>
                  {accountTypes.map(item => (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.chip,
                        values.account_type === item.value &&
                          styles.chipSelected,
                      ]}
                      onPress={() => setFieldValue('account_type', item.value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          values.account_type === item.value &&
                            styles.chipTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Input
                  label="Account Number *"
                  mode="outlined"
                  keyboardType="number-pad"
                  value={values.bank_ac_number}
                  onChangeText={handleChange('bank_ac_number')}
                  maxLength={18}
                  error={errors.bank_ac_number}
                />

                <Input
                  label="Confirm Account Number *"
                  mode="outlined"
                  keyboardType="number-pad"
                  value={values.bank_ac_number_verify}
                  onChangeText={handleChange('bank_ac_number_verify')}
                  secureTextEntry={!showConfirmAcc}
                  right={
                    <TextInput.Icon
                      icon={showConfirmAcc ? 'eye-off' : 'eye'}
                      onPress={() => setShowConfirmAcc(!showConfirmAcc)}
                    />
                  }
                  maxLength={18}
                  error={errors.bank_ac_number_verify}
                />

                <Input
                  label="IFSC Code *"
                  mode="outlined"
                  value={values.ifsc_code}
                  onChangeText={t => setFieldValue('ifsc_code', t)}
                  autoCapitalize="characters"
                  maxLength={11}
                  error={errors.ifsc_code}
                />

                <Input
                  label="Bank Name *"
                  mode="outlined"
                  value={values.bank_name}
                  onChangeText={t => setFieldValue('bank_name', t)}
                  autoCapitalize="characters"
                  error={errors.bank_name}
                />

                <Input
                  label="Branch *"
                  mode="outlined"
                  value={values.branch_name}
                  onChangeText={t => setFieldValue('branch_name', t)}
                  autoCapitalize="characters"
                  error={errors.branch_name}
                />

                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  style={styles.submitButton}
                >
                  Verify Bank Details
                </Button>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </TemporaryDashboardLayout>
  );
};

export default BankVerification;

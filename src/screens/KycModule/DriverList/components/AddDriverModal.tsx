// AddDriverModal.tsx
import Icon from '@react-native-vector-icons/material-design-icons';
import { Formik } from 'formik';
import React, { FC, useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

import DatePickerField from '@components/common/DatePickerField';
import Dropdown from '@components/common/Dropdown';
import Input from '@components/common/Input';
import Loader from '@components/common/Loader';

import { addDriver } from '@api/endpoints/driver.api';
import {
  useCheckAlreadyExistsMutation,
  useGetAddressByPinMutation,
  useGetDistrictQuery,
  useGetStateQuery,
  useValidateLicenceMutation,
} from '@api/hooks_api';
import FormikInput from '@components/common/FormikInput';
import { useDebouncedCallback } from '@hooks/useDebounce';
import { RootState } from '@store/index';
import {
  DriverSchema,
  getDriverAge,
  INITIAL_VALUES,
  isValidDL,
  maxDOB,
  minDOB,
} from '../helper';
import { AddDriverModalProps, DriverFormValues } from '../type';

const AddDriverModal: FC<AddDriverModalProps> = ({
  setModalVisible,
  modalVisible,
  onDriverAdded,
}) => {
  // API hooks
  const [getAddressByPincode] = useGetAddressByPinMutation();
  const vendorId = useSelector((state: RootState) => state?.auth?.token);
  const [checkAlreadyExists, { isLoading: isCheckingExist }] =
    useCheckAlreadyExistsMutation();
  const [validateLicence, { isLoading: isValidating }] =
    useValidateLicenceMutation();

  const { data: stateData } = useGetStateQuery();
  const [selectedState, setSelectedState] = useState<string>('');
  const { data: districtData } = useGetDistrictQuery(
    { state: selectedState },
    { skip: !selectedState },
  );

  const debouncedCheckExists = useDebouncedCallback(
    async (license: string, setFieldError?: any) => {
      try {
        if (!isValidDL(license)) return;
        const resp = await checkAlreadyExists({
          driving_license_no: license,
        }).unwrap();
        if (resp?.status === '01') {
          setFieldError('driving_license_no', 'DL Number Already Registered');
        }
      } catch (err: any) {}
    },
    900,
  );

  const validateDL = useCallback(
    async (
      values: DriverFormValues,
      setFieldError: (f: string, m: string) => void,
      setFieldValue: (f: string, v: any) => void,
    ) => {
      const dl = values?.driving_license_no?.trim();
      try {
        const payload = { dl_number: dl, dob: values.dob };
        const resp = await validateLicence(payload).unwrap();
        if (resp?.status === '00') {
          if (resp?.data?.status !== 'id_not_found') {
            Toast.show({ type: 'success', text1: 'DL validated' });
            const d = resp?.data;
            if (d) {
              if (d?.nt_validity_to || d?.t_validity_to) {
                setFieldValue(
                  'expiry_date',
                  d?.nt_validity_to || d?.t_validity_to,
                );
              }
              if (d?.address)
                setFieldValue('driving_license_address', d?.address);
              if (d?.name) setFieldValue('full_name', d?.name);
            }
          } else {
            setFieldError('driving_license_no', 'Invalid DL Number');
            setFieldError('dob', 'Invalid DOB');
          }
        } else {
          Toast.show({
            type: 'error',
            text1: resp?.message || 'Validation failed',
          });
        }
      } catch (err: any) {}
    },
    [validateLicence],
  );

  const handleSubmit = useCallback(
    async (
      values: DriverFormValues,
      { setSubmitting }: { setSubmitting: (b: boolean) => void },
    ) => {
      try {
        const resp = await addDriver({
          ...values,
          vendorid: vendorId,
        });
        if (resp?.status === '00') {
          setModalVisible(false);
          onDriverAdded?.();
        } else {
          Toast.show({ type: 'error', text1: resp?.message });
        }
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Create failed' });
      } finally {
        setSubmitting(false);
      }
    },
    [onDriverAdded, setModalVisible],
  );

  const handleClose = useCallback(() => {
    setSelectedState('');
    setModalVisible(false);
  }, [setModalVisible]);

  const handlePincodeChange = async (pin: string, setFieldValue: any) => {
    try {
      const numericText = pin.replace(/[^0-9]/g, '').substring(0, 6);
      setFieldValue('pincode', numericText);
      if (numericText?.length === 6) {
        const response = await getAddressByPincode({ pincode: numericText });
        if (response?.data?.status === '00') {
          const addressData = response.data.data || response.data;
          setFieldValue('state', addressData?.State?.toLocaleUpperCase() || '');
          setSelectedState(addressData?.State?.toLocaleUpperCase());
          setFieldValue('City', addressData?.District?.toLocaleUpperCase());
        } else {
          setFieldValue('state', '');
          setFieldValue('City', '');
        }
      }
    } catch (error) {}
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Loader visible={isCheckingExist || isValidating} />
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text variant="titleMedium" style={styles.modalTitle}>
                Add New Driver
              </Text>
              <TouchableOpacity onPress={handleClose} hitSlop={10}>
                <Icon name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={INITIAL_VALUES}
              validationSchema={DriverSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                setFieldValue,
                setFieldError,
                handleSubmit,
                isSubmitting,
                isValid,
                dirty,
              }) => (
                <>
                  <ScrollView
                    style={styles.modalBody}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {/* License Section */}
                    <Card style={styles.card} mode="contained">
                      <Card.Content style={styles.cardContent}>
                        <FormikInput
                          name="driving_license_no"
                          label="Driving License Number *"
                          mode="outlined"
                          placeholder="DL1420110002341"
                          left={<TextInput.Icon icon="card-account-details" />}
                          onChangeText={(t: string) => {
                            setFieldValue('driving_license_no', t);
                            debouncedCheckExists(t, setFieldError);
                          }}
                          autoCapitalize="characters"
                        />

                        <DatePickerField
                          label="Date of Birth *"
                          value={values.dob}
                          maximumDate={maxDOB()}
                          minimumDate={minDOB()}
                          onDateChange={(d: string | Date) => {
                            const iso =
                              typeof d === 'string' ? d : d.toISOString();
                            setFieldValue('dob', iso);
                          }}
                          error={errors.dob}
                        />

                        <Button
                          mode="contained"
                          onPress={async () => {
                            if (errors?.dob || errors?.driving_license_no) {
                              Toast.show({
                                type: 'error',
                                text1:
                                  errors?.dob || errors?.driving_license_no,
                              });
                            } else {
                              await validateDL(
                                values as DriverFormValues,
                                setFieldError,
                                setFieldValue,
                              );
                            }
                          }}
                          loading={isValidating}
                          disabled={isValidating || !!values?.full_name}
                          compact
                        >
                          Validate License
                        </Button>

                        {values?.full_name && (
                          <>
                            <View style={styles.divider} />
                            <Text
                              variant="titleSmall"
                              style={styles.sectionLabel}
                            >
                              License Details
                            </Text>

                            <View style={{ flexDirection: 'row', gap: 5 }}>
                              <View style={{ flex: 1 }}>
                                <DatePickerField
                                  label="License Expiry Date"
                                  value={values.expiry_date}
                                  onDateChange={(d: string | Date) =>
                                    setFieldValue(
                                      'expiry_date',
                                      typeof d === 'string'
                                        ? d
                                        : d.toISOString(),
                                    )
                                  }
                                  minimumDate={new Date()}
                                  editable
                                />
                              </View>
                              <Input
                                label="Driver Age"
                                value={
                                  getDriverAge(values.dob) >= 0
                                    ? `${getDriverAge(values.dob)} years`
                                    : '-'
                                }
                                mode="outlined"
                                editable={false}
                              />
                            </View>
                            <Input
                              label="License Address"
                              value={values.driving_license_address}
                              mode="outlined"
                              multiline
                              numberOfLines={2}
                              style={styles.textArea}
                              editable={false}
                            />
                          </>
                        )}
                      </Card.Content>
                    </Card>

                    {/* Personal Info */}
                    <Card style={styles.card} mode="contained">
                      <Card.Content style={styles.cardContent}>
                        <Text variant="titleSmall" style={styles.sectionLabel}>
                          Personal Information
                        </Text>

                        <FormikInput
                          label="Full Name as per DL *"
                          mode="outlined"
                          name="full_name"
                          editable={false}
                        />

                        <View style={styles.row}>
                          <View style={styles?.flex1}>
                            <FormikInput
                              name="Phone"
                              label="Phone *"
                              mode="outlined"
                              keyboardType="phone-pad"
                              maxLength={10}
                            />
                          </View>

                          <View style={styles?.flex1}>
                            <FormikInput
                              name="emergency_phone"
                              label="Family Contact *"
                              mode="outlined"
                              keyboardType="phone-pad"
                              maxLength={10}
                            />
                          </View>
                        </View>

                        <FormikInput
                          name="Email"
                          label="Email"
                          mode="outlined"
                          keyboardType="email-address"
                        />
                      </Card.Content>
                    </Card>

                    {/* Address */}
                    <Card style={styles.card} mode="contained">
                      <Card.Content style={styles.cardContent}>
                        <Text variant="titleSmall" style={styles.sectionLabel}>
                          Current Address
                        </Text>

                        <FormikInput
                          name="address1"
                          label="Building, Apartment *"
                          mode="outlined"
                          autoCapitalize="characters"
                        />

                        <FormikInput
                          name="address2"
                          label="Street, Area"
                          mode="outlined"
                          autoCapitalize="characters"
                        />

                        <View style={styles.row}>
                          <View style={styles?.flex1}>
                            <FormikInput
                              name="pincode"
                              label="Pincode *"
                              mode="outlined"
                              maxLength={6}
                              keyboardType="number-pad"
                              onChangeText={t =>
                                handlePincodeChange(t, setFieldValue)
                              }
                            />
                          </View>
                          <View style={styles?.flex1}>
                            <FormikInput
                              name="Tahsil"
                              label="Town/Tahsil *"
                              mode="outlined"
                              style={styles.flex1}
                              autoCapitalize="characters"
                            />
                          </View>
                        </View>

                        <Dropdown
                          label="State *"
                          data={stateData?.data || []}
                          value={values.state}
                          onChange={val => {
                            setFieldValue('state', val);
                            setSelectedState(val as string);
                            setFieldValue('City', '');
                          }}
                          error={!!touched.state && !!errors.state}
                          errorMessage={errors?.state}
                        />

                        <Dropdown
                          label="District *"
                          data={districtData?.data || []}
                          value={values.City}
                          onChange={val => setFieldValue('City', val)}
                          disabled={!selectedState}
                          error={!!touched.City && !!errors.City}
                          errorMessage={errors?.City}
                        />
                      </Card.Content>
                    </Card>
                  </ScrollView>

                  {/* Footer */}
                  <View style={styles.modalFooter}>
                    <Button
                      mode="outlined"
                      onPress={handleClose}
                      style={styles.flex1}
                      compact
                    >
                      Cancel
                    </Button>
                    <View style={styles.spacer} />
                    <Button
                      mode="contained"
                      onPress={() => handleSubmit()}
                      loading={isSubmitting}
                      disabled={
                        isSubmitting || !isValid || !dirty || !values?.full_name
                      }
                      style={styles.flex1}
                      compact
                    >
                      Add Driver
                    </Button>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddDriverModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    height: '90%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontWeight: '600',
    color: '#1f2937',
  },
  modalBody: {
    paddingHorizontal: 16,
    maxHeight: '75%',
  },
  card: {
    marginBottom: 12,
    elevation: 1,
  },
  cardContent: {
    paddingVertical: 8,
  },
  validateButton: {
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  sectionLabel: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  ageBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  ageValue: {
    fontWeight: '700',
    color: '#1e40af',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  textArea: {
    minHeight: 64,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  spacer: {
    width: 12,
  },
});

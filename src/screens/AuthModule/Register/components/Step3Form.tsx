import {
  useCheckAlreadyExistsMutation,
  useVerifyGSTMutation,
  useVerifyPANMutation,
} from '@api/hooks_api';
import { VendorRegistrationRequest } from '@api/types/auth.types';
import Input from '@components/common/Input';
import Loader from '@components/common/Loader';
import { COLORS } from '@config/theme';
import { useDebouncedCallback } from '@hooks/useDebounce';
import { extractPanFromGst } from '@utils/helpers';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text, TextInput } from 'react-native-paper';
import {
  showNameMismatchAlert,
  validateGSTCompanyName,
  validatePANOwnerName,
} from '../helper';

const Step3Form: React.FC = () => {
  const { values, setFieldValue, setFieldError, errors } = useFormikContext<
    VendorRegistrationRequest & any
  >();

  console.log({ errors });
  const [verifyGST, { isLoading: verfyGstLoading }] = useVerifyGSTMutation();
  const [verifyPan, { isLoading: verfyPanLoading }] = useVerifyPANMutation();
  const [checkAlreadyExists, { isLoading: isGSTChecking }] =
    useCheckAlreadyExistsMutation();

  const isIndividual =
    values.VendorDetails.companyType === 'CHALAK MALAK' ||
    values.VendorDetails.companyType === 'OWENER/INDIVIDUAL';

  // Check if GST is verified
  const isGSTVerified = !!values?.VendorDetails?.verifiedCompanyName;

  // Check if PAN is verified
  const isPANVerified = !!values?.VendorDetails?.verifiedPanName;

  // Check if GST verification button should be active
  const isGSTVerifyButtonActive =
    !isIndividual &&
    values.kycDetails.gstNo?.length === 15 &&
    !isGSTVerified &&
    !isPANVerified;

  // Check if PAN verification button should be active
  const isPANVerifyButtonActive =
    values.kycDetails.panNo?.length === 10 && !isPANVerified && !isGSTVerified;

  // gst duplication check
  const debouncedGstCheck = useDebouncedCallback(async (gst: string) => {
    if (!gst || gst.length !== 15) {
      return;
    }
    try {
      const resp = await checkAlreadyExists({ gstNo: gst }).unwrap();
      if (resp?.status !== '00') {
        setFieldError('kycDetails.gstNo', 'GST Number Already Registered');
      } else {
        const resp = extractPanFromGst(gst);
        setFieldValue('kycDetails.panNo', resp);
      }
    } catch (error) {}
  }, 600);

  // pan duplication check
  const debouncedPanCheck = useDebouncedCallback(async (pan: string) => {
    if (!pan || pan.length !== 10) {
      return;
    }
    try {
      const resp = await checkAlreadyExists({ panNo: pan }).unwrap();
      if (resp?.status !== '00') {
        setFieldError('kycDetails.panNo', 'PAN Number Already Registered');
      }
    } catch (error) {}
  }, 600);

  // RC duplication check
  const debouncedRCCheck = useDebouncedCallback(
    async (vehicle: string, index: number) => {
      if (!vehicle) {
        return;
      }
      try {
        const resp = await checkAlreadyExists({
          registration_no: vehicle,
        }).unwrap();
        if (resp?.status !== '00') {
          setFieldError(
            `VehicleDetails[${index}].vehicle_number`,
            'Already Registered',
          );
        }
      } catch (error) {}
    },
    600,
  );

  // gst number change
  const handleGSTChange = useCallback(
    (text: string) => {
      const gst = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (isGSTVerified || isPANVerified) {
        setFieldValue('VendorDetails.verifiedCompanyName', '');
        setFieldValue('VendorDetails.verifiedPanName', '');
      }

      setFieldValue('kycDetails.gstNo', gst);
      debouncedGstCheck(gst);
    },
    [setFieldValue, debouncedGstCheck, isGSTVerified, isPANVerified],
  );

  // pan number change
  const handlePanChange = useCallback(
    (text: string) => {
      const pan = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (isGSTVerified || isPANVerified) {
        setFieldValue('VendorDetails.verifiedCompanyName', '');
        setFieldValue('VendorDetails.verifiedPanName', '');
      }

      setFieldValue('kycDetails.panNo', pan);
      debouncedPanCheck(pan);
    },
    [setFieldValue, debouncedPanCheck, isGSTVerified, isPANVerified],
  );

  // vehicle count change
  const handleVehicleCountChange = (count: string) => {
    const numCount = parseInt(count) || 0;
    const currentVehicles = values.VehicleDetails || [];
    let newVehicles = [...currentVehicles];

    if (numCount > currentVehicles.length) {
      while (newVehicles.length < numCount) {
        newVehicles.push({ vehicle_number: '', vehicle_weight: '' } as any);
      }
    } else if (numCount < currentVehicles.length) {
      newVehicles = newVehicles.slice(0, numCount);
    }
    setFieldValue('VehicleDetails', newVehicles);
    setFieldValue('VendorDetails.vehicle_count', count);
  };

  // verify gst number
  const handleVerifyGstNumber = async () => {
    if (!values.kycDetails.gstNo || values.kycDetails.gstNo.length !== 15) {
      return;
    }
    try {
      const response = await verifyGST({
        gstin_number: values.kycDetails.gstNo,
      }).unwrap();

      if (response.status === '00') {
        const gstData = response.data;
        const verifiedCompanyName = gstData.tradeNam || gstData.lgnm;
        setFieldValue('VendorDetails.verifiedCompanyName', verifiedCompanyName);
        const isCompanyNameMatch = validateGSTCompanyName(
          verifiedCompanyName,
          values.VendorDetails.companyName,
        );
        if (!isCompanyNameMatch) {
          showNameMismatchAlert(
            'gst',
            verifiedCompanyName,
            values.VendorDetails.companyName,
          );
          setFieldValue('VendorDetails.companyName', verifiedCompanyName);
          return;
        }
      }
    } catch {}
  };

  // verify pan number
  const handleVerifyPanNumber = async () => {
    if (!values.kycDetails.panNo || values.kycDetails.panNo.length !== 10) {
      return;
    }
    try {
      const response = await verifyPan({
        pan_number: values.kycDetails.panNo,
      }).unwrap();

      if (response.status === '00') {
        const panData = response.data;
        const verifiedPanName = panData.full_name;
        let nameToValidateAgainst = '';
        setFieldValue('VendorDetails.verifiedPanName', verifiedPanName);
        if (isIndividual) {
          nameToValidateAgainst = values?.VendorDetails?.companyName;
        } else {
          nameToValidateAgainst = values?.VendorDetails?.owner_name;
        }
        const isNameMatch = validatePANOwnerName(
          verifiedPanName,
          nameToValidateAgainst,
        );
        if (!isNameMatch) {
          showNameMismatchAlert('pan', verifiedPanName, nameToValidateAgainst);
          setFieldValue('VendorDetails.companyName', verifiedPanName);
          return;
        }
      }
    } catch {}
  };

  return (
    <View style={styles.container}>
      <Loader visible={isGSTChecking} />
      {/* Legal Documents Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionHeader}>
          Legal Documents
        </Text>

        <View style={styles.documentsContainer}>
          {/* GST Field */}

          <View style={styles.inputContainer}>
            <View style={styles.inputWithButton}>
              <View style={{ flex: 1 }}>
                <Input
                  mode="outlined"
                  label="GST Number"
                  placeholder="15-digit GST"
                  value={values.kycDetails.gstNo}
                  maxLength={15}
                  onChangeText={handleGSTChange}
                  style={styles.flexInput}
                  activeOutlineColor={COLORS.primary}
                  editable={!isIndividual}
                  error={(errors?.kycDetails as any)?.gstNo}
                />
              </View>
              {isGSTVerifyButtonActive && (
                <Button
                  mode="contained"
                  style={styles.verifyButton}
                  labelStyle={styles.buttonLabel}
                  onPress={handleVerifyGstNumber}
                  disabled={!isGSTVerifyButtonActive}
                  loading={verfyGstLoading}
                >
                  Verify
                </Button>
              )}
            </View>
          </View>

          {/* PAN Field */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWithButton}>
              <View style={{ flex: 1 }}>
                <Input
                  mode="outlined"
                  label="PAN Number"
                  placeholder="10-digit PAN"
                  value={values.kycDetails.panNo}
                  maxLength={10}
                  left={
                    <TextInput.Icon
                      icon="card-account-details"
                      color={COLORS.primary}
                      size={18}
                    />
                  }
                  onChangeText={handlePanChange}
                  style={styles.flexInput}
                  activeOutlineColor={COLORS.primary}
                  editable={true}
                  error={(errors?.kycDetails as any)?.panNo}
                />
              </View>
              {isPANVerifyButtonActive && (
                <Button
                  mode="contained"
                  style={styles.verifyButton}
                  labelStyle={styles.buttonLabel}
                  onPress={handleVerifyPanNumber}
                  disabled={!isPANVerifyButtonActive}
                  loading={verfyPanLoading}
                >
                  Verify
                </Button>
              )}
            </View>
          </View>
        </View>
      </View>

      {(isGSTVerified || isPANVerified) && (
        <Input
          mode="outlined"
          label={
            isPANVerified ? 'Owner Name As Per Pan' : 'Company Name As Per Gst'
          }
          placeholder="Enter count"
          value={
            isPANVerified
              ? values?.VendorDetails?.verifiedPanName
              : values?.VendorDetails?.verifiedCompanyName
          }
        />
      )}
      {/* Vehicle Information Section */}
      <View style={styles.section}>
        <Input
          mode="outlined"
          label="Number of Vehicles"
          placeholder="Enter count"
          keyboardType="numeric"
          value={values?.VendorDetails?.vehicle_count?.toString() || ''}
          onChangeText={handleVehicleCountChange}
          style={styles.vehicleCountInput}
          outlineColor={COLORS.grey}
          activeOutlineColor={COLORS.primary}
          error={(errors?.VendorDetails as any)?.vehicle_count}
        />
        <View>
          {typeof errors?.VehicleDetails === 'string' && (
            <Card style={styles.maxLimitCard}>
              <Card.Content style={styles.maxLimitContent}>
                <IconButton icon="close" iconColor="#ff9800" size={18} />

                <Text variant="bodySmall" style={styles.maxLimitText}>
                  {errors?.VehicleDetails}
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>
        {(values.VehicleDetails || []).length > 0 && (
          <View style={styles.vehicleList}>
            <View style={styles.vehicleHeader}>
              <Text variant="labelMedium" style={styles.vehicleHeaderText}>
                Registration Number
              </Text>
              <Text variant="labelMedium" style={styles.vehicleHeaderText}>
                Loading Capacity
              </Text>
            </View>

            {(values.VehicleDetails || []).map(
              (vehicle: any, index: number) => (
                <View key={index} style={styles.vehicleRow}>
                  <View style={{ flex: 2 }}>
                    <Input
                      mode="outlined"
                      placeholder="MH01AB2345"
                      value={vehicle.vehicle_number}
                      onChangeText={text =>
                        setFieldValue(
                          `VehicleDetails[${index}].vehicle_number`,
                          text?.toUpperCase(),
                        )
                      }
                      style={[styles.vehicleInput, styles.regInput]}
                      outlineColor={COLORS.grey}
                      activeOutlineColor={COLORS.primary}
                      placeholderTextColor="#E0E0E0"
                      onBlur={() =>
                        debouncedRCCheck(vehicle.vehicle_number, index)
                      }
                      error={
                        (errors?.VehicleDetails as any)?.[index]?.vehicle_number
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      mode="outlined"
                      label="Weight In Kg"
                      placeholder="in kg"
                      value={vehicle.vehicle_weight}
                      onChangeText={text =>
                        setFieldValue(
                          `VehicleDetails[${index}].vehicle_weight`,
                          text,
                        )
                      }
                      keyboardType="numeric"
                      style={[styles.vehicleInput, styles.weightInput]}
                      outlineColor={COLORS.grey}
                      activeOutlineColor={COLORS.primary}
                      placeholderTextColor="#E0E0E0"
                      error={
                        (errors?.VehicleDetails as any)?.[index]?.vehicle_weight
                      }
                    />
                  </View>
                </View>
              ),
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  documentsContainer: {
    gap: 12,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flexInput: {
    flex: 1,
  },
  verifyButton: {
    minWidth: 80,
    borderRadius: 6,
    height: 50,
  },
  buttonLabel: {
    fontWeight: '500',
    fontSize: 13,
  },
  verifiedInfoContainer: {
    marginTop: 2,
  },
  successText: {
    color: COLORS.secondary,
    fontSize: 11,
    marginBottom: 2,
  },
  addressText: {
    color: COLORS.grey,
    fontSize: 10,
    fontStyle: 'italic',
  },
  errorText: {
    marginTop: 2,
    color: COLORS.danger,
    fontSize: 11,
  },
  infoText: {
    marginTop: 2,
    color: COLORS.grey,
    fontSize: 11,
  },
  vehicleCountInput: {
    marginBottom: 8,
  },
  vehicleList: {
    gap: 8,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  vehicleHeaderText: {
    fontWeight: '500',
    color: '#666',
    fontSize: 12,
  },
  vehicleRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  vehicleInput: {
    flex: 1,
  },
  regInput: {
    flex: 2,
  },
  weightInput: {
    flex: 1,
  },
  maxLimitCard: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
    borderWidth: 1,
  },
  maxLimitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  maxLimitText: { color: '#e65100', marginLeft: 4, flex: 1, fontSize: 12 },
});

export default Step3Form;

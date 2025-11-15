import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import {
  useVerifyGSTMutation,
  useVerifyPANMutation,
} from '../../../../api/hooks_api';
import { VendorRegistrationRequest } from '../../../../api/types/auth.types';
import { COLORS } from '../../../../config/theme';

interface VerificationStatus {
  gst: 'unverified' | 'verifying' | 'verified' | 'failed';
  pan: 'unverified' | 'verifying' | 'verified' | 'failed';
}

interface GSTResponseData {
  stjCd: string;
  lgnm: string;
  stj: string;
  dty: string;
  adadr: any[];
  cxdt: string;
  gstin: string;
  nba: string[];
  lstupdt: string;
  rgdt: string;
  ctb: string;
  pradr: {
    addr: {
      bnm: string;
      loc: string;
      st: string;
      bno: string;
      dst: string;
      lt: string;
      locality: string;
      landMark: string;
      stcd: string;
      geocodelvl: string;
      flno: string;
      lg: string;
      pncd: string;
    };
    ntr: string;
  };
  tradeNam: string;
  ctjCd: string;
  sts: string;
  ctj: string;
  einvoiceStatus: string;
}

const Step3Form: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<
    VendorRegistrationRequest & any
  >();
  const [verifyGST] = useVerifyGSTMutation();
  const [verifyPan] = useVerifyPANMutation();

  // Initialize verification status from Formik state or default to unverified
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>(() => ({
      gst: values.kycDetails?.gstVerificationStatus || 'unverified',
      pan: values.kycDetails?.panVerificationStatus || 'unverified',
    }));

  const companyType = values?.VendorDetails?.companyType;
  const isIndividual =
    companyType === 'INDIVIDUAL' || companyType === 'CHALAK MALAK';
  const shouldShowGST = !isIndividual;

  // Extract PAN from GST number
  const extractPanFromGst = (gstNumber: string): string => {
    if (gstNumber && gstNumber.length === 15) {
      return gstNumber.substring(2, 12);
    }
    return '';
  };

  // Format address from GST response
  const formatAddress = (data: GSTResponseData): string => {
    const addr = data.pradr.addr;
    const addressParts = [
      addr.bno,
      addr.bnm,
      addr.st,
      addr.loc,
      addr.locality,
      addr.dst,
      addr.stcd,
      addr.pncd,
    ].filter(part => part && part.trim() !== '');

    return addressParts.join(', ');
  };

  // Sync verification status with Formik state
  useEffect(() => {
    setFieldValue('kycDetails.gstVerificationStatus', verificationStatus.gst);
    setFieldValue('kycDetails.panVerificationStatus', verificationStatus.pan);
  }, [verificationStatus.gst, verificationStatus.pan, setFieldValue]);

  // Reset verification status when fields change
  useEffect(() => {
    if (
      verificationStatus.gst === 'verified' &&
      values.kycDetails.gstNo.length !== 15
    ) {
      setVerificationStatus(prev => ({ ...prev, gst: 'unverified' }));
      setFieldValue('kycDetails.verifiedCompanyName', '');
      setFieldValue('kycDetails.verifiedAddress', '');
      setFieldValue('kycDetails.panNo', '');
    }
  }, [values.kycDetails.gstNo]);

  useEffect(() => {
    if (
      verificationStatus.pan === 'verified' &&
      values.kycDetails.panNo.length !== 10
    ) {
      setVerificationStatus(prev => ({ ...prev, pan: 'unverified' }));
      setFieldValue('kycDetails.panName', '');
    }
  }, [values.kycDetails.panNo]);

  // Auto-fill PAN when GST is entered (before verification)
  useEffect(() => {
    if (shouldShowGST && values.kycDetails.gstNo.length === 15) {
      const extractedPan = extractPanFromGst(values.kycDetails.gstNo);
      if (extractedPan && values.kycDetails.panNo !== extractedPan) {
        setFieldValue('kycDetails.panNo', extractedPan);
        // Only reset PAN verification status if it's not already verified via GST
        if (verificationStatus.gst !== 'verified') {
          setVerificationStatus(prev => ({ ...prev, pan: 'unverified' }));
        }
      }
    }
  }, [values.kycDetails.gstNo, shouldShowGST]);

  const updateVehicleCount = (count: string) => {
    const numCount = parseInt(count) || 0;
    const currentVehicles = values.VehicleDetails || [];
    let newVehicles = [...currentVehicles];

    if (numCount > currentVehicles.length) {
      while (newVehicles.length < numCount) {
        newVehicles.push({ vehicle_number: '', vehicle_weight: '' });
      }
    } else if (numCount < currentVehicles.length) {
      newVehicles = newVehicles.slice(0, numCount);
    }

    setFieldValue('VehicleDetails', newVehicles);
  };

  const updateVehicleNumber = (text: string, index: number) => {
    const vehicles = [...(values.VehicleDetails || [])];
    if (!vehicles[index])
      vehicles[index] = { vehicle_number: '', vehicle_weight: '' };
    const cleanedText = text.replace(/\s/g, '').toUpperCase();
    vehicles[index].vehicle_number = cleanedText;
    setFieldValue('VehicleDetails', vehicles);
  };

  const updateVehicleWeight = (text: string, index: number) => {
    const vehicles = [...(values.VehicleDetails || [])];
    if (!vehicles[index])
      vehicles[index] = { vehicle_number: '', vehicle_weight: '' };
    const numericText = text.replace(/[^0-9]/g, '');
    vehicles[index].vehicle_weight = numericText;
    setFieldValue('VehicleDetails', vehicles);
  };

  const verifyGSTNumber = async () => {
    if (!values.kycDetails.gstNo || values.kycDetails.gstNo.length !== 15) {
      return;
    }

    setVerificationStatus(prev => ({ ...prev, gst: 'verifying' }));

    try {
      const response = await verifyGST({
        gstin_number: values.kycDetails.gstNo,
      }).unwrap();

      if (response.status === '00') {
        setVerificationStatus(prev => ({ ...prev, gst: 'verified' }));
        setFieldValue(
          'kycDetails.verifiedCompanyName',
          response.data.tradeNam || response.data.lgnm,
        );
        setFieldValue(
          'kycDetails.verifiedAddress',
          formatAddress(response.data),
        );

        // Auto-fill PAN from GST and mark as verified
        const extractedPan = extractPanFromGst(values.kycDetails.gstNo);
        if (extractedPan) {
          setFieldValue('kycDetails.panNo', extractedPan);
          setVerificationStatus(prev => ({ ...prev, pan: 'verified' }));
        }
      } else {
        setVerificationStatus(prev => ({ ...prev, gst: 'failed' }));
        setFieldValue('kycDetails.verifiedCompanyName', '');
        setFieldValue('kycDetails.verifiedAddress', '');
        setVerificationStatus(prev => ({ ...prev, pan: 'unverified' }));
      }
    } catch (error) {
      setVerificationStatus(prev => ({ ...prev, gst: 'failed' }));
      setFieldValue('kycDetails.verifiedCompanyName', '');
      setFieldValue('kycDetails.verifiedAddress', '');
      setVerificationStatus(prev => ({ ...prev, pan: 'unverified' }));
      console.error('GST verification failed:', error);
    }
  };

  const verifyPanNumber = async () => {
    if (!values.kycDetails.panNo || values.kycDetails.panNo.length !== 10) {
      return;
    }
    setFieldValue('kycDetails.verifiedAddress', '');
    setFieldValue('kycDetails.verifiedCompanyName', '');
    setVerificationStatus(prev => ({ ...prev, pan: 'verifying' }));

    try {
      const response = await verifyPan({
        pan_number: values.kycDetails.panNo,
      }).unwrap();

      if (response.status === '00') {
        setVerificationStatus(prev => ({ ...prev, pan: 'verified' }));
        setFieldValue('kycDetails.panName', response?.data?.full_name);

        // If GST is already verified and PAN is being verified separately,
        // we need to check if they still match
        if (
          shouldShowGST &&
          values.kycDetails.gstNo &&
          verificationStatus.gst === 'verified'
        ) {
          const extractedPan = extractPanFromGst(values.kycDetails.gstNo);
          if (extractedPan !== values.kycDetails.panNo) {
            // PAN doesn't match GST, so reset GST verification
            setVerificationStatus(prev => ({ ...prev, gst: 'unverified' }));
            setFieldValue('kycDetails.verifiedCompanyName', '');
            setFieldValue('kycDetails.verifiedAddress', '');
          }
        }
      } else {
        setVerificationStatus(prev => ({ ...prev, pan: 'failed' }));
        setFieldValue('kycDetails.panName', '');
      }
    } catch (error) {
      setVerificationStatus(prev => ({ ...prev, pan: 'failed' }));
      setFieldValue('kycDetails.panName', '');
      console.error('PAN verification failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return COLORS.secondary;
      case 'failed':
        return COLORS.danger;
      case 'verifying':
        return COLORS.grey;
      default:
        return COLORS.background;
    }
  };

  // Determine verification button visibility and state
  const canVerifyGST =
    shouldShowGST &&
    verificationStatus.gst !== 'verified' &&
    verificationStatus.gst !== 'verifying';

  const canVerifyPAN =
    verificationStatus.pan !== 'verified' &&
    verificationStatus.pan !== 'verifying';

  // Show verify button based on current status
  const showGSTVerifyButton =
    canVerifyGST && values.kycDetails.gstNo?.length === 15;
  const showPANVerifyButton =
    canVerifyPAN && values.kycDetails.panNo?.length === 10;

  // Reset verification if needed (for debugging)
  const resetVerification = (type: 'gst' | 'pan') => {
    setVerificationStatus(prev => ({ ...prev, [type]: 'unverified' }));
    if (type === 'gst') {
      setFieldValue('kycDetails.verifiedCompanyName', '');
      setFieldValue('kycDetails.verifiedAddress', '');
    } else {
      setFieldValue('kycDetails.panName', '');
    }
  };

  return (
    <View style={styles.container}>
      {/* Legal Documents Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionHeader}>
          Legal Documents
        </Text>

        <View style={styles.documentsContainer}>
          {/* GST Field */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWithButton}>
              <TextInput
                mode="outlined"
                label="GST Number"
                placeholder="15-digit GST"
                value={values.kycDetails.gstNo}
                maxLength={15}
                onChangeText={text =>
                  setFieldValue('kycDetails.gstNo', text.toUpperCase())
                }
                style={styles.flexInput}
                outlineColor={getStatusColor(verificationStatus.gst)}
                activeOutlineColor={COLORS.primary}
                error={verificationStatus.gst === 'failed'}
                editable={!isIndividual}
              />
              {showPANVerifyButton && (
                <Button
                  mode="contained"
                  onPress={verifyGSTNumber}
                  loading={verificationStatus.gst === 'verifying'}
                  disabled={verificationStatus.gst === 'verifying'}
                  style={styles.verifyButton}
                  labelStyle={styles.buttonLabel}
                >
                  Verify
                </Button>
              )}
              {verificationStatus.pan === 'verified' && (
                <Button
                  mode="contained"
                  onPress={() => resetVerification('gst')}
                  style={[
                    styles.verifyButton,
                    { backgroundColor: COLORS.secondary },
                  ]}
                  labelStyle={styles.buttonLabel}
                  icon="check"
                >
                  Verified
                </Button>
              )}
            </View>

            {values?.kycDetails?.verifiedCompanyName &&
              verificationStatus.gst === 'verified' && (
                <View style={styles.verifiedInfoContainer}>
                  <Text variant="bodySmall" style={styles.successText}>
                    ✅ {values?.kycDetails?.verifiedCompanyName}
                  </Text>
                  {values?.kycDetails?.verifiedAddress && (
                    <Text variant="bodySmall" style={styles.addressText}>
                      📍 {values?.kycDetails?.verifiedAddress}
                    </Text>
                  )}
                </View>
              )}

            {verificationStatus.gst === 'failed' && (
              <Text variant="bodySmall" style={styles.errorText}>
                ❌ Invalid GST number
              </Text>
            )}

            {verificationStatus.gst === 'verifying' && (
              <Text variant="bodySmall" style={styles.infoText}>
                🔄 Verifying GST...
              </Text>
            )}
          </View>

          {/* PAN Field */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWithButton}>
              <TextInput
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
                onChangeText={text =>
                  setFieldValue('kycDetails.panNo', text.toUpperCase())
                }
                style={styles.flexInput}
                outlineColor={getStatusColor(verificationStatus.pan)}
                activeOutlineColor={COLORS.primary}
                error={verificationStatus.pan === 'failed'}
                editable={true}
              />
              {showPANVerifyButton && (
                <Button
                  mode="contained"
                  onPress={verifyPanNumber}
                  loading={verificationStatus.pan === 'verifying'}
                  disabled={verificationStatus.pan === 'verifying'}
                  style={styles.verifyButton}
                  labelStyle={styles.buttonLabel}
                >
                  Verify
                </Button>
              )}
              {verificationStatus.pan === 'verified' && (
                <Button
                  mode="contained"
                  onPress={() => resetVerification('pan')}
                  style={[
                    styles.verifyButton,
                    { backgroundColor: COLORS.secondary },
                  ]}
                  labelStyle={styles.buttonLabel}
                  icon="check"
                >
                  Verified
                </Button>
              )}
            </View>

            {verificationStatus.gst === 'verified' &&
            verificationStatus.pan === 'verified' ? (
              <Text variant="bodySmall" style={styles.successText}>
                ✅ PAN auto-filled and verified from GST
              </Text>
            ) : verificationStatus.pan === 'verified' ? (
              <Text variant="bodySmall" style={styles.successText}>
                ✅ PAN verified{' '}
                {values?.kycDetails?.panName &&
                  `- ${values.kycDetails.panName}`}
              </Text>
            ) : verificationStatus.pan === 'failed' ? (
              <Text variant="bodySmall" style={styles.errorText}>
                ❌ Invalid PAN number
              </Text>
            ) : null}

            {verificationStatus.pan === 'verifying' && (
              <Text variant="bodySmall" style={styles.infoText}>
                🔄 Verifying PAN...
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Vehicle Information Section */}
      <View style={styles.section}>
        <TextInput
          mode="outlined"
          label="Number of Vehicles"
          placeholder="Enter count"
          keyboardType="numeric"
          value={values?.VendorDetails?.vehicle_count?.toString() || ''}
          onChangeText={text => {
            setFieldValue('VendorDetails.vehicle_count', text);
            updateVehicleCount(text);
          }}
          style={styles.vehicleCountInput}
          outlineColor={COLORS.grey}
          activeOutlineColor={COLORS.primary}
        />

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
                  <TextInput
                    mode="outlined"
                    placeholder="MH01AB2345"
                    value={vehicle.vehicle_number}
                    onChangeText={text => updateVehicleNumber(text, index)}
                    style={[styles.vehicleInput, styles.regInput]}
                    outlineColor={COLORS.grey}
                    activeOutlineColor={COLORS.primary}
                    placeholderTextColor="#E0E0E0"
                  />
                  <TextInput
                    mode="outlined"
                    placeholder="in kg"
                    value={vehicle.vehicle_weight}
                    onChangeText={text => updateVehicleWeight(text, index)}
                    keyboardType="numeric"
                    style={[styles.vehicleInput, styles.weightInput]}
                    outlineColor={COLORS.grey}
                    activeOutlineColor={COLORS.primary}
                    placeholderTextColor="#E0E0E0"
                  />
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
});

export default Step3Form;

import {
  getVendorDetails,
  postUpdateVendorDetails,
} from '@api/endpoints/profile.api';
import {
  useGetAddressByPinMutation,
  useGetDistrictQuery,
  useGetStateQuery,
} from '@api/hooks_api';
import Dropdown from '@components/common/Dropdown';
import Input from '@components/common/Input';
import Loader from '@components/common/Loader';
import { RootState } from '@store/index';
import { Formik } from 'formik';
import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import ProfileLayout from '../Layout';

interface Props {
  onTabChange?: (tab: string) => void;
}

export const companyTypedata = [
  'OWENER/INDIVIDUAL',
  'PROPRIETORSHIP',
  'CHALAK MALAK',
  'PARTNERSHIP',
  'PVT LTD',
  'LLP',
].map(v => ({ label: v, value: v }));

const validationSchema = Yup.object().shape({
  companyType: Yup.string().required('Required'),
  companyName: Yup.string().required('Required'),
  owner_name: Yup.string().required('Required'),
  mobileNo: Yup.string().min(10).required('Required'),
  address1: Yup.string().required('Required'),
  address2: Yup.string().required('Required'),
  pincode: Yup.string().min(6).required('Required'),
  Tahsil: Yup.string().required('Required'),
});

const initialValues = {
  companyType: '',
  companyName: '',
  owner_name: '',
  mobileNo: '',
  address1: '',
  address2: '',
  pincode: '',
  Tahsil: '',
  state: '',
  district: '',
};

const ProfileCompanyInfo: React.FC<Props> = ({ onTabChange }) => {
  const [getAddressByPincode] = useGetAddressByPinMutation();
  const { data: stateData } = useGetStateQuery();
  const [companyInfo, setCompanyInfo] = useState(initialValues);
  const [state, setState] = useState(companyInfo.state || '');
  const { data: districtData } = useGetDistrictQuery({
    state: state || companyInfo?.state,
  });
  const vendorId = useSelector((state: RootState) => state?.auth?.token);
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const resp = await getVendorDetails({ vendorid: vendorId });

      if (resp?.status === '00') {
        const data = resp?.data?.Vendor_Details?.[0];

        setCompanyInfo(data);
      } else {
        Toast.show({ type: 'error', text1: resp?.message });
      }
    } catch (e) {
      console.log({ e });
      Toast.show({ type: 'error', text1: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  const handlePincodeChange = async (pin: string, setFieldValue: any) => {
    try {
      const numericText = pin.replace(/[^0-9]/g, '').substring(0, 6);
      setFieldValue('pincode', numericText);
      if (numericText?.length === 6) {
        const response = await getAddressByPincode({ pincode: numericText });
        if (response?.data?.status === '00') {
          const addressData = response.data.data || response.data;
          setFieldValue('state', addressData?.State?.toUpperCase() || '');
          setState(addressData?.State?.toUpperCase() || '');
          setFieldValue('district', addressData?.District?.toUpperCase());
        } else {
          setFieldValue('state', '');
          setFieldValue('district', '');
        }
      }
    } catch (error) {}
  };

  return (
    <Formik
      initialValues={companyInfo}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async values => {
        const payload = JSON.parse(JSON.stringify(values));
        delete payload.insert_date;
        delete payload.update_date;
        delete payload.flag;
        delete payload.kyc_verify;
        delete payload.vendor_onboarded;
        delete payload.status;
        delete payload.role;
        delete payload.employee_count;
        delete payload.vehicle_count;

        const resp = await postUpdateVendorDetails({
          ...payload,
          vendorid: vendorId,
        });
        if (resp?.status === '00') {
          setEditable(false);
        } else {
          Toast.show({ type: 'error', text1: resp?.message });
        }
      }}
    >
      {({ values, handleChange, errors, handleSubmit, setFieldValue }) => {
        console.log({ errors, values });
        return (
          <ProfileLayout
            activeTab="ProfileCompanyInfo"
            onTabChange={onTabChange}
            isEditable={editable}
            onEditPress={() => setEditable(prev => !prev)}
          >
            <Loader visible={loading} />

            {/* MAIN CONTAINER */}
            <View style={styles.container}>
              {/* SCROLLABLE CONTENT */}
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card style={styles.contentCard}>
                  <Card.Content style={styles.cardContent}>
                    {/* Company Details */}
                    <View style={styles.section}>
                      <Text variant="titleMedium" style={styles.sectionTitle}>
                        Company Details
                      </Text>

                      <Dropdown
                        label="Company Type *"
                        data={companyTypedata}
                        value={values?.companyType}
                        onChange={(val: any) =>
                          handleChange('companyType')(val)
                        }
                        error={!!errors?.companyType}
                        errorMessage={errors?.companyType}
                        disabled={!editable}
                      />

                      <Input
                        label="Company Name"
                        value={values.companyName}
                        onChangeText={handleChange('companyName')}
                        mode="outlined"
                        editable={editable}
                        style={[styles.input, { marginTop: 10 }]}
                        outlineStyle={styles.inputOutline}
                        error={errors.companyName}
                      />

                      {(values?.companyType === 'CHALAK MALAK' ||
                        values?.companyType === 'OWENER/INDIVIDUAL') && (
                        <Input
                          label="Owner Name"
                          value={values.owner_name}
                          onChangeText={handleChange('owner_name')}
                          mode="outlined"
                          editable={editable}
                          style={styles.input}
                          outlineStyle={styles.inputOutline}
                          error={errors.owner_name}
                        />
                      )}

                      <Input
                        label="Mobile Number"
                        value={values.mobileNo}
                        onChangeText={handleChange('mobileNo')}
                        mode="outlined"
                        editable={editable}
                        keyboardType="phone-pad"
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        error={errors.mobileNo}
                      />
                    </View>

                    {/* Address Info */}
                    <View style={styles.section}>
                      <Text variant="titleMedium" style={styles.sectionTitle}>
                        Address Information
                      </Text>

                      <Input
                        label="Building, Apartment, Plot Number"
                        value={values.address1}
                        onChangeText={handleChange('address1')}
                        mode="outlined"
                        editable={editable}
                        multiline
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        error={errors.address1}
                      />

                      <Input
                        label="Area, Street, Sector, Village"
                        value={values.address2}
                        onChangeText={handleChange('address2')}
                        mode="outlined"
                        editable={editable}
                        multiline
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        error={errors.address2}
                      />

                      <View style={styles.compactRow}>
                        <View style={{ flex: 1 }}>
                          <Input
                            label="Pincode *"
                            value={values.pincode}
                            onChangeText={text =>
                              handlePincodeChange(text, setFieldValue)
                            }
                            mode="outlined"
                            editable={editable}
                            keyboardType="number-pad"
                            maxLength={6}
                            style={[styles.input, styles.compactInput]}
                            outlineStyle={styles.inputOutline}
                            error={errors.pincode}
                          />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Input
                            label="Town/Tahsil *"
                            value={values.Tahsil}
                            onChangeText={handleChange('Tahsil')}
                            mode="outlined"
                            editable={editable}
                            style={[styles.input, styles.compactInput]}
                            outlineStyle={styles.inputOutline}
                            error={errors.Tahsil}
                          />
                        </View>
                      </View>

                      <Dropdown
                        label="State *"
                        data={stateData?.data || []}
                        value={values?.state}
                        onChange={(val: string | string[]) => {
                          setFieldValue('state', val);
                          setState(val as string);
                          setFieldValue('district', '');
                        }}
                        error={!!errors?.state}
                        errorMessage={errors?.state}
                        disabled={!editable}
                      />

                      <Dropdown
                        label="District *"
                        data={districtData?.data || []}
                        value={values?.district}
                        onChange={(val: string | string[]) =>
                          setFieldValue('district', val)
                        }
                        error={!!errors?.district}
                        errorMessage={errors?.district}
                        disabled={!editable && !values?.state}
                      />
                    </View>
                  </Card.Content>
                </Card>
              </ScrollView>

              {/* STICKY BUTTON */}
              {editable && (
                <View style={styles.stickyFooter}>
                  <Button mode="contained" onPress={() => handleSubmit()}>
                    Save Changes
                  </Button>
                </View>
              )}
            </View>
          </ProfileLayout>
        );
      }}
    </Formik>
  );
};

export default ProfileCompanyInfo;

/* ============================================================
   STYLES
============================================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 10,
  },
  contentCard: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 16,
    marginBottom: 10,
  },
  compactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  compactInput: {
    flex: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  inputOutline: {
    borderRadius: 8,
  },
});

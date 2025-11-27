import {
  useGetAddressByPinMutation,
  useGetDistrictQuery,
  useGetStateQuery,
} from '@api/hooks_api';
import { VendorRegistrationRequest } from '@api/types/auth.types';
import Dropdown from '@components/common/Dropdown';
import FormikDropdown from '@components/common/FormikDropdown';
import FormikInput from '@components/common/FormikInput';
import Loader from '@components/common/Loader';
import { useFormikContext } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { companyTypedata } from '../helper';

const Step1Form: React.FC = () => {
  const [getAddressByPincode] = useGetAddressByPinMutation();
  const { data: stateData, isLoading: stateLoading } = useGetStateQuery();
  const { values, setFieldValue, errors, touched } =
    useFormikContext<VendorRegistrationRequest>();

  const { data: districtData, isLoading: districtLoading } =
    useGetDistrictQuery({
      state: values?.VendorDetails?.state,
    });

  const isChalakmalakOrIndividual =
    values.VendorDetails.companyType === 'CHALAK MALAK' ||
    values.VendorDetails.companyType === 'OWENER/INDIVIDUAL';

  const handlePincodeChange = async (pin: string) => {
    try {
      const numericText = pin.replace(/[^0-9]/g, '').substring(0, 6);
      setFieldValue('VendorDetails.pincode', numericText);
      if (numericText?.length === 6) {
        const response = await getAddressByPincode({ pincode: numericText });
        if (response?.data?.status === '00') {
          const addressData = response.data.data || response.data;
          setFieldValue(
            'VendorDetails.state',
            addressData?.State?.toLocaleUpperCase() || '',
          );
          setFieldValue(
            'VendorDetails.district',
            addressData?.District?.toLocaleUpperCase(),
          );
        } else {
          setFieldValue('VendorDetails.state', '');
          setFieldValue('VendorDetails.district', '');
        }
      }
    } catch (error) {}
  };

  // Company Type Select
  const handleCompanyTypeSelect = (val: string | string[]) => {
    setFieldValue('VendorDetails.companyType', val);
    setFieldValue('kycDetails.panNo', '');
    setFieldValue('kycDetails.gstNo', '');
    setFieldValue('kycDetails.cinNo', '');
    setFieldValue('kycDetails.aadharNo', '');
    setFieldValue('VendorEmployeeDetails', []);
  };

  return (
    <View style={styles.container}>
      <Loader visible={stateLoading || districtLoading} />
      <View style={styles.formContainer}>
        {/* Company Type Field */}
        <View style={styles.inputContainer}>
          <Dropdown
            label="Company Type *"
            data={companyTypedata}
            value={values?.VendorDetails?.companyType}
            onChange={handleCompanyTypeSelect}
            error={
              touched?.VendorDetails?.companyType &&
              !!errors?.VendorDetails?.companyType
            }
            errorMessage={errors?.VendorDetails?.companyType}
          />
        </View>

        {/* Company Name / Individual Name */}
        <FormikInput
          name="VendorDetails.companyName"
          label={
            isChalakmalakOrIndividual
              ? 'Full Name (Name As per Aadhaar) *'
              : 'Company Name *'
          }
          mode="outlined"
          left={<TextInput.Icon icon="office-building" size={18} />}
        />
        {/* Owner Name for Business Entities */}
        {!isChalakmalakOrIndividual && (
          <FormikInput
            name="VendorDetails.owner_name"
            label="Owner Name (Name As per Aadhaar) *"
            mode="outlined"
            left={<TextInput.Icon icon="account" size={18} />}
          />
        )}

        {/* Mobile Number Field */}
        <TextInput
          label="Mobile Number *"
          value={values.VendorDetails.mobileNo}
          mode="outlined"
          style={styles.textInput}
          onChangeText={(text: string) =>
            setFieldValue('VendorDetails.mobileNo', text.toUpperCase())
          }
          keyboardType="number-pad"
          maxLength={10}
          editable={false}
          left={<TextInput.Icon icon="phone" size={18} />}
        />

        {/* Address Section */}

        <FormikInput
          name="VendorDetails.address1"
          label="Building, Apartment, Plot Number *"
          mode="outlined"
          left={<TextInput.Icon icon="home" size={18} />}
        />
        <FormikInput
          name="VendorDetails.address2"
          label="Area, Street, Sector, Village"
          mode="outlined"
          left={<TextInput.Icon icon="road" size={18} />}
        />

        {/* Location Details in Compact Row */}
        <FormikInput
          name="VendorDetails.pincode"
          label="Pincode *"
          placeholder="000000"
          value={values.VendorDetails.pincode}
          mode="outlined"
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={handlePincodeChange}
        />

        <FormikDropdown
          name="VendorDetails.state"
          label="State *"
          data={stateData?.data || []}
        />
        {/* State and District Selection */}

        <View
          style={[styles.selectContainer, { flex: 1 }]}
          pointerEvents={values?.VendorDetails?.state ? 'auto' : 'none'}
        >
          <FormikDropdown
            name="VendorDetails.district"
            label="District *"
            data={districtData?.data || []}
          />
        </View>

        <FormikInput
          name="VendorDetails.Tahsil"
          label="Town/Tahsil *"
          mode="outlined"
          left={<TextInput.Icon icon="map-marker" size={18} />}
          editable={
            !!values?.VendorDetails?.state && !!values?.VendorDetails?.district
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  stepHeader: {
    marginBottom: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  formContainer: {
    gap: 8,
  },
  inputContainer: {
    marginBottom: 4,
  },
  sectionLabel: {
    marginTop: 4,
    marginBottom: 6,
    fontWeight: '500',
    color: '#666',
  },
  textInput: {
    marginBottom: 4,
  },
  selectBox: {
    borderColor: '#000',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    minHeight: 50,
  },
  selectInput: {
    fontSize: 14,
    paddingVertical: 2,
  },
  disabledSelect: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  compactRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  compactInput: {
    flex: 1,
    marginBottom: 4,
  },
  selectRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  selectContainer: {
    marginBottom: 4,
  },
});

export default Step1Form;

import { useFormikContext } from 'formik';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import {
  useGetAddressByPinMutation,
  useGetDistrictQuery,
  useGetStateQuery,
  useGetTalukaQuery,
} from '../../../../api/hooks_api';
import { VendorRegistrationRequest } from '../../../../api/types/auth.types';
import Dropdown from '../../../../components/common/Dropdown';
import { companyTypedata, initialValues } from '../helper';

const Step1Form: React.FC = () => {
  const [getAddressByPincode] = useGetAddressByPinMutation();
  const { data: stateData } = useGetStateQuery();
  const { values, setFieldValue } =
    useFormikContext<VendorRegistrationRequest>();

  const state = values?.VendorDetails?.state;
  const district = values?.VendorDetails?.destination;
  const { data: districtData } = useGetDistrictQuery({
    state: state,
  });

  const { data: talukaData } = useGetTalukaQuery(
    {
      state: state,
      district: district,
    },
    {
      skip: state === '' || district === '',
    },
  );

  const isChalakmalakOrIndividual =
    values.VendorDetails.companyType === 'CHALAK MALAK' ||
    values.VendorDetails.companyType === 'INDIVIDUAL';

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
            'VendorDetails.destination',
            addressData?.District?.toLocaleUpperCase(),
          );
        } else {
          setFieldValue('VendorDetails.state', '');
          setFieldValue('VendorDetails.destination', '');
        }
      }
    } catch (error) {}
  };

  const stateDropdownData = useMemo(() => {
    if (!stateData?.data) {
      return [];
    }
    return stateData?.data?.map(item => {
      return { label: item?.state, value: item?.state };
    });
  }, [stateData]);

  const districtDropdownData = useMemo(() => {
    if (!districtData?.data) {
      return [];
    }
    return districtData?.data?.map(item => {
      return { label: item?.district, value: item?.district };
    });
  }, [districtData]);

  const talukaDropdownData = useMemo(() => {
    if (!talukaData?.data) return [];
    return talukaData.data.map((item: any) => ({
      label: item?.division,
      value: item?.division,
    }));
  }, [talukaData]);
  const handleCompanyTypeSelect = (val: string | string[]) => {
    setFieldValue('VendorDetails.companyType', val);
    setFieldValue('kycDetails.panNo', '');
    setFieldValue('kycDetails.gstNo', '');
    setFieldValue('kycDetails.cinNo', '');
    setFieldValue('kycDetails.aadharNo', '');
    setFieldValue('VendorEmployeeDetails', [
      {
        ...initialValues.VendorEmployeeDetails[0],
        designation: val === 'CHALAK MALAK' ? 'Authority' : '',
      },
    ]);
  };

  const handleStateSelect = (val: string | string[]) => {
    setFieldValue('VendorDetails.state', val);
    setFieldValue('VendorDetails.destination', '');
  };
  const handleDistrictSelect = (val: string | string[]) => {
    setFieldValue('VendorDetails.destination', val);
  };
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* Company Type Field */}
        <View style={styles.inputContainer}>
          <Dropdown
            label="Company Type *"
            data={companyTypedata}
            value={values?.VendorDetails?.companyType}
            onChange={handleCompanyTypeSelect}
          />
        </View>

        {/* Company Name / Individual Name */}
        <TextInput
          label={
            isChalakmalakOrIndividual
              ? 'Full Name (Name As per Aadhaar) *'
              : 'Company Name *'
          }
          value={values.VendorDetails.companyName}
          mode="outlined"
          style={styles.textInput}
          onChangeText={(text: string) =>
            setFieldValue('VendorDetails.companyName', text.toUpperCase())
          }
          left={<TextInput.Icon icon="office-building" size={18} />}
        />

        {/* Owner Name for Business Entities */}
        {!isChalakmalakOrIndividual && (
          <TextInput
            label="Owner Name (Name As per Aadhaar) *"
            value={values.VendorDetails.owner_name}
            mode="outlined"
            style={styles.textInput}
            onChangeText={(text: string) =>
              setFieldValue('VendorDetails.owner_name', text.toUpperCase())
            }
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

        <TextInput
          label="Building, Apartment, Plot Number *"
          value={values.VendorDetails.address1}
          mode="outlined"
          style={styles.textInput}
          onChangeText={(text: string) =>
            setFieldValue('VendorDetails.address1', text.toUpperCase())
          }
          left={<TextInput.Icon icon="home" size={18} />}
        />

        <TextInput
          label="Area, Street, Sector, Village"
          value={values.VendorDetails.address2}
          mode="outlined"
          style={styles.textInput}
          onChangeText={(text: string) =>
            setFieldValue('VendorDetails.address2', text.toUpperCase())
          }
          left={<TextInput.Icon icon="road" size={18} />}
        />

        {/* Location Details in Compact Row */}
        <View style={styles.compactRow}>
          <View style={{ width: 100 }}>
            <TextInput
              label="Pincode *"
              value={values.VendorDetails.pincode}
              mode="outlined"
              style={[styles.textInput, styles.compactInput]}
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={handlePincodeChange}
              // left={<TextInput.Icon icon="map-marker" size={18} />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Dropdown
              label="State *"
              data={stateDropdownData}
              value={values?.VendorDetails?.state}
              onChange={handleStateSelect}
            />
          </View>
        </View>

        {/* State and District Selection */}

        <View style={[styles.selectContainer, { flex: 1 }]}>
          <Dropdown
            label="District *"
            data={districtDropdownData}
            value={values?.VendorDetails?.destination}
            onChange={handleDistrictSelect}
          />
        </View>

        <View
          style={[styles.selectContainer, { flex: 1 }]}
          pointerEvents={values?.VendorDetails?.state ? 'auto' : 'none'}
        >
          <Dropdown
            label="Town/Tahsil *"
            data={talukaDropdownData}
            value={values?.VendorDetails?.Tahsil}
            onChange={text => setFieldValue('VendorDetails.Tahsil', text)}
          />
        </View>
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

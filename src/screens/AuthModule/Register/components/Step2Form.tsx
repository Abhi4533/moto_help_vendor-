import { useFormikContext } from 'formik';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';

import { useGetDesignationListQuery } from '@api/hooks_api';
import {
  VendorEmployeeDetails,
  VendorRegistrationRequest,
} from '@api/types/auth.types';
import Dropdown from '@components/common/Dropdown';
import Input from '@components/common/Input';
import Loader from '@components/common/Loader';
import { StepTwoSchema } from '../validationSchema';

const EMPTY_AUTHORITY: VendorEmployeeDetails = {
  full_name: '',
  designation: '',
  contact_No: '',
  alternate_No: '',
  website: '',
  username: '',
  password: '',
  emailAddress: '',
};

const OTHER_DESIGNATION_VALUE = 'Other';
const OTHER_DESIGNATION_LABEL = 'Other';

interface Step2FormProps {
  onSkip: () => void;
}

const Step2Form: React.FC<Step2FormProps> = ({ onSkip }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { values, setFieldValue, errors, setErrors, setTouched } =
    useFormikContext<VendorRegistrationRequest>();
  const { data: designationList, isLoading } = useGetDesignationListQuery();

  const employeeCount = Number(values?.VendorDetails?.employee_count || 0);

  const designationOptions = useMemo(() => {
    const baseList = designationList?.data || [];
    return [
      ...baseList,
      { label: OTHER_DESIGNATION_LABEL, value: OTHER_DESIGNATION_VALUE },
    ];
  }, [designationList]);

  const vendorEmployeeDetails = useMemo(() => {
    const list = Array.isArray(values.VendorEmployeeDetails)
      ? [...values.VendorEmployeeDetails]
      : [];

    while (list.length < employeeCount) {
      list.push({ ...EMPTY_AUTHORITY });
    }

    return list.slice(0, employeeCount);
  }, [values.VendorEmployeeDetails, employeeCount]);

  const currentTotalCount = vendorEmployeeDetails.length;
  const maxAllowed = Number(values?.VendorDetails?.employee_count || 0);
  const isLimitReached = currentTotalCount === maxAllowed;

  const openModal = (index: number) => {
    setActiveIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActiveIndex(null);
  };

  const handleSaveAuthority = async () => {
    try {
      await StepTwoSchema.validate(values, { abortEarly: false });

      closeModal();
    } catch (err: any) {
      const formErrors: Record<string, string> = {};
      err.inner?.forEach((error: any) => {
        if (error.path) formErrors[error.path] = error.message;
      });
      setErrors(formErrors);
      setTouched(formErrors);
    }
  };

  const handleDesignationChange = (text: any) => {
    if (activeIndex !== null) {
      setFieldValue(`VendorEmployeeDetails[${activeIndex}].designation`, text);

      // Clear custom designation if not "Other"
      if (text !== OTHER_DESIGNATION_VALUE) {
        setFieldValue(
          `VendorEmployeeDetails[${activeIndex}].customDesignation`,
          '',
        );
      }
    }
  };

  const handleFieldChange = (
    field: keyof VendorEmployeeDetails | 'customDesignation',
    text: string,
  ) => {
    if (activeIndex !== null) {
      const transformedText = field === 'full_name' ? text.toUpperCase() : text;
      setFieldValue(
        `VendorEmployeeDetails[${activeIndex}].${field}`,
        transformedText,
      );
    }
  };

  const isOtherDesignationSelected = (index: number) => {
    return (
      vendorEmployeeDetails[index]?.designation === OTHER_DESIGNATION_VALUE
    );
  };

  const renderAuthorityButton = ({
    item,
    index,
  }: {
    item: VendorEmployeeDetails;
    index: number;
  }) => (
    <Button
      mode="outlined"
      style={styles.authorityBtn}
      onPress={() => openModal(index)}
      icon={item.full_name ? 'account-check' : 'account-plus'}
      contentStyle={styles.leftAlignedButton}
      labelStyle={styles.buttonLabel}
    >
      {item.full_name || `Add Authority ${index + 1}`}
    </Button>
  );
  console.log({ errors });
  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />

      <Card style={styles.summaryCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text variant="titleMedium" style={styles.mainTitle}>
              Operating Authority Other Than User
            </Text>

            <Button
              mode="contained-tonal"
              compact
              onPress={onSkip}
              style={styles.skipBtn}
              labelStyle={styles.skipLabel}
              icon="skip-next"
            >
              Skip
            </Button>
          </View>

          <View style={styles.countSection}>
            <View style={styles.inputContainer}>
              <Input
                label="Maximum Authorities"
                value={values?.VendorDetails?.employee_count?.toString()}
                mode="outlined"
                keyboardType="number-pad"
                maxLength={2}
                left={<TextInput.Icon icon="account-group" />}
                onChangeText={text =>
                  setFieldValue(
                    'VendorDetails.employee_count',
                    text.replace(/[^0-9]/g, ''),
                  )
                }
                error={errors?.VendorDetails?.employee_count}
              />
            </View>

            <View
              style={[
                styles.countBadge,
                isLimitReached && styles.countBadgeFull,
              ]}
            >
              <Text variant="labelLarge" style={styles.countText}>
                {currentTotalCount + 1}/{maxAllowed + 1}
              </Text>
            </View>
          </View>

          <HelperText type="info" style={styles.helperText}>
            If you wish to authorize/allow others to operate this app on their
            mobile with same credentials
          </HelperText>
        </Card.Content>
      </Card>

      <FlatList
        data={vendorEmployeeDetails}
        keyExtractor={(_, i) => `authority-${i}`}
        renderItem={renderAuthorityButton}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modal}
        >
          {activeIndex !== null && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text variant="titleMedium" style={styles.modalTitle}>
                Authority #{activeIndex + 1}
              </Text>

              <Dropdown
                label="Designation *"
                data={designationOptions}
                value={vendorEmployeeDetails[activeIndex]?.designation}
                onChange={handleDesignationChange}
                error={
                  !!errors?.VendorEmployeeDetails?.[activeIndex]?.designation
                }
                errorMessage={
                  errors?.VendorEmployeeDetails?.[activeIndex]?.designation
                }
              />

              {isOtherDesignationSelected(activeIndex) && (
                <Input
                  label="Enter Designation *"
                  mode="outlined"
                  value={
                    vendorEmployeeDetails[activeIndex]?.customDesignation || ''
                  }
                  onChangeText={text =>
                    handleFieldChange('customDesignation', text)
                  }
                  left={<TextInput.Icon icon="pencil" />}
                  error={
                    errors?.VendorEmployeeDetails?.[activeIndex]
                      ?.customDesignation
                  }
                />
              )}

              <Input
                label="Full Name *"
                mode="outlined"
                value={vendorEmployeeDetails[activeIndex]?.full_name}
                onChangeText={text => handleFieldChange('full_name', text)}
                error={errors?.VendorEmployeeDetails?.[activeIndex]?.full_name}
              />

              <Input
                label="Mobile Number *"
                keyboardType="phone-pad"
                mode="outlined"
                maxLength={10}
                value={vendorEmployeeDetails[activeIndex]?.contact_No}
                onChangeText={text =>
                  handleFieldChange('contact_No', text.replace(/[^0-9]/g, ''))
                }
                error={errors?.VendorEmployeeDetails?.[activeIndex]?.contact_No}
              />

              <Input
                label="Email Address"
                keyboardType="email-address"
                mode="outlined"
                value={vendorEmployeeDetails[activeIndex]?.emailAddress}
                onChangeText={text =>
                  handleFieldChange('emailAddress', text.trim())
                }
                error={
                  errors?.VendorEmployeeDetails?.[activeIndex]?.emailAddress
                }
              />

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={closeModal}
                  style={styles.cancelBtn}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveAuthority}
                  style={styles.saveBtn}
                >
                  Save Authority
                </Button>
              </View>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  skipBtn: {
    borderRadius: 20,
  },
  skipLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  countSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  countBadgeFull: {
    backgroundColor: '#e74c3c',
  },
  countText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  authorityBtn: {
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  leftAlignedButton: {
    justifyContent: 'flex-start',
  },
  buttonLabel: {
    textAlign: 'left',
  },
  modal: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 40,
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    fontSize: 18,
  },
  fieldSpacing: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  cancelBtn: {
    minWidth: 100,
  },
  saveBtn: {
    minWidth: 140,
  },
});

export default Step2Form;

import { useGetDesignationListQuery } from '@api/hooks_api';
import {
  VendorEmployeeDetails,
  VendorRegistrationRequest,
} from '@api/types/auth.types';
import Dropdown from '@components/common/Dropdown';
import EmptyState from '@components/common/EmptyState';
import Input from '@components/common/Input';
import Loader from '@components/common/Loader';
import { useFormikContext } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text, TextInput } from 'react-native-paper';

const MIN_AUTHORITIES = 1;
const OTHER_DESIGNATION = 'Other';

const Step2Form: React.FC<any> = ({ onSkip }) => {
  const { values, setFieldValue, errors } =
    useFormikContext<VendorRegistrationRequest>();
  const { data: designationList, isLoading } = useGetDesignationListQuery();

  const vendorEmployeeDetails: VendorEmployeeDetails[] = useMemo(
    () =>
      Array.isArray(values.VendorEmployeeDetails)
        ? values.VendorEmployeeDetails
        : [],
    [values.VendorEmployeeDetails],
  );

  const currentTotalCount = vendorEmployeeDetails.length;
  const canAddMore =
    currentTotalCount < Number(values?.VendorDetails?.employee_count);

  const addContact = useCallback(() => {
    if (!canAddMore) return;

    const newContact: VendorEmployeeDetails = {
      full_name: '',
      designation:
        values?.VendorDetails?.companyType === 'CHALAK MALAK'
          ? 'Authority'
          : '',
      contact_No: '',
      alternate_No: '',
      website: '',
      username: '',
      password: '',
      emailAddress: '',
    };

    setFieldValue('VendorEmployeeDetails', [
      ...vendorEmployeeDetails,
      newContact,
    ]);
  }, [
    vendorEmployeeDetails,
    setFieldValue,
    canAddMore,
    values?.VendorDetails?.companyType,
  ]);

  const removeContact = useCallback(
    (index: number) => {
      if (vendorEmployeeDetails.length <= MIN_AUTHORITIES) return;

      const updatedContacts = vendorEmployeeDetails.filter(
        (_, i) => i !== index,
      );
      setFieldValue('VendorEmployeeDetails', updatedContacts);
    },
    [vendorEmployeeDetails, setFieldValue],
  );

  const isOtherDesignationSelected = (index: number) =>
    vendorEmployeeDetails[index]?.designation === OTHER_DESIGNATION;

  return (
    <View style={styles.container}>
      {/* ⭐ ALWAYS FLOATING SKIP BUTTON */}
      <View style={styles.floatingSkipContainer}></View>

      <Loader visible={isLoading} />

      <Card style={styles.summaryCard}>
        <Card.Content style={styles.summaryContent}>
          <View style={styles.headerSection}>
            <View style={styles.headerText}>
              <Text variant="titleMedium" style={styles.mainTitle}>
                Operating Authority other Than User
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Input
                label="Maximum Authorities"
                value={values?.VendorDetails?.employee_count}
                mode="outlined"
                style={styles.maxCountInput}
                keyboardType="number-pad"
                maxLength={2}
                left={<TextInput.Icon icon="account-group" />}
                onChangeText={text =>
                  setFieldValue('VendorDetails.employee_count', text)
                }
                error={errors?.VendorDetails?.employee_count}
              />
            </View>

            <View
              style={[
                styles.countBadge,

                currentTotalCount ===
                  Number(values?.VendorDetails?.employee_count) &&
                  styles.countBadgeFull,
              ]}
            >
              <Text variant="labelLarge" style={styles.countText}>
                Total User – {currentTotalCount + 1}/
                {Number(values?.VendorDetails?.employee_count) + 1}
              </Text>
            </View>
            <Button
              mode="contained-tonal"
              compact
              onPress={() => {
                onSkip();
              }}
              style={styles.floatingSkipBtn}
              labelStyle={styles.floatingSkipLabel}
            >
              Skip
            </Button>
          </View>

          {canAddMore ? (
            <Button
              mode="outlined"
              onPress={addContact}
              style={styles.addButton}
              icon="account-plus"
              contentStyle={styles.buttonContent}
            >
              Add Additional Authority
            </Button>
          ) : (
            <Card style={styles.maxLimitCard}>
              <Card.Content style={styles.maxLimitContent}>
                <IconButton icon="alert-circle" iconColor="#ff9800" size={18} />
                <Text variant="bodySmall" style={styles.maxLimitText}>
                  Maximum of {values?.VendorDetails?.employee_count} authorities
                  reached
                </Text>
              </Card.Content>
            </Card>
          )}

          {errors?.VendorEmployeeDetails &&
            typeof errors?.VendorEmployeeDetails === 'string' && (
              <Card style={styles.maxLimitCard}>
                <Card.Content style={styles.maxLimitContent}>
                  <IconButton icon="close" iconColor="#ff9800" size={18} />
                  <Text variant="bodySmall" style={styles.maxLimitText}>
                    {errors?.VendorEmployeeDetails}
                  </Text>
                </Card.Content>
              </Card>
            )}
        </Card.Content>
      </Card>

      <FlatList
        keyboardShouldPersistTaps="always"
        data={vendorEmployeeDetails}
        renderItem={({ item, index }) => (
          <Card style={styles.contactCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleSmall" style={styles.contactNumberText}>
                  Authority #{index + 1}
                </Text>

                {index >= MIN_AUTHORITIES && (
                  <IconButton
                    icon="close-circle"
                    size={20}
                    iconColor="#d32f2f"
                    onPress={() => removeContact(index)}
                    style={styles.removeButton}
                  />
                )}
              </View>

              {values?.VendorDetails?.companyType === 'CHALAK MALAK' ? (
                <Input
                  label="Designation *"
                  value={item.designation}
                  mode="outlined"
                  style={styles.input}
                  editable={false}
                />
              ) : (
                <>
                  <Dropdown
                    label="Designation *"
                    data={
                      designationList?.data
                        ? [
                            ...designationList.data,
                            { label: 'Other', value: 'Other' },
                          ]
                        : [{ label: 'Other', value: 'Other' }]
                    }
                    value={item?.designation}
                    onChange={text =>
                      setFieldValue(
                        `VendorEmployeeDetails[${index}].designation`,
                        text,
                      )
                    }
                    error={
                      !!(errors?.VendorEmployeeDetails?.[index] as any)
                        ?.designation
                    }
                    errorMessage={
                      (errors?.VendorEmployeeDetails?.[index] as any)
                        ?.designation
                    }
                  />

                  {isOtherDesignationSelected(index) && (
                    <Input
                      label="Enter Designation *"
                      value={item.customDesignation || ''}
                      mode="outlined"
                      style={[styles.input, styles.otherInput]}
                      left={<TextInput.Icon icon="pencil" />}
                      onChangeText={text =>
                        setFieldValue(
                          `VendorEmployeeDetails[${index}].customDesignation`,
                          text,
                        )
                      }
                      error={
                        (errors?.VendorEmployeeDetails?.[index] as any)
                          ?.customDesignation
                      }
                    />
                  )}
                </>
              )}

              <Input
                label="Full Name *"
                value={item.full_name}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
                onChangeText={text =>
                  setFieldValue(
                    `VendorEmployeeDetails[${index}].full_name`,
                    text.toUpperCase(),
                  )
                }
                error={
                  (errors?.VendorEmployeeDetails?.[index] as any)?.full_name
                }
              />

              <Input
                label="Mobile Number *"
                value={item.contact_No}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={text =>
                  setFieldValue(
                    `VendorEmployeeDetails[${index}].contact_No`,
                    text,
                  )
                }
                error={
                  (errors?.VendorEmployeeDetails?.[index] as any)?.contact_No
                }
              />

              <Input
                label="Email Address"
                value={item.emailAddress}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={text =>
                  setFieldValue(
                    `VendorEmployeeDetails[${index}].emailAddress`,
                    text,
                  )
                }
                error={
                  (errors?.VendorEmployeeDetails?.[index] as any)?.emailAddress
                }
              />
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="Authority Not Available" />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ⭐ INDUSTRY STANDARD FLOATING SKIP
  floatingSkipContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 99999,
    elevation: 10,
  },
  floatingSkipBtn: {
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  floatingSkipLabel: {
    fontSize: 12,
    fontWeight: '600',
  },

  summaryCard: { marginBottom: 16 },
  summaryContent: { paddingVertical: 12 },

  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerText: { flex: 1 },

  mainTitle: {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },

  maxCountInput: { backgroundColor: '#fff', flex: 1 },

  countBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeFull: { backgroundColor: '#ff6b6b' },

  countText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    paddingVertical: 8,
    width: 100,
  },

  addButton: {
    marginTop: 8,
    marginBottom: 8,
    borderColor: '#3498db',
  },

  buttonContent: { paddingVertical: 6 },

  maxLimitCard: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  maxLimitContent: { flexDirection: 'row', alignItems: 'center' },
  maxLimitText: { color: '#e65100', marginLeft: 4, fontSize: 12 },

  contactCard: { marginBottom: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  input: { marginBottom: 6, backgroundColor: '#fff' },
  otherInput: { marginTop: 6 },

  contactNumberText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#2c3e50',
  },

  removeButton: { padding: 0, margin: 0 },
});

export default Step2Form;

import { useFormikContext } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text, TextInput } from 'react-native-paper';
import {
  VendorEmployeeDetails,
  VendorRegistrationRequest,
} from '../../../../api/types/auth.types';
import Dropdown from '../../../../components/common/Dropdown';
import { designationdata } from '../helper';

// Constants
const MIN_AUTHORITIES = 1;
const MAX_AUTHORITIES = 10;

// Types for better type safety
interface AuthorityFormProps {
  contact: VendorEmployeeDetails;
  index: number;
  onRemove: (index: number) => void;
  companyType?: string;
  getErrorMessage: (index: number, field: string) => string | undefined;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string, isTouched?: boolean) => void;
  allAuthorities: VendorEmployeeDetails[];
}

interface SummaryCardProps {
  currentTotalCount: number;
  maxAuthorityCount: number;
  maxCountInput: string;
  onMaxCountChange: (text: string) => void;
  onMaxCountBlur: () => void;
  duplicateCount: number;
}

// Helper function to check for duplicates
const checkForDuplicates = (
  authorities: VendorEmployeeDetails[],
  currentIndex: number,
  field: string,
  value: string,
): boolean => {
  if (!value.trim()) return false;

  return authorities.some((authority, index) => {
    if (index === currentIndex) return false;

    const fieldValue = authority[field as keyof VendorEmployeeDetails];
    return (
      fieldValue && String(fieldValue).toLowerCase() === value.toLowerCase()
    );
  });
};

const AuthorityForm: React.FC<AuthorityFormProps> = React.memo(
  ({
    contact,
    index,
    onRemove,
    companyType,
    getErrorMessage,
    setFieldValue,
    setFieldTouched,
    allAuthorities,
  }) => {
    const authorityNumber = index + 1;
    const path = (field: string) => `VendorEmployeeDetails[${index}].${field}`;

    const [duplicateErrors, setDuplicateErrors] = useState<{
      contact_No: boolean;
      emailAddress: boolean;
    }>({
      contact_No: false,
      emailAddress: false,
    });

    const handleTextChange = useCallback(
      (field: string, transformer?: (text: string) => string) =>
        (text: string) => {
          const transformedText = transformer ? transformer(text) : text;
          setFieldValue(path(field), transformedText);

          // Check for duplicates in real-time
          if (field === 'contact_No' || field === 'emailAddress') {
            const isDuplicate = checkForDuplicates(
              allAuthorities,
              index,
              field,
              transformedText,
            );

            setDuplicateErrors(prev => ({
              ...prev,
              [field]: isDuplicate,
            }));
          }
        },
      [setFieldValue, path, allAuthorities, index],
    );

    const handleBlur = useCallback(
      (field: string) => {
        setFieldTouched(path(field), true);

        // Re-check duplicates on blur
        if (field === 'contact_No' || field === 'emailAddress') {
          const value = contact[field as keyof VendorEmployeeDetails];
          if (value) {
            const isDuplicate = checkForDuplicates(
              allAuthorities,
              index,
              field,
              String(value),
            );

            setDuplicateErrors(prev => ({
              ...prev,
              [field]: isDuplicate,
            }));
          }
        }
      },
      [setFieldTouched, path, contact, allAuthorities, index],
    );

    const designationOptions = useMemo(() => {
      const baseOptions = [...designationdata];
      if (companyType === 'PARTNERSHIP') {
        baseOptions.push({ label: 'Partner', value: 'Partner' });
      }
      if (companyType === 'PVT LTD') {
        baseOptions.push({ label: 'Director/CEO', value: 'Director/CEO' });
      }
      return baseOptions;
    }, [companyType]);

    const getFieldError = useCallback(
      (field: string): string | undefined => {
        const validationError = getErrorMessage(index, field);
        if (validationError) return validationError;

        if (field === 'contact_No' && duplicateErrors.contact_No) {
          return 'This mobile number is already used by another authority';
        }

        if (field === 'emailAddress' && duplicateErrors.emailAddress) {
          return 'This email address is already used by another authority';
        }

        return undefined;
      },
      [getErrorMessage, index, duplicateErrors],
    );

    return (
      <Card style={styles.contactCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.contactNumber}>
              <Text variant="titleSmall" style={styles.contactNumberText}>
                Authority #{authorityNumber}
                {duplicateErrors.contact_No || duplicateErrors.emailAddress ? (
                  <Text style={styles.duplicateWarning}> • Duplicate</Text>
                ) : null}
              </Text>
            </View>
            {index >= MIN_AUTHORITIES && (
              <IconButton
                icon="close-circle"
                size={20}
                iconColor="#d32f2f"
                onPress={() => onRemove(index)}
                style={styles.removeButton}
              />
            )}
          </View>

          {/* Designation Field */}
          <View style={styles.selectListContainer}>
            {companyType === 'CHALAK MALAK' ? (
              <TextInput
                label="Designation *"
                value={contact.designation}
                mode="outlined"
                style={styles.input}
                editable={false}
              />
            ) : (
              <Dropdown
                label="Designation *"
                data={designationOptions}
                value={contact?.designation}
                onChange={text =>
                  setFieldValue(
                    `VendorEmployeeDetails[${index}].designation`,
                    text,
                  )
                }
              />
            )}
          </View>
          {getFieldError('designation') && (
            <Text style={styles.errorText}>{getFieldError('designation')}</Text>
          )}

          {/* Full Name */}
          <TextInput
            label="Full Name *"
            value={contact.full_name}
            error={!!getFieldError('full_name')}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
            onChangeText={handleTextChange('full_name', text =>
              text.toUpperCase(),
            )}
            onBlur={() => handleBlur('full_name')}
          />
          {getFieldError('full_name') && (
            <Text style={styles.errorText}>{getFieldError('full_name')}</Text>
          )}

          {/* Mobile Number */}
          <TextInput
            label="Mobile Number *"
            value={contact.contact_No}
            error={!!getFieldError('contact_No') || duplicateErrors.contact_No}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={handleTextChange('contact_No', text =>
              text.replace(/[^0-9]/g, ''),
            )}
            onBlur={() => handleBlur('contact_No')}
          />
          {getFieldError('contact_No') && (
            <Text style={styles.errorText}>{getFieldError('contact_No')}</Text>
          )}

          {/* Email Address */}
          <TextInput
            label="Email Address"
            value={contact.emailAddress}
            error={
              !!getFieldError('emailAddress') || duplicateErrors.emailAddress
            }
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={handleTextChange('emailAddress', text =>
              text.toLowerCase(),
            )}
            onBlur={() => handleBlur('emailAddress')}
          />
          {getFieldError('emailAddress') && (
            <Text style={styles.errorText}>
              {getFieldError('emailAddress')}
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  },
);

const SummaryCard: React.FC<SummaryCardProps> = React.memo(
  ({
    currentTotalCount,
    maxAuthorityCount,
    maxCountInput,
    onMaxCountChange,
    onMaxCountBlur,
    duplicateCount,
  }) => {
    const progressPercentage = Math.min(
      (currentTotalCount / maxAuthorityCount) * 100,
      100,
    );
    const canAddMore = currentTotalCount < maxAuthorityCount;

    const getProgressColor = () => {
      if (duplicateCount > 0) return '#ff9800';
      if (currentTotalCount === maxAuthorityCount) return '#ff6b6b';
      if (currentTotalCount >= maxAuthorityCount * 0.8) return '#ffa726';
      return '#4caf50';
    };

    return (
      <Card style={styles.summaryCard}>
        <Card.Content style={styles.summaryContent}>
          <View style={styles.headerSection}>
            <View style={styles.headerText}>
              <Text variant="titleMedium" style={styles.mainTitle}>
                Operating Authorities
              </Text>
              <Text variant="bodySmall" style={styles.subtitle}>
                {duplicateCount > 0 ? (
                  <Text style={styles.duplicateAlert}>
                    {duplicateCount} duplicate(s) found
                  </Text>
                ) : canAddMore ? (
                  `${
                    maxAuthorityCount - currentTotalCount
                  } additional slots available`
                ) : (
                  'Maximum reached'
                )}
              </Text>
            </View>
            <View
              style={[
                styles.countBadge,
                duplicateCount > 0 && styles.countBadgeWarning,
                currentTotalCount === maxAuthorityCount &&
                  styles.countBadgeFull,
              ]}
            >
              <Text variant="labelLarge" style={styles.countText}>
                {currentTotalCount + 1}/{maxAuthorityCount + 1}
                {duplicateCount > 0 ? '!' : ''}
              </Text>
            </View>
          </View>

          <View style={styles.maxCountContainer}>
            <TextInput
              label="Maximum Authorities"
              value={maxCountInput}
              mode="outlined"
              style={styles.maxCountInput}
              keyboardType="number-pad"
              maxLength={2}
              left={<TextInput.Icon icon="account-group" />}
              onChangeText={onMaxCountChange}
              onBlur={onMaxCountBlur}
              error={maxAuthorityCount < MIN_AUTHORITIES}
            />
            <Text variant="bodySmall" style={styles.maxCountHelpText}>
              Minimum {MIN_AUTHORITIES} authority required, maximum{' '}
              {MAX_AUTHORITIES}
            </Text>
            {maxAuthorityCount < MIN_AUTHORITIES && (
              <Text style={styles.errorText}>
                Minimum {MIN_AUTHORITIES} authority is required
              </Text>
            )}
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: getProgressColor(),
                  },
                ]}
              />
            </View>
            {duplicateCount > 0 && (
              <Text variant="bodySmall" style={styles.duplicateHint}>
                Please resolve duplicate entries before proceeding
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  },
);

const Step2Form: React.FC = () => {
  const { values, setFieldValue, errors, touched, setFieldTouched } =
    useFormikContext<VendorRegistrationRequest>();

  const vendorEmployeeDetails: VendorEmployeeDetails[] = useMemo(
    () =>
      Array.isArray(values.VendorEmployeeDetails)
        ? values.VendorEmployeeDetails
        : [],
    [values.VendorEmployeeDetails],
  );

  const [maxAuthorityCount, setMaxAuthorityCount] = useState<number>(() => {
    const savedCount = Number(values?.VendorDetails?.employee_count);
    return savedCount && savedCount >= MIN_AUTHORITIES
      ? savedCount
      : MIN_AUTHORITIES;
  });

  const [maxCountInput, setMaxCountInput] = useState<string>(() => {
    const savedCount = Number(values?.VendorDetails?.employee_count);
    return savedCount && savedCount >= MIN_AUTHORITIES
      ? String(savedCount)
      : String(MIN_AUTHORITIES);
  });

  // Calculate duplicates across all authorities
  const duplicateCount = useMemo(() => {
    const duplicates = new Set<string>();
    const seenContacts = new Set<string>();
    const seenEmails = new Set<string>();

    vendorEmployeeDetails.forEach((authority, index) => {
      // Check mobile number duplicates
      if (authority.contact_No && authority.contact_No.trim()) {
        const normalizedContact = authority.contact_No.trim().toLowerCase();
        if (seenContacts.has(normalizedContact)) {
          duplicates.add(`contact-${normalizedContact}`);
        } else {
          seenContacts.add(normalizedContact);
        }
      }

      // Check email duplicates
      if (authority.emailAddress && authority.emailAddress.trim()) {
        const normalizedEmail = authority.emailAddress.trim().toLowerCase();
        if (seenEmails.has(normalizedEmail)) {
          duplicates.add(`email-${normalizedEmail}`);
        } else {
          seenEmails.add(normalizedEmail);
        }
      }
    });

    return duplicates.size;
  }, [vendorEmployeeDetails]);

  const currentTotalCount = vendorEmployeeDetails.length;
  const canAddMore = currentTotalCount < maxAuthorityCount;

  // Initialize with minimum required authorities
  useEffect(() => {
    if (vendorEmployeeDetails.length < MIN_AUTHORITIES) {
      const initialContacts: VendorEmployeeDetails[] = Array.from(
        { length: MIN_AUTHORITIES - vendorEmployeeDetails.length },
        () => ({
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
        }),
      );
      setFieldValue('VendorEmployeeDetails', [
        ...vendorEmployeeDetails,
        ...initialContacts,
      ]);
    }
  }, [vendorEmployeeDetails.length, values?.VendorDetails?.companyType]);

  const handleMaxCountChange = useCallback(
    (text: string) => {
      const numericValue = text.replace(/[^0-9]/g, '');
      setMaxCountInput(numericValue);

      if (numericValue) {
        const newMaxCount = Math.min(
          Math.max(parseInt(numericValue, 10), MIN_AUTHORITIES),
          MAX_AUTHORITIES,
        );

        setMaxCountInput(String(newMaxCount));

        if (newMaxCount !== maxAuthorityCount) {
          setMaxAuthorityCount(newMaxCount);
          setFieldValue('VendorDetails.employee_count', newMaxCount);

          // Remove excess authorities if current count exceeds new max
          if (currentTotalCount > newMaxCount) {
            const excessCount = currentTotalCount - newMaxCount;
            if (excessCount > 0) {
              const updatedContacts = vendorEmployeeDetails.slice(
                0,
                newMaxCount,
              );
              setFieldValue('VendorEmployeeDetails', updatedContacts);
            }
          }
        }
      } else {
        // Handle empty input
        setMaxCountInput('');
        setMaxAuthorityCount(MIN_AUTHORITIES);
        setFieldValue('VendorDetails.employee_count', MIN_AUTHORITIES);
      }
    },
    [
      maxAuthorityCount,
      currentTotalCount,
      vendorEmployeeDetails,
      setFieldValue,
    ],
  );

  const handleMaxCountBlur = useCallback(() => {
    if (!maxCountInput || parseInt(maxCountInput, 10) < MIN_AUTHORITIES) {
      const defaultValue = String(MIN_AUTHORITIES);
      setMaxCountInput(defaultValue);
      setMaxAuthorityCount(MIN_AUTHORITIES);
      setFieldValue('VendorDetails.employee_count', MIN_AUTHORITIES);
    } else {
      const numericValue = parseInt(maxCountInput, 10);
      const validatedValue = Math.min(
        Math.max(numericValue, MIN_AUTHORITIES),
        MAX_AUTHORITIES,
      );
      if (validatedValue !== numericValue) {
        setMaxCountInput(String(validatedValue));
        setMaxAuthorityCount(validatedValue);
        setFieldValue('VendorDetails.employee_count', validatedValue);
      }
    }
  }, [maxCountInput, setFieldValue]);

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
      // Don't allow removing if it would go below minimum
      if (vendorEmployeeDetails.length <= MIN_AUTHORITIES) {
        return;
      }

      const updatedContacts = vendorEmployeeDetails.filter(
        (_, i) => i !== index,
      );
      setFieldValue('VendorEmployeeDetails', updatedContacts);
    },
    [vendorEmployeeDetails, setFieldValue],
  );

  const getErrorMessage = useCallback(
    (index: number, field: string): string | undefined => {
      const contactErrors = errors.VendorEmployeeDetails?.[index] as any;
      return contactErrors?.[field];
    },
    [errors.VendorEmployeeDetails],
  );

  const renderAdditionalAuthority = useCallback(
    (contact: VendorEmployeeDetails, index: number) => (
      <AuthorityForm
        key={`authority-${index}`}
        contact={contact}
        index={index}
        onRemove={removeContact}
        companyType={values?.VendorDetails?.companyType}
        getErrorMessage={getErrorMessage}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        allAuthorities={vendorEmployeeDetails}
      />
    ),
    [
      removeContact,
      values?.VendorDetails?.companyType,
      getErrorMessage,
      setFieldValue,
      setFieldTouched,
      vendorEmployeeDetails,
    ],
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <SummaryCard
        currentTotalCount={currentTotalCount}
        maxAuthorityCount={maxAuthorityCount}
        maxCountInput={maxCountInput}
        onMaxCountChange={handleMaxCountChange}
        onMaxCountBlur={handleMaxCountBlur}
        duplicateCount={duplicateCount}
      />

      {vendorEmployeeDetails.map(renderAdditionalAuthority)}

      {canAddMore ? (
        <Button
          mode="outlined"
          onPress={addContact}
          style={styles.addButton}
          icon="account-plus"
          contentStyle={styles.buttonContent}
          disabled={duplicateCount > 0}
        >
          Add Additional Authority
        </Button>
      ) : (
        <Card style={styles.maxLimitCard}>
          <Card.Content style={styles.maxLimitContent}>
            <IconButton icon="alert-circle" iconColor="#ff9800" size={18} />
            <Text variant="bodySmall" style={styles.maxLimitText}>
              Maximum of {maxAuthorityCount} authorities reached
            </Text>
          </Card.Content>
        </Card>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 10,
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryContent: {
    paddingVertical: 12,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
  },
  mainTitle: {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  duplicateAlert: {
    color: '#ff9800',
    fontWeight: '500',
  },
  countBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  countBadgeWarning: {
    backgroundColor: '#ff9800',
  },
  countBadgeFull: {
    backgroundColor: '#ff6b6b',
  },
  countText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  maxCountContainer: {
    marginBottom: 12,
  },
  maxCountInput: {
    backgroundColor: '#ffffff',
    marginBottom: 4,
  },
  maxCountHelpText: {
    color: '#7f8c8d',
    fontSize: 11,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  duplicateHint: {
    color: '#ff9800',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  contactCard: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contactNumber: {
    flex: 1,
  },
  contactNumberText: {
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: 14,
  },
  duplicateWarning: {
    color: '#ff9800',
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    margin: 0,
  },
  input: {
    marginBottom: 6,
    backgroundColor: '#ffffff',
  },
  selectListContainer: {
    marginBottom: 6,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 11,
    marginBottom: 6,
    marginLeft: 4,
    marginTop: -2,
  },
  addButton: {
    marginTop: 8,
    marginBottom: 8,
    borderColor: '#3498db',
  },
  buttonContent: {
    paddingVertical: 6,
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
    paddingHorizontal: 8,
  },
  maxLimitText: {
    color: '#e65100',
    marginLeft: 4,
    flex: 1,
    fontSize: 12,
  },
  bottomSpacer: {
    height: 10,
  },
});

export default Step2Form;

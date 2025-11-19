import { Alert } from 'react-native';

export const initialValues = {
  VendorDetails: {
    companyType: '',
    companyName: '',
    owner_name: '',
    address1: '',
    address2: '',
    landMark: '',
    mobileNo: '',
    pincode: '',
    destination: '',
    Tahsil: '',
    state: '',
    City: '',
    vehicle_count: '1',
    employee_count: '1',
  },
  VendorEmployeeDetails: [
    {
      full_name: '',
      designation: '',
      contact_No: '',
      alternate_No: '',
      emailAddress: '',
      website: '',
      username: '',
      password: '',
    },
  ],
  VehicleDetails: [{ vehicle_number: '', vehicle_weight: '' }],
  kycDetails: { gstNo: '', cinNo: '', panNo: '', aadharNo: '' },
};

export const companyTypedata = [
  'OWENER/INDIVIDUAL',
  'PROPRIETORSHIP',
  'CHALAK MALAK',
  'PARTNERSHIP',
  'PVT LTD',
  'LLP',

  // 'INDIVIDUAL',
].map(v => ({ label: v, value: v }));

export const designationdata = [
  // 'CEO',
  // 'Founder',
  // 'Managing Director',
  // 'Proprietor',
  // 'Director',
  // 'General Manager',
  // 'Chief Operating Officer (COO)',
  // 'Chief Financial Officer (CFO)',
  'Authority',
  'Incharge-Manager',
  'Ass. Manager',
  'depty manager',
  'Operation Head',
  'Genaral Manager',
  'Operational manager',
  'Fleet Operation Authority',
  'Officer',
  'Officer Finance',
].map(v => ({ label: v, value: v }));

// Normalize names for comparison (remove extra spaces, convert to uppercase)
export const normalizeName = (name: string): string => {
  return name.replace(/\s+/g, ' ').trim().toUpperCase();
};

// Check if GST company name matches user-entered company name
export const validateGSTCompanyName = (
  gstCompanyName: string,
  userCompanyName: string,
): boolean => {
  const normalizedGSTName = normalizeName(gstCompanyName);
  const normalizedUserCompanyName = normalizeName(userCompanyName);

  return normalizedGSTName === normalizedUserCompanyName;
};

// Check if PAN name matches owner name
export const validatePANOwnerName = (
  panName: string,
  ownerName: string,
): boolean => {
  const normalizedPANName = normalizeName(panName);
  const normalizedOwnerName = normalizeName(ownerName);

  return normalizedPANName === normalizedOwnerName;
};

// Show alert for mismatched names
export const showNameMismatchAlert = (
  type: 'gst' | 'pan',
  verifiedName: string,
  enteredName: string,
) => {
  const titles = {
    gst: 'Company Name Mismatch',
    pan: 'Owner Name Mismatch',
  };

  const messages = {
    gst: `GST registered company name "${verifiedName}" does not match entered company name "${enteredName}". Please verify your company name.`,
    pan: `PAN registered name "${verifiedName}" does not match entered owner name "${enteredName}". Please verify your owner name.`,
  };

  Alert.alert(titles[type], messages[type], [{ text: 'OK' }]);
};

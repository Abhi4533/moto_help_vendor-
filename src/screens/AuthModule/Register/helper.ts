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

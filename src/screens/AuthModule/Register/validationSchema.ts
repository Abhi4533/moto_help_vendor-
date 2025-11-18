import * as Yup from 'yup';

/* --------------------------------------------------
 🧾 STEP ONE — Vendor Details
-------------------------------------------------- */
export const StepOneSchema = Yup.object({
  VendorDetails: Yup.object({
    companyType: Yup.string().required('Company type is required'),
    companyName: Yup.string()
      .when('companyType', {
        is: (type: string) =>
          type !== 'OWENER/INDIVIDUAL' && type !== 'CHALAK MALAK',
        then: schema => schema.required('Company name is required'),
        otherwise: schema => schema.required('Full name is required'),
      })
      .min(2, 'Too short')
      .max(100, 'Too long'),

    owner_name: Yup.string().when('companyType', {
      is: (type: string) =>
        type !== 'OWENER/INDIVIDUAL' && type !== 'CHALAK MALAK',
      then: schema => schema.required('Owner name is required'),
      otherwise: schema => schema.notRequired(),
    }),

    mobileNo: Yup.string()
      .required('Mobile number is required')
      .matches(/^[6-9]\d{9}$/, 'Enter valid mobile number'),

    address1: Yup.string()
      .required('Address Line 1 is required')
      .min(3, 'Too short'),

    address2: Yup.string().nullable(),

    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^\d{6}$/, 'Enter valid 6-digit pincode'),

    state: Yup.string().required('State is required'),

    destination: Yup.string().required('District is required'),

    Tahsil: Yup.string().required('Town/Tahsil is required'),
  }),
});

/* --------------------------------------------------
 👥 STEP TWO — Authorized Persons
-------------------------------------------------- */
export const StepTwoSchema = Yup.object({
  VendorDetails: Yup.object({
    employee_count: Yup.number()
      .required('Number of authorized persons is required')
      .min(1, 'At least 1 authorized person required')
      .max(10, 'Too many authorized persons'),
  }),

  VendorEmployeeDetails: Yup.array()
    .of(
      Yup.object({
        full_name: Yup.string()
          .required('Full name is required')
          .min(2, 'Too short'),
        designation: Yup.string().required('Designation is required'),
        contact_No: Yup.string()
          .required('Mobile number is required')
          .matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
        emailAddress: Yup.string()
          .required('Email is required')
          .email('Invalid email'),
      }),
    )
    .min(1, 'At least one authorized person required')
    .test(
      'unique-contact',
      'Duplicate mobile numbers are not allowed',
      function (employees) {
        if (!employees) return true;
        const numbers = employees.map(e => e.contact_No?.trim());
        return new Set(numbers).size === numbers.length;
      },
    )
    .test(
      'unique-email',
      'Duplicate email addresses are not allowed',
      function (employees) {
        if (!employees) return true;
        const emails = employees.map(e => e.emailAddress?.toLowerCase().trim());
        return new Set(emails).size === emails.length;
      },
    ),
});

/* --------------------------------------------------
 🚛 STEP THREE — KYC + Vehicles
-------------------------------------------------- */
export const StepThreeSchema = Yup.object({
  VendorDetails: Yup.object({
    vehicle_count: Yup.number()
      .required('Number of vehicles is required')
      .min(0, 'Cannot be negative')
      .max(100, 'Too many vehicles'),
  }),

  VehicleDetails: Yup.array().of(
    Yup.object({
      vehicle_number: Yup.string()
        .required('RC required')
        .matches(
          /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
          'Enter valid vehicle registration (e.g. MH12AB1234)',
        ),
      vehicle_weight: Yup.string()
        .required('Weight required')
        .matches(/^\d+$/, 'Enter numeric weight'),
    }),
  ),

  kycDetails: Yup.object({
    gstNo: Yup.string().when('VendorDetails.companyType', {
      is: (type: string) => type !== 'INDIVIDUAL' && type !== 'CHALAK MALAK',
      then: schema => schema.required('GST number is required'),
      otherwise: schema => schema.notRequired(),
    }),

    panNo: Yup.string()
      .required('PAN number is required')
      .matches(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        'Invalid PAN format (e.g. ABCDE1234F)',
      ),

    aadharNo: Yup.string().when('VendorDetails.companyType', {
      is: (type: string) => type === 'INDIVIDUAL' || type === 'CHALAK MALAK',
      then: schema =>
        schema
          .required('Aadhaar number is required')
          .matches(/^\d{12}$/, 'Enter valid 12-digit Aadhaar number'),
      otherwise: schema => schema.notRequired(),
    }),
  }),
});

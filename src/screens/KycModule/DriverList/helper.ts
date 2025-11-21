import * as Yup from 'yup';
import { DriverFormValues } from './type';

export const getDriverAge = (dob: string): number => {
  if (!dob) return 0;

  const d = new Date(dob);
  const t = new Date();
  let age = t.getFullYear() - d.getFullYear();

  if (
    t.getMonth() < d.getMonth() ||
    (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())
  ) {
    age--;
  }

  return age;
};

export const MIN_AGE = 18;
export const MAX_AGE = 65;

/* ---------------------- Validation Schema ---------------------- */
export const DriverSchema = Yup.object({
  full_name: Yup.string().trim().required('Full name is required'),
  Phone: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, 'Enter valid 10 digit phone')
    .required('Phone is required'),
  emergency_phone: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, 'Enter valid 10 digit emergency contact')
    .required('Emergency contact is required'),
  Email: Yup.string().email('Invalid email').nullable(),
  pincode: Yup.string()
    .trim()
    .matches(/^[0-9]{6}$/, 'Enter valid 6 digit pincode')
    .required('Pincode is required'),
  state: Yup.string().required('State required'),
  City: Yup.string().required('District required'),
  driving_license_no: Yup.string()
    .trim()
    .required('DL number required')
    .matches(/^[A-Z]{2}[0-9]{2}(19|20)[0-9]{2}[0-9]{7}$/, 'Invalid DL format'),
  dob: Yup.string()
    .required('DOB required')
    .test(
      'age-range',
      `Driver must be ${MIN_AGE}+ and ≤${MAX_AGE}`,
      function (val) {
        const age = getDriverAge(val);
        return age >= MIN_AGE && age <= MAX_AGE;
      },
    ),
});

/* ---------------------- Initial Values ---------------------- */
export const INITIAL_VALUES: DriverFormValues = {
  full_name: '',
  Phone: '',
  emergency_phone: '',
  Email: '',
  address1: '',
  address2: '',
  pincode: '',
  state: '',
  City: '',
  Tahsil: '',
  driving_license_no: '',
  driving_license_address: '',
  dob: '',
  expiry_date: '',
  Driver_photo: '',
};

// DOB range helpers
export const maxDOB = () => {
  const d = new Date();
  return new Date(d.getFullYear() - MIN_AGE, d.getMonth(), d.getDate());
};
export const minDOB = () => {
  const d = new Date();
  return new Date(d.getFullYear() - MAX_AGE, d.getMonth(), d.getDate());
};

const dlRegex = /^[A-Z]{2}[0-9]{2}(19|20)[0-9]{2}[0-9]{7}$/;

export const isValidDL = (value: string) => dlRegex.test(value.trim());

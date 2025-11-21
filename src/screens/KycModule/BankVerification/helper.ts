import * as Yup from 'yup';

/* ------------------------------------------------------------------
    YUP VALIDATION SCHEMA
------------------------------------------------------------------ */
export const BankSchema = Yup.object().shape({
  bank_ac_holder_name: Yup.string().required('Account holder name required'),
  account_type: Yup.string().required('Select account type'),
  bank_ac_number: Yup.string()
    .min(6, 'Min 6 digits')
    .required('Account number required'),
  bank_ac_number_verify: Yup.string()
    .oneOf([Yup.ref('bank_ac_number'), ''], 'Account numbers do not match')
    .required('Confirm account number'),
  ifsc_code: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
    .required('IFSC code required'),
  bank_name: Yup.string().required('Bank name required'),
  branch_name: Yup.string().required('Branch required'),
});

export const accountTypes = [
  { label: 'Savings', value: 'SAVINGS' },
  { label: 'Current', value: 'CURRENT' },
];

export const INITIAL_VALUE = {
  bank_ac_holder_name: '',
  bank_ac_number: '',
  bank_ac_number_verify: '',
  ifsc_code: '',
  bank_name: '',
  branch_name: '',
  account_type: '',
};

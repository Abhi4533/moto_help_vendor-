// helper.ts
import * as Yup from 'yup';

export const employeeFormSchema = Yup.object().shape({
  full_name: Yup.string().required('Full name is required').min(2, 'Too short'),

  designation: Yup.string().required('Designation is required'),

  contact_no: Yup.string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),

  email_id: Yup.string()
    .nullable()
    .email('Invalid email')
    .required('Email is required'),

  customDesignation: Yup.string().when('designation', {
    is: 'Other',
    then: s => s.required('Enter designation'),
    otherwise: schema => schema.notRequired(),
  }),
});

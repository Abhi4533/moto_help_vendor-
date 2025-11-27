import * as Yup from 'yup';

export const VEHICLE_STATUS_OPTIONS = [
  {
    value: 'empty',
    label: 'Empty',
    icon: 'truck',
    color: '#10B981',
    description: 'Vehicle is empty and ready for loading',
  },
  {
    value: 'unloading',
    label: 'Unloading',
    icon: 'package-variant',
    color: '#F59E0B',
    description: 'Vehicle is currently unloading',
  },
  {
    value: 'waiting',
    label: 'Waiting',
    icon: 'clock',
    color: '#EF4444',
    description: 'Vehicle is waiting for assignment',
  },
];

export const validationSchema = (driverData?: any[]) =>
  Yup.object().shape({
    driverMobile: Yup.string()
      .required('Please enter a mobile number')
      .matches(
        /^[6-9][0-9]{9}$/,
        'Mobile number must be 10 digits and start with 6, 7, 8, or 9',
      )
      .typeError('Mobile number must be a valid string'),
    vehicleStatus: Yup.string()
      .required('Please select a vehicle status')
      .oneOf(
        VEHICLE_STATUS_OPTIONS.map(option => option.value),
        'Please select a valid vehicle status',
      ),
    routes: Yup.array()
      .of(
        Yup.object().shape({
          state: Yup.string().required('Please select a state'),
          region: Yup.string().required('Please select a region'),
          districts: Yup.array()
            .of(Yup.string().required('District is required'))
            .min(1, 'Please select at least one district')
            .max(10, 'Cannot select more than 10 districts per route'),
        }),
      )
      .min(1, 'Please add at least one route')
      .max(5, 'Cannot add more than 5 routes')
      .required('Routes are required')
      .test(
        'no-duplicate-districts',
        'Duplicate districts are not allowed across routes',
        routes => {
          if (!routes) return true;
          const allDistricts = routes.flatMap(route => route.districts);
          const uniqueDistricts = new Set(allDistricts);
          return allDistricts.length === uniqueDistricts.size;
        },
      ),
    // driverId: Yup.string()
    //   .required('Please select a driver')
    //   .test('valid-driver', 'Selected driver is not valid', value => {
    //     if (!driverData || !value) return false;
    //     return driverData.some(driver => driver.DriverID === value);
    //   }),
  });

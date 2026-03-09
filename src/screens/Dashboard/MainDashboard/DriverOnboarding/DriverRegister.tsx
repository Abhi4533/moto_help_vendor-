import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { FormValues } from './Index';
import { FormikHandlers } from 'formik';

interface DriverRegisterProps {
  values: FormValues;
  onChange: FormikHandlers['handleChange'];
  onBlur: FormikHandlers['handleBlur'];
  onSubmit: () => void;
}

export default function DriverRegister({
  values,
  onChange,
  onBlur,
  onSubmit,
}: DriverRegisterProps) {
  return (
    <View>
      <TextInput
        label="Company Name"
        value={values.companyname}
        onChangeText={onChange('companyname')}
        onBlur={onBlur('companyname')}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Owner Name"
        value={values.ownername}
        onChangeText={onChange('ownername')}
        onBlur={onBlur('ownername')}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Mobile Number"
        value={values.mobileno}
        onChangeText={onChange('mobileno')}
        keyboardType="phone-pad"
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Building / Apartment / Plot No"
        value={values.address1}
        onChangeText={onChange('address1')}
        onBlur={onBlur('address1')}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Area / Street / Sector / Village"
        value={values.address2}
        onChangeText={onChange('address2')}
        onBlur={onBlur('address2')}
        mode="outlined"
        style={styles.input}
      />

      {/* Row 1 */}
      <View style={styles.row}>
        <TextInput
          label="Pincode"
          value={values.pincode}
          onChangeText={onChange('pincode')}
          onBlur={onBlur('pincode')}
          keyboardType="numeric"
          mode="outlined"
          style={styles.halfInput}
        />
        <TextInput
          label="State"
          value={values.state}
          onChangeText={onChange('state')}
          onBlur={onBlur('state')}
          mode="outlined"
          style={styles.halfInput}
        />
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <TextInput
          label="District"
          value={values.district}
          onChangeText={onChange('district')}
          onBlur={onBlur('district')}
          mode="outlined"
          style={styles.halfInput}
        />
        <TextInput
          label="Town/Tehsil"
          value={values.taluka}
          onChangeText={onChange('taluka')}
          onBlur={onBlur('taluka')}
          mode="outlined"
          style={styles.halfInput}
        />
      </View>

      {/* <TextInput
        label="Taluka"
        value={values.taluka}
        onChangeText={onChange('taluka')}
        onBlur={onBlur('taluka')}
        mode="outlined"
        style={styles.input}
      /> */}

      {/* <Button mode="contained" style={styles.button} onPress={onSubmit}>
        Validate Driver
      </Button> */}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  halfInput: {
    flex: 1,
    marginBottom: 12,
  },

  button: {
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#0D47A1',
    height: 50,
  },
});

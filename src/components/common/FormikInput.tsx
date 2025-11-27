import { useField, useFormikContext } from 'formik';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

interface FormikInputProps extends TextInputProps {
  name: string; // Formik field name
}

const FormikInput: React.FC<FormikInputProps> = ({ name, ...props }) => {
  const { touched } = useFormikContext();
  const [field, meta, helpers] = useField(name);

  const showError = touched?.[name!] || (meta?.touched && meta?.error);

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        value={field.value}
        onChangeText={text =>
          props?.onChangeText
            ? props?.onChangeText(text)
            : helpers.setValue(text)
        }
        onBlur={() => helpers.setTouched(true)}
        error={showError}
      />
      {showError && <Text style={styles.errorText}>{meta.error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormikInput;

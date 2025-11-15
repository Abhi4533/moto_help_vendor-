import React from 'react';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string | boolean;
  secureTextEntry?: boolean;
  keyboardType?: any;
  multiline?: boolean;
}

const Input: React.FC<Props> = ({
  label,
  value,
  onBlur,
  onChangeText,
  placeholder,
  disabled,
  error,
  secureTextEntry,
  keyboardType,
  multiline = false,
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        mode="outlined"
        disabled={disabled}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        error={!!error}
      />

      {/* ERROR MESSAGE */}
      {error ? (
        <Text style={{ color: '#D32F2F', fontSize: 12, marginTop: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default Input;

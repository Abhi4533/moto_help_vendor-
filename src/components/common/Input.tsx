import React from 'react';
import { Text, View } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

interface Inputprops extends TextInputProps {
  error?: any;
}

const Input: React.FC<Inputprops> = ({ error, ...props }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <TextInput {...props} error={!!error} />

      {/* ERROR MESSAGE */}
      {error ? (
        <Text
          style={{ color: '#D32F2F', fontSize: 12, marginTop: 4 }}
          numberOfLines={1}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default Input;

import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

interface Props {
  title: string;
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: any;
}

const Button = ({
  title,
  mode = 'contained',
  onPress,
  loading = false,
  disabled = false,
  icon,
  style,
}: Props) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      icon={icon}
      style={[styles.button, style]}
      contentStyle={styles.content}
    >
      {title}
    </PaperButton>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginVertical: 6,
  },
  content: {
    paddingVertical: 6,
  },
});

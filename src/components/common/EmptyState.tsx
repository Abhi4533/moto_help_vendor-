import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface Props {
  title: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
}

const EmptyState = ({
  title,
  description,
  actionText,
  onActionPress,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        {title}
      </Text>

      {description && (
        <Text variant="bodyMedium" style={styles.desc}>
          {description}
        </Text>
      )}

      {actionText && (
        <Button mode="contained" onPress={onActionPress} style={styles.button}>
          {actionText}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    marginBottom: 6,
    textAlign: 'center',
  },
  desc: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20,
  },
  button: {
    marginTop: 8,
  },
});

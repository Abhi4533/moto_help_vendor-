import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';

interface Props {
  title: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
  icon?: string; // MaterialCommunityIcons name
}

const EmptyState = ({
  title,
  description,
  actionText,
  onActionPress,
  icon = 'information-outline',
}: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Icon source={icon} size={80} color={theme.colors.primary} />

      <Text
        variant="headlineSmall"
        style={[styles.title, { color: theme.colors.onSurface }]}
      >
        {title}
      </Text>

      {description && (
        <Text
          variant="bodyMedium"
          style={[styles.desc, { color: theme.colors.onSurfaceVariant }]}
        >
          {description}
        </Text>
      )}

      {actionText && (
        <Button
          mode="contained"
          onPress={onActionPress}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          {actionText}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 60,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  desc: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 22,
    lineHeight: 20,
  },
  button: {
    borderRadius: 10,
    elevation: 2,
  },
});

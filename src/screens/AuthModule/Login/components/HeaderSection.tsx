import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderSectionProps {
  isOtpSent: boolean;
}

export const HeaderSection: React.FC = () => (
  <View style={styles.header}>
    <Text style={styles.title}>Vendor Login</Text>
    <Text style={styles.subtitle}>Sign in to manage your fleet</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});

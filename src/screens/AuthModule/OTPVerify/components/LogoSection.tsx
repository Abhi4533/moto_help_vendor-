import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const LogoSection: React.FC = () => (
  <View style={styles.logoContainer}>
    <View style={styles.logoPlaceholder}>
      <Text style={styles.logoText}>🚚</Text>
    </View>
    <Text style={styles.appName}>TRUCK VENDOR</Text>
    <Text style={styles.appTagline}>Logistics Management System</Text>
  </View>
);

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2d3748',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  appTagline: {
    fontSize: 14,
    color: '#cbd5e0',
    marginTop: 5,
  },
});

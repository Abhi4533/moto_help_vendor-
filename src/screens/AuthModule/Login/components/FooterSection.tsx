import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const FooterSection: React.FC = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      © 2023 Truck Vendor App. All rights reserved.
    </Text>
    <Text style={styles.footerText}>Version 2.4.1</Text>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#cbd5e0',
    fontSize: 12,
    marginBottom: 5,
  },
});

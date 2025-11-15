// DrawerContent.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DrawerContent({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menu</Text>

      <TouchableOpacity onPress={() => navigation.navigate('HomeTabs')}>
        <Text style={styles.item}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.closeDrawer()}>
        <Text style={styles.item}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  item: { paddingVertical: 12, fontSize: 16 },
});

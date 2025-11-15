import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

interface Props {
  visible: boolean;
}

const Loader = ({ visible }: Props) => {
  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <ActivityIndicator size="large" />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});

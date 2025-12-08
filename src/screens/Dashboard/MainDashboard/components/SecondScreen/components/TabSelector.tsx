import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

const TabSelector = () => {
  const { selectedTab, handleTabChange } = useDashboard();
  return (
    <View style={styles.tabSelector}>
      <SegmentedButtons
        value={selectedTab}
        onValueChange={handleTabChange}
        buttons={[
          {
            value: 'idle',
            label: 'Vehicles',
            icon: 'pause-circle',
            style: {
              backgroundColor: selectedTab === 'idle' ? '#FF9800' : undefined,
            },
          },
          {
            value: 'process',
            label: 'Process',
            icon: 'refresh-circle',
            style: {
              backgroundColor:
                selectedTab === 'process' ? '#2196F3' : undefined,
            },
          },
          {
            value: 'active',
            label: 'Active',
            icon: 'truck',
            style: {
              backgroundColor: selectedTab === 'active' ? '#4CAF50' : undefined,
            },
          },
          {
            value: 'complete',
            label: 'Authorization',
            icon: 'check-circle',
            style: {
              backgroundColor:
                selectedTab === 'complete' ? '#9C27B0' : undefined,
            },
          },
        ]}
      />
    </View>
  );
};

export default TabSelector;

const styles = StyleSheet.create({
  tabSelector: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});

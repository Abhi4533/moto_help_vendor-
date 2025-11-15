import React, { FC } from 'react';
import { View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { styles } from '../styles';

interface TabSelectorProps {
  selectedTab: string;
  handleTabChange: (value: string) => void;
}

const TabSelector: FC<TabSelectorProps> = ({
  handleTabChange,
  selectedTab,
}) => {
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

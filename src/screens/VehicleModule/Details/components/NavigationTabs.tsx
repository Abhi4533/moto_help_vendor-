import React from 'react';
import { View } from 'react-native';
import { styles } from '../style';
import TabButton from './TabButton';
interface NavigationTabsProps {
  activeTab: any;
  setActiveTab: any;
}

const NavigationTabs = ({ activeTab, setActiveTab }: NavigationTabsProps) => {
  return (
    <View style={styles.tabContainer}>
      <TabButton
        tab="details"
        icon="information"
        label="Details"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <TabButton
        tab="documents"
        icon="file-document"
        label="Documents"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <TabButton
        tab="history"
        icon="history"
        label="History"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </View>
  );
};

export default NavigationTabs;

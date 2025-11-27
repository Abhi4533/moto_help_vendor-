import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

interface TabBarProps {
  activeTab: 'Y' | 'N' | undefined;
  setActiveTab: (tab: 'Y' | 'N' | undefined) => void;
}

const TABS = [
  { label: 'All', value: undefined as undefined },
  { label: 'Assigned', value: 'Y' as const },
  { label: 'Released', value: 'N' as const },
];

const TabBar: FC<TabBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.value;

          return (
            <Button
              key={tab.label}
              mode={isActive ? 'contained' : 'outlined'}
              onPress={() => setActiveTab(tab.value)}
              style={styles.tabButton}
              labelStyle={
                isActive ? styles.tabLabelActive : styles.tabLabelInactive
              }
            >
              {tab.label}
            </Button>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  tabLabelActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelInactive: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});

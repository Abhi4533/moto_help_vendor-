// CustomBottomTab.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { TAB_ITEMS, TabKey } from './helper';

interface Props {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const CustomBottomTab: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      {TAB_ITEMS.map(tab => {
        const focused = tab.id === activeTab;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onTabChange(tab.id)}
          >
            <Icon
              source={tab.icon}
              size={26}
              color={focused ? '#1E88E5' : '#666'}
            />

            <Text
              style={{
                fontSize: 12,
                color: focused ? '#1E88E5' : '#666',
                marginTop: 4,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomBottomTab;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

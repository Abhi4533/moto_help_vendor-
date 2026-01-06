// CustomBottomTab.tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { TAB_ITEMS } from './helper';

const CustomBottomTab: React.FC<{ kycEnabled?: boolean }> = ({
  kycEnabled,
}) => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {TAB_ITEMS.map(tab => {
        const focused = tab.id === route?.name;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => navigation.navigate(tab.id)}
            disabled={tab?.id === 'BankVerification' && !kycEnabled}
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
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, View } from 'react-native';
import { quickActionsData } from '../helper';
import { styles } from '../styles';
import QuickActionButton from './QuickActionButton';

const QuickActions = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.quickActionsSection}>
      <FlatList
        horizontal
        data={quickActionsData}
        renderItem={({ item }) => (
          <QuickActionButton
            icon={item.icon}
            label={item.label}
            onPress={() => navigation.navigate(item?.naviagate)}
            color={item.color}
          />
        )}
        keyExtractor={item => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActions}
      />
    </View>
  );
};

export default QuickActions;

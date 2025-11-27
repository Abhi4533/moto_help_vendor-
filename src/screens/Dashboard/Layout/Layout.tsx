// DashboardLayout.tsx
import { useRoute } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import CustomBottomTab from './BottomTabs';
import CustomDrawer from './CustomDrawer';
import { DashboardProvider, useDashboard } from './DashboardContext';

interface Props {
  children: React.ReactNode;
  title?: string;
}

const LayoutContent: FC<Props> = ({ children, title = 'Dashboard' }) => {
  const route = useRoute();
  const { handleHeaderButtonPress } = useDashboard();
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => setDrawerVisible(true)} />
        <Appbar.Content title={title} titleStyle={{ fontWeight: '700' }} />
        {route?.name === 'Dashboard' && (
          <Appbar.Action icon="view-list" onPress={handleHeaderButtonPress} />
        )}
      </Appbar.Header>

      <View style={styles.content}>{children}</View>

      <CustomBottomTab />

      <CustomDrawer visible={drawerVisible} onSelect={setDrawerVisible} />
    </View>
  );
};

const DashboardLayout: FC<Props> = ({ children, title }) => {
  return (
    <DashboardProvider>
      <LayoutContent title={title}>{children}</LayoutContent>
    </DashboardProvider>
  );
};
export default DashboardLayout;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, overflow: 'hidden' },
});

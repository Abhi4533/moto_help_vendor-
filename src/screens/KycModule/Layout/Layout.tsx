// TemporaryDashboardLayout.tsx
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import CustomBottomTab from './BottomTabs';
import CustomDrawer from './CustomDrawer';

interface Props {
  children: React.ReactNode;
  title?: string;
}

const TemporaryDashboardLayout: FC<Props> = ({
  children,
  title = 'Temporary Dashboard',
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => setDrawerVisible(true)} />
        <Appbar.Content title={title} titleStyle={{ fontWeight: '700' }} />
      </Appbar.Header>

      <View style={styles.content}>{children}</View>

      <CustomBottomTab />

      <CustomDrawer visible={drawerVisible} onSelect={setDrawerVisible} />
    </View>
  );
};

export default TemporaryDashboardLayout;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, overflow: 'hidden' },
});

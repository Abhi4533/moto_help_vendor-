import { KycStackParamList } from '@navigation/KycNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logout } from '@store/slices/authSlice';
import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import CustomBottomTab from './BottomTabs';
import CustomDrawer, { DrawerKey } from './CustomDrawer';
import { TabKey } from './helper';

type TempDashNavProp = NativeStackNavigationProp<
  KycStackParamList,
  'TemporaryDashboard'
>;

interface Props {
  children: React.ReactNode;
}
const TemporaryDashboardLayout: FC<Props> = ({ children }) => {
  const navigation = useNavigation<TempDashNavProp>();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleDrawerSelect = async (key: DrawerKey) => {
    setDrawerVisible(false);
    if (key === 'logout') {
      await dispatch(logout());
      return;
    }
    setActiveTab(key as TabKey);
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => setDrawerVisible(true)} />
        <Appbar.Content title="Temporary Dashboard" />
      </Appbar.Header>
      <View style={{ flex: 1 }}>{children}</View>
      {/* Bottom Tabs */}
      <CustomBottomTab activeTab={activeTab} onTabChange={setActiveTab} />
      {/* drawer */}
      <CustomDrawer
        visible={drawerVisible}
        active={activeTab}
        onSelect={handleDrawerSelect}
      />
    </View>
  );
};

export default TemporaryDashboardLayout;

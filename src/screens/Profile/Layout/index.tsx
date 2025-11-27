import { getVendorDetails } from '@api/endpoints/profile.api';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@store/index';
import React, { FC, useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Appbar,
  Avatar,
  Badge,
  Card,
  Surface,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getInitials, tabs } from './helper';

interface Props {
  children: React.ReactNode;
  title?: string;
  companyName?: string;
  onEditPress?: () => void;
  activeTab: string;
  onTabChange?: (tab: string) => void;
  isEditable?: boolean;
}

const PRIMARY = '#6366F1';

const ProfileLayout: FC<Props> = ({
  children,
  title = 'Company Profile',
  companyName = 'Company Name',
  onEditPress,
  activeTab = 'ProfileCompanyInfo',
  onTabChange,
  isEditable,
}) => {
  const navigation = useNavigation<any>();
  const kycStatus = useSelector((state: RootState) => state.auth?.kycStatus);
  const handleTabPress = useCallback(
    (tabTitle: string) => {
      navigation.navigate(tabTitle);
      onTabChange?.(tabTitle);
    },
    [onTabChange],
  );
  const [companyInfo, setCompanyInfo] = useState({ companyName: '' });
  const vendorId = useSelector((state: RootState) => state?.auth?.token);

  const fetchVendor = async () => {
    try {
      const resp = await getVendorDetails({ vendorid: vendorId });
      if (resp?.status === '00') {
        const data = resp?.data?.Vendor_Details?.[0];
        setCompanyInfo(data);
      }
    } catch (e) {}
  };

  useLayoutEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() =>
            navigation.navigate(
              kycStatus === 'PENDING' ? 'TemporaryDashboard' : 'Dashboard',
            )
          }
        />
        <Appbar.Content title={title} />
        <Appbar.Action
          icon={isEditable ? 'close' : 'pencil'}
          onPress={onEditPress}
        />
      </Appbar.Header>

      {/* PROFILE CARD */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            <Avatar.Text
              size={60}
              label={getInitials(companyInfo?.companyName || companyName)}
              style={styles.avatar}
            />

            {kycStatus === 'COMPLETED' && (
              <Badge style={styles.verifyBadge} size={16}>
                ✓
              </Badge>
            )}
          </View>

          <View style={styles.companyInfo}>
            <Text variant="titleLarge" style={styles.companyName}>
              {companyInfo?.companyName || companyName}
            </Text>
            <Text variant="bodyMedium" style={styles.verifiedText}>
              {kycStatus === 'COMPLETED'
                ? 'Verified Company'
                : 'Verification Pending'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* TABS */}
      <Surface style={styles.tabsContainer} elevation={1}>
        <View style={styles.tabRow}>
          {tabs.map(tab => {
            const isActive = tab.key === activeTab;
            return (
              <TouchableRipple
                key={tab.key}
                onPress={() => handleTabPress(tab.key)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <View style={styles.tabContent}>
                  <View style={styles.iconWrapper}>
                    <Avatar.Icon
                      size={25}
                      icon={tab.icon}
                      style={styles.transparentBg}
                      color={isActive ? '#fff' : PRIMARY}
                    />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.tabLabel,
                      isActive
                        ? styles.tabLabelActive
                        : styles.tabLabelInactive,
                    ]}
                  >
                    {tab.title}
                  </Text>
                </View>
              </TouchableRipple>
            );
          })}
        </View>
      </Surface>

      {/* MAIN CONTENT */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default ProfileLayout;

/* ============================================================
   STYLES
============================================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  appbar: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },

  content: {
    flex: 1,
  },

  profileCard: {
    margin: 12,
    borderRadius: 16,
    backgroundColor: PRIMARY,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  avatarWrapper: {
    marginRight: 16,
    position: 'relative',
  },

  avatar: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },

  verifyBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    color: '#fff',
  },

  companyInfo: {
    flex: 1,
  },

  companyName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 20,
  },

  verifiedText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },

  tabsContainer: {
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  tabRow: {
    flexDirection: 'row',
  },

  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  tabButtonActive: {
    backgroundColor: PRIMARY,
  },

  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapper: {
    position: 'relative',
    marginBottom: 4,
  },

  transparentBg: {
    backgroundColor: 'transparent',
  },

  tabBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
  },

  badgeActive: {
    backgroundColor: '#FFFFFF',
    color: PRIMARY,
  },

  badgeInactive: {
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
  },

  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  tabLabelInactive: {
    color: '#6B7280',
  },
});

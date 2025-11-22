import { useNavigation } from '@react-navigation/native';
import { RootState } from '@store/index';
import React, { FC, useCallback } from 'react';
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
}

const PRIMARY = '#6366F1';

const ProfileLayout: FC<Props> = ({
  children,
  title = 'Company Profile',
  companyName = 'Company Name',
  onEditPress,
  activeTab = 'Company Info',
  onTabChange,
}) => {
  const navigation = useNavigation<any>();
  const kycStatus = useSelector((state: RootState) => state.auth?.kycStatus);
  const handleTabPress = useCallback(
    (tabTitle: string) => {
      onTabChange?.(tabTitle);
    },
    [onTabChange],
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={title} />
        <Appbar.Action icon={'pencil'} onPress={onEditPress} />
      </Appbar.Header>

      {/* PROFILE CARD */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            <Avatar.Text
              size={60}
              label={getInitials(companyName)}
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
              {companyName}
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
            const isActive = tab.title === activeTab;

            return (
              <TouchableRipple
                key={tab.key}
                onPress={() => handleTabPress(tab.title)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <View style={styles.tabContent}>
                  <View style={styles.iconWrapper}>
                    <Avatar.Icon
                      size={22}
                      icon={tab.icon}
                      style={styles.transparentBg}
                      color={isActive ? '#fff' : PRIMARY}
                    />

                    {tab.count > 0 && (
                      <Badge
                        size={14}
                        style={[
                          styles.tabBadge,
                          isActive ? styles.badgeActive : styles.badgeInactive,
                        ]}
                      >
                        {tab.count}
                      </Badge>
                    )}
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

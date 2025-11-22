// ProfileDocuments.tsx
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, Chip, Surface, Text } from 'react-native-paper';
import ProfileLayout from '../Layout';

interface Props {
  onTabChange?: (tab: string) => void;
}

const ProfileDocuments: React.FC<Props> = ({ onTabChange }) => {
  const isVerified = true;

  return (
    <ProfileLayout
      activeTab="Documents"
      onTabChange={onTabChange}
      onEditPress={() => console.log('Edit documents pressed')}
    >
      <Card style={styles.contentCard}>
        <Card.Content style={styles.cardContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  KYC Documents
                </Text>
                <Chip
                  mode="outlined"
                  icon={isVerified ? 'check-circle' : 'clock-alert'}
                  style={isVerified ? styles.verifiedChip : styles.pendingChip}
                >
                  {isVerified ? 'Verified' : 'Pending'}
                </Chip>
              </View>

              <View style={styles.documentsGrid}>
                <Surface style={styles.documentCard} elevation={2}>
                  <View style={styles.documentHeader}>
                    <Avatar.Icon
                      size={32}
                      icon="file-document"
                      style={styles.documentIcon}
                    />
                    <Text variant="bodySmall" style={styles.documentLabel}>
                      GST Number
                    </Text>
                  </View>
                  <Text variant="bodyLarge" style={styles.documentValue}>
                    GST151221
                  </Text>
                </Surface>

                <Surface style={styles.documentCard} elevation={2}>
                  <View style={styles.documentHeader}>
                    <Avatar.Icon
                      size={32}
                      icon="card-account-details"
                      style={styles.documentIcon}
                    />
                    <Text variant="bodySmall" style={styles.documentLabel}>
                      PAN Number
                    </Text>
                  </View>
                  <Text variant="bodyLarge" style={styles.documentValue}>
                    PAN1212121
                  </Text>
                </Surface>

                <Surface style={styles.documentCard} elevation={2}>
                  <View style={styles.documentHeader}>
                    <Avatar.Icon
                      size={32}
                      icon="file-certificate"
                      style={styles.documentIcon}
                    />
                    <Text variant="bodySmall" style={styles.documentLabel}>
                      Business License
                    </Text>
                  </View>
                  <Text variant="bodyLarge" style={styles.documentValue}>
                    BL-2024-001
                  </Text>
                </Surface>
              </View>
            </View>

            <Surface style={styles.verificationCard} elevation={2}>
              <View style={styles.verificationContent}>
                <Avatar.Icon
                  size={40}
                  icon={isVerified ? 'shield-check' : 'shield-alert'}
                  style={
                    isVerified
                      ? styles.verificationIcon
                      : styles.pendingVerificationIcon
                  }
                />
                <View style={styles.verificationText}>
                  <Text variant="bodyLarge" style={styles.verificationTitle}>
                    {isVerified ? 'Verified Business' : 'Verification Pending'}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={styles.verificationSubtitle}
                  >
                    {isVerified
                      ? 'All documents are verified and up to date'
                      : 'Document verification is pending'}
                  </Text>
                </View>
              </View>
            </Surface>
          </ScrollView>
        </Card.Content>
      </Card>
    </ProfileLayout>
  );
};

export default ProfileDocuments;

const styles = StyleSheet.create({
  contentCard: {
    flex: 1,
    margin: 12,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 0,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1F2937',
    fontSize: 16,
  },
  verifiedChip: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  pendingChip: {
    backgroundColor: '#FEF3F2',
    borderColor: '#F04444',
  },
  documentsGrid: {
    gap: 12,
  },
  documentCard: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentIcon: {
    backgroundColor: '#6366F1',
    marginRight: 12,
  },
  documentLabel: {
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 12,
  },
  documentValue: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 44,
  },
  verificationCard: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
    borderWidth: 1,
    margin: 16,
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationIcon: {
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  pendingVerificationIcon: {
    backgroundColor: '#F59E0B',
    marginRight: 12,
  },
  verificationText: {
    flex: 1,
  },
  verificationTitle: {
    color: '#065F46',
    fontWeight: '600',
    fontSize: 14,
  },
  verificationSubtitle: {
    color: '#047857',
    fontSize: 12,
    marginTop: 2,
  },
});

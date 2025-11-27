import { getKycDetails } from '@api/endpoints/profile.api';
import { RootState } from '@store/index';
import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, Chip, Surface, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import ProfileLayout from '../Layout';
import BottomSheetKYCForm from './components/BottomSheetKYCForm';

interface Props {
  onTabChange?: (tab: string) => void;
}

const ProfileDocuments: React.FC<Props> = ({ onTabChange }) => {
  const vendorId = useSelector((state: RootState) => state?.auth?.token);

  const [editable, setEditable] = useState(false);
  const [kycData, setKycData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch KYC Details
  const fetchKyc = async () => {
    try {
      setLoading(true);
      const resp = await getKycDetails({ vendorid: vendorId });

      if (resp?.status === '00') {
        setKycData(resp?.data?.[0] || null);
      } else {
        Toast.show({ type: 'error', text1: resp?.message });
      }
    } catch (e) {
      console.log({ e });
      Toast.show({ type: 'error', text1: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (vendorId) fetchKyc();
  }, [vendorId]);

  const isVerified = true;

  return (
    <ProfileLayout
      activeTab="ProfileDocuments"
      onTabChange={onTabChange}
      onEditPress={() => setEditable(true)} // open bottom sheet
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Card style={styles.contentCard}>
          <Card.Content style={styles.cardContent}>
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

              {/* GST */}
              <Surface style={styles.documentCard} elevation={2}>
                <View style={styles.documentHeader}>
                  <Avatar.Icon
                    size={32}
                    icon="file-document"
                    style={styles.documentIcon}
                  />
                  <Text style={styles.documentLabel}>GST Number</Text>
                </View>

                <Text style={styles.documentValue}>
                  {kycData?.gstNo || 'Not Provided'}
                </Text>
              </Surface>

              {/* PAN */}
              <Surface style={styles.documentCard} elevation={2}>
                <View style={styles.documentHeader}>
                  <Avatar.Icon
                    size={32}
                    icon="card-account-details"
                    style={styles.documentIcon}
                  />
                  <Text style={styles.documentLabel}>PAN Number</Text>
                </View>

                <Text style={styles.documentValue}>
                  {kycData?.panNo || 'Not Provided'}
                </Text>
              </Surface>

              {/* BANK */}
              <Text style={styles.bankTitle}>Bank Details</Text>

              <Surface style={styles.documentCard} elevation={2}>
                <Text style={styles.bankField}>
                  Account Holder:{' '}
                  {kycData?.bank_ac_holder_name || 'Not Provided'}
                </Text>
                <Text style={styles.bankField}>
                  Account No: {kycData?.bank_ac_number || 'Not Provided'}
                </Text>
                <Text style={styles.bankField}>
                  IFSC: {kycData?.ifsc_code || 'Not Provided'}
                </Text>
                <Text style={styles.bankField}>
                  Bank Name: {kycData?.bank_name || 'Not Provided'}
                </Text>
                <Text style={styles.bankField}>
                  Branch: {kycData?.branch_name || 'Not Provided'}
                </Text>
              </Surface>
            </View>

            {/* VERIFICATION BANNER */}
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
                  <Text style={styles.verificationTitle}>
                    {isVerified ? 'Verified Business' : 'Verification Pending'}
                  </Text>
                  <Text style={styles.verificationSubtitle}>
                    {isVerified
                      ? 'All documents are verified and updated'
                      : 'Document verification is pending'}
                  </Text>
                </View>
              </View>
            </Surface>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* BOTTOM SHEET KYC FORM */}
      <BottomSheetKYCForm
        visible={editable}
        onDismiss={() => {
          setEditable(false);
          fetchKyc(); // refresh after updating
        }}
        vendorId={vendorId!}
        initialData={kycData} // 👈 pass pre-filled values
      />
    </ProfileLayout>
  );
};

export default ProfileDocuments;

const styles = StyleSheet.create({
  contentCard: { margin: 12, borderRadius: 12 },
  cardContent: { padding: 0 },

  section: { padding: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: { fontWeight: '700', fontSize: 16, color: '#1F2937' },

  verifiedChip: { backgroundColor: '#F0FDF4', borderColor: '#10B981' },
  pendingChip: { backgroundColor: '#FEF3F2', borderColor: '#F04444' },

  documentCard: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },

  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  documentIcon: { backgroundColor: '#6366F1', marginRight: 12 },
  documentLabel: { fontWeight: '600', color: '#374151' },
  documentValue: {
    marginLeft: 44,
    fontWeight: '600',
    fontSize: 14,
    color: '#1F2937',
  },

  bankTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  bankField: { fontSize: 14, marginBottom: 4, color: '#374151' },

  verificationCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderColor: '#10B981',
    borderWidth: 1,
  },
  verificationContent: { flexDirection: 'row', alignItems: 'center' },

  verificationIcon: { backgroundColor: '#10B981', marginRight: 12 },
  pendingVerificationIcon: { backgroundColor: '#F59E0B', marginRight: 12 },

  verificationText: { flex: 1 },
  verificationTitle: { fontWeight: '600', color: '#065F46', fontSize: 14 },
  verificationSubtitle: { fontSize: 12, color: '#047857', marginTop: 2 },
});

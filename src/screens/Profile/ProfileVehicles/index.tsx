import {
  deleteVehicle,
  getProfileVehicleDetails,
  updateVehicle,
} from '@api/endpoints/profile.api';
import Input from '@components/common/Input';
import { RootState } from '@store/index';
import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import ProfileLayout from '../Layout';

interface Props {
  onTabChange?: (tab: string) => void;
}

const ProfileVehicles: React.FC<Props> = ({ onTabChange }) => {
  const vendorId = useSelector((state: RootState) => state?.auth?.token);

  const [vehicleList, setVehicleList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /** ---- MODAL STATE ---- **/
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  const [regNo, setRegNo] = useState('');
  const [weight, setWeight] = useState('');

  /** ---- EDITABLE SECTION ---- **/
  const [editable, setEditable] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(0);

  const currentTotalCount = vehicleList?.length;
  const canAddMore = currentTotalCount < vehicleCount;
  /** FETCH VEHICLES **/
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const resp = await getProfileVehicleDetails({ vendorid: vendorId });

      if (resp?.status === '00') {
        setVehicleList(resp?.data || []);
        setVehicleCount(
          Number(resp?.data?.[0]?.vehicleDetails?.vehicle_count || 0),
        );
      } else {
        Toast.show({ type: 'error', text1: resp?.message });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (vendorId) fetchVehicles();
  }, [vendorId]);

  /** OPEN ADD MODAL **/
  const openAddModal = () => {
    setEditMode(false);
    setRegNo('');
    setWeight('');
    setEditingVehicleId(null);
    setModalVisible(true);
  };

  /** OPEN EDIT MODAL **/
  const openEditModal = (item: any) => {
    const v = item?.vehicleDetails;

    setEditMode(true);
    setRegNo(v?.registration_no || '');
    setWeight(v?.vehicle_weight?.toString() || '');
    setEditingVehicleId(item?.vehicleId);

    setModalVisible(true);
  };

  /** SAVE VEHICLE (ADD + EDIT) **/
  const handleSave = async () => {
    if (!regNo || !weight) {
      Toast.show({ type: 'error', text1: 'All fields are required' });
      return;
    }

    try {
      let payload = {
        vehicleid: editingVehicleId ?? '',
        vendorid: vendorId!,
        registrationNo: regNo,
        vehicleWeight: weight,
        vehicle_count: vehicleCount?.toString(),
      };

      const resp = await updateVehicle(payload);

      if (resp?.status === '00') {
        Toast.show({
          type: 'success',
          text1: editMode ? 'Vehicle updated' : 'Vehicle added',
        });

        setModalVisible(false);
        fetchVehicles();
      } else {
        Toast.show({ type: 'error', text1: resp?.message });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    }
  };

  /** DELETE VEHICLE **/
  const handleDelete = async (id: number) => {
    try {
      const resp = await deleteVehicle({
        vehicleid: id,
        vendorid: vendorId,
      });

      if (resp?.status === '00') {
        Toast.show({ type: 'success', text1: 'Deleted successfully' });
        fetchVehicles();
      } else {
        Toast.show({ type: 'error', text1: resp?.message });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    }
  };

  return (
    <ProfileLayout
      activeTab="ProfileVehicles"
      onTabChange={onTabChange}
      isEditable={editable}
      onEditPress={() => setEditable(prev => !prev)}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Card style={styles.contentCard}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.section}>
              {/* HEADER */}
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Vehicle Fleet
                </Text>

                <Chip mode="outlined" style={styles.countChip}>
                  {vehicleList.length}/{vehicleCount} Vehicles
                </Chip>
              </View>

              {/* LOADING */}
              {loading && (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
              )}

              {/* ADD BUTTON */}
              {editable && (
                <>
                  <Input
                    label="Maximum Vehicles"
                    value={vehicleCount?.toString()}
                    mode="outlined"
                    keyboardType="number-pad"
                    maxLength={2}
                    left={<TextInput.Icon icon="account-group" />}
                    onChangeText={text => setVehicleCount(Number(text))}
                  />

                  {canAddMore ? (
                    <Button
                      mode="contained-tonal"
                      icon="account-plus"
                      onPress={openAddModal}
                      style={styles.addBtn}
                    >
                      Add Vehicle
                    </Button>
                  ) : (
                    <Card style={styles.maxLimitCard}>
                      <Card.Content style={styles.maxLimitContent}>
                        <IconButton
                          icon="alert-circle"
                          iconColor="#ff9800"
                          size={18}
                        />
                        <Text variant="bodySmall" style={styles.maxLimitText}>
                          Maximum of {vehicleCount} authorities reached
                        </Text>
                      </Card.Content>
                    </Card>
                  )}
                </>
              )}

              {/* VEHICLE LIST */}
              <View style={styles.vehicleList}>
                {vehicleList.map((item, index) => {
                  const v = item?.vehicleDetails || {};

                  return (
                    <Surface
                      key={index}
                      style={styles.vehicleCard}
                      elevation={1}
                    >
                      <View style={styles.vehicleInfo}>
                        <Avatar.Icon
                          size={50}
                          icon="truck"
                          style={styles.vehicleIcon}
                        />

                        <View style={styles.vehicleDetails}>
                          <Text
                            variant="bodyLarge"
                            style={styles.vehicleNumber}
                          >
                            {v?.registration_no || 'NA'}
                          </Text>

                          <Text variant="bodyMedium" style={styles.vehicleType}>
                            Weight: {v?.vehicle_weight || 'NA'} kg
                          </Text>
                        </View>

                        {editable && (
                          <View style={styles.actionButtons}>
                            <IconButton
                              icon="pencil"
                              size={24}
                              onPress={() => openEditModal(item)}
                            />

                            <IconButton
                              icon="delete"
                              size={24}
                              iconColor="#E11D48"
                              onPress={() => handleDelete(item?.vehicleId)}
                            />
                          </View>
                        )}
                      </View>
                    </Surface>
                  );
                })}
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* ADD/EDIT MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editMode ? 'Edit Vehicle' : 'Add Vehicle'}
            </Text>

            <TextInput
              label="Registration Number"
              mode="outlined"
              value={regNo}
              onChangeText={setRegNo}
              style={styles.modalInput}
            />

            <TextInput
              label="Vehicle Weight"
              mode="outlined"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              style={styles.modalInput}
            />

            <Button
              mode="contained"
              onPress={handleSave}
              style={{ marginTop: 10 }}
            >
              {editMode ? 'Update' : 'Save'}
            </Button>

            <Button onPress={() => setModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>
    </ProfileLayout>
  );
};

export default ProfileVehicles;

/* ---------------- STYLE ---------------- */

const styles = StyleSheet.create({
  contentCard: { margin: 12, borderRadius: 12 },
  cardContent: { padding: 0 },
  section: { padding: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontWeight: '700', color: '#1F2937', fontSize: 16 },
  countChip: { backgroundColor: '#F0FDF4', borderColor: '#10B981' },

  vehicleList: { gap: 12 },

  vehicleCard: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },

  vehicleInfo: { flexDirection: 'row', alignItems: 'center' },

  vehicleIcon: { backgroundColor: '#6366F1', marginRight: 12 },

  vehicleDetails: { flex: 1 },

  vehicleNumber: { fontWeight: '600', color: '#1F2937' },

  vehicleType: { color: '#6B7280', marginTop: 2 },

  actionButtons: { flexDirection: 'column', justifyContent: 'center' },

  addBtn: { marginBottom: 10 },

  /* Modal */
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalInput: { marginBottom: 12 },
  maxLimitCard: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  maxLimitContent: { flexDirection: 'row', alignItems: 'center' },
  maxLimitText: { color: '#e65100', marginLeft: 4, fontSize: 12 },
});

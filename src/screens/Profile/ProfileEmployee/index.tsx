import {
  deleteEmployee,
  getEmployeeDetails,
  updateEmployee,
} from '@api/endpoints/profile.api';
import Input from '@components/common/Input';
import Loader from '@components/common/Loader';
import { RootState } from '@store/index';
import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
import FormModal from './FormModal';
import { EmployeeItem } from './types';

interface Props {
  onTabChange?: (tab: string) => void;
}

const ProfileEmployee: React.FC<Props> = ({ onTabChange }) => {
  const vendorId = useSelector((state: RootState) => state?.auth?.token);
  const [employeeList, setEmployeeList] = useState<EmployeeItem[]>([]);
  const [employeeCount, setEmployeeCount] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<
    EmployeeItem | any | null
  >(null);

  const currentTotalCount = employeeList?.length;
  const canAddMore = currentTotalCount < employeeCount;

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const resp = await getEmployeeDetails({ vendorid: vendorId });
      if (resp?.status === '00') {
        const data = resp?.data || [];
        setEmployeeList(data);
        setEmployeeCount(Number(data[0]?.employee_count || 0));
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
    if (vendorId) fetchEmployee();
  }, [vendorId]);

  // ADD EMPLOYEE
  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentEmployee({
      full_name: '',
      contact_no: '',
      email_id: '',
      designation: '',
      customDesignation: '',
    });
    setModalVisible(true);
  };

  // EDIT EMPLOYEE
  const openEditModal = (emp: EmployeeItem) => {
    setIsEditMode(true);
    setCurrentEmployee({
      customDesignation: '',
      ...emp,
    });
    setModalVisible(true);
  };

  // DELETE EMPLOYEE
  const deleteEmployees = async (id: string) => {
    const resp = await deleteEmployee({ employeeid: id, vendorid: vendorId });
    if (resp?.status === '00') {
      fetchEmployee();
      Toast.show({ type: 'success', text1: resp?.message });
    } else {
      Toast.show({ type: 'error', text1: resp?.message });
    }
  };

  // add edit handler
  const handleFormSubmit = async (values: any) => {
    try {
      if (employeeCount <= employeeList?.length && !isEditMode) {
        Toast.show({
          type: 'error',
          text1: 'Cannot add more employees than the maximum limit.',
        });
        return;
      }
      // cheque_pass_img
      const payload = JSON.parse(JSON.stringify(values));
      delete payload.vendor_id;
      delete payload.username;
      delete payload.password;
      delete payload.alternate_no;
      delete payload.website;
      delete payload.insert_date;
      delete payload.update_date;

      const resp = await updateEmployee({
        ...payload,
        vendorid: vendorId,
        employee_count: employeeCount?.toString(),
      });
      if (resp?.status === '00') {
        fetchEmployee();
        setModalVisible(false);
      } else {
        Toast.show({ type: 'error', text1: resp?.message });
      }
    } catch (error) {}
  };

  return (
    <ProfileLayout
      activeTab="ProfileEmployee"
      onTabChange={onTabChange}
      isEditable={editable}
      onEditPress={() => setEditable(prev => !prev)}
    >
      <Loader visible={loading} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.contentCard}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text
                  variant="titleMedium"
                  style={styles.sectionTitle}
                  numberOfLines={2}
                >
                  Operating Authority other Than User
                </Text>

                <Chip
                  mode="outlined"
                  style={[
                    styles.countChip,
                    { marginLeft: 'auto', marginRight: 0 },
                  ]}
                >
                  {employeeList.length}/{employeeCount} Authority
                </Chip>
              </View>

              {/* ADD BUTTON */}
              {editable && (
                <>
                  <Input
                    label="Maximum Authorities"
                    value={employeeCount?.toString()}
                    mode="outlined"
                    keyboardType="number-pad"
                    maxLength={2}
                    left={<TextInput.Icon icon="account-group" />}
                    onChangeText={text => setEmployeeCount(Number(text))}
                  />
                  {canAddMore ? (
                    <Button
                      mode="contained-tonal"
                      icon="account-plus"
                      onPress={openAddModal}
                      style={styles.addBtn}
                    >
                      Add Employee
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
                          Maximum of {employeeCount} authorities reached
                        </Text>
                      </Card.Content>
                    </Card>
                  )}
                </>
              )}
              {/* EMPLOYEE LIST */}
              <View style={styles.employeeList}>
                {employeeList?.map(emp => (
                  <Surface key={emp.employeeid} style={styles.employeeCard}>
                    <View style={styles.employeeInfo}>
                      <Avatar.Text
                        size={50}
                        label={emp.full_name
                          ?.split(' ')
                          .map(n => n[0])
                          .join('')}
                        style={styles.employeeAvatar}
                      />

                      <View style={styles.employeeDetails}>
                        <Text style={styles.employeeName}>{emp.full_name}</Text>
                        <Text style={styles.employeeRole}>
                          {emp.designation}
                        </Text>
                        <Text style={styles.subText}>📞 {emp.contact_no}</Text>
                        <Text style={styles.subText}>
                          ✉️ {emp.email_id || 'No Email'}
                        </Text>
                      </View>

                      {editable && (
                        <View>
                          <IconButton
                            icon="pencil"
                            onPress={() => openEditModal(emp)}
                          />
                          <IconButton
                            icon="delete"
                            iconColor="red"
                            onPress={() => deleteEmployees(emp?.employeeid!)}
                          />
                        </View>
                      )}
                    </View>
                  </Surface>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      <FormModal
        modalVisible={modalVisible}
        currentEmployee={currentEmployee}
        isEditMode={isEditMode}
        setModalVisible={setModalVisible}
        handleFormSubmit={handleFormSubmit}
      />
    </ProfileLayout>
  );
};

export default ProfileEmployee;

// ------------------ STYLES ------------------

const styles = StyleSheet.create({
  contentCard: { margin: 12, borderRadius: 12 },
  cardContent: { padding: 0 },
  section: { padding: 16 },

  sectionHeader: {
    flexDirection: 'column',
    marginBottom: 16,
  },

  sectionTitle: { fontWeight: '700', fontSize: 16, flex: 1 },
  countChip: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
    width: 140,
  },
  addBtn: { marginBottom: 10 },

  employeeList: { gap: 12 },
  employeeCard: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  employeeInfo: { flexDirection: 'row', alignItems: 'center' },
  employeeAvatar: { backgroundColor: '#6366F1', marginRight: 12 },
  employeeDetails: { flex: 1 },
  employeeName: { fontWeight: '700', fontSize: 15 },
  employeeRole: { color: '#6B7280', marginBottom: 4 },
  subText: { fontSize: 13, color: '#4B5563' },

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

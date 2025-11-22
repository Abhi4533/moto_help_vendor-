// ProfileEmployee.tsx
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, Chip, Surface, Text } from 'react-native-paper';
import ProfileLayout from '../Layout';

interface Props {
  onTabChange?: (tab: string) => void;
}

const ProfileEmployee: React.FC<Props> = ({ onTabChange }) => {
  const employees = [
    { id: 1, name: 'John Doe', role: 'Manager', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Developer', status: 'Active' },
    { id: 3, name: 'Mike Johnson', role: 'Designer', status: 'Active' },
    { id: 4, name: 'Sarah Wilson', role: 'Analyst', status: 'On Leave' },
  ];

  return (
    <ProfileLayout
      activeTab="Employees"
      onTabChange={onTabChange}
      onEditPress={() => console.log('Edit employees pressed')}
    >
      <Card style={styles.contentCard}>
        <Card.Content style={styles.cardContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Employee Management
                </Text>
                <Chip mode="outlined" style={styles.countChip}>
                  {employees.length} employees
                </Chip>
              </View>

              <View style={styles.employeeList}>
                {employees.map(employee => (
                  <Surface
                    key={employee.id}
                    style={styles.employeeCard}
                    elevation={1}
                  >
                    <View style={styles.employeeInfo}>
                      <Avatar.Text
                        size={50}
                        label={employee.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                        style={styles.employeeAvatar}
                      />
                      <View style={styles.employeeDetails}>
                        <Text variant="bodyLarge" style={styles.employeeName}>
                          {employee.name}
                        </Text>
                        <Text variant="bodyMedium" style={styles.employeeRole}>
                          {employee.role}
                        </Text>
                      </View>
                      <Chip
                        mode="outlined"
                        style={
                          employee.status === 'Active'
                            ? styles.activeChip
                            : styles.leaveChip
                        }
                        textStyle={styles.chipText}
                      >
                        {employee.status}
                      </Chip>
                    </View>
                  </Surface>
                ))}
              </View>
            </View>
          </ScrollView>
        </Card.Content>
      </Card>
    </ProfileLayout>
  );
};

export default ProfileEmployee;

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
  countChip: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  employeeList: {
    gap: 12,
  },
  employeeCard: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeAvatar: {
    backgroundColor: '#6366F1',
    marginRight: 12,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontWeight: '600',
    color: '#1F2937',
  },
  employeeRole: {
    color: '#6B7280',
    marginTop: 2,
  },
  activeChip: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  leaveChip: {
    backgroundColor: '#FEF3F2',
    borderColor: '#F04444',
  },
  chipText: {
    fontSize: 12,
  },
});

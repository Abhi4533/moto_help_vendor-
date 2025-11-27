import { formatDate } from '@utils/dateUtils';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton, Surface } from 'react-native-paper';

/* -------------------------- TYPES -------------------------- */
export interface AssignmentItem {
  AssignID: string;
  VehicleNumber: string;
  DriverName: string;
  AssignmentDate: string | null;
  update_date?: string | null;
  IsActive: '0' | '1';
}

interface AssignedCardProps {
  item: AssignmentItem;
  onDelete?: (id: string) => void;
}

/* -------------------------- HELPERS -------------------------- */
const getDiscontinueDate = (assignment: AssignmentItem): string | null => {
  if (assignment?.IsActive === '0' && assignment?.update_date) {
    return assignment?.update_date;
  }
  return null;
};

/* -------------------------- COMPONENT -------------------------- */
const AssignedCard: FC<AssignedCardProps> = ({ item, onDelete }) => {
  const discontinueDate = getDiscontinueDate(item);
  const isActive = item?.IsActive !== '0';

  return (
    <Surface style={styles.card} elevation={3}>
      {/* Top status bar */}
      <View
        style={[
          styles.statusBar,
          isActive ? styles.activeBar : styles.inactiveBar,
        ]}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.assignId}>{item?.AssignID}</Text>

            <View
              style={[
                styles.statusBadge,
                isActive ? styles.activeBadge : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? '#065F46' : '#991B1B' },
                ]}
              >
                {isActive ? 'ACTIVE' : 'RELEASED'}
              </Text>
            </View>
          </View>

          {!discontinueDate && (
            <IconButton
              icon="trash-can-outline"
              size={20}
              iconColor="#EF4444"
              style={styles.deleteBtn}
              onPress={() => onDelete?.(item?.AssignID)}
            />
          )}
        </View>

        {/* Body */}
        <View style={styles.mainRow}>
          {/* Vehicle + Driver */}
          <View style={styles.mainContent}>
            <View style={styles.section}>
              <Text style={styles.label}>Vehicle No.</Text>
              <Text style={styles.valuePrimary}>{item?.VehicleNumber}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Driver</Text>
              <Text style={styles.valueSecondary}>{item?.DriverName}</Text>
            </View>
          </View>

          {/* Dates */}
          <View style={styles.datesBox}>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>Assigned</Text>
              <Text style={styles.dateValue}>
                {formatDate(item?.AssignmentDate!)}
              </Text>
            </View>

            {discontinueDate && (
              <View style={[styles.dateSection, { marginTop: 5 }]}>
                <Text style={styles.dateLabel}>Released</Text>
                <Text
                  style={[styles.dateValue, !isActive && styles.releasedDate]}
                >
                  {formatDate(discontinueDate!)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Surface>
  );
};

export default AssignedCard;

/* -------------------------- STYLES -------------------------- */
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  statusBar: { height: 4, width: '100%' },
  activeBar: { backgroundColor: '#10B981' },
  inactiveBar: { backgroundColor: '#EF4444' },

  content: { padding: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  assignId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadge: { backgroundColor: '#D1FAE5' },
  inactiveBadge: { backgroundColor: '#FEE2E2' },

  statusText: { fontSize: 10, fontWeight: '700' },

  deleteBtn: { margin: 0 },

  mainRow: { flexDirection: 'row' },
  mainContent: { flex: 1 },

  section: { flex: 1 },

  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },

  valuePrimary: { fontSize: 16, fontWeight: '700', color: '#111827' },
  valueSecondary: { fontSize: 16, fontWeight: '600', color: '#1F2937' },

  datesBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },

  dateSection: { alignItems: 'center' },

  dateLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 3,
  },

  dateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  releasedDate: { color: '#DC2626' },
});

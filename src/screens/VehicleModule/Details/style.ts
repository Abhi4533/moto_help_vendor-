import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#6366F1',
    elevation: 0,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },

  // Vehicle Header
  vehicleHeaderCard: {
    borderRadius: 0,
    elevation: 2,
    backgroundColor: '#fff',
  },
  vehicleHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  vehicleAvatar: {
    position: 'relative' as const,
    marginRight: 16,
  },
  avatar: {
    margin: 0,
  },
  statusIndicator: {
    position: 'absolute' as const,
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  vehicleMainInfo: {
    flex: 1,
  },
  registrationNo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  vehicleCategory: {
    fontSize: 14,
    color: '#64748B',
  },
  quickStatus: {
    flexDirection: 'row' as const,
    gap: 8,
    marginBottom: 16,
  },
  statusChip: {
    borderRadius: 20,
  },
  verifiedChip: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
  },
  quickActions: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 8,
  },
  quickActionLabel: {
    fontSize: 12,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row' as const,
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 8,
  },

  // Sections
  sectionCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 8,
  },

  // Info Rows
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  infoValueContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
    justifyContent: 'flex-end' as const,
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  copyButton: {
    margin: 0,
    marginLeft: 8,
  },

  // Specs Grid
  specsGrid: {
    flexDirection: 'column' as const,
    gap: 16,
  },
  specColumn: {
    flex: 1,
  },

  // Documents
  documentCard: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  documentHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  },
  documentTitle: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: -8,
  },
  documentBadge: {
    borderRadius: 4,
  },
  documentDate: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  documentProgress: {
    marginTop: 4,
  },
  documentDays: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  documentActions: {
    flexDirection: 'row' as const,
    gap: 12,
    padding: 16,
  },
  documentButton: {
    flex: 1,
    borderRadius: 8,
  },

  // History
  historyItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyIcon: {
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 13,
    color: '#64748B',
  },

  // Danger Zone
  dangerZoneCard: {
    margin: 16,
    borderRadius: 12,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  dangerZoneHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  dangerZoneText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  deleteButtonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Modals
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  deleteModalContent: {
    alignItems: 'center' as const,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center' as const,
    marginBottom: 16,
  },
  modalScroll: {
    maxHeight: 400,
  },
  input: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  switchLabel: {
    fontSize: 14,
    color: '#374151',
  },
  modalActions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
  },
  deleteText: {
    textAlign: 'center' as const,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },

  // Snackbar
  snackbar: {
    borderRadius: 8,
    margin: 16,
  },
});

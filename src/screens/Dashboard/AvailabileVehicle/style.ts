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
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  formContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    fontSize: 18,
  },
  input: {
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  loader: {
    marginVertical: 8,
  },
  driverInfoSurface: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  driverDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  driverText: {
    flex: 1,
  },
  driverName: {
    fontWeight: 'bold',
    color: '#065F46',
    fontSize: 16,
  },
  driverVehicle: {
    color: '#047857',
    marginTop: 2,
    fontSize: 14,
  },
  driverLocation: {
    color: '#059669',
    marginTop: 2,
    fontSize: 12,
  },
  noDriverText: {
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  statusContainer: {
    gap: 12,
  },
  statusOption: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusButton: {
    borderRadius: 8,
  },
  statusButtonContent: {
    height: 44,
  },
  statusDescription: {
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#6366F1',
  },
  selectSection: {
    marginBottom: 20,
  },
  selectLabel: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontSize: 14,
  },

  // Dropdown Styles
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 56,
    justifyContent: 'center',
  },
  dropdownDisabled: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 8,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemSelected: {
    backgroundColor: '#F0F7FF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: '#6366F1',
    fontWeight: '600',
  },
  multiSelectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButton: {
    flex: 1,
    marginRight: 8,
  },
  doneButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#6366F1',
  },

  addButton: {
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#6366F1',
  },
  addButtonContent: {
    height: 48,
  },
  routesList: {
    marginTop: 16,
  },
  divider: {
    marginVertical: 8,
  },
  routesTitle: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    fontSize: 16,
  },
  routeSurface: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  routeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeInfo: {
    flex: 1,
  },
  routePath: {
    fontWeight: '600',
    color: '#1F2937',
    fontSize: 14,
  },
  routeDistricts: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#6366F1',
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonContent: {
    height: 52,
  },
  snackbar: {
    borderRadius: 12,
    margin: 16,
  },
  snackbarSuccess: {
    backgroundColor: '#10B981',
  },
  snackbarError: {
    backgroundColor: '#EF4444',
  },
});

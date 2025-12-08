import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#f5f5f5' },

  topButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  topButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 12,
  },
  availableButton: { backgroundColor: '#10B981' },
  topButtonLabel: { fontSize: 13, fontWeight: '600' },

  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },

  map: { height: height * 0.45, width: '100%' },

  quickActionsContainer: { gap: 12 },

  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionIcon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
  },
});

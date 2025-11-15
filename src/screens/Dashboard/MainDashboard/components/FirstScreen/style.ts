import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  appbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  welcomeCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#2196F3',
    overflow: 'hidden', // Ensure content stays within card
  },
  welcomeCardContent: {
    paddingVertical: 8, // Reduced vertical padding
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed to flex-start for better alignment
    flexWrap: 'wrap', // Allow wrapping on small screens
  },
  welcomeTextContainer: {
    flex: 1, // Take available space
    marginRight: 12, // Add spacing between text and date
    minWidth: 200, // Minimum width for text container
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 20, // Slightly smaller font
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 24, // Better line height
  },
  welcomeSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13, // Slightly smaller font
    lineHeight: 16, // Better line height
    flexWrap: 'wrap', // Ensure text wraps
  },
  dateBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start', // Align to top
    minWidth: 100, // Minimum width for date
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    margin: 8,
    backgroundColor: 'white',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  statTextContainer: {
    flex: 1,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statCount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconText: {
    fontSize: 20,
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: 'white',
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tripStat: {
    alignItems: 'center',
    flex: 1,
  },
  tripIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripIconText: {
    fontSize: 24,
  },
  tripCount: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  tripLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  tripText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  docCard: {
    flex: 1,
    backgroundColor: 'white',
    elevation: 2,
  },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  docTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  docBadge: {
    backgroundColor: '#2196F3',
  },
  docStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  docStat: {
    alignItems: 'center',
    flex: 1,
  },
  docIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  docCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  docLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },

  quickActionsContainer: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  quickActionsCard: {
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 8,
    elevation: 2,
  },
  quickActionContent: {
    paddingVertical: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  assignButton: {
    backgroundColor: '#FF9800', // Orange
  },
  availableButton: {
    backgroundColor: '#4CAF50', // Green
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  documentItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentIconText: {
    fontSize: 16,
  },
  documentText: {
    flex: 1,
  },
  documentCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  documentLabel: {
    fontSize: 12,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  subSection: {
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  miniStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

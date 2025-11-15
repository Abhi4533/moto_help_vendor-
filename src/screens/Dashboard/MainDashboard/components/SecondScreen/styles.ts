import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: 'relative' as const,
  },
  controlsContainer: {
    position: 'absolute' as const,
    top: 10,
    right: 10,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row' as const,
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  controlButton: {
    marginVertical: 2,
  },
  noDataContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 500,
  },
  noDataMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  tabSelector: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  // Map Container

  map: {
    flex: 1,
  },
  // Selected Trip Banner
  selectedTripBanner: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#E3F2FD',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
  },
  badge: {
    marginRight: 8,
  },
  tripList: {
    flex: 1,
    padding: 16,
  },
  tripItem: {
    marginBottom: 12,
  },
  selectedTripItem: {
    borderColor: '#2196F3',
    borderWidth: 2,
    borderRadius: 8,
  },
  tripCard: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripId: {
    fontWeight: 'bold',
    flex: 1,
  },
  tripDriver: {
    fontWeight: '600',
    marginBottom: 2,
  },
  tripVehicle: {
    color: '#666',
  },
  // Progress Bar
  progressContainer: {
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontWeight: 'bold',
  },
  // Trip Details
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'flex-start',
    flex: 1,
  },
  detailLabel: {
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontWeight: '600',
    color: '#333',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#999',
    textAlign: 'center',
  },
  // Callout Styles
  calloutContainer: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  calloutContent: {
    padding: 16,
  },
  calloutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  calloutLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  calloutValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceChip: {
    height: 24,
  },
  locationInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  locationText: {
    fontSize: 10,
    color: '#666',
  },
  emptyListContainer: {
    flexGrow: 1,
  },
});

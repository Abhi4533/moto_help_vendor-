import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  modalButton: {
    flex: 1,
  },

  // Detail Card Styles
  detailCard: {
    marginBottom: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleTitle: {
    flex: 1,
    marginLeft: 12,
  },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  // Photo Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  photoModalCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 4,
  },

  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6B7280',
  },
  modalButtons: {
    gap: 12,
  },

  modalButtonContent: {
    height: 44,
  },
  modalCancelButton: {
    marginTop: 8,
  },

  // Photo Gallery Styles
  photoGalleryContainer: {
    marginVertical: 16,
  },
  photoGalleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoGalleryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  addPhotoButton: {
    margin: 0,
    backgroundColor: '#F3F4F6',
  },
  emptyPhotosContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyPhotosText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  emptyAddPhotoButton: {
    margin: 0,
    backgroundColor: '#6366F1',
  },
  photoScrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  photoItem: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 8,
  },
  photoIndex: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  removePhotoButton: {
    margin: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  addPhotoItem: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  addPhotoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addPhotoText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  addPhotoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Updated Photo Badge
  photoBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  photoBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  vehicleCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  // Header Section
  cardHeader: {
    marginBottom: 12,
  },
  vehicleMainInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    borderRadius: 12,
  },

  photoBadgeIcon: {
    backgroundColor: 'transparent',
  },
  vehicleInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // marginBottom: 4,
  },
  registrationNo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
    marginTop: 10,
    // backgroundColor: '#000',
  },
  menuButton: {
    margin: -8,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },

  // Status & Expiry Row
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    borderRadius: 6,
    width: 100,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiryBadge: {
    backgroundColor: '#EF4444',
  },
  expiryInfo: {
    alignItems: 'flex-end',
  },
  expiryLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },

  // KYC Section
  kycSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEF7FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  kycHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kycChip: {
    backgroundColor: 'transparent',
    height: 32,
  },
  verifiedDate: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '500',
  },
  kycNote: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 16,
  },

  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  verifyButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  verifyButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  photoButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  photoButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  detailsButton: {
    borderRadius: 8,
    minWidth: 60,
  },
  detailsButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Expiry Warning (for critical states)
  expiryWarning: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  expiryText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 12,
  },

  // Additional details (commented out but kept for reference)
  additionalDetails: {
    marginTop: 12,
    gap: 4,
  },

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  } as ViewStyle,
  header: {
    backgroundColor: '#6366F1',
    elevation: 4,
  } as ViewStyle,
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  } as TextStyle,
  quickActionsSection: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    elevation: 2,
  } as ViewStyle,
  quickActions: {
    paddingHorizontal: 16,
    gap: 16,
  } as ViewStyle,
  quickAction: {
    alignItems: 'center',
    minWidth: 60,
  } as ViewStyle,
  quickActionIcon: {
    borderRadius: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  } as ViewStyle,
  actionIcon: {
    margin: 0,
  } as ViewStyle,
  quickActionLabel: {
    fontSize: 11,
    marginTop: 4,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  } as TextStyle,
  searchSection: {
    backgroundColor: '#fff',
    padding: 12,
    elevation: 2,
  } as ViewStyle,
  searchBar: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginBottom: 12,
    elevation: 0,
    height: 44,
  } as ViewStyle,
  filterContainer: {
    flexGrow: 0,
  } as ViewStyle,
  filterContent: {
    gap: 8,
  } as ViewStyle,
  chip: {
    backgroundColor: 'transparent',
    borderColor: '#E2E8F0',
    height: 32,
  } as ViewStyle,
  chipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
    height: 32,
  } as ViewStyle,
  chipText: {
    fontSize: 12,
    color: '#64748B',
  } as TextStyle,
  chipTextActive: {
    fontSize: 12,
    color: '#fff',
  } as TextStyle,
  vehiclesList: {
    flex: 1,
  } as ViewStyle,
  listContent: {
    padding: 12,
    gap: 12,
  } as ViewStyle,
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  } as ViewStyle,

  registrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  } as ViewStyle,

  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
  } as ViewStyle,
  specItem: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  specLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  } as TextStyle,
  specValue: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '600',
  } as TextStyle,
  expiryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  } as ViewStyle,
  expiryItem: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  expiryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  } as ViewStyle,

  expiryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  } as ViewStyle,

  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  } as ViewStyle,
  compactButton: {
    flex: 1,
    borderRadius: 6,
    height: 32,
  } as ViewStyle,
  compactButtonLabel: {
    fontSize: 11,
    fontWeight: '500',
  } as TextStyle,
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    marginTop: 20,
  } as ViewStyle,
  emptyTitle: {
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 18,
  } as TextStyle,
  emptyText: {
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    fontSize: 14,
  } as TextStyle,
  emptyButton: {
    borderRadius: 8,
    backgroundColor: '#6366F1',
  } as ViewStyle,
  fab: {
    position: 'absolute' as 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366F1',
    borderRadius: 12,
  } as ViewStyle,

  ownerName: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },

  // Expiry Warning

  kycInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },

  verifiedInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  verifiedText: {
    color: '#4CAF50',
    fontStyle: 'italic',
    fontSize: 12,
  },

  // Additional Details
});

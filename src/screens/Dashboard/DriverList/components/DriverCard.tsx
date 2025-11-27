import Icon from '@react-native-vector-icons/material-design-icons';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
const DriverCard = ({ item }: { item: any }) => {
  const details = item?.DriverDetails;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.driverInfo}>
          <Icon name="account-circle" size={24} color="#3498db" />
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {details?.full_name || 'N/A'}
            </Text>
            <Text style={styles.phone}>{details?.Phone || 'No phone'}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Icon name="check-circle" size={16} color="#27ae60" />
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Icon name="card-account-details" size={16} color="#7f8c8d" />
          <Text style={styles.detailText}>
            {details?.driving_license_no || 'No license'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="calendar" size={16} color="#7f8c8d" />
          <Text style={styles.detailText}>
            Expires:{' '}
            {details?.expiry_date ? details.expiry_date.split('T')[0] : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DriverCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  phone: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f6ef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#27ae60',
    marginLeft: 4,
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#34495e',
    marginLeft: 8,
    flex: 1,
  },
});

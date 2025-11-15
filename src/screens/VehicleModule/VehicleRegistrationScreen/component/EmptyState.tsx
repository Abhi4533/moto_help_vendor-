import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { styles } from '../style';

const EmptyState: React.FC<{ searchQuery: string }> = ({ searchQuery }) => (
  <View style={styles.emptyState}>
    <IconButton icon="car-off" size={64} iconColor="#9CA3AF" />
    <Text style={styles.emptyStateTitle}>
      {searchQuery ? 'No vehicles found' : 'No vehicles available'}
    </Text>
    <Text style={styles.emptyStateText}>
      {searchQuery
        ? 'Try adjusting your search terms'
        : 'Add vehicles to get started with validation'}
    </Text>
  </View>
);

export default EmptyState;

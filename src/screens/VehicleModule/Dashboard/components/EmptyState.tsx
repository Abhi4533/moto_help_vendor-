import { View } from 'react-native';
import { Button, IconButton, Text, Title } from 'react-native-paper';
import { styles } from '../styles';

interface EmptyStateProps {
  searchQuery: any;
  setSearchQuery: any;
  setSelectedStatus: any;
}

const EmptyState = ({
  searchQuery,
  setSearchQuery,
  setSelectedStatus,
}: EmptyStateProps) => (
  <View style={styles.emptyState}>
    <IconButton icon="truck-off" size={60} iconColor="#94A3B8" />
    <Title style={styles.emptyTitle}>No vehicles found</Title>
    <Text style={styles.emptyText}>
      {searchQuery
        ? 'No vehicles match your search criteria'
        : 'No vehicles available for the selected filters'}
    </Text>
    <Button
      mode="contained"
      onPress={() => {
        setSearchQuery('');
        setSelectedStatus('all');
      }}
      style={styles.emptyButton}
    >
      Clear Filters
    </Button>
  </View>
);
export default EmptyState;

import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { styles } from '../style';

const StatItem: React.FC<{ number: number; label: string }> = ({
  number,
  label,
}) => (
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default StatItem;

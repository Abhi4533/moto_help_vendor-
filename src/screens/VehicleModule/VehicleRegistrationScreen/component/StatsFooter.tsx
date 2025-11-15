import { View } from 'react-native';
import { styles } from '../style';
import StatItem from './StatItem';

interface VehicleStats {
  registered: number;
  pending: number;
  total: number;
}
const StatsFooter: React.FC<{ stats: VehicleStats }> = ({ stats }) => (
  <View style={styles.footer}>
    <View style={styles.statsContainer}>
      <StatItem number={stats.registered} label="Registered" />
      <View style={styles.statDivider} />
      <StatItem number={stats.pending} label="Pending" />
      <View style={styles.statDivider} />
      <StatItem number={stats.total} label="Total" />
    </View>
  </View>
);

export default StatsFooter;

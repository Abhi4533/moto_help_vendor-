import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { styles } from '../style';
interface StatCardProps {
  title: string;
  count: number;
  subtitle: string;
  icon: string;
  color: string;
  onPress?: () => void;
}
const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  subtitle,
  icon,
  color,
  onPress,
}) => (
  <Card style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
    <Card.Content style={styles.statCardContent}>
      <View style={styles.statTextContainer}>
        <Text variant="titleLarge" style={[styles.docTitle, { color }]}>
          {title}
        </Text>
        <Text variant="titleLarge" style={[styles.statCount, { color }]}>
          {count}
        </Text>
      </View>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Text variant="bodyMedium" style={[styles.statIconText, { color }]}>
          {icon}
        </Text>
      </View>
    </Card.Content>
  </Card>
);

export default StatCard;

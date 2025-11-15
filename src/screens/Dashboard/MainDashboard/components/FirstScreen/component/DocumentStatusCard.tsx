import { View } from 'react-native';
import { Badge, Card, Paragraph } from 'react-native-paper';
import { styles } from '../style';

interface DocumentStatusProps {
  type: 'vehicle' | 'driver';
  stats: {
    valid: number;
    expired: number;
    pending: number;
    rejected: number;
  };
}

const DocumentStatusCard: React.FC<DocumentStatusProps> = ({ type, stats }) => (
  <Card style={styles.docCard}>
    <Card.Content>
      <View style={styles.docHeader}>
        <Paragraph style={styles.docTitle}>
          {type === 'vehicle' ? 'Vehicle' : 'Driver'} Documents
        </Paragraph>
        <Badge size={24} style={styles.docBadge}>
          {stats.valid + stats.expired + stats.pending + stats.rejected}
        </Badge>
      </View>
      <View style={styles.docStats}>
        <View style={styles.docStat}>
          <View style={[styles.docIndicator, { backgroundColor: '#4CAF50' }]} />
          <Paragraph style={styles.docCount}>{stats.valid}</Paragraph>
          <Paragraph style={styles.docLabel}>Valid</Paragraph>
        </View>
        <View style={styles.docStat}>
          <View style={[styles.docIndicator, { backgroundColor: '#f44336' }]} />
          <Paragraph style={styles.docCount}>{stats.expired}</Paragraph>
          <Paragraph style={styles.docLabel}>Expired</Paragraph>
        </View>
        <View style={styles.docStat}>
          <View style={[styles.docIndicator, { backgroundColor: '#FF9800' }]} />
          <Paragraph style={styles.docCount}>{stats.pending}</Paragraph>
          <Paragraph style={styles.docLabel}>Pending</Paragraph>
        </View>
        <View style={styles.docStat}>
          <View style={[styles.docIndicator, { backgroundColor: '#9C27B0' }]} />
          <Paragraph style={styles.docCount}>{stats.rejected}</Paragraph>
          <Paragraph style={styles.docLabel}>Rejected</Paragraph>
        </View>
      </View>
    </Card.Content>
  </Card>
);
export default DocumentStatusCard;

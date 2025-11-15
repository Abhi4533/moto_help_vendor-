import { View } from 'react-native';
import { Badge, Card, IconButton, ProgressBar, Text } from 'react-native-paper';
import { getDaysRemaining, getExpiryStatus } from '../helper';
import { styles } from '../style';

const DocumentStatusCard = ({
  title,
  date,
  icon,
  type,
}: {
  title: string;
  date: string;
  icon: string;
  type: string;
}) => {
  const status = getExpiryStatus(date);
  const daysRemaining = getDaysRemaining(date);

  return (
    <Card style={styles.documentCard}>
      <Card.Content>
        <View style={styles.documentHeader}>
          <View style={styles.documentTitle}>
            <IconButton icon={icon} size={20} iconColor="#6366F1" />
            <Text style={styles.documentName}>{title}</Text>
          </View>
          <Badge
            style={[styles.documentBadge, { backgroundColor: status.color }]}
          >
            {status.label}
          </Badge>
        </View>

        <Text style={styles.documentDate}>
          {new Date(date).toLocaleDateString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>

        <View style={styles.documentProgress}>
          <Text style={styles.documentDays}>
            {daysRemaining < 0
              ? `Expired ${Math.abs(daysRemaining)} days ago`
              : `${daysRemaining} days remaining`}
          </Text>
          <ProgressBar
            progress={status.progress}
            color={status.color}
            style={styles.progressBar}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

export default DocumentStatusCard;

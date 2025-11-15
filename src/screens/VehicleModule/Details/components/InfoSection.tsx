import { View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import { styles } from '../style';

const InfoSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => (
  <Card style={styles.sectionCard}>
    <Card.Content>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitle}>
          <IconButton icon={icon} size={20} iconColor="#6366F1" />
          <Text style={styles.sectionTitleText}>{title}</Text>
        </View>
      </View>
      {children}
    </Card.Content>
  </Card>
);

export default InfoSection;

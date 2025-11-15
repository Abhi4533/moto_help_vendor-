import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { styles } from '../styles';
interface QuickActionButtonProps {
  icon: any;
  label: any;
  onPress: any;
  color?: any;
}
const QuickActionButton = ({
  icon,
  label,
  onPress,
  color = '#2563EB',
}: QuickActionButtonProps) => (
  <View style={styles.quickAction}>
    <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
      <IconButton
        icon={icon}
        iconColor="#fff"
        size={20}
        onPress={onPress}
        style={styles.actionIcon}
      />
    </View>
    <Text style={styles.quickActionLabel} numberOfLines={2}>
      {label}
    </Text>
  </View>
);

export default QuickActionButton;

import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { styles } from '../style';

const InfoRow = ({
  label,
  value,
  copyable = false,
  setSnackbarVisible,
  setSnackbarMessage,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  setSnackbarMessage: any;
  setSnackbarVisible: any;
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoValueContainer}>
      <Text style={styles.infoValue}>{value}</Text>
      {copyable && (
        <IconButton
          icon="content-copy"
          size={16}
          onPress={() => {
            // Clipboard functionality would go here
            setSnackbarMessage('Copied to clipboard');
            setSnackbarVisible(true);
          }}
          style={styles.copyButton}
        />
      )}
    </View>
  </View>
);

export default InfoRow;

import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { styles } from '../style';
// Types
interface Vehicle {
  id: string;
  registrationNo: string;
  status: 'pending' | 'validating' | 'validated' | 'submitted' | 'error';
  lastValidated: string | null;
  message: string | null;
  isExisting: boolean;
}

const StatusMessage: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
  const getMessageStyle = () => {
    if (vehicle.status === 'submitted' || vehicle.isExisting) {
      return [styles.messageContainer, styles.successMessage];
    }
    if (vehicle.status === 'error') {
      return [styles.messageContainer, styles.errorMessage];
    }
    return [styles.messageContainer, styles.infoMessage];
  };

  const getMessageTextStyle = () => {
    if (vehicle.status === 'submitted' || vehicle.isExisting) {
      return [styles.messageText, styles.successMessageText];
    }
    if (vehicle.status === 'error') {
      return [styles.messageText, styles.errorMessageText];
    }
    return [styles.messageText, styles.infoMessageText];
  };

  return (
    <View style={getMessageStyle()}>
      <Text style={getMessageTextStyle()}>{vehicle.message}</Text>
    </View>
  );
};

export default StatusMessage;

import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { login } from '../../../../api/endpoints/auth.api';
import { formatPhone } from '../../../../utils/formatter';
import { isPhone } from '../../../../utils/validation';

export const PhoneInputSection: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const handlePhoneNumberChange = (text: string): void => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericText);
  };

  const handleSendOtp = async () => {
    try {
      console.log({ phoneNumber });
      const resp = await login({ mobile_number: phoneNumber });
      if (resp?.status === '00') {
        navigation.navigate('OTPVerify', { phoneNumber });
      } else {
        Toast.show({ type: 'error', text1: resp?.message });
      }
    } catch (error) {}
  };

  return (
    <View style={styles.phoneContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>PHONE NUMBER</Text>
        <View style={styles.phoneInputWrapper}>
          <Text style={styles.countryCode}>+91 |</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={formatPhone(phoneNumber)}
            onChangeText={handlePhoneNumberChange}
            maxLength={12}
            autoFocus={true}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!isPhone(phoneNumber) || loading) && styles.buttonDisabled,
        ]}
        onPress={handleSendOtp}
        disabled={!isPhone(phoneNumber) || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'SENDING...' : 'SEND OTP'}
        </Text>
      </TouchableOpacity>

      <View style={styles.helpTextContainer}>
        <Text style={styles.helpText}>
          Contact support if you have issues logging in
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phoneContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4a5568',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f7fafc',
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#2d3748',
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e0',
    shadowColor: '#cbd5e0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  helpTextContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 12,
    color: '#718096',
  },
  button: {
    backgroundColor: '#3182ce',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3182ce',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
});

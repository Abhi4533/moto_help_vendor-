import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { login, verifyOTP } from '../../../../api/endpoints/auth.api';
import { loginSuccess, setKycStatus } from '../../../../store/slices/authSlice';
import { formatPhone } from '../../../../utils/formatter';
import { isOTPValid } from '../../../../utils/validation';

interface OtpScreenProps {
  phoneNumber: string;
}

const OtpScreen: React.FC<OtpScreenProps> = ({ phoneNumber }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [countdown, setCountdown] = useState<number>(30);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);

  // FIX: Array of refs
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // -----------------------
  // TIMER
  // -----------------------
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // -----------------------
  // OTP CHANGE
  // -----------------------
  const onOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // -----------------------
  // BACKSPACE HANDLER
  // -----------------------
  const onKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // -----------------------
  // VERIFY OTP
  // -----------------------
  const onVerifyOtp = async () => {
    const code = otp.join('');
    setIsVerifyingOtp(true);
    const resp = await verifyOTP({ mobile_number: phoneNumber, otp: code });
    if (resp?.status === '00') {
      if (!!resp?.userDetails?.vendor_onboarded) {
        dispatch(loginSuccess({ token: resp?.userDetails?.vendorid }));
        if (!!resp?.userDetails?.kyc_verify) {
          navigation.navigate('TemporaryDashboard');
        } else {
          dispatch(setKycStatus('COMPLETED'));
          navigation.navigate('Dashboard');
        }
      } else {
        navigation.navigate('Register', { phoneNumber });
      }
    } else {
      Toast.show({ type: 'error', text1: resp?.message });
    }
    setIsVerifyingOtp(false);
  };

  // -----------------------
  // RESEND OTP
  // -----------------------
  const onResendOtp = async () => {
    const resp = await login({ mobile_number: phoneNumber });
    if (resp?.status === '00') {
      setCountdown(30);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      Toast.show({ type: 'error', text1: resp?.message });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Enter the 4-digit code sent to{'\n'}
        <Text style={styles.phoneNumberText}>
          +91 {formatPhone(phoneNumber)}
        </Text>
      </Text>

      {/* OTP Input Boxes */}
      <View style={styles.otpInputsContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputRefs.current[index] = ref; // FIXED — returns void
            }}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={value => onOtpChange(value, index)}
            onKeyPress={e => onKeyPress(e, index)}
          />
        ))}
      </View>

      {/* VERIFY BUTTON */}
      <TouchableOpacity
        style={[
          styles.button,
          (!isOTPValid(otp) || isVerifyingOtp) && styles.buttonDisabled,
        ]}
        disabled={!isOTPValid(otp) || isVerifyingOtp}
        onPress={onVerifyOtp}
      >
        <Text style={styles.buttonText}>
          {isVerifyingOtp ? 'VERIFYING...' : 'VERIFY & LOGIN'}
        </Text>
      </TouchableOpacity>

      {/* RESEND SECTION */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>

        <TouchableOpacity onPress={onResendOtp} disabled={countdown > 0}>
          <Text
            style={[styles.resendLink, countdown > 0 && styles.resendDisabled]}
          >
            {countdown > 0 ? ` Resend in ${countdown}s` : ' Resend Code'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Change number */}
      <TouchableOpacity
        style={styles.changeNumberButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.changeNumberIcon}>←</Text>
        <Text style={styles.changeNumberText}>Change Number</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;

// -----------------------
// STYLES
// -----------------------
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  instructions: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
  },
  phoneNumberText: {
    fontWeight: '600',
    color: '#2D3748',
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    color: '#2D3748',
  },
  otpInputFilled: {
    borderColor: '#3182ce',
    backgroundColor: '#ebf8ff',
  },
  button: {
    backgroundColor: '#3182CE',
    paddingVertical: 14,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  resendText: {
    color: '#718096',
  },
  resendLink: {
    color: '#3182CE',
    fontWeight: '600',
  },
  resendDisabled: {
    color: '#A0AEC0',
  },
  changeNumberButton: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  changeNumberIcon: {
    color: '#3182CE',
    marginRight: 6,
  },
  changeNumberText: {
    color: '#3182CE',
    fontWeight: '600',
    fontSize: 15,
  },
});

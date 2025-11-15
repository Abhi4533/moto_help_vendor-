import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import SafeContainer from '../../../components/layout/SafeContainer';
import { COLORS } from '../../../config/theme';
import { FooterSection } from './components/FooterSection';
import { HeaderSection } from './components/HeaderSection';
import { LogoSection } from './components/LogoSection';
import OtpScreen from './components/OtpInputSection';
import { styles } from './style';

const OTPVerify = () => {
  const route = useRoute<any>();
  const { phoneNumber } = route?.params || { phoneNumber: '' };

  return (
    <SafeContainer style={{ backgroundColor: COLORS.primary }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LogoSection />
        <View style={styles.card}>
          <HeaderSection />
          <OtpScreen phoneNumber={phoneNumber} />
        </View>
        <FooterSection />
      </ScrollView>
    </SafeContainer>
  );
};

export default OTPVerify;

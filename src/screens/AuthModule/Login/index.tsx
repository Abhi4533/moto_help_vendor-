import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import SafeContainer from '../../../components/layout/SafeContainer';
import { COLORS } from '../../../config/theme';
import { FooterSection } from './components/FooterSection';
import { HeaderSection } from './components/HeaderSection';
import { LogoSection } from './components/LogoSection';
import { PhoneInputSection } from './components/PhoneInputSection';
import { styles } from './style';

const MobileNumberScreen = () => {
  return (
    <SafeContainer style={{ backgroundColor: COLORS.primary }}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LogoSection />
          <View style={styles.card}>
            <HeaderSection />
            <PhoneInputSection />
          </View>
          <FooterSection />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

export default MobileNumberScreen;

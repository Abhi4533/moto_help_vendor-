import React from 'react';
import { ScrollView, View } from 'react-native';
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
    </SafeContainer>
  );
};

export default MobileNumberScreen;

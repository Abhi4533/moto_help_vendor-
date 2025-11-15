// Register.tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Card, ProgressBar, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import SafeContainer from '../../../components/layout/SafeContainer';
import Step1Form from './components/Step1Form';
import Step2Form from './components/Step2Form';
import Step3Form from './components/Step3Form';

import { register } from '../../../api/endpoints/auth.api';
import { COLORS } from '../../../config/theme';
import { initialValues } from './helper';
import { styles } from './styles';
import {
  StepOneSchema,
  StepThreeSchema,
  StepTwoSchema,
} from './validationSchema';

const Register: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { phoneNumber } = route?.params || { phoneNumber: '' };
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);

  const handleSubmit = async (values: any) => {
    console.log({ values });
    const res = await register({
      ...values,
      VendorDetails: {
        ...values?.VendorDetails,
        employee_count: String(values?.VendorDetails?.employee_count),
      },
    });
    console.log({ res });

    if (res?.status === '00') {
    }
  };

  const getValidationSchema = () => {
    switch (step) {
      case 1:
        return StepOneSchema;
      case 2:
        return StepTwoSchema;
      case 3:
        return StepThreeSchema;
      default:
        return StepOneSchema;
    }
  };
  return (
    <SafeContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.root}
        keyboardVerticalOffset={Platform.select({
          android: 20,
          ios: 0,
        })}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Formik
            initialValues={{
              ...initialValues,
              VendorDetails: {
                ...initialValues.VendorDetails,
                mobileNo: phoneNumber,
              },
            }}
            validationSchema={getValidationSchema()}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ handleSubmit, isValid, values }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.header}>
                    <Text style={styles.title}>
                      {step === 1
                        ? 'Vendor Onboarding'
                        : values?.VendorDetails?.companyName?.toUpperCase()}
                    </Text>
                    <Text style={styles.subtitle}>Step {step} of 3</Text>
                  </View>
                  <ProgressBar
                    progress={step / 3}
                    color={COLORS.primary}
                    style={styles.progress}
                  />

                  {step === 1 && <Step1Form />}
                  {step === 2 && <Step2Form />}
                  {step === 3 && <Step3Form />}

                  <View style={styles.buttons}>
                    {step > 1 && (
                      <Button
                        mode="outlined"
                        onPress={() => setStep(s => s - 1)}
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      mode="contained"
                      onPress={() =>
                        step === 3 ? handleSubmit() : setStep(s => s + 1)
                      }
                      // loading={isLoading}
                      // disabled={!isValid}
                    >
                      {step === 3 ? 'Submit' : 'Next'}
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

export default Register;

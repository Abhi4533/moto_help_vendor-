import { updateKyc } from '@api/endpoints/profile.api';
import Input from '@components/common/Input';
import { Formik } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

// Validation Schema
const kycSchema = Yup.object().shape({
  panNo: Yup.string().required('PAN is required'),
});

interface Props {
  visible: boolean;
  onDismiss: () => void;
  vendorId: string;
  initialData?: any; // prefilled KYC
}

const BottomSheetKYCForm: React.FC<Props> = ({
  visible,
  onDismiss,
  vendorId,
  initialData,
}) => {
  const handleSubmitForm = async (values: any) => {
    try {
      const resp = await updateKyc({
        vendorid: vendorId,
        ...values,
      });
      if (resp?.status === '00') {
        Toast.show({
          type: 'success',
          text1: 'KYC Updated Successfully!',
        });
        onDismiss();
      } else {
        Toast.show({
          type: 'error',
          text1: resp?.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed!',
      });
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.bottomSheet}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Text style={styles.title}>Update Vendor KYC</Text>

          <Formik
            enableReinitialize
            initialValues={{
              gstNo: initialData?.gstNo || '',
              cinNo: initialData?.cinNo || '',
              panNo: initialData?.panNo || '',
              aadharNo: initialData?.aadharNo || '',
              cancel_cheque_no: initialData?.cancel_cheque_no || '',
            }}
            validationSchema={kycSchema}
            onSubmit={handleSubmitForm}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <>
                <Input
                  label="GST Number"
                  value={values.gstNo}
                  onChangeText={handleChange('gstNo')}
                  error={touched.gstNo && errors.gstNo}
                />

                <Input
                  label="PAN Number"
                  value={values.panNo}
                  onChangeText={handleChange('panNo')}
                  error={touched.panNo && errors.panNo}
                />

                <Input
                  label="Cancel Cheque Number"
                  value={values.cancel_cheque_no}
                  onChangeText={handleChange('cancel_cheque_no')}
                  error={touched.cancel_cheque_no && errors.cancel_cheque_no}
                />

                <View style={styles.actionRow}>
                  <Button mode="outlined" onPress={onDismiss}>
                    Cancel
                  </Button>

                  <Button mode="contained" onPress={() => handleSubmit()}>
                    Update
                  </Button>
                </View>
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

export default BottomSheetKYCForm;

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

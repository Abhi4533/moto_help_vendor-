import { useGetDesignationListQuery } from '@api/hooks_api';
import Dropdown from '@components/common/Dropdown';
import Input from '@components/common/Input';
import { Formik } from 'formik';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { employeeFormSchema } from './helper';
import { FormModalProps } from './types';

const OTHER_DESIGNATION = 'Other';

const FormModal: React.FC<FormModalProps> = ({
  handleFormSubmit,
  modalVisible,
  currentEmployee,
  isEditMode,
  setModalVisible,
}) => {
  const { data: designationList } = useGetDesignationListQuery();

  return (
    <Modal transparent visible={modalVisible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>
            {isEditMode ? 'Edit Employee' : 'Add Employee'}
          </Text>

          {currentEmployee && (
            <Formik
              initialValues={currentEmployee}
              validationSchema={employeeFormSchema}
              onSubmit={handleFormSubmit}
            >
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <>
                  {/* DESIGNATION */}
                  <Dropdown
                    label="Designation *"
                    data={
                      designationList?.data
                        ? designationList.data
                        : [{ label: 'Other', value: OTHER_DESIGNATION }]
                    }
                    value={values.designation}
                    onChange={v => setFieldValue('designation', v)}
                    error={touched.designation && !!errors.designation}
                    errorMessage={errors?.designation as string}
                  />

                  {values.designation === OTHER_DESIGNATION && (
                    <Input
                      label="Enter Designation *"
                      value={values.customDesignation || ''}
                      onChangeText={text =>
                        setFieldValue('customDesignation', text)
                      }
                      mode="outlined"
                      style={styles.input}
                      error={
                        touched.customDesignation && errors.customDesignation
                      }
                    />
                  )}

                  <Input
                    label="Full Name *"
                    value={values.full_name}
                    onChangeText={handleChange('full_name')}
                    mode="outlined"
                    error={touched.full_name && errors.full_name}
                  />

                  <Input
                    label="Mobile Number *"
                    value={values.contact_no}
                    onChangeText={handleChange('contact_no')}
                    mode="outlined"
                    keyboardType="phone-pad"
                    maxLength={10}
                    error={touched.contact_no && errors.contact_no}
                  />

                  <Input
                    label="Email *"
                    value={values.email_id || ''}
                    onChangeText={handleChange('email_id')}
                    mode="outlined"
                    error={touched.email_id && errors.email_id}
                  />

                  <View style={styles.modalActions}>
                    <Button
                      mode="outlined"
                      onPress={() => setModalVisible(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => {
                        handleSubmit();
                        console.log({ errors });
                      }}
                    >
                      {isEditMode ? 'Update' : 'Save'}
                    </Button>
                  </View>
                </>
              )}
            </Formik>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FormModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  input: { marginBottom: 6 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

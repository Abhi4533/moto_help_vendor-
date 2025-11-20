import { useGetDistrictQuery, useGetStateQuery } from '@api/hooks_api';
import DatePickerField from '@components/common/DatePickerField';
import Dropdown from '@components/common/Dropdown';
import Input from '@components/common/Input';
import Icon from '@react-native-vector-icons/material-design-icons';
import { Formik } from 'formik';
import { FC } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Card, HelperText, Text, TextInput } from 'react-native-paper';

interface AddDriverModalProps {
  setModalVisible: any;
  modalVisible: any;
}

const AddDriverModal: FC<AddDriverModalProps> = ({
  setModalVisible,
  modalVisible,
}) => {
  const { data: stateData, isLoading: stateLoading } = useGetStateQuery();
  const { data: districtData, isLoading: districtLoading } =
    useGetDistrictQuery({
      state: '',
    });
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Driver</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#7f8c8d" />
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={{
              full_name: '',
              Phone: '',
              emergency_phone: '',
              Email: '',
              address1: '',
              address2: '',
              pincode: '',
              state: '',
              City: '',
              Tahsil: '',
              driving_license_no: '',
              driving_license_address: '',
              dob: '',
              expiry_date: '',
              vendorid: '',
              driver_id: '',
              Driver_license_photo: '',
              password: '',
              status: '',
              username: '',
              Driver_photo: '',
            }}
            enableReinitialize={true}
            onSubmit={() => {}}
          >
            {({ values, errors }) => (
              <>
                <ScrollView style={styles.modalBody}>
                  <View style={{ flex: 1 }}>
                    {/* License Information Card */}
                    <Card
                      style={{
                        marginBottom: 12,
                        elevation: 2,
                      }}
                    >
                      <Card.Content
                        style={{
                          paddingVertical: 8,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 12,
                          }}
                        ></View>

                        <View style={{}}>
                          <View
                            style={{
                              flex: 1,
                            }}
                          >
                            <Input
                              label="Driving License Number *"
                              value={values.driving_license_no}
                              mode="outlined"
                              placeholder="DL1420110002341"
                              left={
                                <TextInput.Icon icon="card-account-details" />
                              }
                              autoCapitalize="characters"
                              autoComplete="off"
                            />

                            {/* License Check Status */}
                            <View
                              style={{
                                marginTop: 4,
                              }}
                            ></View>
                          </View>

                          <View style={{ flex: 1 }}>
                            <DatePickerField
                              label="Date of Birth *"
                              value={values.dob}
                              onDateChange={date => {}}
                            />
                          </View>
                        </View>

                        <View
                          style={{
                            marginVertical: 8,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: '#fff3e0',
                              padding: 10,
                              borderRadius: 6,
                              borderLeftWidth: 4,
                              borderLeftColor: '#ff9800',
                            }}
                          >
                            <Text
                              style={{
                                color: '#e65100',
                                fontSize: 13,
                                fontWeight: '500',
                              }}
                            >
                              Fill both fields above to enable validation
                            </Text>
                          </View>

                          <View
                            style={{
                              backgroundColor: '#e8f5e8',
                              padding: 10,
                              borderRadius: 6,
                              borderLeftWidth: 4,
                              borderLeftColor: '#4caf50',
                            }}
                          >
                            <Text
                              style={{
                                color: '#2e7d32',
                                fontSize: 13,
                                fontWeight: '500',
                              }}
                            >
                              Ready to validate license
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            marginVertical: 8,
                          }}
                        >
                          <Button
                            mode="contained"
                            style={[
                              {
                                height: 50,
                              },
                            ]}
                            icon={'check-circle'}
                            contentStyle={{
                              paddingVertical: 4,
                            }}
                          >
                            Validate License
                          </Button>
                        </View>

                        <View
                          style={{
                            marginTop: 16,
                          }}
                        >
                          <View
                            style={{
                              height: 1,
                              backgroundColor: '#e0e0e0',
                              marginVertical: 16,
                            }}
                          />
                          <Text
                            variant="titleSmall"
                            style={{
                              marginBottom: 12,
                              color: '#4CAF50',
                              fontWeight: '600',
                            }}
                          >
                            License Details
                          </Text>

                          <View
                            style={{
                              flexDirection: 'row',
                              gap: 8,
                              marginBottom: 4,
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <DatePickerField
                                label="License Expiry Date *"
                                value={values.expiry_date}
                                onDateChange={() => {}}
                                error={errors.expiry_date}
                                minimumDate={new Date()}
                                editable={true}
                              />
                            </View>

                            <View style={{ flex: 1 }}>
                              {/* {values.dob && ( */}
                              <View
                                style={{
                                  backgroundColor: '#f5f5f5',
                                  padding: 12,
                                  borderRadius: 4,
                                  borderWidth: 1,
                                  borderColor: '#e0e0e0',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: 56,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: '#666',
                                    marginBottom: 2,
                                  }}
                                >
                                  Driver Age
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#2c3e50',
                                  }}
                                >
                                  {(() => {
                                    const dob = new Date(values.dob);
                                    const today = new Date();
                                    let age =
                                      today.getFullYear() - dob.getFullYear();
                                    const monthDiff =
                                      today.getMonth() - dob.getMonth();

                                    if (
                                      monthDiff < 0 ||
                                      (monthDiff === 0 &&
                                        today.getDate() < dob.getDate())
                                    ) {
                                      age--;
                                    }

                                    return `${age} years`;
                                  })()}
                                </Text>
                              </View>
                              {/* )}     */}
                            </View>
                          </View>

                          <TextInput
                            label="License Address *"
                            value={values.driving_license_address}
                            mode="outlined"
                            multiline
                            numberOfLines={2}
                            style={{
                              marginBottom: 8,
                              minHeight: 70,
                            }}
                            placeholder="Address as per driving license"
                            left={<TextInput.Icon icon="map-marker" />}
                            editable={false}
                          />
                          <HelperText type="error">
                            {errors?.driving_license_address}
                          </HelperText>
                        </View>
                      </Card.Content>
                    </Card>

                    {/* Rest of your form components remain the same */}
                    {/* Personal Information Card */}
                    <Card
                      style={{
                        marginBottom: 12,
                        elevation: 2,
                      }}
                    >
                      <Card.Content
                        style={{
                          paddingVertical: 8,
                        }}
                      >
                        <Text
                          variant="titleLarge"
                          style={{
                            color: '#2c3e50',
                            fontWeight: '600',
                            fontSize: 18,
                          }}
                        >
                          Personal Information
                        </Text>

                        <TextInput
                          label="Full Name as Per DL *"
                          value={values.full_name}
                          mode="outlined"
                          style={styles.input}
                          placeholder="John Doe"
                          left={<TextInput.Icon icon="account" />}
                        />

                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <TextInput
                              label="Phone *"
                              value={values.Phone}
                              keyboardType="phone-pad"
                              maxLength={10}
                              mode="outlined"
                              placeholder="1234567890"
                            />
                          </View>

                          <View style={{ flex: 1 }}>
                            <TextInput
                              label="Family Contact *"
                              value={values.emergency_phone}
                              keyboardType="phone-pad"
                              maxLength={10}
                              mode="outlined"
                              placeholder="1234567890"
                            />
                          </View>
                        </View>

                        <TextInput
                          label="Email"
                          value={values.Email}
                          keyboardType="email-address"
                          mode="outlined"
                          style={styles.input}
                          placeholder="john.doe@example.com"
                          left={<TextInput.Icon icon="email" />}
                        />
                      </Card.Content>
                    </Card>

                    {/* Address Information Card */}
                    <Card
                      style={{
                        marginBottom: 12,
                        elevation: 2,
                      }}
                    >
                      <Card.Content
                        style={{
                          paddingVertical: 8,
                        }}
                      >
                        <Text
                          variant="titleLarge"
                          style={{
                            color: '#2c3e50',
                            fontWeight: '600',
                            fontSize: 18,
                          }}
                        >
                          Current Address
                        </Text>

                        <TextInput
                          label="Building, Apartment, Plot Number *"
                          value={values.address1}
                          mode="outlined"
                          style={styles.input}
                          placeholder="Building name/number"
                          left={<TextInput.Icon icon="home" />}
                        />

                        <TextInput
                          label="Area, Street, Sector, Village"
                          value={values.address2}
                          mode="outlined"
                          style={styles.input}
                          placeholder="Area details"
                          left={<TextInput.Icon icon="map-marker" />}
                        />

                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <TextInput
                              label="Pincode *"
                              value={values.pincode}
                              keyboardType="number-pad"
                              maxLength={6}
                              mode="outlined"
                              placeholder="110001"
                              left={<TextInput.Icon icon="map-marker" />}
                            />
                          </View>

                          <View style={{ flex: 1 }}>
                            <TextInput
                              label="Town/Tahsil *"
                              value={values.Tahsil}
                            />
                          </View>
                        </View>

                        <View style={{}}>
                          <View style={{ flex: 1 }}>
                            <View
                              style={{
                                marginBottom: 8,
                                zIndex: 1000,
                              }}
                            >
                              <Dropdown
                                label="State *"
                                data={stateData?.data || []}
                                value={values.state}
                                onChange={val => {}}
                              />
                            </View>
                          </View>

                          <View style={{ flex: 1 }}>
                            <View
                              style={{
                                marginBottom: 8,
                                zIndex: 1000,
                              }}
                            >
                              <Dropdown
                                label="Select District *"
                                data={districtData?.data || []}
                                value={values.City}
                                onChange={val => {}}
                                disabled={stateData?.data?.length === 0}
                              />
                            </View>
                          </View>
                        </View>
                      </Card.Content>
                    </Card>

                    {/* Action Buttons */}
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <Button
                    mode="outlined"
                    onPress={() => setModalVisible(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      // Handle add driver logic here
                      setModalVisible(false);
                    }}
                    style={styles.submitButton}
                  >
                    Add Driver
                  </Button>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

export default AddDriverModal;

const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '95%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#bdc3c7',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#3498db',
  },
});

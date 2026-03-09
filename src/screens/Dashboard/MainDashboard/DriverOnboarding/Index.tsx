import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { IconButton } from 'react-native-paper';
import DriverRegister from './DriverRegister';
import DriverDocument from './DriverDocument';
import { Formik } from 'formik';
import { ScrollView } from 'react-native';

export interface FormValues {
  companyname: string;
  ownername: string;
  mobileno: string;
  address1: string;
  address2: string;
  pincode: string;
  city: string;
  state: string;
  district: string;
  taluka: string;
  licenseNumber?: string;
  aadharNumber?: string;
}

const initialValues: FormValues = {
  companyname: '',
  ownername: '',
  mobileno: '',
  address1: '',
  address2: '',
  pincode: '',
  city: '',
  state: '',
  district: '',
  taluka: '',
  licenseNumber: '',
  aadharNumber: '',
};
const TABS = [
  { key: 'register', label: 'Profile' },
  { key: 'document', label: 'Document' },
];

export default function Index({ navigation }) {
  const [activeTab, setActiveTab] = useState<'register' | 'document'>(
    'register',
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: '#E1E1E1', borderRadius: 10 }}
        />

        <Text style={styles.headerTitle}>Onboard Driver</Text>

        {/* Empty view for spacing */}
        <View style={{ width: 40 }} />
      </View>

      {/* Body */}
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key as 'register' | 'document')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        <Formik
          initialValues={initialValues}
          onSubmit={values => console.log(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <ScrollView showsVerticalScrollIndicator={false}>
                {activeTab === 'register' ? (
                  <DriverRegister
                    values={values}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onSubmit={handleSubmit}
                  />
                ) : (
                  <DriverDocument
                    values={values}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                )}
              </ScrollView>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.Submitbutton}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Validate Driver</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 40,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0D47A1',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },

  activeTab: {
    backgroundColor: '#fff',
  },

  tabText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  activeText: {
    color: '#0D47A1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  Submitbutton: {
    marginTop: 20,
    backgroundColor: '#1C4FA3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

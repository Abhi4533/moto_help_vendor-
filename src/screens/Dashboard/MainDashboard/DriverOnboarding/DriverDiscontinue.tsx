import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { IconButton, TextInput } from 'react-native-paper';
import { Rating } from 'react-native-ratings';

interface FormValues {
  mobileno: string;
  reason: string;
  rating: number;
}
interface Props {
  navigation: any;
}
export default function DriverDiscontinue({ navigation }: Props) {
  const [values, setValues] = useState<FormValues>({
    mobileno: '',
    reason: '',
    rating: 0,
  });

  const handleChange = (field: keyof FormValues, value: string | number) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(values);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        />
        <Text style={styles.title}>Discontinue Driver</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Mobile */}
        <Text style={styles.label}>Driver Mobile Number</Text>
        <TextInput
          label="Mobile Number"
          value={values.mobileno}
          onChangeText={text => handleChange('mobileno', text)}
          keyboardType="phone-pad"
          mode="outlined"
          style={styles.input}
        />

        {/* Reason */}
        <Text style={styles.label}>Reason</Text>
        <TextInput
          label="Enter reason"
          value={values.reason}
          onChangeText={text => handleChange('reason', text)}
          mode="outlined"
          multiline
          numberOfLines={5}
          style={styles.reasonInput}
        />

        {/* Rating */}
        <Text style={styles.label}>Driver Rating</Text>

        <View style={styles.ratingCard}>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={34}
            startingValue={values.rating}
            onFinishRating={(rating: number) => handleChange('rating', rating)}
          />

          <Text style={styles.ratingText}>{values.rating} / 5</Text>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 10,
  },

  backBtn: {
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#0D47A1',
  },

  content: {
    padding: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },

  input: {
    marginBottom: 18,
  },

  reasonInput: {
    marginBottom: 20,
    minHeight: 110,
  },

  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },

  submitButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#1C4FA3',
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
  },

  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

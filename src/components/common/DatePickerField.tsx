import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, TouchableWithoutFeedback, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import Input from './Input';

interface DatePickerFieldProps {
  label: string;
  value: string;
  onDateChange: (date: string) => void;
  error?: string;
  touched?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
  editable?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onDateChange,
  error,
  touched,
  maximumDate,
  minimumDate,
  editable = false,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      onDateChange(formattedDate);

      if (Platform.OS === 'ios') {
        // Keep open for iOS, user will close manually
      }
    }
  };

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const hidePicker = () => {
    setShowDatePicker(false);
  };

  const displayValue = value ? new Date(value).toLocaleDateString() : '';

  // For iOS - use Modal approach for better UX
  if (Platform.OS === 'ios') {
    return (
      <View>
        <TextInput
          label={label}
          value={displayValue}
          mode="outlined"
          style={{ marginBottom: 8 }}
          left={<TextInput.Icon icon="calendar" />}
          right={<TextInput.Icon icon="calendar-range" onPress={showPicker} />}
          onFocus={showPicker}
          showSoftInputOnFocus={false}
          error={!!error && touched}
        />

        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <TouchableWithoutFeedback onPress={hidePicker}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: 'white', padding: 16 }}>
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate}
                    style={{ height: 200 }}
                  />
                  <Button
                    mode="contained"
                    onPress={hidePicker}
                    style={{ marginTop: 16 }}
                  >
                    Done
                  </Button>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <HelperText type="error" visible={!!error && !!touched}>
          {error}
        </HelperText>
      </View>
    );
  }

  // For Android - use default approach
  return (
    <View>
      <Input
        label={label}
        value={displayValue}
        mode="outlined"
        left={<TextInput.Icon icon="calendar" />}
        onFocus={showPicker}
        showSoftInputOnFocus={false}
        error={error}
        onPress={showPicker}
        editable={!editable}
        cursorColor="#fff"
      />

      {showDatePicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

export default DatePickerField;

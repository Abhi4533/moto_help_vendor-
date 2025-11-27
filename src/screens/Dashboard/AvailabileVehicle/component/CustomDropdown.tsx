import { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Card, IconButton, Searchbar, Text } from 'react-native-paper';
import { styles } from '../style';
import { DropdownProps } from '../type';

const CustomDropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onSelect,
  disabled = false,
  placeholder = 'Select an option',
  multiSelect = false,
  selectedValues = [],
  onMultiSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter(
    option =>
      option?.value?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      option?.label?.toLowerCase().includes(searchQuery?.toLowerCase()),
  );

  const displayValue = multiSelect
    ? selectedValues.length > 0
      ? `${selectedValues.length} selected`
      : placeholder
    : value || placeholder;

  const handleSelect = (selectedValue: string) => {
    if (multiSelect && onMultiSelect) {
      const newValues = selectedValues.includes(selectedValue)
        ? selectedValues.filter(v => v !== selectedValue)
        : [...selectedValues, selectedValue];
      onMultiSelect(newValues);
    } else {
      onSelect(selectedValue);
      setModalVisible(false);
    }
  };

  const isSelected = (optionValue: string) => {
    return multiSelect
      ? selectedValues.includes(optionValue)
      : value === optionValue;
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        style={[styles.dropdownTrigger, disabled && styles.dropdownDisabled]}
      >
        <View style={styles.dropdownContent}>
          <Text
            style={[
              styles.dropdownText,
              !value &&
                !(multiSelect && selectedValues.length > 0) &&
                styles.placeholderText,
            ]}
          >
            {displayValue}
          </Text>
          <IconButton
            icon={modalVisible ? 'menu-up' : 'menu-down'}
            size={20}
            iconColor="#6B7280"
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Card.Content>
              <View style={styles.modalHeader}>
                <Text variant="titleMedium">{label}</Text>
                <IconButton
                  icon="close"
                  onPress={() => setModalVisible(false)}
                />
              </View>

              <Searchbar
                placeholder={`Search ${label?.toLowerCase()}...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchBar}
              />

              <ScrollView
                style={styles.dropdownList}
                showsVerticalScrollIndicator={false}
              >
                {filteredOptions.map(option => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => handleSelect(option.value)}
                    style={[
                      styles.dropdownItem,
                      isSelected(option.value) && styles.dropdownItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected(option.value) &&
                          styles.dropdownItemTextSelected,
                      ]}
                    >
                      {option.label || option.value}
                    </Text>
                    {isSelected(option.value) && (
                      <IconButton icon="check" size={20} iconColor="#6366F1" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {multiSelect && (
                <View style={styles.multiSelectActions}>
                  <Button
                    mode="outlined"
                    onPress={() => onMultiSelect && onMultiSelect([])}
                    style={styles.clearButton}
                  >
                    Clear All
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => setModalVisible(false)}
                    style={styles.doneButton}
                  >
                    Done
                  </Button>
                </View>
              )}
            </Card.Content>
          </Card>
        </View>
      </Modal>
    </>
  );
};

export default CustomDropdown;

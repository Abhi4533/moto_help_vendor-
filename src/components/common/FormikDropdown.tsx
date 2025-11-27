import Icon from '@react-native-vector-icons/material-design-icons'; // or your icon library
import { useField } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export interface Item {
  label: string;
  value: string;
}

interface FormikDropdownProps {
  name: string; // Formik field name
  label?: string;
  data: Item[];
  multi?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

const FormikDropdown: React.FC<FormikDropdownProps> = ({
  name,
  label = 'Select',
  data,
  multi = false,
  placeholder = 'Choose an option',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
  disabled = false,
}) => {
  const [field, meta, helpers] = useField(name);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const showError =
    !!meta?.error && (meta?.touched || meta?.form?.submitCount > 0);

  // Initialize selected values from Formik
  useEffect(() => {
    if (field.value) {
      setSelected(Array.isArray(field.value) ? field.value : [field.value]);
    } else {
      setSelected([]);
    }
  }, [field.value]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase().trim()),
    );
  }, [data, search]);

  const handleSelect = (val: string) => {
    if (multi) {
      const newSelected = selected.includes(val)
        ? selected.filter(i => i !== val)
        : [...selected, val];
      setSelected(newSelected);
    } else {
      setSelected([val]);
      helpers.setValue(val);
      helpers.setTouched(true);
      closeModal();
    }
  };

  const closeModal = () => {
    setVisible(false);
    setSearch('');
  };

  const handleDone = () => {
    helpers.setValue(multi ? selected : selected[0] || '');
    helpers.setTouched(true);
    closeModal();
  };

  const displayLabel = useMemo(() => {
    if (selected.length === 0) return placeholder;

    if (multi) {
      const labels = selected
        .map(v => data.find(i => i.value === v)?.label)
        .filter(Boolean);
      return labels.join(', ') || placeholder;
    }

    return data.find(i => i.value === selected[0])?.label || placeholder;
  }, [selected, data, multi, placeholder]);

  const renderItem = ({ item }: { item: Item }) => {
    const isSelected = selected.includes(item.value);
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => handleSelect(item.value)}
      >
        <Text style={styles.itemLabel}>{item.label}</Text>
        {isSelected && <Icon name="check" size={20} color="#1976D2" />}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => !disabled && setVisible(true)}
        disabled={disabled}
      >
        <View pointerEvents="none">
          <TextInput
            label={label}
            mode="outlined"
            value={displayLabel}
            editable={false}
            error={showError}
            style={[styles.input, showError && styles.inputError]}
            right={
              <TextInput.Icon
                icon={visible ? 'chevron-up' : 'chevron-down'}
                color={showError ? '#D32F2F' : '#000'}
              />
            }
          />
        </View>
      </TouchableOpacity>

      {showError && <Text style={styles.errorText}>{meta.error}</Text>}

      <Modal visible={visible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{label}</Text>
            <View style={styles.headerActions}>
              {multi && selected.length > 0 && (
                <Button
                  onPress={() => setSelected([])}
                  mode="text"
                  textColor="#666"
                >
                  Clear
                </Button>
              )}
              {multi ? (
                <Button onPress={handleDone} mode="contained" compact>
                  Done ({selected.length})
                </Button>
              ) : (
                <Button onPress={closeModal} mode="text">
                  Cancel
                </Button>
              )}
            </View>
          </View>

          <RNTextInput
            placeholder={searchPlaceholder}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#888"
          />

          <FlatList
            data={filteredData}
            keyExtractor={item => item.value}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            )}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          />
        </View>
      </Modal>
    </>
  );
};

export default FormikDropdown;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000060',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#333' },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSelected: {
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  itemLabel: { fontSize: 16, color: '#333', flex: 1 },
  input: { backgroundColor: '#fff' },
  inputError: { borderColor: '#D32F2F' },
  errorText: { color: '#D32F2F', fontSize: 12, marginTop: 4, marginLeft: 4 },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
});

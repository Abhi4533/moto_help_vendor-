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
import { Button, Icon, TextInput } from 'react-native-paper';

export interface Item {
  label: string;
  value: string;
}

export interface Props {
  label?: string;
  data: Item[];
  multi?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;

  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;

  disabled?: boolean;

  // NEW ↓↓↓
  error?: boolean;
  errorMessage?: string;
}

const Dropdown: React.FC<Props> = ({
  label = 'Select',
  data,
  multi = false,
  value,
  onChange,
  placeholder = 'Choose an option',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
  disabled = false,
  error = false,
  errorMessage = '',
}) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  /** -------------------------------
   * INIT SELECTED FROM PROPS
   -------------------------------- */
  useEffect(() => {
    if (value) {
      setSelected(Array.isArray(value) ? value : [value]);
    } else {
      setSelected([]);
    }
  }, [value]);

  /** -------------------------------
   * FILTERED LIST
   -------------------------------- */
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase().trim()),
    );
  }, [data, search]);

  /** -------------------------------
   * ON ITEM SELECT
   -------------------------------- */
  const handleSelect = (val: string) => {
    if (multi) {
      const newSelected = selected.includes(val)
        ? selected.filter(i => i !== val)
        : [...selected, val];

      setSelected(newSelected);
    } else {
      setSelected([val]);
      onChange(val);
      closeModal();
    }
  };

  const closeModal = () => {
    setVisible(false);
    setSearch('');
  };

  const handleDone = () => {
    onChange(multi ? selected : selected[0] || '');
    closeModal();
  };

  const handleClear = () => {
    setSelected([]);
    if (!multi) {
      onChange('');
    }
  };

  /** -------------------------------
   * DISPLAY LABEL
   -------------------------------- */
  const displayLabel = useMemo(() => {
    if (selected.length === 0) return placeholder;

    if (multi) {
      const labels = selected
        .map(
          v =>
            data.find(
              i => i.value?.toLocaleLowerCase() === v?.toLocaleLowerCase(),
            )?.label,
        )
        .filter(Boolean);

      return labels.join(', ') || placeholder;
    }

    return data.find(i => i.value === selected[0])?.label || placeholder;
  }, [selected, data, multi, placeholder]);

  /** -------------------------------
   * LIST ITEM
   -------------------------------- */
  const renderItem = ({ item }: { item: Item }) => {
    const isSelected = selected.includes(item.value);

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => handleSelect(item.value)}
      >
        <Text style={styles.itemLabel}>{item.label}</Text>
        {isSelected && <Icon source="check" size={20} color="#1976D2" />}
      </TouchableOpacity>
    );
  };

  /** -------------------------------
   * EMPTY LIST
   -------------------------------- */
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  /** ===================================
   *  RETURN COMPONENT
   * ================================== */
  return (
    <>
      {/* Input (Opens Modal) */}
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
            error={error} // 👈 Paper error styling
            right={
              <TextInput.Icon
                icon={({ size, color }) => (
                  <View style={styles.rightIconsContainer}>
                    <Icon
                      source={visible ? 'chevron-up' : 'chevron-down'}
                      size={size}
                      color={error ? '#D32F2F' : color}
                    />
                  </View>
                )}
              />
            }
            style={[styles.input, error && styles.inputError]}
          />
        </View>
      </TouchableOpacity>

      {/* 🔥 FULL ERROR MESSAGE UNDER INPUT */}
      {error && !!errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {/* MODAL SHEET */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{label}</Text>

            <View style={styles.headerActions}>
              {multi && selected.length > 0 && (
                <Button onPress={handleClear} mode="text" textColor="#666">
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

          {/* SEARCH */}
          <RNTextInput
            placeholder={searchPlaceholder}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#888"
            autoCorrect={false}
            autoCapitalize="none"
          />

          {/* LIST */}
          <FlatList
            data={filteredData}
            keyExtractor={item => item.value}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyComponent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          />
        </View>
      </Modal>
    </>
  );
};

export default Dropdown;

export const styles = StyleSheet.create({
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
    shadowOffset: {
      width: 0,
      height: -2,
    },
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 12,
    fontSize: 16,
    color: '#000',
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
  itemLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
  },

  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginLeft: 4,
    marginTop: 2,
  },

  inputError: {
    borderColor: '#D32F2F',
  },

  inputDisabled: {
    opacity: 0.6,
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearIcon: {
    padding: 2,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

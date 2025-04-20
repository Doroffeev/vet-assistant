// src/components/SelectField.tsx - Поле выбора из списка
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  label: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  zIndex?: number;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Выберите значение',
  required = false,
  disabled = false,
  zIndex = 1,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(options);

  return (
    <View style={[styles.container, { zIndex }]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={{ color: theme.colors.error }}> *</Text>}
      </Text>
      
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const newValue = callback(value as any);
          onChange(newValue);
        }}
        setItems={setItems}
        placeholder={placeholder}
        style={[
          styles.dropdown,
          error ? { borderColor: theme.colors.error } : null,
          disabled ? { backgroundColor: '#F5F5F5', opacity: 0.7 } : null
        ]}
        dropDownContainerStyle={styles.dropDownContainer}
        textStyle={styles.dropdownText}
        placeholderStyle={styles.placeholderText}
        disabledStyle={{ opacity: 0.6 }}
        disabled={disabled}
        listMode="SCROLLVIEW"
        autoScroll
        closeAfterSelecting
      />
      
      {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  dropdown: {
    borderColor: '#BDBDBD',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  dropDownContainer: {
    borderColor: '#BDBDBD',
  },
  dropdownText: {
    fontSize: 16,
    color: '#212121',
  },
  placeholderText: {
    color: '#9E9E9E',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default SelectField;


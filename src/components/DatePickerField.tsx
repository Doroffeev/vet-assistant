// src/components/DatePickerField.tsx - Поле выбора даты
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MaterialIcons } from '@expo/vector-icons';

interface DatePickerFieldProps {
  label: string;
  value: string | null;
  onChange: (date: string | null) => void;
  error?: string;
  mode?: 'date' | 'time' | 'datetime';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  error,
  mode = 'date',
  placeholder = 'Выберите дату',
  required = false,
  disabled = false,
}) => {
  const theme = useTheme();
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = () => {
    if (!disabled) {
      setPickerVisible(true);
    }
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    hidePicker();
    const formattedDate = format(date, 'yyyy-MM-dd');
    onChange(formattedDate);
  };

  const clearDate = () => {
    onChange(null);
  };

  const displayValue = value
    ? format(parse(value, 'yyyy-MM-dd', new Date()), 'dd.MM.yyyy', { locale: ru })
    : '';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={{ color: theme.colors.error }}> *</Text>}
      </Text>
      
      <View style={[
        styles.inputContainer,
        error ? { borderColor: theme.colors.error } : null,
        disabled ? { backgroundColor: '#F5F5F5' } : null
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={displayValue}
          editable={false}
          onTouchStart={showPicker}
        />
        
        <View style={styles.iconContainer}>
          {value && !disabled && (
            <TouchableOpacity onPress={clearDate} style={styles.clearButton}>
              <MaterialIcons name="close" size={20} color="#757575" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={showPicker} disabled={disabled}>
            <MaterialIcons name="calendar-today" size={20} color={disabled ? '#9E9E9E' : theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
      
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        date={value ? parse(value, 'yyyy-MM-dd', new Date()) : new Date()}
        locale="ru"
        confirmTextIOS="Выбрать"
        cancelTextIOS="Отмена"
      />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  clearButton: {
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default DatePickerField;

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

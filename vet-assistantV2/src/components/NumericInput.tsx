// src/components/NumericInput.tsx - Поле для ввода чисел
import React from 'react';
import { View, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface NumericInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  decimal?: boolean;
  min?: number;
  max?: number;
  suffix?: string;
}

const NumericInput: React.FC<NumericInputProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = '',
  required = false,
  disabled = false,
  decimal = false,
  min,
  max,
  suffix,
}) => {
  const theme = useTheme();

  const handleChange = (text: string) => {
    // Разрешаем только цифры и точку для десятичных
    const regex = decimal ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
    if (text === '' || regex.test(text)) {
      onChange(text);
    }
  };

  const handleBlur = () => {
    if (value === '') return;

    const numericValue = parseFloat(value);
    
    if (min !== undefined && numericValue < min) {
      onChange(min.toString());
    } else if (max !== undefined && numericValue > max) {
      onChange(max.toString());
    }
  };

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
        <RNTextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
          editable={!disabled}
        />
        
        {suffix && (
          <Text style={styles.suffix}>{suffix}</Text>
        )}
      </View>
      
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
  suffix: {
    paddingRight: 12,
    color: '#757575',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default NumericInput;
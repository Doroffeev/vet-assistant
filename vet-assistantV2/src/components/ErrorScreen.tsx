// src/components/ErrorScreen.tsx - Компонент ошибки
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ 
  message = 'Что-то пошло не так...', 
  onRetry 
}) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="error-outline" size={64} color="#D32F2F" />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title="Повторить"
          onPress={onRetry}
          color="#2196F3"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  message: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
  },
});

export default ErrorScreen;
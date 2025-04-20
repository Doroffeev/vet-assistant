// src/components/EmptyListMessage.tsx - Компонент пустого списка
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface EmptyListMessageProps {
  message: string;
  icon?: string;
}

const EmptyListMessage: React.FC<EmptyListMessageProps> = ({ 
  message, 
  icon = 'info-outline'
}) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name={icon as any} size={48} color="#9E9E9E" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default EmptyListMessage;
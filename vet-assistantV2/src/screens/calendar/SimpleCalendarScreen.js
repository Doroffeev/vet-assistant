// src/screens/calendar/SimpleCalendarScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDatabase } from '../../context/DatabaseContext'; // Исправленный путь

const SimpleCalendarScreen = () => {
  const { isDbReady } = useDatabase();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Календарь операций</Text>
      <Text style={styles.subtitle}>
        Статус БД: {isDbReady ? 'Готова' : 'Инициализация...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
});

export default SimpleCalendarScreen;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useDatabase } from '../../context/DatabaseContext';

const SimpleExportScreen = () => {
  const { isDbReady } = useDatabase();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Экспорт данных</Text>
      <Text style={styles.subtitle}>
        Статус БД: {isDbReady ? 'Готова' : 'Инициализация...'}
      </Text>
      <Button 
        mode="contained" 
        style={styles.button}
        onPress={() => alert('Экспорт данных')}
        disabled={!isDbReady}
      >
        Экспорт животных
      </Button>
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
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default SimpleExportScreen;
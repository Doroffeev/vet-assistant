import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Switch } from 'react-native';
import { Text, Card, List, Divider, Button } from 'react-native-paper';
import { useDatabase } from '../../context/DatabaseContext';

const SettingsScreen = () => {
  const { isDbReady } = useDatabase();
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  
  const resetDatabase = async () => {
    Alert.alert('Информация', 'Эта функция будет доступна в следующей версии');
  };
  
  const handleDarkModeToggle = (value) => {
    setDarkMode(value);
    Alert.alert('Информация', 'Настройка тёмной темы будет доступна в следующей версии');
  };
  
  const handleAutoBackupToggle = (value) => {
    setAutoBackup(value);
    Alert.alert('Информация', 'Настройка автоматического резервного копирования будет доступна в следующей версии');
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Статус приложения</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>База данных:</Text>
            <Text style={[
              styles.statusValue, 
              { color: isDbReady ? '#4CAF50' : '#F44336' }
            ]}>
              {isDbReady ? 'Готова' : 'Инициализация...'}
            </Text>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Настройки приложения</Text>
          
          <List.Section>
            <List.Item
              title="Тёмная тема"
              description="Включить тёмную тему оформления"
              left={props => <List.Icon {...props} icon="brightness-4" />}
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={handleDarkModeToggle}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Автоматическое резервное копирование"
              description="Создавать резервную копию при выходе"
              left={props => <List.Icon {...props} icon="backup-restore" />}
              right={() => (
                <Switch
                  value={autoBackup}
                  onValueChange={handleAutoBackupToggle}
                />
              )}
            />
          </List.Section>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Данные приложения</Text>
          
          <List.Section>
            <List.Item
              title="Экспорт базы данных"
              description="Сохранить копию базы данных"
              left={props => <List.Icon {...props} icon="database-export" />}
              onPress={() => Alert.alert('Информация', 'Эта функция будет доступна в следующей версии')}
            />
            <Divider />
            <List.Item
              title="Импорт базы данных"
              description="Восстановить из резервной копии"
              left={props => <List.Icon {...props} icon="database-import" />}
              onPress={() => Alert.alert('Информация', 'Эта функция будет доступна в следующей версии')}
            />
          </List.Section>
          
          <Button
            mode="contained"
            buttonColor="#D32F2F"
            onPress={resetDatabase}
            style={styles.resetButton}
          >
            Сбросить базу данных
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>О приложении</Text>
          
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>Ветеринарный ассистент</Text>
            <Text style={styles.appVersion}>Версия 1.0.0</Text>
            <Text style={styles.appDescription}>
              Приложение для ветеринаров с поддержкой офлайн-режима работы.
              Позволяет вести учет животных, ветеринарных операций и использовать справочники.
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#424242',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
    color: '#616161',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 16,
  },
  aboutContainer: {
    alignItems: 'center',
    padding: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#212121',
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 16,
    color: '#757575',
  },
  appDescription: {
    fontSize: 14,
    color: '#616161',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SettingsScreen;
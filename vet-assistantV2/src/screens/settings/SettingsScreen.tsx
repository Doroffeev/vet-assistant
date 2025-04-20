// src/screens/settings/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Switch } from 'react-native';
import { Text, Card, List, Divider, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDatabase } from '../../context/DatabaseContext';
import { initDatabase } from '../../database/DatabaseService';
import { APP_NAME } from '../../constants/appConstants';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const SettingsScreen: React.FC = () => {
  const { refreshDb } = useDatabase();
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  
  const resetDatabase = async () => {
    try {
      // Здесь можно добавить код для сброса базы данных
      // Например, удаление всех таблиц и их пересоздание
      
      // Пересоздаем базу данных
      await initDatabase();
      
      // Обновляем контекст базы данных
      refreshDb();
      
      Alert.alert('Успех', 'База данных успешно сброшена');
    } catch (error) {
      console.error('Reset database error:', error);
      Alert.alert('Ошибка', 'Не удалось сбросить базу данных');
    }
  };
  
  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    // Здесь можно сохранить настройку в AsyncStorage
    AsyncStorage.setItem('darkMode', value ? '1' : '0');
  };
  
  const handleAutoBackupToggle = (value: boolean) => {
    setAutoBackup(value);
    // Здесь можно сохранить настройку в AsyncStorage
    AsyncStorage.setItem('autoBackup', value ? '1' : '0');
  };
  
  return (
    <ScrollView style={styles.container}>
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
            onPress={() => setConfirmResetVisible(true)}
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
            <Text style={styles.appName}>{APP_NAME}</Text>
            <Text style={styles.appVersion}>Версия 1.0.0</Text>
            <Text style={styles.appDescription}>
              Приложение для ветеринаров с поддержкой офлайн-режима работы.
              Позволяет вести учет животных, ветеринарных операций и использовать справочники.
            </Text>
          </View>
        </Card.Content>
      </Card>
      
      <ConfirmationDialog
        visible={confirmResetVisible}
        title="Сброс базы данных"
        message="Вы уверены, что хотите сбросить базу данных? Все данные будут удалены. Это действие нельзя будет отменить."
        confirmText="Сбросить"
        cancelText="Отмена"
        onConfirm={() => {
          setConfirmResetVisible(false);
          resetDatabase();
        }}
        onCancel={() => setConfirmResetVisible(false)}
        destructive
      />
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
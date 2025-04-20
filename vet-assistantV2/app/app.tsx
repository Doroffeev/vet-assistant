import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/styles/theme';

// Создаем мок DatabaseContext
const DatabaseContext = createContext({ isDbReady: true, refreshDb: () => {} });
export const useDatabase = () => useContext(DatabaseContext);

// Простой мок DatabaseProvider
const DatabaseProvider = ({ children }) => {
  const [isDbReady] = useState(true); // Всегда готова
  const refreshDb = () => console.log('Mock refresh');
  
  return (
    <DatabaseContext.Provider value={{ isDbReady, refreshDb }}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Простые экраны, которые используют контекст БД
const HomeScreen = () => {
  const { isDbReady } = useDatabase();
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Домашний экран с DatabaseProvider</Text>
      <Text>Статус БД: {isDbReady ? 'Готова' : 'Инициализация'}</Text>
    </View>
  );
};

const SettingsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Экран настроек</Text>
  </View>
);

// Создаем навигатор
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <DatabaseProvider>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </DatabaseProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
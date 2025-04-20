// App.tsx - со всеми обновленными компонентами
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { DefaultTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

// Импорт контекста базы данных из отдельного файла
import { DatabaseProvider } from './src/context/DatabaseContext';

// Импорт упрощенных экранов
import SimpleAnimalListScreen from './src/screens/animals/SimpleAnimalListScreen';
import SimpleCalendarScreen from './src/screens/calendar/SimpleCalendarScreen';
import SimpleExportScreen from './src/screens/export/SimpleExportScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import DirectoriesScreen from './src/screens/directories/DirectoriesScreen';

// Простая тема
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
  },
};

// Создаем стеки навигации
const AnimalStack = createNativeStackNavigator();
const CalendarStack = createNativeStackNavigator();
const DirectoriesStack = createNativeStackNavigator();
const ExportStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const AnimalStackNavigator = () => (
  <AnimalStack.Navigator>
    <AnimalStack.Screen 
      name="AnimalList" 
      component={SimpleAnimalListScreen} 
      options={{ title: 'Животные' }} 
    />
  </AnimalStack.Navigator>
);

const CalendarStackNavigator = () => (
  <CalendarStack.Navigator>
    <CalendarStack.Screen 
      name="Calendar" 
      component={SimpleCalendarScreen} 
      options={{ title: 'Календарь' }} 
    />
  </CalendarStack.Navigator>
);

const DirectoriesStackNavigator = () => (
  <DirectoriesStack.Navigator>
    <DirectoriesStack.Screen 
      name="Directories" 
      component={DirectoriesScreen} 
      options={{ title: 'Справочники' }} 
    />
  </DirectoriesStack.Navigator>
);

const ExportStackNavigator = () => (
  <ExportStack.Navigator>
    <ExportStack.Screen 
      name="Export" 
      component={SimpleExportScreen} 
      options={{ title: 'Экспорт' }} 
    />
  </ExportStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{ title: 'Настройки' }} 
    />
  </SettingsStack.Navigator>
);

// Нижняя навигация
const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        headerShown: false
      }}
    >
      <Tab.Screen 
        name="Animals" 
        component={AnimalStackNavigator} 
        options={{
          tabBarLabel: 'Животные',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="pets" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarStackNavigator} 
        options={{
          tabBarLabel: 'Календарь',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Directories" 
        component={DirectoriesStackNavigator} 
        options={{
          tabBarLabel: 'Справочники',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu-book" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Export" 
        component={ExportStackNavigator} 
        options={{
          tabBarLabel: 'Экспорт',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="cloud-download" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStackNavigator} 
        options={{
          tabBarLabel: 'Настройки',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <DatabaseProvider>
          <NavigationContainer>
            <MainNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </DatabaseProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
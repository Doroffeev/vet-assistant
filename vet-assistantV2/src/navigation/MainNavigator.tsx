// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDatabase } from '../context/DatabaseContext';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SimpleAnimalListScreen from '../screens/animals/SimpleAnimalListScreen';

// Компонент для отображения статуса БД на заглушках
const StatusDisplay = ({ screenName }) => {
  const { isDbReady } = useDatabase();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>{screenName}</Text>
      <View style={{ 
        padding: 10, 
        backgroundColor: isDbReady ? '#d4edda' : '#f8d7da',
        borderRadius: 5
      }}>
        <Text>Статус БД: {isDbReady ? 'Готова' : 'Инициализация...'}</Text>
      </View>
    </View>
  );
};

// Заглушки для экранов
const AnimalListScreen = () => <StatusDisplay screenName="Список животных" />;
const AnimalDetailScreen = () => <StatusDisplay screenName="Детали животного" />;
const AnimalFormScreen = () => <StatusDisplay screenName="Форма животного" />;
const CalendarScreen = () => <StatusDisplay screenName="Календарь" />;
const DirectoriesScreen = () => <StatusDisplay screenName="Справочники" />;
const ExportScreen = () => <StatusDisplay screenName="Экспорт" />;
const SettingsScreen = () => <StatusDisplay screenName="Настройки" />;

// Навигационные стеки
const AnimalStack = createNativeStackNavigator();
const CalendarStack = createNativeStackNavigator();
const DirectoriesStack = createNativeStackNavigator();
const ExportStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

// Стеки навигации
const AnimalStackNavigator = () => (
  <AnimalStack.Navigator>
    <AnimalStack.Screen name="AnimalList" component={SimpleAnimalListScreen} options={{ title: 'Животные' }} />
    <AnimalStack.Screen name="AnimalDetail" component={AnimalDetailScreen} options={{ title: 'Детали животного' }} />
    <AnimalStack.Screen name="AnimalForm" component={AnimalFormScreen} options={{ title: 'Добавление/редактирование' }} />
  </AnimalStack.Navigator>
);

const CalendarStackNavigator = () => (
  <CalendarStack.Navigator>
    <CalendarStack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Календарь' }} />
  </CalendarStack.Navigator>
);

const DirectoriesStackNavigator = () => (
  <DirectoriesStack.Navigator>
    <DirectoriesStack.Screen name="Directories" component={DirectoriesScreen} options={{ title: 'Справочники' }} />
  </DirectoriesStack.Navigator>
);

const ExportStackNavigator = () => (
  <ExportStack.Navigator>
    <ExportStack.Screen name="Export" component={ExportScreen} options={{ title: 'Экспорт' }} />
  </ExportStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Настройки' }} />
  </SettingsStack.Navigator>
);

// Главный навигатор
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

export default MainNavigator;
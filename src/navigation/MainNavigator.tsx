// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useDatabase } from '../context/DatabaseContext';

// Импорт экранов животных
import AnimalListScreen from '../screens/animals/AnimalListScreen';
import AnimalDetailScreen from '../screens/animals/AnimalDetailScreen';
import AnimalFormScreen from '../screens/animals/AnimalFormScreen';
import OperationDetailScreen from '../screens/operations/OperationDetailScreen';
import OperationFormScreen from '../screens/operations/OperationFormScreen';

// Импорт экрана календаря
import CalendarScreen from '../screens/calendar/CalendarScreen';

// Импорт экранов справочников
import DirectoriesScreen from '../screens/directories/DirectoriesScreen';
import BullListScreen from '../screens/directories/BullListScreen';
import BullFormScreen from '../screens/directories/BullFormScreen';
import DiseaseListScreen from '../screens/directories/DiseaseListScreen';
import DiseaseFormScreen from '../screens/directories/DiseaseFormScreen';
import ExecutorListScreen from '../screens/directories/ExecutorListScreen';
import ExecutorFormScreen from '../screens/directories/ExecutorFormScreen';
import MedicineListScreen from '../screens/directories/MedicineListScreen';
import MedicineFormScreen from '../screens/directories/MedicineFormScreen';
import VaccineListScreen from '../screens/directories/VaccineListScreen';
import VaccineFormScreen from '../screens/directories/VaccineFormScreen';

// Импорт экрана экспорта
import ExportScreen from '../screens/export/ExportScreen';

// Импорт экрана настроек
import SettingsScreen from '../screens/settings/SettingsScreen';

// Типы для навигации
export type AnimalStackParamList = {
  AnimalList: undefined;
  AnimalDetail: { animalId: number };
  AnimalForm: { animalId?: number };
  OperationDetail: { operationId: number };
  OperationForm: { operationId?: number; animalId?: number; date?: string };
};

export type CalendarStackParamList = {
  Calendar: undefined;
  OperationDetail: { operationId: number };
  OperationForm: { operationId?: number; date?: string };
  AnimalDetail: { animalId: number };
};

export type DirectoriesStackParamList = {
  Directories: undefined;
  BullList: undefined;
  BullForm: { bullId?: number };
  DiseaseList: undefined;
  DiseaseForm: { diseaseId?: number };
  ExecutorList: undefined;
  ExecutorForm: { executorId?: number };
  MedicineList: undefined;
  MedicineForm: { medicineId?: number };
  VaccineList: undefined;
  VaccineForm: { vaccineId?: number };
};

export type ExportStackParamList = {
  Export: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
};

// Создаем стеки навигации
const AnimalStack = createNativeStackNavigator<AnimalStackParamList>();
const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();
const DirectoriesStack = createNativeStackNavigator<DirectoriesStackParamList>();
const ExportStack = createNativeStackNavigator<ExportStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

// Стеки навигации
const AnimalStackNavigator = () => (
  <AnimalStack.Navigator>
    <AnimalStack.Screen 
      name="AnimalList" 
      component={AnimalListScreen} 
      options={{ title: 'Животные' }} 
    />
    <AnimalStack.Screen 
      name="AnimalDetail" 
      component={AnimalDetailScreen} 
      options={{ title: 'Карточка животного' }} 
    />
    <AnimalStack.Screen 
      name="AnimalForm" 
      component={AnimalFormScreen} 
      options={({ route }) => ({ 
        title: route.params?.animalId ? 'Редактирование животного' : 'Добавление животного' 
      })} 
    />
    <AnimalStack.Screen 
      name="OperationDetail" 
      component={OperationDetailScreen} 
      options={{ title: 'Операция' }} 
    />
    <AnimalStack.Screen 
      name="OperationForm" 
      component={OperationFormScreen} 
      options={({ route }) => ({ 
        title: route.params?.operationId ? 'Редактирование операции' : 'Добавление операции' 
      })} 
    />
  </AnimalStack.Navigator>
);

const CalendarStackNavigator = () => (
  <CalendarStack.Navigator>
    <CalendarStack.Screen 
      name="Calendar" 
      component={CalendarScreen} 
      options={{ title: 'Календарь' }} 
    />
    <CalendarStack.Screen 
      name="OperationDetail" 
      component={OperationDetailScreen} 
      options={{ title: 'Операция' }} 
    />
    <CalendarStack.Screen 
      name="OperationForm" 
      component={OperationFormScreen} 
      options={({ route }) => ({ 
        title: route.params?.operationId ? 'Редактирование операции' : 'Добавление операции' 
      })} 
    />
    <CalendarStack.Screen 
      name="AnimalDetail" 
      component={AnimalDetailScreen} 
      options={{ title: 'Карточка животного' }} 
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
    
    {/* Bulls */}
    <DirectoriesStack.Screen 
      name="BullList" 
      component={BullListScreen} 
      options={{ title: 'Быки' }} 
    />
    <DirectoriesStack.Screen 
      name="BullForm" 
      component={BullFormScreen} 
      options={({ route }) => ({ 
        title: route.params?.bullId ? 'Редактирование быка' : 'Добавление быка' 
      })} 
    />
    
    {/* Diseases */}
    <DirectoriesStack.Screen 
      name="DiseaseList" 
      component={DiseaseListScreen} 
      options={{ title: 'Заболевания' }} 
    />
    <DirectoriesStack.Screen 
      name="DiseaseForm" 
      component={DiseaseFormScreen} 
      options={({ route }) => ({ 
        title: route.params?.diseaseId ? 'Редактирование заболевания' : 'Добавление заболевания' 
      })} 
    />
    
    {/* Executors */}
    <DirectoriesStack.Screen 
      name="ExecutorList" 
      component={ExecutorListScreen} 
      options={{ title: 'Исполнители' }} 
    />
    <DirectoriesStack.Screen 
      name="ExecutorForm" 
      component={ExecutorFormScreen} 
      options={({ route }) => ({ 
        title: route.params?.executorId ? 'Редактирование исполнителя' : 'Добавление исполнителя' 
      })} 
    />
    
    {/* Medicines */}
    <DirectoriesStack.Screen 
      name="MedicineList" 
      component={MedicineListScreen} 
      options={{ title: 'Лекарства' }} 
    />
    <DirectoriesStack.Screen 
      name="MedicineForm" 
      component={MedicineFormScreen} 
      options={({ route }) => ({ 
        title: route.params?.medicineId ? 'Редактирование лекарства' : 'Добавление лекарства' 
      })} 
    />
    
    {/* Vaccines */}
    <DirectoriesStack.Screen 
      name="VaccineList" 
      component={VaccineListScreen} 
      options={{ title: 'Вакцины' }} 
    />
    <DirectoriesStack.Screen 
      name="VaccineForm" 
      component={VaccineFormScreen} 
      options={({ route }) => ({ 
        title: route.params?.vaccineId ? 'Редактирование вакцины' : 'Добавление вакцины' 
      })} 
    />
  </DirectoriesStack.Navigator>
);

const ExportStackNavigator = () => (
  <ExportStack.Navigator>
    <ExportStack.Screen 
      name="Export" 
      component={ExportScreen} 
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

// Главный навигатор с вкладками
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
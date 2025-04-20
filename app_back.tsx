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

// Импорт основных экранов
import SimpleAnimalListScreen from './src/screens/animals/SimpleAnimalListScreen';
import SimpleCalendarScreen from './src/screens/calendar/SimpleCalendarScreen';
import SimpleExportScreen from './src/screens/export/SimpleExportScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import DirectoriesScreen from './src/screens/directories/DirectoriesScreen';
import AnimalDetailScreen from './src/screens/animals/AnimalDetailScreen';
import AnimalFormScreen from './src/screens/animals/AnimalFormScreen';
import AnimalAddScreen from './src/screens/animals/AnimalAddScreen';
import OperationDetailScreen from './src/screens/operations/OperationDetailScreen';
import OperationFormScreen from './src/screens/operations/OperationFormScreen';

// Импорт экранов справочников
import BullListScreen from './src/screens/directories/BullListScreen';
import BullFormScreen from './src/screens/directories/BullFormScreen';
import DiseaseListScreen from './src/screens/directories/DiseaseListScreen';
import DiseaseFormScreen from './src/screens/directories/DiseaseFormScreen';
import ExecutorListScreen from './src/screens/directories/ExecutorListScreen';
import ExecutorFormScreen from './src/screens/directories/ExecutorFormScreen';
import MedicineListScreen from './src/screens/directories/MedicineListScreen';
import MedicineFormScreen from './src/screens/directories/MedicineFormScreen';
import VaccineListScreen from './src/screens/directories/VaccineListScreen';
import VaccineFormScreen from './src/screens/directories/VaccineFormScreen';

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
    <AnimalStack.Screen 
      name="AnimalDetail" 
      component={AnimalDetailScreen} 
      options={{ title: 'Карточка животного' }} 
    />
    <AnimalStack.Screen 
      name="AnimalAdd" 
      component={AnimalAddScreen} 
      options={{ title: 'Добавление животного' }} 
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
      component={SimpleCalendarScreen} 
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
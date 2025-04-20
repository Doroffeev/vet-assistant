// src/screens/calendar/CalendarScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, FAB, Divider } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, parseISO, startOfMonth, endOfMonth, isEqual } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Operation, Animal } from '../../types';
import { getOperationsByDateRange } from '../../database/repositories/OperationRepository';
import { getAnimalById } from '../../database/repositories/AnimalRepository';
import { CalendarStackParamList } from '../../navigation/MainNavigator';
import EmptyListMessage from '../../components/EmptyListMessage';
import CalendarHeader from './CalendarHeader';
import CalendarOperationItem from './CalendarOperationItem';

type CalendarScreenNavigationProp = NativeStackNavigationProp<CalendarStackParamList, 'Calendar'>;

export type OperationWithAnimal = Operation & {
  animalNumber?: string;
  animalType?: string;
};

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [operations, setOperations] = useState<OperationWithAnimal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOperationType, setSelectedOperationType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined);
  
  const loadOperations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let startDate: string;
      let endDate: string;
      
      if (viewMode === 'day') {
        startDate = format(selectedDate, 'yyyy-MM-dd');
        endDate = format(selectedDate, 'yyyy-MM-dd');
      } else {
        // В режиме месяца загружаем операции за весь месяц
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);
        startDate = format(start, 'yyyy-MM-dd');
        endDate = format(end, 'yyyy-MM-dd');
      }
      
      const operations = await getOperationsByDateRange(startDate, endDate);
      
      // Загружаем информацию о животных для операций
      const operationsWithAnimals = await Promise.all(
        operations.map(async operation => {
          try {
            const animal = await getAnimalById(operation.animalId);
            return {
              ...operation,
              animalNumber: animal?.number,
              animalType: animal?.type,
            };
          } catch (error) {
            console.error('Error fetching animal:', error);
            return operation;
          }
        })
      );
      
      setOperations(operationsWithAnimals);
    } catch (err) {
      setError('Не удалось загрузить список операций');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, viewMode]);
  
  // Загружаем операции при изменении выбранной даты или режима просмотра
  useEffect(() => {
    loadOperations();
  }, [loadOperations]);
  
  // Обновляем список при возврате на экран
  useFocusEffect(
    useCallback(() => {
      loadOperations();
    }, [loadOperations])
  );
  
  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleAddOperation = () => {
    navigation.navigate('OperationForm', { date: format(selectedDate, 'yyyy-MM-dd') });
  };
  
  const selectOperationType = (type: string | null) => {
    setSelectedOperationType(type);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'day' ? 'month' : 'day');
  };
  
  const getFilteredOperations = () => {
    if (!selectedOperationType) return operations;
    return operations.filter(op => op.type === selectedOperationType);
  };
  
  const getDaysWithOperations = () => {
    if (!operations.length) return [];
    
    // Создаем Set для уникальных дат
    const uniqueDates = new Set<string>();
    
    // Если есть выбранный тип операции, фильтруем только даты с этим типом
    operations.forEach(operation => {
      if (!selectedOperationType || operation.type === selectedOperationType) {
        uniqueDates.add(operation.date.split('T')[0]);
      }
    });
    
    // Преобразуем даты в формат, который ожидает CalendarStrip
    return Array.from(uniqueDates).map(dateString => ({
      date: parseISO(dateString),
      dots: [
        {
          color: '#2196F3',
          selectedColor: '#FFFFFF',
        },
      ],
    }));
  };
  
  const renderOperationItem = ({ item }: { item: OperationWithAnimal }) => {
    // Проверяем, соответствует ли операция выбранному типу
    if (selectedOperationType && item.type !== selectedOperationType) {
      return null;
    }
    
    return (
      <CalendarOperationItem 
        operation={item} 
        selectedDate={selectedDate} 
        viewMode={viewMode}
        onPress={() => navigation.navigate('OperationDetail', { operationId: item.id! })}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      <CalendarHeader 
        selectedDate={selectedDate}
        onDateSelected={handleDateSelected}
        viewMode={viewMode}
        onToggleViewMode={toggleViewMode}
        selectedOperationType={selectedOperationType}
        onSelectOperationType={selectOperationType}
        daysWithOperations={getDaysWithOperations()}
        minDate={minDate}
        maxDate={maxDate}
      />
      
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Загрузка операций...</Text>
          </View>
        ) : (
          <>
            {getFilteredOperations().length === 0 ? (
              <EmptyListMessage 
                message={
                  selectedOperationType 
                    ? `Нет операций типа "${selectedOperationType}" за ${viewMode === 'day' ? 'выбранную дату' : 'выбранный месяц'}`
                    : `Нет операций за ${viewMode === 'day' ? 'выбранную дату' : 'выбранный месяц'}`
                }
                icon="event-busy"
              />
            ) : (
              <FlatList
                data={getFilteredOperations()}
                keyExtractor={item => item.id!.toString()}
                renderItem={renderOperationItem}
                ItemSeparatorComponent={() => <Divider />}
                contentContainerStyle={styles.listContent}
              />
            )}
          </>
        )}
      </View>
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddOperation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#616161',
  },
  listContent: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CalendarScreen;
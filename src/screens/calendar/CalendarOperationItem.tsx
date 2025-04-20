// src/screens/calendar/CalendarOperationItem.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format, parseISO, isEqual } from 'date-fns';
import { ru } from 'date-fns/locale';
import { OperationWithAnimal } from './CalendarScreen';

interface CalendarOperationItemProps {
  operation: OperationWithAnimal;
  selectedDate: Date;
  viewMode: 'day' | 'month';
  onPress: () => void;
}

const CalendarOperationItem: React.FC<CalendarOperationItemProps> = ({
  operation,
  selectedDate,
  viewMode,
  onPress,
}) => {
  // В режиме месяца проверяем, соответствует ли операция выбранной дате
  const isSelectedDate = viewMode === 'month' && isEqual(parseISO(operation.date), selectedDate);
  
  // Иконка для типа операции
  const getOperationIcon = () => {
    switch (operation.type) {
      case 'Лечение': return 'medical-services';
      case 'Осеменение': return 'water-drop';
      case 'Вакцинация': return 'vaccines';
      case 'Осмотр': return 'search';
      case 'Проверка стельности': return 'monitor-heart';
      case 'Отёл': return 'child-care';
      case 'Хирургическая операция': return 'biotech';
      default: return 'event-note';
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.operationItem,
        isSelectedDate && styles.selectedDateItem
      ]}
      onPress={onPress}
    >
      <View style={styles.operationIconContainer}>
        <MaterialIcons name={getOperationIcon()} size={24} color="#616161" />
      </View>
      <View style={styles.operationInfo}>
        <Text style={styles.operationType}>{operation.type}</Text>
        {viewMode === 'month' && (
          <Text style={styles.operationDate}>{format(parseISO(operation.date), 'dd.MM.yyyy')}</Text>
        )}
        {operation.animalNumber && (
          <Text style={styles.animalInfo}>
            {operation.animalNumber} {operation.animalType ? `(${operation.animalType})` : ''}
          </Text>
        )}
        {operation.diagnosis && (
          <Text style={styles.operationDetail}>Диагноз: {operation.diagnosis}</Text>
        )}
        {operation.medicine && (
          <Text style={styles.operationDetail}>Лекарство: {operation.medicine}</Text>
        )}
        {operation.bull && (
          <Text style={styles.operationDetail}>Бык: {operation.bull}</Text>
        )}
        {operation.vaccine && (
          <Text style={styles.operationDetail}>Вакцина: {operation.vaccine}</Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  operationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  selectedDateItem: {
    backgroundColor: '#E3F2FD',
  },
  operationIconContainer: {
    marginRight: 16,
  },
  operationInfo: {
    flex: 1,
  },
  operationType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  operationDate: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  animalInfo: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 4,
  },
  operationDetail: {
    fontSize: 14,
    color: '#616161',
  },
});

export default CalendarOperationItem;
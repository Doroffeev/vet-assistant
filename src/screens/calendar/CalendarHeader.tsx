// src/screens/calendar/CalendarHeader.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Divider, Button, Menu, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import CalendarStrip from 'react-native-calendar-strip';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { OPERATION_TYPES } from '../../constants/appConstants';

interface CalendarHeaderProps {
  selectedDate: Date;
  onDateSelected: (date: Date) => void;
  viewMode: 'day' | 'month';
  onToggleViewMode: () => void;
  selectedOperationType: string | null;
  onSelectOperationType: (type: string | null) => void;
  daysWithOperations: Array<{
    date: Date;
    dots: Array<{
      color: string;
      selectedColor: string;
    }>;
  }>;
  minDate?: Date;
  maxDate?: Date;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  onDateSelected,
  viewMode,
  onToggleViewMode,
  selectedOperationType,
  onSelectOperationType,
  daysWithOperations,
  minDate,
  maxDate,
}) => {
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const toggleFilterMenu = () => {
    setFilterMenuVisible(!filterMenuVisible);
  };

  const selectOperationType = (type: string | null) => {
    onSelectOperationType(type);
    setFilterMenuVisible(false);
  };

  return (
    <>
      <View style={styles.calendarContainer}>
        <CalendarStrip
          style={styles.calendar}
          calendarColor="#FFFFFF"
          calendarHeaderStyle={styles.calendarHeader}
          dateNumberStyle={styles.calendarDateNumber}
          dateNameStyle={styles.calendarDateName}
          highlightDateNumberStyle={styles.calendarHighlightedDateNumber}
          highlightDateNameStyle={styles.calendarHighlightedDateName}
          disabledDateNameStyle={styles.calendarDisabledDateName}
          disabledDateNumberStyle={styles.calendarDisabledDateNumber}
          iconContainer={{ flex: 0.1 }}
          selectedDate={selectedDate}
          onDateSelected={onDateSelected}
          markedDates={daysWithOperations}
          minDate={minDate}
          maxDate={maxDate}
          maxDayComponentSize={60}
          locale={{
            name: 'ru',
            config: {
              months: 'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'.split('_'),
              weekdaysShort: 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
            }
          }}
        />
      </View>
      
      <View style={styles.toolbarContainer}>
        <View style={styles.dateViewContainer}>
          <Text style={styles.currentDateText}>
            {viewMode === 'day' 
              ? format(selectedDate, 'd MMMM yyyy', { locale: ru })
              : format(selectedDate, 'LLLL yyyy', { locale: ru })}
          </Text>
          <Button
            mode="text"
            onPress={onToggleViewMode}
            style={styles.viewModeButton}
          >
            {viewMode === 'day' ? 'Месяц' : 'День'}
          </Button>
        </View>
        
        <View style={styles.filtersContainer}>
          <Menu
            visible={filterMenuVisible}
            onDismiss={toggleFilterMenu}
            anchor={
              <TouchableOpacity style={styles.filterButton} onPress={toggleFilterMenu}>
                <MaterialIcons name="filter-list" size={24} color="#616161" />
                <Text style={styles.filterButtonText}>Фильтр</Text>
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}
          >
            <Menu.Item 
              onPress={() => selectOperationType(null)} 
              title="Все операции" 
              style={selectedOperationType === null ? styles.selectedMenuItem : undefined}
            />
            <Divider />
            {Object.values(OPERATION_TYPES).map(type => (
              <Menu.Item
                key={type}
                onPress={() => selectOperationType(type)}
                title={type}
                style={selectedOperationType === type ? styles.selectedMenuItem : undefined}
              />
            ))}
          </Menu>
          
          {selectedOperationType && (
            <Chip
              mode="outlined"
              onClose={() => selectOperationType(null)}
              style={styles.filterChip}
            >
              {selectedOperationType}
            </Chip>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  calendar: {
    height: 100,
    paddingTop: 10,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: '#212121',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarDateNumber: {
    color: '#424242',
    fontSize: 14,
  },
  calendarDateName: {
    color: '#757575',
    fontSize: 12,
  },
  calendarHighlightedDateNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarHighlightedDateName: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  calendarDisabledDateName: {
    color: '#BDBDBD',
    fontSize: 12,
  },
  calendarDisabledDateNumber: {
    color: '#BDBDBD',
    fontSize: 14,
  },
  toolbarContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dateViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  viewModeButton: {
    marginLeft: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
  },
  filterButtonText: {
    marginLeft: 4,
    color: '#616161',
  },
  filterChip: {
    marginLeft: 8,
  },
  menuContent: {
    marginTop: 44,
  },
  selectedMenuItem: {
    backgroundColor: '#E3F2FD',
  },
});

export default CalendarHeader;
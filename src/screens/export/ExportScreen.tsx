// src/screens/export/ExportScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, ProgressBar, RadioButton, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { exportAnimalsToExcel, exportOperationsToExcel } from '../../database/DataExport';
import { OPERATION_TYPES } from '../../constants/appConstants';
import DatePickerField from '../../components/DatePickerField';

type DateRangeType = 'today' | 'week' | 'month' | 'custom';

const ExportScreen: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>('month');
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [customEndDate, setCustomEndDate] = useState<string | null>(null);
  const [selectedOperationType, setSelectedOperationType] = useState<string | null>(null);
  const [operationTypeMenuVisible, setOperationTypeMenuVisible] = useState(false);
  
  // Установка начальных дат при загрузке
  useEffect(() => {
    const today = new Date();
    setCustomStartDate(format(startOfMonth(today), 'yyyy-MM-dd'));
    setCustomEndDate(format(today, 'yyyy-MM-dd'));
  }, []);
  
  const getDateRange = (): { startDate: string; endDate: string } => {
    const today = new Date();
    
    switch (dateRangeType) {
      case 'today':
        return {
          startDate: format(today, 'yyyy-MM-dd'),
          endDate: format(today, 'yyyy-MM-dd'),
        };
      case 'week':
        return {
          startDate: format(subDays(today, 7), 'yyyy-MM-dd'),
          endDate: format(today, 'yyyy-MM-dd'),
        };
      case 'month':
        return {
          startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
          endDate: format(today, 'yyyy-MM-dd'),
        };
      case 'custom':
        return {
          startDate: customStartDate || format(today, 'yyyy-MM-dd'),
          endDate: customEndDate || format(today, 'yyyy-MM-dd'),
        };
      default:
        return {
          startDate: format(today, 'yyyy-MM-dd'),
          endDate: format(today, 'yyyy-MM-dd'),
        };
    }
  };
  
  const getDateRangeText = (): string => {
    const { startDate, endDate } = getDateRange();
    const start = format(new Date(startDate), 'dd.MM.yyyy', { locale: ru });
    const end = format(new Date(endDate), 'dd.MM.yyyy', { locale: ru });
    
    if (start === end) {
      return `${start}`;
    }
    
    return `${start} — ${end}`;
  };
  
  const handleExportAnimals = async () => {
    try {
      setExporting(true);
      await exportAnimalsToExcel();
      Alert.alert('Успех', 'Список животных успешно экспортирован');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Ошибка', 'Не удалось экспортировать список животных');
    } finally {
      setExporting(false);
    }
  };
  
  const handleExportOperations = async () => {
    try {
      setExporting(true);
      
      const { startDate, endDate } = getDateRange();
      await exportOperationsToExcel(startDate, endDate, selectedOperationType || undefined);
      
      Alert.alert('Успех', 'Операции успешно экспортированы');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Ошибка', 'Не удалось экспортировать операции');
    } finally {
      setExporting(false);
    }
  };
  
  const toggleOperationTypeMenu = () => {
    setOperationTypeMenuVisible(!operationTypeMenuVisible);
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Экспорт списка животных</Text>
          
          <Text style={styles.description}>
            Экспортировать полный список животных со всеми данными в Excel
          </Text>
          
          <Button
            mode="contained"
            onPress={handleExportAnimals}
            loading={exporting}
            disabled={exporting}
            style={styles.exportButton}
            icon="file-excel"
          >
            Экспортировать список животных
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Экспорт операций</Text>
          
          <Text style={styles.description}>
            Экспортировать операции за выбранный период времени
          </Text>
          
          <View style={styles.dateRangeContainer}>
            <Text style={styles.dateRangeLabel}>Период:</Text>
            
            <RadioButton.Group
              onValueChange={value => setDateRangeType(value as DateRangeType)}
              value={dateRangeType}
            >
              <View style={styles.radioButtonRow}>
                <RadioButton.Item
                  label="Сегодня"
                  value="today"
                  style={styles.radioButton}
                  labelStyle={styles.radioButtonLabel}
                  disabled={exporting}
                />
                <RadioButton.Item
                  label="Неделя"
                  value="week"
                  style={styles.radioButton}
                  labelStyle={styles.radioButtonLabel}
                  disabled={exporting}
                />
              </View>
              
              <View style={styles.radioButtonRow}>
                <RadioButton.Item
                  label="Месяц"
                  value="month"
                  style={styles.radioButton}
                  labelStyle={styles.radioButtonLabel}
                  disabled={exporting}
                />
                <RadioButton.Item
                  label="Произвольный"
                  value="custom"
                  style={styles.radioButton}
                  labelStyle={styles.radioButtonLabel}
                  disabled={exporting}
                />
              </View>
            </RadioButton.Group>
            
            {dateRangeType === 'custom' && (
              <View style={styles.customDateContainer}>
                <View style={styles.datePickerRow}>
                  <View style={styles.datePickerColumn}>
                    <DatePickerField
                      label="Начало периода"
                      value={customStartDate}
                      onChange={setCustomStartDate}
                      disabled={exporting}
                      required
                    />
                  </View>
                  <View style={styles.datePickerColumn}>
                    <DatePickerField
                      label="Конец периода"
                      value={customEndDate}
                      onChange={setCustomEndDate}
                      disabled={exporting}
                      required
                    />
                  </View>
                </View>
              </View>
            )}
            
            <View style={styles.selectedDateRangeContainer}>
              <Text style={styles.selectedDateRangeLabel}>Выбран период:</Text>
              <Text style={styles.selectedDateRangeValue}>{getDateRangeText()}</Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.operationTypeContainer}>
            <Text style={styles.operationTypeLabel}>Тип операции:</Text>
            
            <TouchableOpacity
              style={styles.operationTypeSelector}
              onPress={toggleOperationTypeMenu}
              disabled={exporting}
            >
              <Text style={styles.operationTypeValue}>
                {selectedOperationType || 'Все операции'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#757575" />
            </TouchableOpacity>
            
            {operationTypeMenuVisible && (
              <View style={styles.operationTypeMenu}>
                <TouchableOpacity
                  style={styles.operationTypeMenuItem}
                  onPress={() => {
                    setSelectedOperationType(null);
                    setOperationTypeMenuVisible(false);
                  }}
                >
                  <Text style={[
                    styles.operationTypeMenuItemText,
                    selectedOperationType === null && styles.operationTypeMenuItemSelected
                  ]}>
                    Все операции
                  </Text>
                </TouchableOpacity>
                
                {Object.values(OPERATION_TYPES).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={styles.operationTypeMenuItem}
                    onPress={() => {
                      setSelectedOperationType(type);
                      setOperationTypeMenuVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.operationTypeMenuItemText,
                      selectedOperationType === type && styles.operationTypeMenuItemSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <Button
            mode="contained"
            onPress={handleExportOperations}
            loading={exporting}
            disabled={exporting}
            style={styles.exportButton}
            icon="file-excel"
          >
            Экспортировать операции
          </Button>
          
          {exporting && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Экспорт данных...</Text>
              <ProgressBar indeterminate style={styles.progressBar} />
            </View>
          )}
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
    marginBottom: 8,
    color: '#424242',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  exportButton: {
    marginTop: 16,
  },
  dateRangeContainer: {
    marginTop: 16,
  },
  dateRangeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#616161',
  },
  radioButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    paddingHorizontal: 0,
  },
  radioButtonLabel: {
    fontSize: 14,
  },
  customDateContainer: {
    marginTop: 8,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerColumn: {
    width: '48%',
  },
  selectedDateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
  },
  selectedDateRangeLabel: {
    fontSize: 14,
    color: '#1976D2',
    marginRight: 8,
  },
  selectedDateRangeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  divider: {
    marginVertical: 16,
  },
  operationTypeContainer: {
    marginBottom: 16,
  },
  operationTypeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#616161',
  },
  operationTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  operationTypeValue: {
    fontSize: 16,
    color: '#212121',
  },
  operationTypeMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  operationTypeMenuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  operationTypeMenuItemText: {
    fontSize: 16,
    color: '#212121',
  },
  operationTypeMenuItemSelected: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
  },
});

export default ExportScreen;
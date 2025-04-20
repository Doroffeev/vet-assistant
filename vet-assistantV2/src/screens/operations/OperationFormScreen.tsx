// src/screens/operations/OperationFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Keyboard, TextInput } from 'react-native';
import { Text, Button, Card, HelperText } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, parseISO } from 'date-fns';
import { Operation, Animal } from '../../types';
import { getOperationById, addOperation, updateOperation } from '../../database/repositories/OperationRepository';
import { getAnimalById, updateAnimal } from '../../database/repositories/AnimalRepository';
import { getAllExecutors } from '../../database/repositories/ExecutorRepository';
import { getAllBulls } from '../../database/repositories/BullRepository';
import { getAllVaccines } from '../../database/repositories/VaccineRepository';
import { getAllMedicines } from '../../database/repositories/MedicineRepository';
import { getAllDiseases } from '../../database/repositories/DiseaseRepository';
import { AnimalStackParamList, CalendarStackParamList } from '../../navigation/MainNavigator';
import { OPERATION_TYPES } from '../../constants/appConstants';
import DatePickerField from '../../components/DatePickerField';
import SelectField from '../../components/SelectField';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';

// остальной код файла остается без изменений

type OperationFormScreenRouteProp = RouteProp<AnimalStackParamList | CalendarStackParamList, 'OperationForm'>;
type OperationFormScreenNavigationProp = NativeStackNavigationProp<AnimalStackParamList | CalendarStackParamList, 'OperationForm'>;

const OperationFormScreen: React.FC = () => {
  const navigation = useNavigation<OperationFormScreenNavigationProp>();
  const route = useRoute<OperationFormScreenRouteProp>();
  const { operationId, animalId, date } = route.params || {};
  const isEditMode = !!operationId;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Данные животного
  const [animal, setAnimal] = useState<Animal | null>(null);
  
  // Справочники
  const [executors, setExecutors] = useState<{ label: string; value: number }[]>([]);
  const [bulls, setBulls] = useState<{ label: string; value: string }[]>([]);
  const [vaccines, setVaccines] = useState<{ label: string; value: string }[]>([]);
  const [medicines, setMedicines] = useState<{ label: string; value: string }[]>([]);
  const [diseases, setDiseases] = useState<{ label: string; value: string }[]>([]);
  
  // Форма операции
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [operationType, setOperationType] = useState('');
  const [operationDate, setOperationDate] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medicine, setMedicine] = useState('');
  const [dose, setDose] = useState('');
  const [bull, setBull] = useState('');
  const [vaccine, setVaccine] = useState('');
  const [executorId, setExecutorId] = useState<number | null>(null);
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState('');
  
  // Валидация
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Загружаем справочники
        const [executorsData, bullsData, vaccinesData, medicinesData, diseasesData] = await Promise.all([
          getAllExecutors(),
          getAllBulls(),
          getAllVaccines(),
          getAllMedicines(),
          getAllDiseases(),
        ]);
        
        setExecutors(
          executorsData.map(executor => ({
            label: executor.name,
            value: executor.id!,
          }))
        );
        
        setBulls(
          bullsData.map(bull => ({
            label: `${bull.name}${bull.number ? ` (${bull.number})` : ''}`,
            value: bull.name,
          }))
        );
        
        setVaccines(
          vaccinesData.map(vaccine => ({
            label: vaccine.name,
            value: vaccine.name,
          }))
        );
        
        setMedicines(
          medicinesData.map(medicine => ({
            label: medicine.name,
            value: medicine.name,
          }))
        );
        
        setDiseases(
          diseasesData.map(disease => ({
            label: disease.name,
            value: disease.name,
          }))
        );
        
        // Если указано животное, загружаем его данные
        if (animalId) {
          const animalData = await getAnimalById(animalId);
          if (animalData) {
            setAnimal(animalData);
            setSelectedAnimalId(animalId);
          }
        }
        
        // Если указана дата (из календаря), устанавливаем её
        if (date) {
          setOperationDate(date);
        } else if (!isEditMode) {
          // По умолчанию устанавливаем текущую дату для новой операции
          setOperationDate(new Date().toISOString().split('T')[0]);
        }
        
        // Если редактируем операцию, загружаем её данные
        if (isEditMode) {
          const operation = await getOperationById(operationId);
          if (!operation) {
            throw new Error('Операция не найдена');
          }
          
          // Загружаем данные животного
          const animalData = await getAnimalById(operation.animalId);
          if (animalData) {
            setAnimal(animalData);
          }
          
          setSelectedAnimalId(operation.animalId);
          setOperationType(operation.type);
          setOperationDate(operation.date);
          setDiagnosis(operation.diagnosis || '');
          setMedicine(operation.medicine || '');
          setDose(operation.dose || '');
          setBull(operation.bull || '');
          setVaccine(operation.vaccine || '');
          setExecutorId(operation.executorId || null);
          setResult(operation.result || '');
          setNotes(operation.notes || '');
        }
      } catch (err) {
        setError('Не удалось загрузить данные');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isEditMode, operationId, animalId, date]);
  
  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedAnimalId) {
      newErrors.animalId = 'Животное обязательно';
    }
    
    if (!operationType) {
      newErrors.type = 'Тип операции обязателен';
    }
    
    if (!operationDate) {
      newErrors.date = 'Дата операции обязательна';
    }
    
    if (operationType === 'Лечение' && !diagnosis) {
      newErrors.diagnosis = 'Диагноз обязателен для лечения';
    }
    
    if (operationType === 'Осеменение' && !bull) {
      newErrors.bull = 'Бык обязателен для осеменения';
    }
    
    if (operationType === 'Вакцинация' && !vaccine) {
      newErrors.vaccine = 'Вакцина обязательна для вакцинации';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Сохранение операции
  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      const operationData: Omit<Operation, 'id'> = {
        animalId: selectedAnimalId!,
        type: operationType,
        date: operationDate!,
        diagnosis: diagnosis || undefined,
        medicine: medicine || undefined,
        dose: dose || undefined,
        bull: bull || undefined,
        vaccine: vaccine || undefined,
        executorId: executorId || undefined,
        result: result || undefined,
        notes: notes || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (isEditMode) {
        await updateOperation({ ...operationData, id: operationId });
        navigation.goBack();
      } else {
        const newOperationId = await addOperation(operationData);
        
        // Если это женское животное, обновляем соответствующие даты
        if (animal && animal.gender === 'female') {
          const animalToUpdate: Partial<Animal> = { id: animal.id };
          
          if (operationType === 'Осеменение') {
            animalToUpdate.lastInseminationDate = operationDate;
            
            // Если есть предыдущие осеменения, увеличиваем счетчик
            if (animal.inseminationCount !== undefined) {
              animalToUpdate.inseminationCount = animal.inseminationCount + 1;
            } else {
              animalToUpdate.inseminationCount = 1;
            }
          } else if (operationType === 'Отёл') {
            animalToUpdate.lastDeliveryDate = operationDate;
            
            // Если есть номер лактации, увеличиваем его
            if (animal.lactationNumber !== undefined) {
              animalToUpdate.lactationNumber = animal.lactationNumber + 1;
            } else {
              animalToUpdate.lactationNumber = 1;
            }
          }
          
          // Обновляем данные животного, если были изменения
          if (Object.keys(animalToUpdate).length > 1) {  // > 1, потому что id уже добавлен
            await updateAnimal(animalToUpdate as Animal);
          }
        }
        
        navigation.navigate('OperationDetail', { operationId: newOperationId });
      }
    } catch (err) {
      Alert.alert(
        'Ошибка',
        isEditMode
          ? 'Не удалось обновить данные операции'
          : 'Не удалось добавить новую операцию'
      );
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen message="Загрузка данных..." />;
  }
  
  if (error) {
    return <ErrorScreen message={error} onRetry={() => navigation.goBack()} />;
  }
  
  const operationTypeOptions = Object.entries(OPERATION_TYPES).map(([_, label]) => ({
    label,
    value: label,
  }));
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Информация об операции</Text>
          
          <View style={styles.animalInfoContainer}>
            <Text style={styles.animalInfoLabel}>Животное:</Text>
            {animal ? (
              <Text style={styles.animalInfoValue}>
                {animal.number} ({animal.type})
              </Text>
            ) : (
              <Text style={styles.animalInfoError}>
                Животное не выбрано
              </Text>
            )}
          </View>
          
          <SelectField
            label="Тип операции"
            value={operationType}
            onChange={value => setOperationType(value as string)}
            options={operationTypeOptions}
            error={errors.type}
            required
            zIndex={3000}
          />
          
          <DatePickerField
            label="Дата операции"
            value={operationDate}
            onChange={setOperationDate}
            error={errors.date}
            required
          />
        </Card.Content>
      </Card>
      
      {operationType === 'Лечение' && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Информация о лечении</Text>
            
            <SelectField
              label="Диагноз"
              value={diagnosis}
              onChange={value => setDiagnosis(value as string)}
              options={[
                { label: 'Ввести вручную...', value: '' },
                ...diseases,
              ]}
              error={errors.diagnosis}
              required
              zIndex={2900}
            />
            
            {!diseases.some(d => d.value === diagnosis) && (
              <View style={styles.formGroup}>
                <TextInput
                  style={[styles.textInput, errors.diagnosis && styles.inputError]}
                  value={diagnosis}
                  onChangeText={setDiagnosis}
                  placeholder="Введите диагноз"
                />
                {errors.diagnosis && (
                  <HelperText type="error" visible={!!errors.diagnosis}>
                    {errors.diagnosis}
                  </HelperText>
                )}
              </View>
            )}
            
            <SelectField
              label="Лекарство"
              value={medicine}
              onChange={value => setMedicine(value as string)}
              options={[
                { label: 'Выберите или введите...', value: '' },
                ...medicines,
              ]}
              zIndex={2800}
            />
            
            {!medicines.some(m => m.value === medicine) && medicine !== '' && (
              <View style={styles.formGroup}>
                <TextInput
                  style={styles.textInput}
                  value={medicine}
                  onChangeText={setMedicine}
                  placeholder="Введите название лекарства"
                />
              </View>
            )}
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Доза</Text>
              <TextInput
                style={styles.textInput}
                value={dose}
                onChangeText={setDose}
                placeholder="Введите дозу"
              />
            </View>
          </Card.Content>
        </Card>
      )}
      
      {operationType === 'Осеменение' && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Информация об осеменении</Text>
            
            <SelectField
              label="Бык"
              value={bull}
              onChange={value => setBull(value as string)}
              options={[
                { label: 'Выберите или введите...', value: '' },
                ...bulls,
              ]}
              error={errors.bull}
              required
              zIndex={2900}
            />
            
            {!bulls.some(b => b.value === bull) && bull !== '' && (
              <View style={styles.formGroup}>
                <TextInput
                  style={[styles.textInput, errors.bull && styles.inputError]}
                  value={bull}
                  onChangeText={setBull}
                  placeholder="Введите имя быка"
                />
                {errors.bull && (
                  <HelperText type="error" visible={!!errors.bull}>
                    {errors.bull}
                  </HelperText>
                )}
              </View>
            )}
          </Card.Content>
        </Card>
      )}
      
      {operationType === 'Вакцинация' && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Информация о вакцинации</Text>
            
            <SelectField
              label="Вакцина"
              value={vaccine}
              onChange={value => setVaccine(value as string)}
              options={[
                { label: 'Выберите или введите...', value: '' },
                ...vaccines,
              ]}
              error={errors.vaccine}
              required
              zIndex={2900}
            />
            
            {!vaccines.some(v => v.value === vaccine) && vaccine !== '' && (
              <View style={styles.formGroup}>
                <TextInput
                  style={[styles.textInput, errors.vaccine && styles.inputError]}
                  value={vaccine}
                  onChangeText={setVaccine}
                  placeholder="Введите название вакцины"
                />
                {errors.vaccine && (
                  <HelperText type="error" visible={!!errors.vaccine}>
                    {errors.vaccine}
                  </HelperText>
                )}
              </View>
            )}
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Доза</Text>
              <TextInput
                style={styles.textInput}
                value={dose}
                onChangeText={setDose}
                placeholder="Введите дозу"
              />
            </View>
          </Card.Content>
        </Card>
      )}
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Дополнительная информация</Text>
          
          <SelectField
            label="Исполнитель"
            value={executorId}
            onChange={value => setExecutorId(value as number)}
            options={[
              { label: 'Не выбран', value: -1 },
              ...executors,
            ]}
            zIndex={2700}
          />
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Результат</Text>
            <TextInput
              style={styles.textInput}
              value={result}
              onChangeText={setResult}
              placeholder="Введите результат операции"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Примечания</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Введите примечания"
              multiline
              numberOfLines={4}
            />
          </View>
        </Card.Content>
      </Card>
      
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={formSubmitting}
          disabled={formSubmitting}
          style={styles.saveButton}
        >
          {isEditMode ? 'Сохранить изменения' : 'Добавить операцию'}
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          disabled={formSubmitting}
        >
          Отмена
        </Button>
      </View>
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
  animalInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  animalInfoLabel: {
    fontSize: 16,
    marginRight: 8,
    color: '#757575',
  },
  animalInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  animalInfoError: {
    fontSize: 16,
    color: '#D32F2F',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#424242',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    padding: 16,
    marginBottom: 24,
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {
    borderColor: '#BDBDBD',
  },
});

export default OperationFormScreen;
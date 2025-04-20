// src/screens/animals/AnimalFormScreen.tsx - Экран формы животного
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Keyboard, TextInput } from 'react-native';
import { Text, Button, Card, HelperText } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, parseISO } from 'date-fns';
import { Animal } from '../../types';
import { getAnimalById, addAnimal, updateAnimal } from '../../database/repositories/AnimalRepository';
import { AnimalStackParamList } from '../../navigation/MainNavigator';
import { ANIMAL_TYPES } from '../../constants/appConstants';
import DatePickerField from '../../components/DatePickerField';
import SelectField from '../../components/SelectField';
import NumericInput from '../../components/NumericInput';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorScreen from '../../components/ErrorScreen';

type AnimalFormScreenRouteProp = RouteProp<AnimalStackParamList, 'AnimalForm'>;
type AnimalFormScreenNavigationProp = NativeStackNavigationProp<AnimalStackParamList, 'AnimalForm'>;

const AnimalFormScreen: React.FC = () => {
  const navigation = useNavigation<AnimalFormScreenNavigationProp>();
  const route = useRoute<AnimalFormScreenRouteProp>();
  const { animalId } = route.params || {};
  const isEditMode = !!animalId;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Форма животного
  const [number, setNumber] = useState('');
  const [responder, setResponder] = useState('');
  const [group, setGroup] = useState('');
  const [type, setType] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [lastDeliveryDate, setLastDeliveryDate] = useState<string | null>(null);
  const [nextDeliveryDate, setNextDeliveryDate] = useState<string | null>(null);
  const [lastInseminationDate, setLastInseminationDate] = useState<string | null>(null);
  const [lactationNumber, setLactationNumber] = useState('');
  const [inseminationCount, setInseminationCount] = useState('');
  const [averageMilk, setAverageMilk] = useState('');
  const [milkByLactation, setMilkByLactation] = useState('');
  const [notes, setNotes] = useState('');
  
  // Валидация
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Загрузка данных животного в режиме редактирования
  useEffect(() => {
    const loadAnimal = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        
        const animal = await getAnimalById(animalId);
        if (!animal) {
          throw new Error('Животное не найдено');
        }
        
        setNumber(animal.number);
        setResponder(animal.responder || '');
        setGroup(animal.group || '');
        setType(animal.type);
        setGender(animal.gender);
        setBirthDate(animal.birthDate || null);
        setLastDeliveryDate(animal.lastDeliveryDate || null);
        setNextDeliveryDate(animal.nextDeliveryDate || null);
        setLastInseminationDate(animal.lastInseminationDate || null);
        setLactationNumber(animal.lactationNumber?.toString() || '');
        setInseminationCount(animal.inseminationCount?.toString() || '');
        setAverageMilk(animal.averageMilk?.toString() || '');
        setMilkByLactation(animal.milkByLactation?.toString() || '');
        setNotes(animal.notes || '');
      } catch (err) {
        setError('Не удалось загрузить данные животного');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAnimal();
  }, [isEditMode, animalId]);
  
  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!number.trim()) {
      newErrors.number = 'Номер животного обязателен';
    }
    
    if (!type) {
      newErrors.type = 'Тип животного обязателен';
    }
    
    if (!gender) {
      newErrors.gender = 'Пол животного обязателен';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Сохранение животного
  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      const animalData: Omit<Animal, 'id'> = {
        number,
        responder: responder || undefined,
        group: group || undefined,
        type,
        gender: gender as 'male' | 'female',
        birthDate: birthDate || undefined,
        lastDeliveryDate: lastDeliveryDate || undefined,
        nextDeliveryDate: nextDeliveryDate || undefined,
        lastInseminationDate: lastInseminationDate || undefined,
        lactationNumber: lactationNumber ? parseInt(lactationNumber, 10) : undefined,
        inseminationCount: inseminationCount ? parseInt(inseminationCount, 10) : undefined,
        averageMilk: averageMilk ? parseFloat(averageMilk) : undefined,
        milkByLactation: milkByLactation ? parseFloat(milkByLactation) : undefined,
        notes: notes || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (isEditMode) {
        await updateAnimal({ ...animalData, id: animalId });
        navigation.goBack();
      } else {
        const newAnimalId = await addAnimal(animalData);
        navigation.replace('AnimalDetail', { animalId: newAnimalId });
      }
    } catch (err) {
      Alert.alert(
        'Ошибка',
        isEditMode
          ? 'Не удалось обновить данные животного'
          : 'Не удалось добавить новое животное'
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
  
  const animalTypeOptions = Object.entries(ANIMAL_TYPES).map(([_, label]) => ({
    label,
    value: label,
  }));
  
  const genderOptions = [
    { label: 'Женский', value: 'female' },
    { label: 'Мужской', value: 'male' },
  ];
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Основная информация</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Номер животного <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.number && styles.inputError]}
              value={number}
              onChangeText={setNumber}
              placeholder="Введите номер животного"
              maxLength={20}
            />
            {errors.number && (
              <HelperText type="error" visible={!!errors.number}>
                {errors.number}
              </HelperText>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Респондер</Text>
            <TextInput
              style={styles.textInput}
              value={responder}
              onChangeText={setResponder}
              placeholder="Введите номер респондера"
              maxLength={20}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Группа</Text>
            <TextInput
              style={styles.textInput}
              value={group}
              onChangeText={setGroup}
              placeholder="Введите группу"
              maxLength={20}
            />
          </View>
          
          <SelectField
            label="Тип животного"
            value={type}
            onChange={value => setType(value as string)}
            options={animalTypeOptions}
            error={errors.type}
            required
            zIndex={3000}
          />
          
          <SelectField
            label="Пол"
            value={gender}
            onChange={value => setGender(value as string)}
            options={genderOptions}
            error={errors.gender}
            required
            zIndex={2900}
          />
          
          <DatePickerField
            label="Дата рождения"
            value={birthDate}
            onChange={setBirthDate}
          />
        </Card.Content>
      </Card>
      
      {gender === 'female' && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Репродуктивная информация</Text>
            
            <DatePickerField
              label="Дата последнего отёла"
              value={lastDeliveryDate}
              onChange={setLastDeliveryDate}
            />
            
            <DatePickerField
              label="Ожидаемая дата следующего отёла"
              value={nextDeliveryDate}
              onChange={setNextDeliveryDate}
            />
            
            <DatePickerField
              label="Дата последнего осеменения"
              value={lastInseminationDate}
              onChange={setLastInseminationDate}
            />
            
            <NumericInput
              label="Количество осеменений"
              value={inseminationCount}
              onChange={setInseminationCount}
              placeholder="Введите количество"
              decimal={false}
              min={0}
            />
          </Card.Content>
        </Card>
      )}
      
      {gender === 'female' && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Лактация</Text>
            
            <NumericInput
              label="Номер лактации"
              value={lactationNumber}
              onChange={setLactationNumber}
              placeholder="Введите номер"
              decimal={false}
              min={1}
            />
            
            <NumericInput
              label="Средний удой"
              value={averageMilk}
              onChange={setAverageMilk}
              placeholder="Введите значение"
              decimal={true}
              min={0}
              suffix="кг"
            />
            
            <NumericInput
              label="Молоко по лактации"
              value={milkByLactation}
              onChange={setMilkByLactation}
              placeholder="Введите значение"
              decimal={true}
              min={0}
              suffix="кг"
            />
          </Card.Content>
        </Card>
      )}
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Дополнительная информация</Text>
          
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
          {isEditMode ? 'Сохранить изменения' : 'Добавить животное'}
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#424242',
  },
  required: {
    color: '#D32F2F',
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

export default AnimalFormScreen;